/// <reference path="../../node_modules/svelte/types/runtime/index.d.ts" />
// @ts-ignore
import App from "../components/trackedOverview/trackedOverview.svelte";

import {
  provideVSCodeDesignSystem,
  vsCodeButton,
} from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(vsCodeButton());

const app = new App({
  target: document.querySelector("#root") || document.body,
  props: {},
});

export default app;
