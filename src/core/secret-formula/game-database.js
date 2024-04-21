import { achievements } from "./achievements/index.js";
import { celestials } from "./celestials/index.js";
import { challenges } from "./challenges/index.js";
import { eternity } from "./eternity/index.js";
import { infinity } from "./infinity/index.js";
import { reality } from "./reality/index.js";
import { tabs } from "./tabs.js";

export const GameDatabase = {
  achievements,
  celestials,
  challenges,
  eternity,
  infinity,
  reality,
  tabs
};

window.GameDatabase = GameDatabase;

window.mapGameData = function mapGameData(gameData, mapFn) {
  const result = [];
  for (const data of gameData) {
    result[data.id] = mapFn(data);
  }
  return result;
};

window.mapGameDataToObject = function mapGameDataToObject(gameData, mapFun) {
  const array = Object.entries(gameData);
  const out = {};
  for (let idx = 0; idx < array.length; idx++) {
    out[array[idx][0]] = mapFun(array[idx][1]);
  }
  return {
    all: Object.values(out),
    ...out
  };
};
