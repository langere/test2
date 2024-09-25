// 获取画布元素并设置上下文
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const width = (canvas.width = window.innerWidth); // 设置画布宽度为窗口宽度
const height = (canvas.height = window.innerHeight); // 设置画布高度为窗口高度
const ballCountDisplay = document.getElementById("ballCount"); // 获取显示球数量的元素

let ballCount = 0; // 初始化球的数量

// 生成指定范围内的随机数
function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min; // 生成[min, max)之间的随机整数
}

// 生成随机颜色
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

// 创建一个基本形状类
function Shape(x, y, velX, velY, exists) {
    this.x = x; // X坐标
    this.y = y; // Y坐标
    this.velX = velX; // X方向速度
    this.velY = velY; // Y方向速度
    this.exists = exists; // 该形状是否存在
}

// 创建小球类
function Ball(x, y, velX, velY, color, size) {
    Shape.call(this, x, y, velX, velY, true); // 调用父类构造函数
    this.color = color; // 小球颜色
    this.size = size; // 小球大小
}
Ball.prototype = Object.create(Shape.prototype); // 继承Shape类
Ball.prototype.constructor = Ball; // 设置构造函数

// 绘制小球
Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color; // 设置填充颜色
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); // 绘制圆形
    ctx.fill(); // 填充
};

// 更新小球位置
Ball.prototype.update = function () {
    // 碰撞检测与反弹
    if (this.x + this.size >= width || this.x - this.size <= 0) {
        this.velX = -this.velX; // X方向反向
    }
    if (this.y + this.size >= height || this.y - this.size <= 0) {
        this.velY = -this.velY; // Y方向反向
    }
    this.x += this.velX; // 更新X坐标
    this.y += this.velY; // 更新Y坐标
};

// 碰撞检测
Ball.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        // 检测与其他小球的碰撞
        if (this !== balls[j]) { // 不与自身碰撞
            const dx = this.x - balls[j].x; // 计算X方向距离
            const dy = this.y - balls[j].y; // 计算Y方向距离
            const distance = Math.sqrt(dx * dx + dy * dy); // 计算两球之间的距离

            // 检测碰撞
            if (distance < this.size + balls[j].size) {
                // 如果发生碰撞，改变颜色
                balls[j].color = this.color = randomColor();
            }
        }
    }
};

// 创建恶魔圆圈类
function EvilCircle(x, y) {
    Shape.call(this, x, y, 20, 20, true); // 调用父类构造函数
    this.color = "white"; // 设置颜色为白色
    this.size = 10; // 设置大小
}
EvilCircle.prototype = Object.create(Shape.prototype); // 继承Shape类
EvilCircle.prototype.constructor = EvilCircle; // 设置构造函数

// 绘制恶魔圆圈
EvilCircle.prototype.draw = function () {
    ctx.strokeStyle = this.color; // 设置边框颜色
    ctx.lineWidth = 4; // 设置边框宽度
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); // 绘制圆形
    ctx.stroke(); // 描边
};

// 更新恶魔圆圈的位置
EvilCircle.prototype.update = function() {
    window.onkeydown = (e) => {
        // 根据键盘输入控制移动
        switch (e.key) {
            case "a": this.x -= this.velX; break;  // 左移动
            case "d": this.x += this.velX; break;  // 右移动
            case "w": this.y -= this.velY; break;  // 上移动
            case "s": this.y += this.velY; break;  // 下移动
        }
    };
};

// 恶魔圆圈与小球的碰撞检测
EvilCircle.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (balls[j].exists) { // 只对存在的小球进行检测
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 如果恶魔圈与小球发生碰撞
            if (distance < this.size + balls[j].size) {
                balls[j].exists = false; // 将小球标记为不存在
                ballCount--; // 减少球的数量
                updateBallCountDisplay(); // 更新球的数量显示

                // 从小球数组中删除这个小球
                balls.splice(j, 1); // 从数组中删除碰撞的小球
                j--; // 调整索引，确保检查到下一个小球
            }
        }
    }
};

// 添加小球
function addBall() {
    let size = random(10, 30); // 随机大小
    let ball = new Ball(
        random(0 + size, width - size), // 随机X坐标
        random(0 + size, height - size), // 随机Y坐标
        random(1, 7), // 随机X速度
        random(1, 7), // 随机Y速度
        randomColor(), // 随机颜色
        size // 大小
    );
    balls.push(ball); // 添加到小球数组中
    ballCount++; // 增加球的数量
    updateBallCountDisplay(); // 更新球的数量显示
}

// 更新球的数量显示
function updateBallCountDisplay() {
    ballCountDisplay.textContent = `当前球数: ${ballCount}`;
}

let balls = []; // 小球数组
let evilCircle = new EvilCircle(0, 0); // 创建恶魔圆圈实例

// 初始化100个小球
for (let i = 0; i < 100; i++) {
    addBall();
}

// 主循环函数
function loop() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)"; // 设置背景色
    ctx.fillRect(0, 0, width, height); // 填充背景

    // 更新并绘制所有小球
    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists) { // 如果小球存在
            balls[i].draw(); // 绘制小球
            balls[i].update(); // 更新小球
            balls[i].collisionDetect(); // 碰撞检测
        }
    }

    // 更新恶魔圆圈
    evilCircle.draw();
    evilCircle.update();
    evilCircle.collisionDetect();

    requestAnimationFrame(loop); // 请求下一帧
}

loop(); // 启动主循环
