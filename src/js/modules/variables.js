import Player from "../classes/Player";
import Boundary from "../classes/Boundary";
import Ghost from "../classes/Ghost";

//PALLET
export const pallets = [];

//POWERUP
export const powerUps = [];

//MAP
export const map = [
  ["1", "-", "-", "-", "-", "-", "-", "-", "-", "-", "2"],
  ["|", " ", " ", " ", " ", " ", " ", " ", " ", "4", "|"],
  ["|", " ", "x", " ", "x", " ", "<", ">", " ", " ", "|"],
  ["|", " ", " ", " ", " ", " ", " ", " ", "x", " ", "|"],
  ["|", " ", "<", "-", ">", " ", "x", "*", " ", " ", "|"],
  ["|", " ", " ", " ", " ", " ", " ", " ", "x", " ", "|"],
  ["|", " ", "x", " ", "x", " ", "<", ">", " ", " ", "|"],
  ["|", " ", " ", " ", " ", " ", " ", " ", " ", "1", "|"],
  ["4", "-", "-", "-", "-", "-", "-", "-", "-", "-", "3"],
];

export const boundaries = [];

export function createImg(src) {
  const image = new Image();
  image.src = src;
  return image;
}

//PLAYER
export const player = new Player({
  position: {
    x: Boundary.width + Boundary.width / 2,
    y: Boundary.height + Boundary.height / 2,
  },
  velocity: {
    x: 0,
    y: 0,
  },
});

//CONTROLS
export const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

export const gameInfo = {
  lastKey: "",
  score: 0,
};

//GHOST
export const ghosts = [
  new Ghost({
    position: {
      x: 6 * Boundary.width + Boundary.width / 2,
      y: 3 * Boundary.height + Boundary.height / 2,
    },
    velocity: {
      x: Ghost.speed,
      y: 0,
    },
  }),
];
