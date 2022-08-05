const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth / 1.5;
canvas.height = innerHeight;

const scoreEl = document.querySelector("#score");

let animationId = undefined;

class Boundary {
  static width = 40;
  static height = 40;

  constructor({ position, image }) {
    this.position = position;
    this.width = 40;
    this.height = 40;
    this.image = image;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class Player {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.radians = 0.75;
    this.openRate = 0.12;
    this.rortation = 0;
  }

  draw() {
    c.save();
    c.translate(this.position.x, this.position.y);
    c.rotate(this.rortation);
    c.translate(-this.position.x, -this.position.y);
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians);
    c.lineTo(this.position.x, this.position.y);
    c.fillStyle = "yellow";
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.radians < 0 || this.radians > 0.75) {
      this.openRate = -this.openRate;
    }

    this.radians += this.openRate;
  }
}

class Ghost {
  static speed = 2;

  constructor({ position, velocity, color = "red" }) {
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.radius = 15;
    this.prevCollisions = [];
    this.speed = 5;
    this.scared = false;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.scared ? "blue" : this.color;
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Pallet {
  constructor({ position }) {
    this.position = position;
    this.radius = 3;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "white";
    c.fill();
    c.closePath();
  }
}

class PowerUp {
  constructor({ position }) {
    this.position = position;
    this.radius = 8;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "green";
    c.fill();
    c.closePath();
  }
}

//PALLET
const pallets = [];

//POWERUP
const powerUps = [];

//MAP
const map = [
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

const boundaries = [];

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

function createImg(src) {
  const image = new Image();
  image.src = src;
  return image;
}

//PLAYER
const player = new Player({
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
const keys = {
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
let lastKey = "";
let score = 0;

//GHOST
const ghosts = [
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

//Event listner
window.addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
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

//RENDER
function animate() {
  animationId = requestAnimationFrame(animate);

  c.clearRect(0, 0, canvas.width, canvas.height);

  //Checking collision detection
  if (keys.w.pressed && lastKey === "w") {
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
  } else if (keys.a.pressed && lastKey === "a") {
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
  } else if (keys.s.pressed && lastKey === "s") {
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
  } else if (keys.d.pressed && lastKey === "d") {
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
      powerUp.radius + player.radius
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
      ghost.radius + player.radius
    ) {
      if (ghost.scared) {
        ghosts.splice(i, 1);
      } else {
        cancelAnimationFrame(animationId);
        console.log("yuo los");
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
      pallet.radius + player.radius
    ) {
      pallets.splice(palletIndex, 1);
      score += 10;
      scoreEl.innerHTML = score;
    }
  }

  //Eated all Pallet
  if (pallets.length - 1 === 0) {
    cancelAnimationFrame(animationId);
    console.log("you win");
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
animate();

//Collision detection function
function collisionDetection({ circle, ractangle }) {
  const padding = Boundary.width / 2 - circle.radius - 1;

  return (
    circle.position.y - circle.radius + circle.velocity.y <=
      ractangle.position.y + ractangle.height + padding &&
    circle.position.x + circle.radius + circle.velocity.x >= ractangle.position.x - padding &&
    circle.position.y + circle.radius + circle.velocity.y >= ractangle.position.y - padding &&
    circle.position.x - circle.radius + circle.velocity.x <=
      ractangle.position.x + ractangle.width + padding
  );
}
