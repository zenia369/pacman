import { map, boundaries, powerUps, pallets, createImg } from "./variables";

import Boundary from "../classes/Boundary";
import Pallet from "../classes/Pallet";
import PowerUp from "../classes/PowerUp";

map.forEach((row, rowIndex) => {
  row.forEach((symbol, columnIndex) => {
    switch (symbol) {
      case "-":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * columnIndex,
              y: Boundary.height * rowIndex,
            },
            image: createImg("./images/pipeHorizontal.png"),
          })
        );
        break;
      case "|":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * columnIndex,
              y: Boundary.height * rowIndex,
            },
            image: createImg("./images/pipeVertical.png"),
          })
        );
        break;
      case /[0-9]/.test(symbol) ? symbol : false:
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * columnIndex,
              y: Boundary.height * rowIndex,
            },
            image: createImg(`./images/pipeCorner${symbol}.png`),
          })
        );
        break;
      case "x":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * columnIndex,
              y: Boundary.height * rowIndex,
            },
            image: createImg("./images/block.png"),
          })
        );
        break;
      case ">":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * columnIndex,
              y: Boundary.height * rowIndex,
            },
            image: createImg("./images/capRight.png"),
          })
        );
        break;
      case "<":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * columnIndex,
              y: Boundary.height * rowIndex,
            },
            image: createImg("./images/capLeft.png"),
          })
        );
        break;
      case "^":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * columnIndex,
              y: Boundary.height * rowIndex,
            },
            image: createImg("./images/capTop.png"),
          })
        );
        break;
      case "_":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * columnIndex,
              y: Boundary.height * rowIndex,
            },
            image: createImg("./images/capBottom.png"),
          })
        );
        break;
      case "+":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * columnIndex,
              y: Boundary.height * rowIndex,
            },
            image: createImg("./images/pipeCross.png"),
          })
        );
        break;
      case "*":
        powerUps.push(
          new PowerUp({
            position: {
              x: columnIndex * Boundary.width + Boundary.width / 2,
              y: rowIndex * Boundary.height + Boundary.height / 2,
            },
          })
        );
        break;
      default:
        pallets.push(
          new Pallet({
            position: {
              x: columnIndex * Boundary.width + Boundary.width / 2,
              y: rowIndex * Boundary.height + Boundary.height / 2,
            },
          })
        );
    }
  });
});
