export interface IProject {
  name: string;
  // Root path of the project/workspace
  path: string;
  // File path of the local db for that project/workspace
  db: string;
  // First time that project/workspace was opened
  timestamp: number;
}
export interface ISession {
  // Date of the session
  timestamp: number;
  // Time spent for that session in seconds
  duration: number;
}
export interface IProjects {
  project: IProject;
  sessions: ISession[];
}
