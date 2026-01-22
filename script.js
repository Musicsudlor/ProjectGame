let board;
let boardWidth = 800;
let boardHeight = 300;
let context;

// player
let playerWidth = 85;
let playerHeight = 85;
let playerX = 50;
let playerY;
let playerImg;

let player = {
    x: playerX,
    y: 0,
    width: playerWidth,
    height: playerHeight
};

let gameOver = false;
let score = 0;
let time = 0;
let justRestarted = false;

// box
let boxImg;
let boxWidth = 40;
let boxHeight = 80;
let boxX = 800;
let boxY;
let boxesArray = [];
let boxSpeed = -6;

// physics
let velocityY = 0;
let gravity = 0.5; 

window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    playerY = boardHeight - playerHeight;
    player.y = playerY;

    playerImg = new Image();
    playerImg.src = "pree1.png";

    boxImg = new Image();
    boxImg.src = "bom4.png";

    document.addEventListener("keydown", movePlayer);
    createBox(); // สร้าง box แรก

    requestAnimationFrame(update);
};

function update() {
    requestAnimationFrame(update);
    if (gameOver) return;

    context.clearRect(0, 0, boardWidth, boardHeight);

    // player gravity
    velocityY += gravity;
    player.y = Math.min(player.y + velocityY, playerY);
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);

    // boxes
    for (let i = 0; i < boxesArray.length; i++) {
        let box = boxesArray[i];
        box.x += box.speed;
        context.drawImage(boxImg, box.x, box.y, box.width, box.height);

        // ตรวจสอบการชนกัน แต่ข้ามถ้าเพิ่งรีสตาร์ท หรือ game over
        if ((!justRestarted || time >= 0.5) && !gameOver) {
            if (onCollision(player, box)) {
                gameOver = true;
                context.font = "bold 40px Arial";
                context.textAlign = "center";
                context.fillText("Game Over!", boardWidth / 2, boardHeight / 2);
                context.fillText("Score: " + (score+1), boardWidth / 2, 200 );
                context.fillText("Press SPACE to Restart", boardWidth / 2, 250);
            }
        }
    }

    if (justRestarted && time >= 0.5) {
        justRestarted = false;
    }

    // ลบ logic ลบ boxes เพื่อให้ไม่หายไป

    score++;
    context.font = "20px Arial";
    context.textAlign = "left";
    context.fillText("Score: " + score, 20, 30);

    time += 0.01;
    context.font = "20px Arial";
    context.textAlign = "right";
    context.fillText("Time: " + time.toFixed(2), 780, 30);

    
}

function movePlayer(e) {
    if (gameOver) {
        if (e.code === "Space") {
            // รีสตาร์ทเกม
            gameOver = false;
            score = 0;
            time = 0;
            boxesArray = [];
            player.y = playerY;
            velocityY = 0;
            createBox(); // สร้าง box แรกใหม่
        }
        return;
    }

    if (e.code === "Space" && player.y === playerY) {
        velocityY = -15;
    }
}

function createBox() {
    if (gameOver) return;

    let isFlying = Math.random() < 0.2; // 50% โอกาสเป็น flying
    let randomWidth = Math.floor(Math.random() * 21) + 30; // 30 to 50
    let randomHeight = Math.floor(Math.random() * 41) + 40; // 40 to 80
    let randomY;

    if (isFlying) {
        // สิ่งกีดขวางลอยข้างบน 
        randomY = Math.floor(Math.random() * 100) + 60; // 50 to 150
    } else {
        // สิ่งกีดขวางบนพื้น
        randomY = boardHeight - randomHeight;
    }

    // สุ่มตำแหน่ง x เริ่มต้นให้ห่างกัน
    let startX = boxX + Math.random() * 200; // 800 to 1000

    boxesArray.push({
        x: startX,
        y: randomY,
        width: randomWidth,
        height: randomHeight,
        speed: -5 + Math.random() * 2 // สุ่มความเร็ว -3 to -5
    });

    if (boxesArray.length > 5) {
        boxesArray.shift();
    }

    // สุ่มเวลาสำหรับ box ถัดไป ระหว่าง 2 ถึง 5 วินาที เพื่อไม่ให้ติดกันมาก
    let randomDelay = Math.floor(Math.random() * 3000) + 2000; // 2000 to 5000 ms

    // ถ้ามี boxes ในจอมากกว่า 2 อัน, เพิ่ม delay
    let activeBoxes = boxesArray.filter(b => b.x > 0 && b.x < boardWidth);
    if (activeBoxes.length > 2) {
        randomDelay += 2000; // เพิ่ม 2 วินาที
    }

    setTimeout(createBox, randomDelay);
}

function onCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function restartGame() {
    gameOver = false;
    score = 0;
    time = 0;
    justRestarted = true;
    boxesArray = [];
    player.y = playerY;
    velocityY = 0;
    createBox(); // สร้าง box ใหม่เพื่อให้มีสิ่งกีดขวาง
}



