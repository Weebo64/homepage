const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const leaderboardScreen = document.getElementById('leaderboardScreen');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const finalScoreDisplay = document.getElementById('finalScore');
const newHighScoreDisplay = document.getElementById('newHighScore');
const restartBtn = document.getElementById('restartBtn');
const leaderboardBtn = document.getElementById('leaderboardBtn');
const closeLeaderboardBtn = document.getElementById('closeLeaderboardBtn');
canvas.width = 1000;
canvas.height = 500;
function resizeCanvas() {
    const isFullscreen = window.innerHeight === screen.height || 
                        document.fullscreenElement || 
                        document.webkitFullscreenElement || 
                        document.mozFullScreenElement ||
                        window.fullScreen;
    if (isFullscreen) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    } else {
        canvas.width = 1000;
        canvas.height = 500;
    }
}
window.addEventListener('resize', resizeCanvas);
document.addEventListener('fullscreenchange', resizeCanvas);
document.addEventListener('webkitfullscreenchange', resizeCanvas);
document.addEventListener('mozfullscreenchange', resizeCanvas);
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const JUMP_HOLD_FORCE = -0.3;
const MAX_JUMP_HOLD_TIME = 15;
const GAME_SPEED_START = 8;
const GAME_SPEED_INCREMENT = 0.003;
let gameState = 'start';
let score = 0;
let coins = 0;
let highScore = localStorage.getItem('weebowoRunHighScore') || 0;
let gameSpeed = GAME_SPEED_START;
let frameCount = 0;
let deathAnimationFrame = 0;
let deathCheckpointX = 0;
let jumpHoldTime = 0;
let isJumpKeyHeld = false;
let playerName = '';
let difficulty = 'medium';
let isPoweredUp = false;
let powerUpAnimationFrame = 0;
let isInvincible = false;
let invincibleFrames = 0;
let scoreAtPowerUp = 0;
let isPoweringDown = false;
let powerDownAnimationFrame = 0;
const INVINCIBLE_DURATION = 120;

const audio = {
    mainTheme: new Audio('music/overworld.mp3'),
    fcoTheme: new Audio('music/beta_theme.ogg'),
    horseTheme: new Audio('music/zgw0vr.ogg'),
    powerUp: new Audio('music/power-up.mp3'),
    coin: new Audio('music/coin.mp3'),
    jump: new Audio('music/jump.mp3'),
    hitted: new Audio('music/hitted.mp3'),
    death: new Audio('music/death.mp3')
};

audio.mainTheme.loop = true;
audio.fcoTheme.loop = false;
audio.horseTheme.loop = true;
audio.powerUp.loop = false;
audio.coin.loop = false;
audio.jump.loop = false;
audio.hitted.loop = false;
audio.death.loop = false;

let fcoLoopStarted = false;

audio.fcoTheme.addEventListener('timeupdate', function() {
    if (fcoLoopStarted && this.currentTime >= 44.43) {
        this.currentTime = 2.46;
    }
});

audio.fcoTheme.addEventListener('play', function() {
    if (this.currentTime < 2.46) {
        fcoLoopStarted = false;
    }
});

audio.fcoTheme.addEventListener('timeupdate', function() {
    if (!fcoLoopStarted && this.currentTime >= 2.46) {
        fcoLoopStarted = true;
    }
});

let currentMusic = null;
const difficultySettings = {
    easy: {
        speedIncrement: 0.002,
        obstacleFrequency: 110,
        powerUpScore: 50,
        name: 'Easy'
    },
    medium: {
        speedIncrement: 0.003,
        obstacleFrequency: 90,
        powerUpScore: 100,
        name: 'Medium'
    },
    hard: {
        speedIncrement: 0.004,
        obstacleFrequency: 70,
        powerUpScore: 150,
        name: 'Hard'
    }
};
highScoreDisplay.textContent = highScore;
const sprites = {
    walk1: new Image(),
    walk2: new Image(),
    jump: new Image(),
    falling: new Image(),
    dead: new Image(),
    checkpoint: new Image(),
    coin1: new Image(),
    coin2: new Image(),
    goomba1: new Image(),
    goomba2: new Image(),
    pipe: new Image(),
    blueshell: new Image(),
    death1: new Image(),
    death2: new Image()
};
let spritesLoaded = 0;
const totalSprites = 14;
sprites.walk1.src = 'sprites/walk1.png';
sprites.walk2.src = 'sprites/walk2.png';
sprites.jump.src = 'sprites/jump.png';
sprites.falling.src = 'sprites/falling.png';
sprites.dead.src = 'sprites/dead.png';
sprites.checkpoint.src = 'sprites/checkpoint_leaderboard.png';
sprites.coin1.src = 'sprites/coin1.png';
sprites.coin2.src = 'sprites/coin2.png';
sprites.goomba1.src = 'sprites/goomba.png';
sprites.goomba2.src = 'sprites/goomba2.png';
sprites.pipe.src = 'sprites/pipe.png';
sprites.blueshell.src = 'sprites/blueshell.png';
sprites.death1.src = 'sprites/death.png';
sprites.death2.src = 'sprites/death2.png';
Object.values(sprites).forEach(sprite => {
    sprite.onload = () => {
        spritesLoaded++;
        if (spritesLoaded === totalSprites) {
            console.log('All sprites loaded!');
            console.log('Sprite sizes:');
            console.log('walk1:', sprites.walk1.naturalWidth, 'x', sprites.walk1.naturalHeight);
            console.log('walk2:', sprites.walk2.naturalWidth, 'x', sprites.walk2.naturalHeight);
            console.log('jump:', sprites.jump.naturalWidth, 'x', sprites.jump.naturalHeight);
        }
    };
    sprite.onerror = () => {
        console.error('Failed to load sprite:', sprite.src);
    };
});
ctx.imageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
const player = {
    x: 100,
    y: 0,
    width: 0,
    height: 0,
    baseScale: 2,
    powerUpScale: 3,
    scale: 2,
    velocityY: 0,
    jumping: false,
    ducking: false,
    groundY: 0,
    walkFrame: 0,
    walkAnimSpeed: 8
};
const obstacles = [];
const clouds = [];
const grounds = [];
function createObstacle() {
    const types = ['pipe', 'goomba', 'coin', 'blueshell'];
    let type;
    
    if (Math.random() < 0.15) {
        type = 'blueshell';
    } else {
        const normalTypes = ['pipe', 'goomba', 'coin'];
        type = normalTypes[Math.floor(Math.random() * normalTypes.length)];
    }
    
    const GROUND_Y = canvas.height * 0.8;
    const obstacle = {
        x: canvas.width,
        type: type
    };
    if (type === 'pipe') {
        obstacle.width = 65;
        obstacle.height = 95;
        obstacle.y = GROUND_Y - obstacle.height;
    } else if (type === 'goomba') {
        obstacle.width = 55;
        obstacle.height = 55;
        obstacle.y = GROUND_Y - obstacle.height;
    } else if (type === 'blueshell') {
        obstacle.width = 50;
        obstacle.height = 40;
        const playerHeight = isPoweredUp ? sprites.walk1.naturalHeight * player.powerUpScale : sprites.walk1.naturalHeight * player.baseScale;
        obstacle.y = GROUND_Y - playerHeight + 10;
        obstacle.speed = gameSpeed * 2.5;
    } else {
        obstacle.width = 45;
        obstacle.height = 45;
        obstacle.y = GROUND_Y - 80;
        obstacle.isCollectible = true;
    }
    obstacles.push(obstacle);
}
function createCloud() {
    clouds.push({
        x: canvas.width,
        y: Math.random() * (canvas.height * 0.4) + 50,
        width: 120,
        height: 60,
        speed: Math.random() * 1 + 0.5
    });
}
function createGround() {
    grounds.push({
        x: grounds.length > 0 ? grounds[grounds.length - 1].x + 50 : 0,
        y: player.groundY + player.height,
        width: 50,
        height: 10
    });
}
function init() {
    resizeCanvas();
    player.scale = player.baseScale;
    player.width = 0;
    player.height = 0;
    const GROUND_Y = canvas.height * 0.8;
    player.y = GROUND_Y;
    player.velocityY = 0;
    player.jumping = false;
    player.ducking = false;
    player.walkFrame = 0;
    obstacles.length = 0;
    clouds.length = 0;
    grounds.length = 0;
    score = 0;
    coins = 0;
    isPoweredUp = false;
    powerUpAnimationFrame = 0;
    isInvincible = false;
    invincibleFrames = 0;
    scoreAtPowerUp = difficultySettings[difficulty].powerUpScore;
    isPoweringDown = false;
    powerDownAnimationFrame = 0;
    gameSpeed = GAME_SPEED_START;
    frameCount = 0;
    deathAnimationFrame = 0;
    deathCheckpointX = 0;
    createCloud();
}
function jump() {
    if (!player.jumping && !player.ducking && player.y >= player.groundY) {
        player.velocityY = JUMP_FORCE;
        player.jumping = true;
        jumpHoldTime = 0;
        isJumpKeyHeld = true;
        audio.jump.currentTime = 0;
        audio.jump.play().catch(e => console.log('Jump sound error:', e));
    }
}
function releaseJump() {
    isJumpKeyHeld = false;
}
function duck(isDucking) {
    if (!player.jumping) {
        player.ducking = isDucking;
    }
}
function updatePlayer() {
    if (player.jumping && isJumpKeyHeld && player.velocityY < 0 && jumpHoldTime < MAX_JUMP_HOLD_TIME) {
        player.velocityY += JUMP_HOLD_FORCE;
        jumpHoldTime++;
    }
    player.velocityY += GRAVITY;
    player.y += player.velocityY;
    const GROUND_Y = canvas.height * 0.8;
    const playerBottom = player.y + player.height;
    if (playerBottom >= GROUND_Y) {
        player.y = GROUND_Y - player.height;
        player.velocityY = 0;
        player.jumping = false;
        jumpHoldTime = 0;
    }
    if (!player.jumping && gameState === 'playing' && frameCount > 0) {
        if (frameCount % player.walkAnimSpeed === 0) {
            player.walkFrame = player.walkFrame === 0 ? 1 : 0;
        }
    }
    
    if (gameState === 'poweringUp' || gameState === 'poweringDown') {
        if (frameCount % player.walkAnimSpeed === 0) {
            player.walkFrame = player.walkFrame === 0 ? 1 : 0;
        }
    }
}
function updateObstacles() {
    const settings = difficultySettings[difficulty];
    if (frameCount % settings.obstacleFrequency === 0) {
        createObstacle();
    }
    obstacles.forEach((obstacle, index) => {
        const moveSpeed = obstacle.type === 'blueshell' ? obstacle.speed : gameSpeed;
        obstacle.x -= moveSpeed;
        if (!obstacle.passed && obstacle.x + obstacle.width < player.x) {
            obstacle.passed = true;
            if (!obstacle.isCollectible) {
                score += 10;
            }
        }
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
        }
        if (obstacle.isCollectible && !obstacle.collected) {
            if (checkCollisionWithObstacle(obstacle)) {
                obstacle.collected = true;
                coins++;
                score += 5;
                obstacles.splice(index, 1);
                audio.coin.currentTime = 0;
                audio.coin.play().catch(e => console.log('Coin sound error:', e));
            }
        }
    });
    if (!isPoweredUp && score >= scoreAtPowerUp) {
        startPowerUpAnimation();
    }
}
function updateClouds() {
    if (frameCount % 400 === 0 && clouds.length < 2) {
        createCloud();
    }
    clouds.forEach((cloud, index) => {
        cloud.x -= cloud.speed;
        if (cloud.x + cloud.width < 0) {
            clouds.splice(index, 1);
        }
    });
}
function updateGround() {
}
function checkCollision() {
    if (isInvincible || isPoweringDown) return false;
    
    for (let obstacle of obstacles) {
        if (obstacle.isCollectible || obstacle.collected) continue;
        if (checkCollisionWithObstacle(obstacle)) {
            if (isPoweredUp) {
                handlePowerDown();
                return false;
            } else {
                return true;
            }
        }
    }
    return false;
}
function checkCollisionWithObstacle(obstacle) {
    const playerHeight = player.ducking ? player.height * 0.6 : player.height;
    const playerY = player.ducking ? player.y + player.height * 0.4 : player.y;
    return (
        player.x < obstacle.x + obstacle.width - 10 &&
        player.x + player.width - 10 > obstacle.x &&
        playerY < obstacle.y + obstacle.height - 10 &&
        playerY + playerHeight - 10 > obstacle.y
    );
}
function startPowerUpAnimation() {
    isPoweredUp = true;
    powerUpAnimationFrame = 0;
    gameState = 'poweringUp';
    scoreAtPowerUp = score;
    audio.powerUp.currentTime = 0;
    audio.powerUp.play().catch(e => console.log('Power-up sound error:', e));
}
function handlePowerDown() {
    isPoweringDown = true;
    powerDownAnimationFrame = 0;
    isInvincible = true;
    invincibleFrames = 0;
    scoreAtPowerUp = score + difficultySettings[difficulty].powerUpScore;
    gameState = 'poweringDown';
    
    audio.hitted.currentTime = 0;
    audio.hitted.play().catch(e => console.log('Hit sound error:', e));
}

function updatePowerDownAnimation() {
    powerDownAnimationFrame++;
    if (powerDownAnimationFrame < 30) {
        if (Math.floor(powerDownAnimationFrame / 3) % 2 === 0) {
            player.scale = player.powerUpScale;
        } else {
            player.scale = player.baseScale;
        }
        if (sprites.walk1.naturalWidth > 0) {
            const oldHeight = player.height;
            player.width = sprites.walk1.naturalWidth * player.scale;
            player.height = sprites.walk1.naturalHeight * player.scale;
            const heightDiff = oldHeight - player.height;
            player.y += heightDiff;
        }
    } else {
        isPoweredUp = false;
        isPoweringDown = false;
        player.scale = player.baseScale;
        player.width = sprites.walk1.naturalWidth * player.scale;
        player.height = sprites.walk1.naturalHeight * player.scale;
        gameState = 'playing';
    }
}

function updateInvincibility() {
    if (isInvincible) {
        invincibleFrames++;
        if (invincibleFrames >= INVINCIBLE_DURATION) {
            isInvincible = false;
            invincibleFrames = 0;
        }
    }
}

function updatePowerUpAnimation() {
    powerUpAnimationFrame++;
    if (powerUpAnimationFrame < 30) {
        if (Math.floor(powerUpAnimationFrame / 3) % 2 === 0) {
            player.scale = player.baseScale;
        } else {
            player.scale = player.powerUpScale;
        }
        if (sprites.walk1.naturalWidth > 0) {
            const oldHeight = player.height;
            player.width = sprites.walk1.naturalWidth * player.scale;
            player.height = sprites.walk1.naturalHeight * player.scale;
            const heightDiff = player.height - oldHeight;
            player.y -= heightDiff;
        }
    } else {
        player.scale = player.powerUpScale;
        player.width = sprites.walk1.naturalWidth * player.scale;
        player.height = sprites.walk1.naturalHeight * player.scale;
        gameState = 'playing';
    }
}
function drawPlayer() {
    const drawHeight = player.ducking ? player.height * 0.6 : player.height;
    const drawY = player.ducking ? player.y + player.height * 0.4 : player.y;
    
    if (isInvincible && Math.floor(frameCount / 5) % 2 === 0) {
        return;
    }
    
    if (spritesLoaded >= totalSprites) {
        let currentSprite;
        if (player.jumping) {
            currentSprite = player.velocityY < 0 ? sprites.jump : sprites.jump;
        } else {
            currentSprite = player.walkFrame === 0 ? sprites.walk1 : sprites.walk2;
        }
        if (player.width === 0) {
            player.width = currentSprite.naturalWidth * player.scale;
            player.height = currentSprite.naturalHeight * player.scale;
        }
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
            currentSprite,
            player.x,
            drawY,
            currentSprite.naturalWidth * player.scale,
            player.ducking ? currentSprite.naturalHeight * player.scale * 0.6 : currentSprite.naturalHeight * player.scale
        );
    } else {
        ctx.fillStyle = '#ffdf00';
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 3;
        ctx.fillRect(player.x, drawY, 50, 50);
        ctx.strokeRect(player.x, drawY, 50, 50);
    }
}
function drawDeathAnimation() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#5c94fc');
    gradient.addColorStop(1, '#92c5ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawClouds();
    drawGround();
    drawObstacles();
    
    const scale = isPoweredUp ? player.powerUpScale : player.baseScale;
    const GROUND_Y = canvas.height * 0.8;
    
    if (deathAnimationFrame < 15) {
        const deathSprite = Math.floor(deathAnimationFrame / 8) % 2 === 0 ? sprites.death1 : sprites.death2;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
            deathSprite,
            deathCheckpointX,
            player.y,
            sprites.death1.naturalWidth * scale,
            sprites.death1.naturalHeight * scale
        );
    } else if (deathAnimationFrame < 55) {
        const jumpProgress = (deathAnimationFrame - 15) / 40;
        const jumpHeight = 180;
        const jumpY = player.y - (Math.sin(jumpProgress * Math.PI) * jumpHeight);
        
        const deathSprite = Math.floor(deathAnimationFrame / 8) % 2 === 0 ? sprites.death1 : sprites.death2;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
            deathSprite,
            deathCheckpointX,
            jumpY,
            sprites.death1.naturalWidth * scale,
            sprites.death1.naturalHeight * scale
        );
    } else if (deathAnimationFrame < 95) {
        const fallProgress = (deathAnimationFrame - 55) / 40;
        const fallY = player.y + (fallProgress * fallProgress * (canvas.height - player.y + 150));
        
        const deathSprite = Math.floor(deathAnimationFrame / 8) % 2 === 0 ? sprites.death1 : sprites.death2;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
            deathSprite,
            deathCheckpointX,
            fallY,
            sprites.death1.naturalWidth * scale,
            sprites.death1.naturalHeight * scale
        );
    } else if (deathAnimationFrame < 155) {
        const fadeProgress = (deathAnimationFrame - 95) / 60;
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeProgress})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    deathAnimationFrame++;
    if (deathAnimationFrame >= 155) {
        finalScoreDisplay.textContent = score;
        saveScore(score);
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('weebowoRunHighScore', highScore);
            highScoreDisplay.textContent = highScore;
            newHighScoreDisplay.classList.remove('hidden');
        } else {
            newHighScoreDisplay.classList.add('hidden');
        }
        gameOverScreen.classList.remove('hidden');
        gameState = 'gameOver';
    }
}
function drawObstacles() {
    obstacles.forEach(obstacle => {
        if (obstacle.type === 'pipe') {
            if (spritesLoaded >= totalSprites && sprites.pipe.naturalWidth > 0) {
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(
                    sprites.pipe,
                    obstacle.x,
                    obstacle.y,
                    obstacle.width,
                    obstacle.height
                );
            } else {
                ctx.fillStyle = '#2ecc40';
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                ctx.fillStyle = '#27ae60';
                ctx.fillRect(obstacle.x - 4, obstacle.y, obstacle.width + 8, 8);
            }
        } else if (obstacle.type === 'goomba') {
            if (spritesLoaded >= totalSprites && sprites.goomba1.naturalWidth > 0) {
                const goombaFrame = Math.floor(frameCount / 10) % 2;
                const currentGoombaSprite = goombaFrame === 0 ? sprites.goomba1 : sprites.goomba2;
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(
                    currentGoombaSprite,
                    obstacle.x,
                    obstacle.y,
                    obstacle.width,
                    obstacle.height
                );
            } else {
                ctx.fillStyle = '#8b4513';
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                ctx.fillStyle = '#fff';
                ctx.fillRect(obstacle.x + 8, obstacle.y + 10, 8, 8);
                ctx.fillRect(obstacle.x + 19, obstacle.y + 10, 8, 8);
                ctx.fillStyle = '#000';
                ctx.fillRect(obstacle.x + 10, obstacle.y + 12, 4, 4);
                ctx.fillRect(obstacle.x + 21, obstacle.y + 12, 4, 4);
            }
        } else if (obstacle.type === 'coin') {
            const coinFrame = Math.floor(frameCount / 10) % 2;
            const currentCoinSprite = coinFrame === 0 ? sprites.coin1 : sprites.coin2;
            if (spritesLoaded >= totalSprites && currentCoinSprite.naturalWidth > 0) {
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(
                    currentCoinSprite,
                    obstacle.x,
                    obstacle.y,
                    obstacle.width,
                    obstacle.height
                );
            } else {
                const coinWidth = obstacle.width * (1 - Math.abs(coinFrame - 0.5) / 2);
                ctx.fillStyle = '#ffd700';
                ctx.fillRect(
                    obstacle.x + (obstacle.width - coinWidth) / 2,
                    obstacle.y,
                    coinWidth,
                    obstacle.height
                );
            }
        } else if (obstacle.type === 'blueshell') {
            if (spritesLoaded >= totalSprites && sprites.blueshell.naturalWidth > 0) {
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(
                    sprites.blueshell,
                    obstacle.x,
                    obstacle.y,
                    obstacle.width,
                    obstacle.height
                );
            } else {
                ctx.fillStyle = '#0066ff';
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(obstacle.x + 10, obstacle.y + 10, 10, 10);
            }
        }
    });
}
function drawClouds() {
    clouds.forEach(cloud => {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.width / 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cloud.x + cloud.width / 3, cloud.y - 5, cloud.width / 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cloud.x + cloud.width / 1.5, cloud.y, cloud.width / 3, 0, Math.PI * 2);
        ctx.fill();
    });
}
function drawGround() {
    const GROUND_Y = canvas.height * 0.8;
    const groundHeight = canvas.height - GROUND_Y;
    ctx.fillStyle = '#7ec850';
    ctx.fillRect(0, GROUND_Y, canvas.width, 15);
    ctx.fillStyle = '#8b6914';
    ctx.fillRect(0, GROUND_Y + 15, canvas.width, groundHeight - 15);
}

function draw() {
    ctx.imageSmoothingEnabled = false;
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#5c94fc');
    gradient.addColorStop(1, '#92c5ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!lowQualityMode) {
        drawClouds();
    }
    drawGround();
    drawPlayer();
    drawObstacles();
}
function gameLoop() {
    if (gameState === 'deathAnimation') {
        drawDeathAnimation();
        requestAnimationFrame(gameLoop);
        return;
    }
    if (gameState === 'poweringUp') {
        updatePowerUpAnimation();
        updatePlayer();
        draw();
        requestAnimationFrame(gameLoop);
        return;
    }

    if (gameState === 'poweringDown') {
        updatePowerDownAnimation();
        updatePlayer();
        draw();
        requestAnimationFrame(gameLoop);
        return;
    }
    if (gameState === 'paused') {
        return;
    }
    if (gameState !== 'playing') return;
    
    const currentTime = performance.now();
    const elapsed = currentTime - lastFrameTime;
    
    if (elapsed < frameDelay) {
        requestAnimationFrame(gameLoop);
        return;
    }
    
    lastFrameTime = currentTime - (elapsed % frameDelay);
    
    frameCount++;
    const speedBoost = Math.floor(score / 100) * 0.7;
    gameSpeed = GAME_SPEED_START + speedBoost + (frameCount * difficultySettings[difficulty].speedIncrement);
    updatePlayer();
    updateObstacles();
    if (!lowQualityMode) {
        updateClouds();
    }
    updateGround();
    updateInvincibility();
    if (checkCollision()) {
        startDeathAnimation();
        return;
    }
    draw();
    scoreDisplay.textContent = score;
    document.getElementById('coins').textContent = coins;
    
    const coinSprite = document.getElementById('coinSprite');
    const coinFrame = Math.floor(frameCount / 10) % 2;
    coinSprite.src = coinFrame === 0 ? 'sprites/coin1.png' : 'sprites/coin2.png';
    
    requestAnimationFrame(gameLoop);
}
function startDeathAnimation() {
    gameState = 'deathAnimation';
    deathAnimationFrame = 0;
    deathCheckpointX = player.x;
    stopMusic();
    audio.death.currentTime = 0;
    audio.death.play().catch(e => console.log('Death sound error:', e));
    gameLoop();
}
function startGame() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) {
        const isFullscreen = window.innerHeight === screen.height || 
                            document.fullscreenElement || 
                            document.webkitFullscreenElement || 
                            document.mozFullScreenElement ||
                            window.fullScreen;
        if (!isFullscreen) {
            alert('Please press F11 to enter fullscreen mode before playing!');
            return;
        }
    } else {
        const isLandscape = window.innerWidth > window.innerHeight;
        if (!isLandscape) {
            return;
        }
    }
    
    gameState = 'playing';
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    leaderboardScreen.classList.add('hidden');
    
    if (isMobile) {
        document.getElementById('mobileControls').classList.add('active');
    }
    
    init();
    playMusic();
    gameLoop();
}

function playMusic() {
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }
    
    const nameLower = playerName.toLowerCase();
    
    if (nameLower === 'fco64' || nameLower === 'fco' || nameLower === 'fco64') {
        currentMusic = audio.fcoTheme;
        currentMusic.currentTime = 0;
    } else if (nameLower === 'horse' || nameLower === 'horsemanoftheapocolypse' || nameLower === 'unc horse') {
        currentMusic = audio.horseTheme;
        currentMusic.currentTime = 0;
    } else {
        currentMusic = audio.mainTheme;
        currentMusic.currentTime = 0;
    }
    
    currentMusic.play().catch(e => console.log('Music play error:', e));
}

function stopMusic() {
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }
}
function gameOver() {
    gameState = 'gameOver';
    finalScoreDisplay.textContent = score;
    saveScore(score);
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('weebowoRunHighScore', highScore);
        highScoreDisplay.textContent = highScore;
        newHighScoreDisplay.classList.remove('hidden');
    } else {
        newHighScoreDisplay.classList.add('hidden');
    }
    gameOverScreen.classList.remove('hidden');
}
function saveScore(score) {
    let leaderboard = JSON.parse(localStorage.getItem('weebowoRunLeaderboard') || '[]');
    leaderboard.push({
        name: playerName,
        score: score,
        coins: coins,
        difficulty: difficulty,
        date: new Date().toISOString()
    });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);
    localStorage.setItem('weebowoRunLeaderboard', JSON.stringify(leaderboard));
}
function showLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('weebowoRunLeaderboard') || '[]');
    const leaderboardList = document.getElementById('leaderboardList');
    if (leaderboard.length === 0) {
        leaderboardList.innerHTML = '<div class="leaderboard-empty">No scores yet. Be the first!</div>';
    } else {
        leaderboardList.innerHTML = leaderboard.map((entry, index) => {
            const date = new Date(entry.date);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            const rankClass = index === 0 ? 'top-1' : index === 1 ? 'top-2' : index === 2 ? 'top-3' : '';
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
            const diffIcon = entry.difficulty === 'easy' ? '🟢' : entry.difficulty === 'hard' ? '🔴' : '🟡';
            return `
                <div class="leaderboard-entry ${rankClass}">
                    <div class="entry-rank">${medal} #${index + 1}</div>
                    <div class="entry-info">
                        <div class="entry-name">${entry.name || 'Player'}</div>
                        <div class="entry-details">${diffIcon} ${entry.coins || 0} 🪙 • ${formattedDate}</div>
                    </div>
                    <div class="entry-score">${entry.score}</div>
                </div>
            `;
        }).join('');
    }
    gameOverScreen.classList.add('hidden');
    leaderboardScreen.classList.remove('hidden');
}
function hideLeaderboard() {
    leaderboardScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
}
document.addEventListener('keydown', (e) => {
    if (gameState === 'playing' || gameState === 'poweringUp') {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            if (gameState === 'playing') jump();
        } else if (e.code === 'ArrowDown') {
            e.preventDefault();
            if (gameState === 'playing') duck(true);
        }
    }
});
document.addEventListener('keyup', (e) => {
    if (gameState === 'playing') {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            releaseJump();
        } else if (e.code === 'ArrowDown') {
            duck(false);
        }
    }
});
canvas.addEventListener('click', () => {
    if (gameState === 'playing') {
        jump();
    }
});
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameState === 'playing') {
        jump();
    }
});
document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        difficulty = btn.dataset.difficulty;
    });
});
document.getElementById('startGameBtn').addEventListener('click', () => {
    const nameInput = document.getElementById('playerNameInput');
    playerName = nameInput.value.trim() || 'Player';
    startGame();
});
document.getElementById('playerNameInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('startGameBtn').click();
    }
});
function checkFullscreen() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        document.getElementById('fullscreenWarning').classList.add('hidden');
        return;
    }
    
    const warning = document.getElementById('fullscreenWarning');
    const isFullscreen = window.innerHeight === screen.height || 
                        document.fullscreenElement || 
                        document.webkitFullscreenElement || 
                        document.mozFullScreenElement ||
                        window.fullScreen;
    if (isFullscreen) {
        warning.classList.add('hidden');
    } else {
        warning.classList.remove('hidden');
    }
}
document.addEventListener('fullscreenchange', checkFullscreen);
document.addEventListener('webkitfullscreenchange', checkFullscreen);
document.addEventListener('mozfullscreenchange', checkFullscreen);
window.addEventListener('resize', checkFullscreen);
window.addEventListener('resize', () => {
    const isFullscreen = window.innerHeight === screen.height || 
                        document.fullscreenElement || 
                        document.webkitFullscreenElement || 
                        document.mozFullScreenElement ||
                        window.fullScreen;
    if (!isFullscreen && (gameState === 'playing' || gameState === 'poweringUp')) {
        gameState = 'paused';
        document.getElementById('fullscreenExitScreen').classList.remove('hidden');
    }
});
document.getElementById('continueFullscreenBtn').addEventListener('click', () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    }
    document.getElementById('fullscreenExitScreen').classList.add('hidden');
    gameState = 'playing';
    gameLoop();
});
document.getElementById('exitFullscreenBtn').addEventListener('click', () => {
    document.getElementById('fullscreenExitScreen').classList.add('hidden');
    startScreen.classList.remove('hidden');
    gameState = 'start';
    stopMusic();
    init();
    draw();
});
checkFullscreen();
restartBtn.addEventListener('click', () => {
    startScreen.classList.remove('hidden');
    gameOverScreen.classList.add('hidden');
});
leaderboardBtn.addEventListener('click', showLeaderboard);
closeLeaderboardBtn.addEventListener('click', hideLeaderboard);

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const mobileControls = document.getElementById('mobileControls');
const jumpBtn = document.getElementById('jumpBtn');
const duckBtn = document.getElementById('duckBtn');
const orientationWarning = document.getElementById('orientationWarning');

let lowQualityMode = false;
let lastFrameTime = 0;
const targetFPS = 60;
const frameDelay = 1000 / targetFPS;

function checkOrientation() {
    if (isMobile) {
        const isLandscape = window.innerWidth > window.innerHeight;
        if (isLandscape) {
            orientationWarning.classList.add('hidden');
            if (gameState === 'playing' || gameState === 'poweringUp' || gameState === 'poweringDown') {
                mobileControls.classList.add('active');
            }
        } else {
            orientationWarning.classList.remove('hidden');
            mobileControls.classList.remove('active');
            if (gameState === 'playing' || gameState === 'poweringUp' || gameState === 'poweringDown') {
                gameState = 'paused';
                if (currentMusic) {
                    currentMusic.pause();
                }
            }
        }
    } else {
        orientationWarning.classList.add('hidden');
        mobileControls.classList.remove('active');
    }
}

function resumeFromOrientation() {
    if (gameState === 'paused') {
        const isLandscape = window.innerWidth > window.innerHeight;
        if (isLandscape) {
            gameState = 'playing';
            if (currentMusic) {
                currentMusic.play().catch(e => console.log('Music resume error:', e));
            }
            gameLoop();
        }
    }
}

window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        checkOrientation();
        resumeFromOrientation();
    }, 100);
});

window.addEventListener('resize', () => {
    checkOrientation();
    resumeFromOrientation();
});

if (isMobile) {
    if ('vibrate' in navigator) {
        jumpBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            navigator.vibrate(10);
            if (gameState === 'playing') {
                jump();
            }
        });
        
        duckBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            navigator.vibrate(10);
            if (gameState === 'playing') {
                duck(true);
            }
        });
    } else {
        jumpBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (gameState === 'playing') {
                jump();
            }
        });
        
        duckBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (gameState === 'playing') {
                duck(true);
            }
        });
    }
    
    jumpBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (gameState === 'playing') {
            releaseJump();
        }
    });
    
    duckBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (gameState === 'playing') {
            duck(false);
        }
    });
    
    const userAgent = navigator.userAgent.toLowerCase();
    const isOldDevice = /android [1-6]/.test(userAgent) || /iphone os [1-9]_/.test(userAgent);
    if (isOldDevice) {
        lowQualityMode = true;
    }
}

checkOrientation();
init();
draw();
