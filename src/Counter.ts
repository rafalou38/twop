import * as vscode from "vscode";
import { StatusProvider } from "./status";
import { CounterOptions, Time } from "./types";

export class Counter {
  private idleTimeout: NodeJS.Timeout | null = null;
  private tickInterval: NodeJS.Timeout | null = null;
  private lastTick = 0;
  private totalTime = 0;
  private isIdle = true;
  private storage: vscode.Memento;
  private options: CounterOptions;
  constructor(storage: vscode.Memento, options: CounterOptions) {
    this.storage = storage;
    // Load saved time
    const savedTime = this.storage.get("timeWasted", 0);
    this.totalTime = savedTime;
    this.options = options;
    setInterval(this.save.bind(this), options.saveInterval);

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
    if (this.isIdle)
      StatusProvider.instance.showTimeActive(this.getTimeWasted());
    if (this.idleTimeout) clearTimeout(this.idleTimeout);
    this.isIdle = false;
    this.idleTimeout = setTimeout(
      this.idle.bind(this),
      this.options.idleTime * 1000
    );

    if (this.tickInterval) return;
    this.tickInterval = setInterval(
      this.tick.bind(this),
      this.options.tickInterval
    );
  }
  private tick() {
    if (this.lastTick) {
      this.totalTime += Date.now() - this.lastTick;
      StatusProvider.instance.showTimeActive(this.getTimeWasted());
    }
    this.lastTick = Date.now();
  }
  private async idle() {
    if (this.isIdle) return;
    // Save time
    await this.save();
    this.isIdle = true;

    StatusProvider.instance.showTimeIdle(this.getTimeWasted());

    this.lastTick = 0;
    if (this.tickInterval) clearInterval(this.tickInterval);
    this.tickInterval = null;
    if (this.idleTimeout) clearTimeout(this.idleTimeout);
    this.idleTimeout = null;
  }

  public save() {
    // StatusProvider.instance.showSaving();
    if (!this.isIdle) return this.storage.update("timeWasted", this.totalTime);
  }
  public getTimeWasted(): Time {
    const d = Math.floor(this.totalTime / 1000 / 60 / 60 / 24);
    const h = Math.floor(this.totalTime / 1000 / 60 / 60) % 24;
    const m = Math.floor(this.totalTime / 1000 / 60) % 60;
    const s = Math.floor(this.totalTime / 1000) % 60;
    return { d, h, m, s };
  }
}
