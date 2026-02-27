import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { GENERATION_POLL_INTERVAL, MAX_POLL_ATTEMPTS } from "@/lib/constants";

interface GenerationState {
  status: "idle" | "pending" | "processing" | "completed" | "failed";
  resultUrl: string | null;
  error: string | null;
  isLoading: boolean;
  generationId: string | null;
  elapsedSeconds: number;
}

export function useGeneration() {
  const { session } = useAuth();
  const [state, setState] = useState<GenerationState>({
    status: "idle",
    resultUrl: null,
    error: null,
    isLoading: false,
    generationId: null,
    elapsedSeconds: 0,
  });

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const attemptRef = useRef(0);

  const stopPolling = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    pollRef.current = null;
    timerRef.current = null;
    attemptRef.current = 0;
  }, []);

  const pollStatus = useCallback(
    async (generationId: string) => {
      if (!session?.access_token) return;

      try {
        const res = await fetch(`/api/generate/${generationId}/status`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (!res.ok) throw new Error("Gagal memeriksa status.");

        const data = await res.json();

        if (data.status === "completed") {
          stopPolling();
          setState((prev) => ({
            ...prev,
            status: "completed",
            resultUrl: data.resultUrl,
            isLoading: false,
          }));
        } else if (data.status === "failed") {
          stopPolling();
          setState((prev) => ({
            ...prev,
            status: "failed",
            error: data.error || "Generasi gagal. Coba lagi.",
            isLoading: false,
          }));
        }
        // else still processing, keep polling
      } catch {
        // don't stop on transient errors
      }
    },
    [session, stopPolling]
  );

  const startGeneration = useCallback(
    async (body: {
      productImageUrl: string;
      characterId: string;
      prompt: string;
      scene?: { background: string; pose: string; mood: string };
    }) => {
      if (!session?.access_token) return;

      stopPolling();
      setState({
        status: "pending",
        resultUrl: null,
        error: null,
        isLoading: true,
        generationId: null,
        elapsedSeconds: 0,
      });

      try {
        const res = await fetch("/api/generate/image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Gagal memulai generasi." }));
          throw new Error(err.error);
        }

        const { generationId } = await res.json();

        setState((prev) => ({
          ...prev,
          status: "processing",
          generationId,
        }));

        // Start elapsed timer
        timerRef.current = setInterval(() => {
          setState((prev) => ({ ...prev, elapsedSeconds: prev.elapsedSeconds + 1 }));
        }, 1000);

        // Start polling
        attemptRef.current = 0;
        pollRef.current = setInterval(() => {
          attemptRef.current += 1;
          if (attemptRef.current >= MAX_POLL_ATTEMPTS) {
            stopPolling();
            setState((prev) => ({
              ...prev,
              status: "failed",
              error: "Timeout — generasi terlalu lama. Coba lagi.",
              isLoading: false,
            }));
            return;
          }
          pollStatus(generationId);
        }, GENERATION_POLL_INTERVAL);
      } catch (err: unknown) {
        stopPolling();
        setState((prev) => ({
          ...prev,
          status: "failed",
          error: err instanceof Error ? err.message : "Terjadi kesalahan.",
          isLoading: false,
        }));
      }
    },
    [session, stopPolling, pollStatus]
  );

  const cancel = useCallback(() => {
    stopPolling();
    setState({
      status: "idle",
      resultUrl: null,
      error: null,
      isLoading: false,
      generationId: null,
      elapsedSeconds: 0,
    });
  }, [stopPolling]);

  const reset = useCallback(() => {
    stopPolling();
    setState({
      status: "idle",
      resultUrl: null,
      error: null,
      isLoading: false,
      generationId: null,
      elapsedSeconds: 0,
    });
  }, [stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  return { ...state, startGeneration, cancel, reset };
}

