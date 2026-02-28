import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Force rebuild v3 - clear vite cache
createRoot(document.getElementById("root")!).render(<App />);
