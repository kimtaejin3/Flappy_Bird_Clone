const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 700;

// global variables
const gravity = 0.35;
let isGameOver = false;
let score = 0;

// object variables
const bird = new Bird({
  position: {
    x: canvas.width / 2 - 80,
    y: 10,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  width: 30,
  height: 30,
  imageSrc: "./assets/bluebird-downflap.png",
  framesMax: 3,
  scale: 1.3,
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

const ground = new Ground({
  position: {
    x: 0,
    y: canvas.height - 23,
  },
  velocity: {
    x: -4,
    y: 0,
  },
  imageSrc: "./assets/base.png",
  width: 1000,
  height: 50,
});

let frames = 0;

// animation loop
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
  ground.update();

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
        width: 70,
        height: Math.floor(Math.random() * (canvas.height - 180)) + 10,
        gap: 140,
        imageSrc: "./assets/pipe-green.png",
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
