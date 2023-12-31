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
    this.angle = 0;
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

  draw() {
    if (this.velocity.y > 0) {
      ctx.save();
      ctx.translate(
        this.position.x + this.width / 2,
        this.position.y + this.height / 2
      );
      ctx.rotate(this.angle);
      ctx.translate(
        -this.position.x - this.width / 2,
        -this.position.y - this.height / 2
      );
      ctx.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width * this.scale,
        this.height * this.scale
      );
      ctx.restore();
    } else {
      ctx.save();
      ctx.translate(
        this.position.x + this.width / 2,
        this.position.y + this.height / 2
      );
      ctx.rotate(0);
      this.angle = 0;
      ctx.translate(
        -this.position.x - this.width / 2,
        -this.position.y - this.height / 2
      );
      ctx.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width * this.scale,
        this.height * this.scale
      );
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.draw();
    this.animateFrames();
    this.angle += 0.01;
    if (this.velocity.y < -8) {
      this.velocity.y = -8;
    }

    if (this.position.y + this.height >= canvas.height - 23) {
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
    ctx.save();
    ctx.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
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

class Ground extends Sprite {
  constructor({
    position,
    velocity,
    width,
    scale = 1,
    framesMax = 1,
    imageSrc,
    height,
  }) {
    super({ position, imageSrc, width, height, scale, framesMax });
    this.velocity = velocity;
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    if (this.position.x + this.width < canvas.width) {
      this.position.x = 0;
    }
  }
}
