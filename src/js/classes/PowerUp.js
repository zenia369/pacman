import { c } from "../render";

export default class PowerUp {
  static play = true;

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
