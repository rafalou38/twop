// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Counter } from "./Counter";
import { TrackedOverviewPanel } from "./panels/trackedOverviewPanel";
import { StatusProvider } from "./status";
import { CounterOptions } from "./types";

export function activate(context: vscode.ExtensionContext) {
  if (!vscode.workspace.workspaceFolders) return;

  // load settings
  const options: CounterOptions = {
    idleTime: vscode.workspace
      .getConfiguration("twop", vscode.workspace.workspaceFolders[0])
      .get("idleTime", 10),
    saveInterval: vscode.workspace
      .getConfiguration("twop")
      .get("saveInterval", 10000),
    tickInterval: vscode.workspace
      .getConfiguration("twop")
      .get("tickInterval", 1000),
  };

  const status = new StatusProvider(context);
  const counter = new Counter(context, options);

  let timeWastedCommand = vscode.commands.registerCommand(
    "twop.timeWasted",
    () => {
      // const wasted = counter.getTimeWasted();
      // vscode.window.showInformationMessage(
      //   `Time wasted on project ${vscode.workspace.name || "unknown"}`,
      //   {
      //     modal: true,
      //     detail: `${wasted.d} days, ${wasted.h} hours, ${wasted.m} minutes, ${wasted.s} seconds`,
      //   }
      // );
      TrackedOverviewPanel.createOrShow(context.extensionUri);
    }
  );

  context.subscriptions.push(timeWastedCommand);
  context.subscriptions.push(status.item);
}

// this method is called when your extension is deactivated
export function deactivate() {}
