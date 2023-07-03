const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 700;

const gravity = 0.6;

class Bird {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 30;
    this.height = 30;
  }

  draw() {
    ctx.fillStyle = "royalblue";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.velocity.y < -10) {
      this.velocity.y = -10;
    }

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }
}

class Obstacle {
  constructor({ position, velocity, height, gap }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 70;
    this.height = height;
    this.gap = gap;
  }

  draw() {
    ctx.fillRect(this.position.x, 0, this.width, this.height);
    ctx.fillRect(
      this.position.x,
      this.position.y + this.height + this.gap,
      this.width,
      canvas.height - this.height - this.gap
    );
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
  }
}

const bird = new Bird({
  position: {
    x: canvas.width / 2 - 80,
    y: 10,
  },
  velocity: {
    x: 0,
    y: 3,
  },
});

const obstacle_list = [];

let frames = 0;
function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = "#ddd";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  bird.update();
  obstacle_list.forEach((obstacle, index) => {
    if (obstacle.position.x + obstacle.width <= 0) {
      setTimeout(() => {
        obstacle_list.splice(index, 1);
      }, 0);
    }
    obstacle.update();
  });

  if (frames % 150 === 0) {
    obstacle_list.push(
      new Obstacle({
        position: {
          x: 470,
          y: 0,
        },
        velocity: {
          x: -3,
          y: 0,
        },
        height: Math.floor(Math.random() * (canvas.height - 180)) + 10,
        gap: 150,
      })
    );
  }

  frames++;
}

animate();

addEventListener("keydown", (e) => {
  switch (e.key) {
    case " ":
      console.log(bird.velocity.y);
      bird.velocity.y -= 20;

      break;
  }
});
