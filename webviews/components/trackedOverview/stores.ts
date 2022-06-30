import { readable } from "svelte/store";
import type { IProjects } from "./types";

export const projects = readable<IProjects>(
  JSON.parse(projectsJSON.replace(/\\/g, "/"))
);
