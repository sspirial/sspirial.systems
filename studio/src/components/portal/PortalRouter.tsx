import React from "react";
import CollaboratePage from "./CollaboratePage";
import IndexPage from "./IndexPage";
import LabNotebookPage from "./LabNotebookPage";
import PhilosophyPage from "./PhilosophyPage";
import ProjectsPage from "./ProjectsPage";

export type PortalRoute =
  | "portal"
  | "portal/collaborate"
  | "portal/lab-notebook"
  | "portal/philosophy"
  | "portal/projects";

export const PortalRouter: React.FC<{ route: PortalRoute }> = ({ route }) => {
  switch (route) {
    case "portal":
      return <IndexPage />;
    case "portal/collaborate":
      return <CollaboratePage />;
    case "portal/lab-notebook":
      return <LabNotebookPage />;
    case "portal/philosophy":
      return <PhilosophyPage />;
    case "portal/projects":
      return <ProjectsPage />;
    default:
      return <div>Not found</div>;
  }
};
