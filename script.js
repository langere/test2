const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);
const ballCountDisplay = document.getElementById("ballCount");

let ballCount = 0;

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomColor() {
    return (
        "rgb(" +
        random(0, 255) +
        ", " +
        random(0, 255) +
        ", " +
        random(0, 255) +
        ")"
    );
}

function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}

function Ball(x, y, velX, velY, color, size) {
    Shape.call(this, x, y, velX, velY, true);
    this.color = color;
    this.size = size;
}
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
};

Ball.prototype.update = function () {
    if (this.x + this.size >= width || this.x - this.size <= 0) {
        this.velX = -this.velX;
    }
    if (this.y + this.size >= height || this.y - this.size <= 0) {
        this.velY = -this.velY;
    }
    this.x += this.velX;
    this.y += this.velY;
};

Ball.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (this !== balls[j]) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = randomColor();
            }
        }
    }
};

function EvilCircle(x, y) {
    Shape.call(this, x, y, 20, 20, true);
    this.color = "white";
    this.size = 10;
}
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function () {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
};


// 设置控制
EvilCircle.prototype.update = function() {
    window.onkeydown = (e) => {
        switch (e.key) {
            case "a": this.x -= this.velX; break;  // 左移动
            case "d": this.x += this.velX; break;  // 右移动
            case "w": this.y -= this.velY; break;  // 上移动
            case "s": this.y += this.velY; break;  // 下移动
        }
    };
};
EvilCircle.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (balls[j].exists) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].exists = false;
                ballCount--; // 减少球的数量
                updateBallCountDisplay(); // 更新球的数量显示
            }
        }
    }
};

function addBall() {
    let size = random(20, 30);
    let ball = new Ball(
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-6, 6),
        random(-6, 6),
        randomColor(),
        size
    );
    balls.push(ball);
    ballCount++; // 增加球的数量
    updateBallCountDisplay(); // 更新球的数量显示
}

function updateBallCountDisplay() {
    ballCountDisplay.textContent = `当前球数: ${ballCount}`;
}

let balls = [];
let evilCircle = new EvilCircle(0, 0);

// 初始化25个小球
for (let i = 0; i < 25; i++) {
    addBall();
}

function loop() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
    }
    
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => {
        ball.update();
        ball.draw();
    });

    // 在画布中显示当前球数
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial'; // 设置字体和大小
    ctx.fillText(`当前球数: ${ballCount}`, 10, 30); // 在画布上绘制文本

    requestAnimationFrame(animate);
}

    evilCircle.draw();
    evilCircle.update();
    evilCircle.collisionDetect();

    requestAnimationFrame(loop);
}

loop();
