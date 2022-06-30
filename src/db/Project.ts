import * as vscode from "vscode";
import Datastore from "nedb";
import path from "path";
import { rejects } from "assert";
import { ISession } from "./Session";

export interface IProject {
  name: string;
  // Root path of the project/workspace
  path: string;
  // File path of the local db for that project/workspace
  db: string;
  // First time that project/workspace was opened
  timestamp: number;
}

let db: Datastore<IProject> | null = null;
let errorNotified = false;

async function loadDB(ctx: vscode.ExtensionContext) {
  if (db) return db;

  const dbPath = ctx.globalStorageUri?.fsPath;

  if (dbPath === undefined) return null;
  console.log("TWOP: global DB:", path.join(dbPath, "twop.db"));

  db = new Datastore<IProject>({
    filename: path.join(dbPath, "twop.db"),
  });
  // wait for the database to load
  await new Promise((resolve) => db!.loadDatabase(resolve));
  return db;
}

/**
 * Return the local storagePath for the curent workspace, if the workspace is not registered in the db, whe add it.
 * If no workspace is opened or can't load DB, return null
 */
export async function getLocalDBpath(ctx: vscode.ExtensionContext) {
  // Return null if no project is oppened
  if (!vscode.workspace.name) return null;
  // return null if failed to load database
  if (!(await loadDB(ctx))) return null;
  if (!db) return null;

  // Get the workspace folder, if multiple folders, take the first one
  const rootFolder = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
  if (!rootFolder) return null;

  let localDBpath = ctx.storageUri?.fsPath;
  if (!localDBpath) return null;

  localDBpath = path.join(localDBpath, "twop.db");
  console.log("TWOP: local DB:", localDBpath);

  const result = await new Promise<IProject | null>((resolve, reject) =>
    db!.findOne(
      {
        db: localDBpath,
      } as Partial<IProject>,
      (err, doc) => {
        if (err) return reject(err);
        resolve(doc);
      }
    )
  );

  if (!result) {
    // That's a new workspace, add it
    db.insert({
      name: vscode.workspace.name,
      db: localDBpath,
      path: rootFolder,
      timestamp: Date.now(),
    });
  }

  return localDBpath;
}

export async function getProjects(ctx: vscode.ExtensionContext) {
  if (!(await loadDB(ctx))) return null;

  const projects = await new Promise<IProject[]>((res, rej) => {
    db?.find({}, (err: Error | null, docs: IProject[]) => {
      if (err) return rej(err);
      res(docs);
    });
  });

  return Promise.all(
    projects.map(async (project) => {
      const localDB = new Datastore({
        filename: project.db,
      });
      await new Promise((resolve) => localDB.loadDatabase(resolve));

      const sessions = await new Promise<ISession[]>((res, rej) => {
        localDB?.find({}, (err: Error | null, docs: ISession[]) => {
          if (err) return rej(err);
          res(docs);
        });
      });

      return {
        project,
        sessions,
      };
    })
  );
}
