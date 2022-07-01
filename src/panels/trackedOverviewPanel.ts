import * as vscode from "vscode";
import { getProjects } from "../db/Project";
import { getNonce } from "../utils";

export class TrackedOverviewPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: TrackedOverviewPanel | undefined;

  public static readonly viewType = "trackedOverview";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];
  static ctx: vscode.ExtensionContext;

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor?.viewColumn;

    // If we already have a panel, show it.
    if (TrackedOverviewPanel.currentPanel) {
      TrackedOverviewPanel.currentPanel._panel.reveal(column);
      return;
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      TrackedOverviewPanel.viewType,
      "Tracked projects overview",
      column || vscode.ViewColumn.One,
      {
        // Enable javascript in the webview
        enableScripts: true,
        // And restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, "dist/public"),
          vscode.Uri.joinPath(extensionUri, "node_modules", "@vscode/codicons"),
        ],
      }
    );

    TrackedOverviewPanel.currentPanel = new TrackedOverviewPanel(
      panel,
      extensionUri
    );
  }

  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    TrackedOverviewPanel.currentPanel = new TrackedOverviewPanel(
      panel,
      extensionUri
    );
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    // Set the webview's initial html content
    this._update();

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programmatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Update the content based on view changes
    this._panel.onDidChangeViewState(
      (e) => {
        if (this._panel.visible) {
          this._update();
        }
      },
      null,
      this._disposables
    );

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case "alert":
            vscode.window.showErrorMessage(message.text);
            return;
        }
      },
      null,
      this._disposables
    );
  }

  public dispose() {
    TrackedOverviewPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private async _update() {
    const webview = this._panel.webview;
    this._panel.webview.html = await this._getHtmlForWebview(webview);
  }

  private async _getHtmlForWebview(webview: vscode.Webview) {
    // And the uri we use to load this script in the webview
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        "dist",
        "public",
        "trackedOverview.js"
      )
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        "dist",
        "public",
        "trackedOverview.css"
      )
    );
    const codiconsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        "node_modules",
        "@vscode/codicons",
        "dist",
        "codicon.css"
      )
    );

    // Use a nonce to only allow specific scripts to be run
    const nonce = getNonce();

    const projects = await getProjects(TrackedOverviewPanel.ctx);
    const currentProjectID = projects?.find(
      (p) =>
        p.project.path === vscode.workspace.workspaceFolders?.[0].uri.fsPath
    )?.project._id;

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<script defer nonce="${nonce}" src="${scriptUri}"></script>
        <link rel="stylesheet" nonce="${nonce}" href="${styleUri}">
        <link href="${codiconsUri}" rel="stylesheet" />
        <script>
          const projectsJSON = \`${JSON.stringify(projects)}\`
          const currentProjectIDbase = "${currentProjectID}"
        </script>
			</head>
			<body id="root">
        
			</body>
			</html>`;
  }
}
