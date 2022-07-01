/// <reference path="../../node_modules/svelte/types/runtime/index.d.ts" />
// @ts-ignore
import App from "../components/trackedOverview/trackedOverview.svelte";

import {
  provideVSCodeDesignSystem,
  vsCodeButton,
  vsCodeDataGrid,
  vsCodeDataGridRow,
  vsCodeDataGridCell,
} from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(vsCodeButton());
provideVSCodeDesignSystem().register(vsCodeDataGrid());
provideVSCodeDesignSystem().register(vsCodeDataGridRow());
provideVSCodeDesignSystem().register(vsCodeDataGridCell());

const app = new App({
  target: document.querySelector("#root") || document.body,
  props: {},
});

export default app;
