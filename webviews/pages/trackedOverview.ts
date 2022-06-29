/// <reference path="../../node_modules/svelte/types/runtime/index.d.ts" />
// @ts-ignore
import App from "../components/trackedOverview.svelte";

const app = new App({
  target: document.body,
  props: {},
});

export default app;
