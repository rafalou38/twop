import { derived, readable, writable } from "svelte/store";
import type { IProjects } from "./types";

export const projects = readable<IProjects[]>(
  JSON.parse(projectsJSON.replace(/\\/g, "/"))
);
export const currentProjectID = writable<string>(currentProjectIDbase);
export const currentProject = derived(
  [projects, currentProjectID],
  ([$projects, $currentProjectID]) =>
    $projects.find((project) => project.project._id === $currentProjectID)
);
