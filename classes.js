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
      this.width * this.scale,
      this.height * this.scale
    );
  }

  update() {
    this.draw();
  }
}

class Bird extends Sprite {
  constructor({
    position,
    imageSrc,
    velocity,
    width,
    height,
    scale = 1,
    framesMax = 1,
  }) {
    super({ position, imageSrc, width, height, scale, framesMax });
    this.velocity = velocity;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 8;
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
        if (this.framesCurrent === 1) {
          this.image.src = "./assets/bluebird-midflap.png";
        } else {
          this.image.src = "./assets/bluebird-upflap.png";
        }
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

class Obstacle extends Sprite {
  constructor({
    position,
    imageSrc,
    width,
    height,
    velocity,
    scale = 1,
    framesMax = 1,
    gap,
  }) {
    super({ position, imageSrc, width, height, scale, framesMax });

    this.position = position;
    this.velocity = velocity;
    this.width = width;
    this.height = height;
    this.gap = gap;
  }

  draw() {
    // ctx.fillStyle = "royalblue";
    // ctx.fillRect(this.position.x, 0, this.width, this.height);
    // ctx.drawImage(this.image, 0, canvas.height - 600, this.width, 431);

    ctx.save();
    ctx.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    // ctx.rotate(3.14);
    ctx.rotate(Math.PI);
    ctx.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );

    let d1 = 0;
    if (this.height < 484) {
      d1 = 484 - this.height;
    }

    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height + d1
    );
    console.log(this.height);

    ctx.restore();

    let d2 = 0;
    if (this.height < 531) {
      d2 = 531 - (canvas.height - this.height - this.gap);
    }
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y + this.height + this.gap,
      this.width,
      canvas.height - this.height - this.gap + d2
    );
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
  }
}
