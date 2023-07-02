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

const bird = new Bird({
  position: {
    x: canvas.width / 2 - 30,
    y: 10,
  },
  velocity: {
    x: 0,
    y: 3,
  },
});

function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = "#ddd";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  bird.update();
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
