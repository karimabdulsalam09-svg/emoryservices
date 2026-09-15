import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Static-host deep-link recovery (GitHub Pages 404.html fallback)
const redirected = sessionStorage.redirect;
if (redirected) {
  delete sessionStorage.redirect;
  const target = new URL(redirected);
  if (target.origin === window.location.origin && target.pathname !== window.location.pathname) {
    history.replaceState(null, "", target.pathname + target.search + target.hash);
  }
}

createRoot(document.getElementById("root")!).render(<App />);
