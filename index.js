const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 700;

const gravity = 0.35;
let isGameOver = false;
let score = 0;

class Sprite {
  constructor({ position, imageSrc, width, height, scale = 1, framesMax = 1 }) {
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.framesMax = framesMax;
  }

  draw() {
    ctx.drawImage(
      this.image,

      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
  }
}

class Bird {
  constructor({
    position,
    imageSrc,
    velocity,
    width,
    height,
    scale = 1,
    framesMax = 1,
  }) {
    this.position = position;
    this.velocity = velocity;
    this.image = new Image();
    this.image.src = imageSrc;
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 8;
  }

  draw() {
    ctx.drawImage(
      this.image,
      (this.image.width / this.framesMax) * this.framesCurrent,
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x,
      this.position.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.draw();
    this.animateFrames();

    if (this.velocity.y < -8) {
      this.velocity.y = -8;
    }

    if (this.position.y + this.height >= canvas.height) {
      isGameOver = true;
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
    ctx.fillStyle = "royalblue";
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
  width: 30,
  height: 30,
  imageSrc: "./assets/basebird2.png",
  framesMax: 3,
  scale: 1.4,
});

const obstacle_list = [];

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/background-night.png",
  width: canvas.width,
  height: canvas.height,
});

let frames = 0;
function animate() {
  requestAnimationFrame(animate);

  if (isGameOver) {
    return;
  }

  ctx.fillStyle = "#ddd";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  background.update();

  bird.update();
  obstacle_list.forEach((obstacle, index) => {
    if (obstacle.position.x + obstacle.width <= 0) {
      setTimeout(() => {
        obstacle_list.splice(index, 1);
        score += 1;
      }, 0);
    }

    // collision detection
    if (
      bird.position.x + bird.width >= obstacle.position.x &&
      bird.position.x <= obstacle.position.x + obstacle.width &&
      (bird.position.y <= obstacle.position.y + obstacle.height ||
        bird.position.y + bird.height >=
          obstacle.position.y + obstacle.height + obstacle.gap)
    ) {
      console.log("충돌");
      bird.velocity.x = 0;
      bird.velocity.y = 0;
      isGameOver = true;
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
          x: -4,
          y: 0,
        },
        height: Math.floor(Math.random() * (canvas.height - 180)) + 10,
        gap: 140,
      })
    );
  }

  frames++;
}

animate();

addEventListener("keydown", (e) => {
  switch (e.key) {
    case " ":
      bird.velocity.y -= 20;
      break;
  }
});
