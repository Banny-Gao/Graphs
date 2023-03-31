const React = globalThis.React;
const { createRoot } = globalThis.ReactDOM

import { App } from "./App";

createRoot(document.getElementById("container")).render(
    <App />
);