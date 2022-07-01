import * as vscode from "vscode";
import Datastore from "nedb";
import { getLocalDBpath } from "./Project";
import { builtinModules } from "module";

export interface ISession {
  // Date of the session
  timestamp: number;
  // Time spent for that session in seconds
  duration: number;

  _id?: string;
}

let localDB: Datastore<ISession> | null = null;
/**
 * Return the local storagePath for the curent workspace, if the workspace is not registered in the db, whe add it.
 */
export async function addSECtoCurrentSession(
  ctx: vscode.ExtensionContext,
  sec: number
) {
  if (!localDB) {
    const dbPath = await getLocalDBpath(ctx);
    if (!dbPath) return null;
    localDB = new Datastore({
      filename: dbPath,
    });
    await new Promise((resolve) => localDB!.loadDatabase(resolve));

    // Migrate old times
    const oldTime = ctx.workspaceState.get("timeWasted");
    if (oldTime) {
      console.log("TWOP: migrating", oldTime, "miliseconds");
      ctx.workspaceState.update("timeWasted", null);

      addSECtoCurrentSession(ctx, oldTime as number);
    }
  }

  const timestamp = new Date();
  timestamp.setHours(0);
  timestamp.setMinutes(0);
  timestamp.setSeconds(0);
  timestamp.setMilliseconds(0);

  const newDoc = await new Promise<ISession>((resolve, reject) => {
    localDB!.update(
      {
        timestamp,
      },
      {
        $inc: {
          duration: sec,
        },
      },
      {
        returnUpdatedDocs: true,
        upsert: true,
      },
      (
        err: Error | null,
        numberOfUpdated: number,
        doc: ISession,
        upsert: boolean
      ) => {
        if (err) return reject(err);
        resolve(doc);
      }
    );
  });

  return newDoc.duration;
}
