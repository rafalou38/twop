import * as vscode from "vscode";
import { addSECtoCurrentSession } from "./db/Session";
import { StatusProvider } from "./status";
import { CounterOptions, Time } from "./types";

export class Counter {
  private ctx: vscode.ExtensionContext;
  private options: CounterOptions;

  private idleTimeout: NodeJS.Timeout | null = null;
  private tickInterval: NodeJS.Timeout | null = null;

  private totalTime = 0;

  private lastTick = 0;
  private isIdle = true;

  constructor(ctx: vscode.ExtensionContext, options: CounterOptions) {
    this.options = options;
    this.ctx = ctx;

    // Listen for changes to the active editor
    vscode.workspace.onDidChangeTextDocument(this.active.bind(this));
    vscode.workspace.onDidCloseTextDocument(this.active.bind(this));
    vscode.workspace.onDidSaveTextDocument(this.active.bind(this));

    vscode.workspace.onDidCreateFiles(this.active.bind(this));
    vscode.workspace.onDidDeleteFiles(this.active.bind(this));
    vscode.workspace.onDidRenameFiles(this.active.bind(this));

    // listen for changes to the active editor
    vscode.window.onDidChangeActiveTextEditor(this.active.bind(this));
    vscode.window.onDidChangeTextEditorSelection(this.active.bind(this));
    vscode.window.onDidChangeActiveTerminal(this.active.bind(this));
  }

  // Called when the user does an action: not idle
  private active() {
    // user was idle
    if (this.isIdle)
      StatusProvider.instance.showTimeActive(this.getTimeWasted());

    // Reset idle timeout
    if (this.idleTimeout) clearTimeout(this.idleTimeout);
    this.idleTimeout = setTimeout(
      this.idle.bind(this),
      this.options.idleTime * 1000
    );

    this.isIdle = false;

    if (this.tickInterval) return;
    this.tickInterval = setInterval(
      this.tick.bind(this),
      this.options.tickInterval
    );
  }

  private async tick() {
    if (this.lastTick) {
      // Min for if the computer is suspended between two ticks that would resolve in a tickDuration of many hours
      const tickDuration = Math.min(
        Date.now() - this.lastTick,
        this.options.tickInterval * 2
      );
      let result = await addSECtoCurrentSession(this.ctx, tickDuration);
      if (result) {
        this.totalTime = result;
        StatusProvider.instance.showTimeActive(this.getTimeWasted());
      } else {
        StatusProvider.instance.showError();
      }
    }
    this.lastTick = Date.now();
  }

  private async idle() {
    if (this.isIdle) return;
    this.isIdle = true;

    StatusProvider.instance.showTimeIdle(this.getTimeWasted());

    // Stop timeouts and intervals
    this.lastTick = 0;
    if (this.tickInterval) clearInterval(this.tickInterval);
    this.tickInterval = null;
    if (this.idleTimeout) clearTimeout(this.idleTimeout);
    this.idleTimeout = null;
  }

  public getTimeWasted(): Time {
    const d = Math.floor(this.totalTime / 1000 / 60 / 60 / 24);
    const h = Math.floor(this.totalTime / 1000 / 60 / 60) % 24;
    const m = Math.floor(this.totalTime / 1000 / 60) % 60;
    const s = Math.floor(this.totalTime / 1000) % 60;
    return { d, h, m, s };
  }
}
