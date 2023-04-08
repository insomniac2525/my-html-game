

window.onload = () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const player = {
    x: 50,
    y: 450,
    width: 30,
    height: 50,
    color: "blue",
    velY: 0,
    velX: 0,
    gravity: 0.3,
    jumping: false,
    doubleJump: false,
  };

  let { platforms, collectibles } = generatePlatforms();

  // function jump() {
  //   if (!player.jumping) {
  //     player.jumping = true;
  //     player.velY = -12;
  //   }
  // } 

  function jump() {
    if (!player.jumping) {
      player.jumping = true;
      player.doubleJump = false;
      player.velY = -12;
    } else if (!player.doubleJump) {
      player.doubleJump = true;
      player.velY = -12;
    }
  }

  let levelWeight = 2000

  // const platforms = [
  //   { x: 0, y: 500, width: levelWeight, height: 20, color: "green" },
  //   { x: 200, y: 400, width: 200, height: 20, color: "green" },
  //   { x: 600, y: 300, width: 200, height: 20, color: "green" },
  // ];

  function drawPlatforms(platforms) {
    platforms.forEach((platform) => {
      ctx.fillStyle = platform.color;
      ctx.fillRect(
        platform.x - camera.x,
        platform.y - camera.y,
        platform.width,
        platform.height
      );
    });
  }
// randomly generate platform 

// const levelWidth = 2000
function generatePlatforms() {
  const platforms = [
    {
      x: 0,
      y: 500 - 20,
      width: 2000,
      height: 20,
      color: "green",
    },
  ];
  const collectibles = [];

  for (let i = 0; i < 10; i++) {
    const platformWidth = 200;
    const platformHeight = 20;

    const randomX = Math.random() * (2000 - platformWidth);
    const randomY = Math.random() * (canvas.height - platformHeight - 100) + 100;

    platforms.push({
      x: randomX,
      y: randomY,
      width: platformWidth,
      height: platformHeight,
      color: "green",
    });

    collectibles.push({
      x: randomX + platformWidth / 2 - 10,
      y: randomY - 20,
      width: 20,
      height: 20,
      color: "gold",
    });
  }

  return { platforms, collectibles };
}



  const keys = {};

// Modify the restartGame function
function restartGame() {
  if (checkWinCondition()) {
    player.x = 50;
    player.y = 450;
    score = 0;
    updateScore();

    const newObjects = generatePlatforms();
    platforms = newObjects.platforms;
    collectibles = newObjects.collectibles;
  }
}

// restartGame();

document.addEventListener("keydown", (event) => {
  keys[event.code] = true;
  if (event.code === "Space") {
    jump();
  }
  if (event.code === "Enter") {
    restartGame();
  }
});


  function resetCollectibles() {
    collectibles = [
      { x: 250, y: 360, width: 20, height: 20, color: "gold" },
      { x: 650, y: 260, width: 20, height: 20, color: "gold" },
      // Add more collectible items as desired
    ];
  }

  
  function drawCollectibles(collectibles) {
    collectibles.forEach((item) => {
      ctx.fillStyle = item.color;
      ctx.fillRect(
        item.x - camera.x,
        item.y - camera.y,
        item.width,
        item.height
      );
    });
  }

  let score = 0;

  function checkCollectibles() {
    collectibles.forEach((item, index) => {
      if (
        player.x < item.x + item.width &&
        player.x + player.width > item.x &&
        player.y < item.y + item.height &&
        player.y + player.height > item.y
      ) {
        collectibles.splice(index, 1);
        score += 10;
        updateScore();
      }
    });
  }

  function collision(platform) {
    const playerFutureX = player.x + player.velX;
    const playerFutureY = player.y + player.velY;
  
    const playerTop = playerFutureY;
    const playerBottom = playerFutureY + player.height;
    const playerLeft = playerFutureX;
    const playerRight = playerFutureX + player.width;
  
    const platformTop = platform.y;
    const platformBottom = platform.y + platform.height;
    const platformLeft = platform.x;
    const platformRight = platform.x + platform.width;
  
    if (
      playerBottom > platformTop &&
      playerTop < platformBottom &&
      playerRight > platformLeft &&
      playerLeft < platformRight
    ) {
      if (playerTop < platformTop && playerBottom - player.velY <= platformTop) {
        player.y = platformTop - player.height;
        player.velY = 0;
        player.jumping = false;
      } else if (
        playerBottom > platformBottom &&
        playerTop - player.velY >= platformBottom
      ) {
        player.y = platformBottom;
        player.velY = 0;
      } else if (playerLeft < platformLeft && playerRight - player.velX <= platformLeft) {
        player.x = platformLeft - player.width;
      } else if (playerRight > platformRight && playerLeft - player.velX >= platformRight) {
        player.x = platformRight;
      }
    }
  }
  

  function updateScore() {
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText("Score: " + score, 10, 30);
  }

  const targetScore = 20;

  function checkWinCondition() {
    if (score >= targetScore) {
      return true;
    }
    return false;
  }

  function displayWinMessage() {
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("You Win!", canvas.width / 2 - 50, canvas.height / 2);
  }

  let backgroundImage = new Image();
  backgroundImage.src = "space.png";

  let playerImage = new Image();
  playerImage.src = "cha.jpg";
  playerImage.width = "100%";
  playerImage.height = "100%";

  function drawPlayer() {
    ctx.drawImage(playerImage, player.x - camera.x, player.y - camera.y, player.width, player.height);
  }

  const camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  };

  document.addEventListener("keyup", (event) => {
    keys[event.code] = false;
  });

  function movePlayer() {
    if (checkWinCondition()) {
      return;
    }

    const leftArrowPressed = keys["ArrowLeft"];
    const rightArrowPressed = keys["ArrowRight"];
  
    const playerSpeed = 5;
  
    if (leftArrowPressed && player.x > 0) {
      player.x -= playerSpeed;
    }
    if (rightArrowPressed && player.x < levelWeight - player.width) {
      player.x += playerSpeed;
    }
  
    player.x += player.velX;
    player.y += player.velY;
    player.velY += player.gravity;
  
    platforms.forEach((platform) => {
      collision(platform);
      if (
        player.y + player.height > platform.y &&
        player.y < platform.y + platform.height &&
        player.x + player.width > platform.x &&
        player.x < platform.x + platform.width
      ) {
        player.y = platform.y - player.height;
        player.velY = 0;
        player.jumping = false;
      }
    });

    // Reset horizontal velocity
  player.velX = 0;
  
    // Update camera position
    camera.x = player.x - canvas.width / 2 + player.width / 2;
    camera.y = 0;

    // Clamp camera position within canvas bounds
    camera.x = Math.max(0, Math.min(camera.x, 2000 - camera.width));
    camera.y = Math.max(0, Math.min(camera.y, canvas.height - camera.height));
  }

  // function drawBackground() {
  //   ctx.drawImage(
  //     backgroundImage,
  //     -camera.x,
  //     -camera.y,
  //     canvas.width,
  //     canvas.height,
  //     0,
  //     0,
  //     canvas.width,
  //     canvas.height
  //   );
  // }

  function drawBackground() {
    for (let x = -camera.x % backgroundImage.width; x < canvas.width; x += backgroundImage.width) {
      for (let y = -camera.y % backgroundImage.height; y < canvas.height; y += backgroundImage.height) {
        ctx.drawImage(backgroundImage, x, y, backgroundImage.width, backgroundImage.height);
      }
    }
  }

  resetCollectibles()

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    movePlayer();
    drawPlayer();
    drawPlatforms(platforms);
    drawCollectibles(collectibles);
    checkCollectibles(collectibles);
    updateScore();

  
    if (checkWinCondition()) {
      displayWinMessage();
      if (keys["Enter"]) {
        restartGame();
      }
    }
  
    requestAnimationFrame(gameLoop);
  }
  

  gameLoop();
  updateScore();

  async function startGame() {
    collectibles = [
      { x: 250, y: 360, width: 20, height: 20, color: "gold" },
      { x: 650, y: 260, width: 20, height: 20, color: "gold" },
    ];
    await new Promise((resolve) => {
      backgroundImage.onload = () => {
        resolve();
      };
    });
  
    await new Promise((resolve) => {
      playerImage.onload = () => {
        resolve();
      };
    });
  
    gameLoop();
  }

  startGame()
};


