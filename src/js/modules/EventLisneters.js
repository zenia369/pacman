import { keys, gameInfo } from "./variables";

import Ghost from "../classes/Ghost";
import Pallet from "../classes/Pallet";
import PowerUp from "../classes/PowerUp";

const start = () => {
  Ghost.play = false;
  Pallet.play = false;
  PowerUp.play = false;
};
const regame = () => {
  window.location.reload();
};

export default (() => {
  window.addEventListener("keydown", ({ key }) => {
    switch (key) {
      case "w":
        keys.w.pressed = true;
        gameInfo.lastKey = "w";
        break;
      case "a":
        keys.a.pressed = true;
        gameInfo.lastKey = "a";
        break;
      case "s":
        keys.s.pressed = true;
        gameInfo.lastKey = "s";
        break;
      case "d":
        keys.d.pressed = true;
        gameInfo.lastKey = "d";
        break;
    }
  });

  window.addEventListener("keyup", ({ key }) => {
    switch (key) {
      case "w":
        keys.w.pressed = false;
        break;
      case "a":
        keys.a.pressed = false;
        break;
      case "s":
        keys.s.pressed = false;
        break;
      case "d":
        keys.d.pressed = false;
        break;
    }
  });

  document.querySelector("#start").addEventListener("click", start);
  document.querySelector("#regame").addEventListener("click", regame);
})();
