const canvas = document.querySelector("canvas");
export const c = canvas.getContext("2d");

canvas.width = innerWidth / 1.7;
canvas.height = innerHeight;

const scoreEl = document.querySelector("#score");

let animationId = undefined;

import "./modules/EventLisneters";

import "../js/modules/generateMap";

import { boundaries, ghosts, keys, gameInfo, pallets, player, powerUps } from "./modules/variables";
import collisionDetection from "./modules/collisionDetection";

import PowerUp from "./classes/PowerUp";
import Ghost from "./classes/Ghost";
import Pallet from "./classes/Pallet";

export function animate() {
  animationId = requestAnimationFrame(animate);

  c.clearRect(0, 0, canvas.width, canvas.height);

  //Checking collision detection
  if (keys.w.pressed && gameInfo.lastKey === "w") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        collisionDetection({
          circle: { ...player, velocity: { x: 0, y: -5 } },
          ractangle: boundary,
        })
      ) {
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = -5;
      }
    }
  } else if (keys.a.pressed && gameInfo.lastKey === "a") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        collisionDetection({
          circle: { ...player, velocity: { x: -5, y: 0 } },
          ractangle: boundary,
        })
      ) {
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = -5;
      }
    }
  } else if (keys.s.pressed && gameInfo.lastKey === "s") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        collisionDetection({
          circle: { ...player, velocity: { x: 0, y: 5 } },
          ractangle: boundary,
        })
      ) {
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = 5;
      }
    }
  } else if (keys.d.pressed && gameInfo.lastKey === "d") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        collisionDetection({
          circle: { ...player, velocity: { x: 5, y: 0 } },
          ractangle: boundary,
        })
      ) {
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = 5;
      }
    }
  }

  //Touch powerUp
  for (let i = powerUps.length - 1; 0 <= i; i--) {
    const powerUp = powerUps[i];
    powerUp.draw();

    //Checking collision detection for PowerUp
    if (
      Math.hypot(powerUp.position.x - player.position.x, powerUp.position.y - player.position.y) <
        powerUp.radius + player.radius &&
      !PowerUp.play
    ) {
      powerUps.splice(i, 1);

      //make ghost scared
      ghosts.forEach((ghost) => {
        ghost.scared = true;
        setTimeout(() => {
          ghost.scared = false;
        }, 3000);
      });
    }
  }

  //Touch Ghost
  for (let i = ghosts.length - 1; 0 <= i; i--) {
    const ghost = ghosts[i];

    //Checking collision detection for Ghost
    if (
      Math.hypot(ghost.position.x - player.position.x, ghost.position.y - player.position.y) <
        ghost.radius + player.radius &&
      !Ghost.play
    ) {
      if (ghost.scared) {
        ghosts.splice(i, 1);
      } else {
        cancelAnimationFrame(animationId);
        document.querySelector("#lost").classList.remove("hidden");
      }
    }
  }

  boundaries.forEach((boundary) => {
    boundary.draw();

    if (collisionDetection({ circle: player, ractangle: boundary })) {
      player.velocity.y = 0;
      player.velocity.x = 0;
    }
  });

  //Eating pallet logic
  for (let i = pallets.length - 1; 0 < i; i--) {
    const pallet = pallets[i];
    const palletIndex = i;
    pallet.draw();

    //Checking collision detection for Pallet
    if (
      Math.hypot(pallet.position.x - player.position.x, pallet.position.y - player.position.y) <
        pallet.radius + player.radius &&
      !Pallet.play
    ) {
      pallets.splice(palletIndex, 1);
      gameInfo.score += 10;
      scoreEl.innerHTML = gameInfo.score;
    }
  }

  //Eated all Pallet
  if (pallets.length - 1 === 0) {
    cancelAnimationFrame(animationId);
    document.querySelector("#win").classList.remove("hidden");
  }

  player.update();

  //Ghost moving logic
  ghosts.forEach((ghost, i) => {
    ghost.update();
    const collisions = [];

    boundaries.forEach((boundary) => {
      if (
        !collisions.includes("right") &&
        collisionDetection({
          circle: { ...ghost, velocity: { x: Ghost.speed, y: 0 } },
          ractangle: boundary,
        })
      ) {
        collisions.push("right");
      }
      if (
        !collisions.includes("left") &&
        collisionDetection({
          circle: { ...ghost, velocity: { x: -Ghost.speed, y: 0 } },
          ractangle: boundary,
        })
      ) {
        collisions.push("left");
      }
      if (
        !collisions.includes("up") &&
        collisionDetection({
          circle: { ...ghost, velocity: { x: 0, y: -Ghost.speed } },
          ractangle: boundary,
        })
      ) {
        collisions.push("up");
      }
      if (
        !collisions.includes("down") &&
        collisionDetection({
          circle: { ...ghost, velocity: { x: 0, y: Ghost.speed } },
          ractangle: boundary,
        })
      ) {
        collisions.push("down");
      }
    });

    if (collisions.length > ghost.prevCollisions.length) {
      ghost.prevCollisions = collisions;
    }

    if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
      if (ghost.velocity.x > 0) ghost.prevCollisions.push("right");
      else if (ghost.velocity.x < 0) ghost.prevCollisions.push("left");
      else if (ghost.velocity.y < 0) ghost.prevCollisions.push("up");
      else if (ghost.velocity.y > 0) ghost.prevCollisions.push("down");

      const pathWay = ghost.prevCollisions.filter((el) => !collisions.includes(el));

      const randomIndex = Math.floor(Math.random() * pathWay.length);
      const direction = pathWay[randomIndex];

      switch (direction) {
        case "down":
          ghost.velocity.y = Ghost.speed;
          ghost.velocity.x = 0;
          break;
        case "up":
          ghost.velocity.y = -Ghost.speed;
          ghost.velocity.x = 0;
          break;
        case "right":
          ghost.velocity.y = 0;
          ghost.velocity.x = Ghost.speed;
          break;
        case "left":
          ghost.velocity.y = 0;
          ghost.velocity.x = -Ghost.speed;
          break;
      }

      ghost.prevCollisions = [];
    }
  });

  if (player.velocity.x > 0) player.rortation = 0;
  else if (player.velocity.x < 0) player.rortation = Math.PI;
  else if (player.velocity.y > 0) player.rortation = Math.PI / 2;
  else if (player.velocity.y < 0) player.rortation = Math.PI * 1.5;
}
