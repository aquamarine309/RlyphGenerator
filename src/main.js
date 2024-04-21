import "../modules/drag-drop-touch/index.js";
import "./shims.js";
import "./merge-globals.js";
import { browserCheck, init } from "./game.js";
import { DEV } from "./env.js";
import { watchLatestCommit } from "./commit-watcher.js";

if (browserCheck()) init();
if (DEV) watchLatestCommit();
