import { useAuth } from "@/contexts/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { UserCircle } from "lucide-react";
import { format } from "date-fns";

const ProfileSection = () => {
  const { user } = useAuth();
  const { profile } = useDashboardData();

  const displayName =
    profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const initial = displayName[0]?.toUpperCase() || "U";
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const tier = profile?.tier || "free";
  const joinedDate = profile?.created_at
    ? format(new Date(profile.created_at), "dd MMM yyyy")
    : "";

  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6">
      <p className="text-xs uppercase tracking-widest text-[#666] mb-4 font-satoshi">
        PROFIL
      </p>

      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Avatar */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="w-16 h-16 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-[#2A2A2A] flex items-center justify-center text-xl font-bold text-white shrink-0">
            {initial}
          </div>
        )}

        {/* Info */}
        <div className="min-w-0">
          <p className="text-lg text-white font-semibold font-satoshi truncate">
            {displayName}
          </p>
          <p className="text-sm text-[#888] truncate">{user?.email}</p>
          <div className="mt-2">
            {tier === "free" ? (
              <span className="inline-block bg-[#2A2A2A] text-[#888] text-xs px-3 py-1 rounded-full uppercase tracking-wider font-medium">
                FREE TRIAL
              </span>
            ) : (
              <span className="inline-block bg-primary/15 text-primary text-xs px-3 py-1 rounded-full uppercase tracking-wider font-medium">
                BYOK LIFETIME ✦
              </span>
            )}
          </div>
          {joinedDate && (
            <p className="text-xs text-[#555] mt-2">Bergabung {joinedDate}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
