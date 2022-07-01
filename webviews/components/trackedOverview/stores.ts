import { derived, readable, writable } from "svelte/store";
import type { IProjects } from "./types";

export const projects = writable<IProjects[]>(
  (JSON.parse(projectsJSON.replace(/\\/g, "/")) as IProjects[]).map((p) => {
    if (p.project.name === "Untitled (Workspace)") {
      return {
        project: {
          ...p.project,
          name: p.project.path.split("/").at(-1) || p.project.name,
        },
        sessions: p.sessions,
      };
    }
    return p;
  })
);
export const currentProjectID = writable<string>(currentProjectIDbase);
export const currentProject = derived(
  [projects, currentProjectID],
  ([$projects, $currentProjectID]) =>
    $projects.find((project) => project.project._id === $currentProjectID)
);
