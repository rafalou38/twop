// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Counter } from "./Counter";
import { CounterOptions } from "./types";

let counter: Counter;

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

  counter = new Counter(context.workspaceState, options);

  let timeWastedCommand = vscode.commands.registerCommand(
    "twop.timeWasted",
    () => {
      const wasted = counter.getTimeWasted();
      vscode.window.showInformationMessage(
        `Time wasted on project ${vscode.workspace.name || "unknown"}`,
        {
          modal: true,
          detail: `${wasted.d} days, ${wasted.h} hours, ${wasted.m} minutes, ${wasted.s} seconds`,
        }
      );
    }
  );
  context.subscriptions.push(timeWastedCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {
  if (counter) counter.save();
}
