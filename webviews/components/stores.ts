import { readable, writable } from "svelte/store";

export const vscode = readable<WebviewApi | null>(acquireVsCodeApi());
