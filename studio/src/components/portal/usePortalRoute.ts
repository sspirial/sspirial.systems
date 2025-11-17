import { useState, useEffect } from "react";
import type { PortalRoute } from "./PortalRouter";

// Simple hash-based router for portal pages
export function usePortalRoute(): [PortalRoute, (r: PortalRoute) => void] {
  const [route, setRoute] = useState<PortalRoute>(() => {
    const hash = window.location.hash.replace(/^#\/?/, "");
    switch (hash) {
      case "portal/collaborate":
      case "portal/lab-notebook":
      case "portal/philosophy":
      case "portal/projects":
        return hash as PortalRoute;
      default:
        return "portal";
    }
  });

  // Listen for hash changes
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, "");
      setRoute(
        hash === "portal" ||
          hash === "portal/collaborate" ||
          hash === "portal/lab-notebook" ||
          hash === "portal/philosophy" ||
          hash === "portal/projects"
          ? (hash as PortalRoute)
          : "portal"
      );
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (r: PortalRoute) => {
    window.location.hash = r;
  };

  return [route, navigate];
}
