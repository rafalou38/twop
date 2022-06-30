import * as vscode from "vscode";
import { Time } from "./types";

export class StatusProvider {
  item: vscode.StatusBarItem;
  static instance: StatusProvider;
  constructor(context: vscode.ExtensionContext) {
    this.item = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left
    );
    this.item.command = "twop.timeWasted";
    this.item.tooltip = "Time wasted on this project";
    this.item.text = "$(squirrel) idle";
    this.item.show();
    context.subscriptions.push(this.item);
    StatusProvider.instance = this;
  }
  public showTimeActive(time: Time) {
    let text = "";
    if (time.d) text += `${time.d}d `;
    if (time.h || text) text += `${time.h}h `;
    if (time.m || text) text += `${time.m}m `;
    if (time.s || text) text += `${time.s}s `;
    this.item.text = "$(flame) " + text;
  }
  public showTimeIdle(time: Time) {
    let text = "";
    if (time.d) text += `${time.d}d `;
    if (time.h || text) text += `${time.h}h `;
    if (time.m || text) text += `${time.m}m `;
    if (time.s || text) text += `${time.s}s `;
    this.item.text = "$(squirrel) " + text;
  }
  showError() {
    this.item.text = "$(squirrel) error";
  }
}
