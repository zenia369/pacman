import Boundary from "../classes/Boundary";

export default function collisionDetection({ circle, ractangle }) {
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
