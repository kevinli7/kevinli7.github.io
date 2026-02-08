/**
 * Secret Game - Platform game with moving obstacles and power-ups.
 * Exposes restartGame globally for HTML onclick.
 */

// Game constants: level fits in ~1 min of play
const WORLD_WIDTH = 7200;
const WORLD_HEIGHT = 600;
const GROUND_Y = 520;
const GOAL_X = 6950;

// Physics / feel (lower = slower, easier to react)
const PLAYER_RUN_SPEED = 3.5;
const PLAYER_JUMP_STRENGTH = 10;
const GRAVITY = 0.45;
const OBSTACLE_SPEED_FACTOR = 0.03;
const POWERUP_RESPAWN_MS = 5000;

// Game state
let gameState = {
    player: { x: 80, y: GROUND_Y - 40, vx: 0, vy: 0, onGround: false, jumpsLeft: 2 },
    platforms: [],
    spikes: [],
    obstacles: [],
    powerups: [],
    clouds: [],
    particles: [],
    startTime: Date.now(),
    gameTime: 0,
    deathCount: 0,
    isGameOver: false,
    isCompleted: false,
    cheatDetected: false,
    lastPosition: { x: 80, y: GROUND_Y - 40 },
    positionHistory: [],
    speedHistory: [],
    consoleOpened: false,
    devToolsOpened: false,
    camera: { x: 0, y: 0 }
};

// Anti-cheat detection
let cheatDetection = {
    consoleOpened: false,
    devToolsOpened: false,
    speedHacks: false,
    positionHacks: false,
    timeHacks: false
};

// --- Initialization ---

function initGame() {
    createPlatforms();
    createSpikes();
    createObstacles();
    createPowerUps();
    createClouds();
    const goalEl = document.getElementById('goal');
    goalEl.style.left = (GOAL_X + 30) + 'px';
    goalEl.style.top = (GROUND_Y - 80) + 'px';
    setupEventListeners();
    setupAntiCheat();
    gameLoop();
}

// --- Level creation ---

function createPlatforms() {
    const platformData = [
        { x: 0, y: GROUND_Y, width: 400, height: 80 },
        { x: 500, y: GROUND_Y, width: 180, height: 80 },
        { x: 780, y: GROUND_Y - 60, width: 160, height: 80 },
        { x: 1060, y: GROUND_Y, width: 180, height: 80 },
        { x: 1340, y: GROUND_Y - 80, width: 140, height: 80 },
        { x: 1580, y: GROUND_Y, width: 220, height: 80 },
        { x: 1900, y: GROUND_Y - 40, width: 180, height: 80 },
        { x: 2180, y: GROUND_Y, width: 200, height: 80 },
        { x: 2500, y: GROUND_Y - 100, width: 160, height: 80 },
        { x: 2760, y: GROUND_Y, width: 240, height: 80 },
        { x: 3100, y: GROUND_Y - 60, width: 140, height: 80 },
        { x: 3340, y: GROUND_Y, width: 180, height: 80 },
        { x: 3620, y: GROUND_Y - 80, width: 160, height: 80 },
        { x: 3880, y: GROUND_Y, width: 200, height: 80 },
        { x: 4180, y: GROUND_Y - 40, width: 150, height: 80 },
        { x: 4430, y: GROUND_Y, width: 220, height: 80 },
        { x: 4750, y: GROUND_Y - 70, width: 170, height: 80 },
        { x: 5020, y: GROUND_Y, width: 200, height: 80 },
        { x: 5320, y: GROUND_Y - 90, width: 140, height: 80 },
        { x: 5560, y: GROUND_Y, width: 260, height: 80 },
        { x: 5920, y: GROUND_Y - 50, width: 160, height: 80 },
        { x: 6180, y: GROUND_Y, width: 200, height: 80 },
        { x: 6480, y: GROUND_Y - 60, width: 180, height: 80 },
        { x: 6760, y: GROUND_Y, width: 240, height: 80 },
        { x: GOAL_X - 50, y: GROUND_Y - 40, width: 200, height: 80 }
    ];

    platformData.forEach((platform) => {
        const platformEl = document.createElement('div');
        platformEl.className = 'platform';
        platformEl.style.left = platform.x + 'px';
        platformEl.style.top = platform.y + 'px';
        platformEl.style.width = platform.width + 'px';
        platformEl.style.height = platform.height + 'px';
        document.querySelector('.game-world').appendChild(platformEl);
        gameState.platforms.push(platform);
    });
}

function createSpikes() {
    const spikeData = [
        // { x: 690, y: GROUND_Y + 60 },
        // { x: 1000, y: GROUND_Y + 60 },
        // { x: 1560, y: GROUND_Y + 60 },
        // { x: 2120, y: GROUND_Y + 60 },
        // { x: 3320, y: GROUND_Y + 60 },
        // { x: 3840, y: GROUND_Y + 60 },
        // { x: 4580, y: GROUND_Y + 60 },
        // { x: 5580, y: GROUND_Y + 60 },
        // { x: 6140, y: GROUND_Y + 60 }
    ];
    spikeData.forEach(spike => {
        const spikeEl = document.createElement('div');
        spikeEl.className = 'spike';
        spikeEl.style.left = spike.x + 'px';
        spikeEl.style.top = spike.y + 'px';
        document.querySelector('.game-world').appendChild(spikeEl);
        gameState.spikes.push(spike);
    });
}

function createObstacles() {
    const world = document.querySelector('.game-world');
    const obstacleData = [
        { x: 600, y: GROUND_Y - 100, width: 40, height: 40, pattern: 'horizontal', range: 120, speed: 1.8 },
        { x: 900, y: GROUND_Y - 140, width: 35, height: 35, pattern: 'vertical', range: 60, speed: 2 },
        { x: 1280, y: GROUND_Y - 120, width: 45, height: 30, pattern: 'horizontal', range: 100, speed: 2.2 },
        { x: 1720, y: GROUND_Y - 140, width: 40, height: 40, pattern: 'vertical', range: 100, speed: 4 },
        { x: 2090, y: GROUND_Y - 80, width: 50, height: 25, pattern: 'horizontal', range: 130, speed: 1.9 },
        { x: 2680, y: GROUND_Y - 180, width: 35, height: 35, pattern: 'vertical', range: 70, speed: 2.1 },
        { x: 3080, y: GROUND_Y - 100, width: 40, height: 40, pattern: 'horizontal', range: 110, speed: 2 },
        { x: 3520, y: GROUND_Y - 140, width: 45, height: 30, pattern: 'vertical', range: 65, speed: 1.7 },
        { x: 3980, y: GROUND_Y - 120, width: 40, height: 40, pattern: 'horizontal', range: 130, speed: 2.3 },
        { x: 4380, y: GROUND_Y - 90, width: 35, height: 45, pattern: 'vertical', range: 55, speed: 2 },
        { x: 4920, y: GROUND_Y - 150, width: 45, height: 35, pattern: 'horizontal', range: 100, speed: 1.8 },
        { x: 5380, y: GROUND_Y - 160, width: 40, height: 40, pattern: 'vertical', range: 75, speed: 2.2 },
        { x: 5820, y: GROUND_Y - 100, width: 50, height: 30, pattern: 'horizontal', range: 120, speed: 2.1 },
        { x: 6380, y: GROUND_Y - 130, width: 40, height: 40, pattern: 'vertical', range: 60, speed: 1.9 },
        { x: 6680, y: GROUND_Y - 80, width: 40, height: 40, pattern: 'horizontal', range: 90, speed: 2 }
    ];

    obstacleData.forEach((obs, i) => {
        const el = document.createElement('div');
        el.className = 'obstacle';
        el.style.left = obs.x + 'px';
        el.style.top = obs.y + 'px';
        el.style.width = obs.width + 'px';
        el.style.height = obs.height + 'px';
        world.appendChild(el);
        gameState.obstacles.push({
            ...obs,
            element: el,
            baseX: obs.x,
            baseY: obs.y,
            t: i * 0.7
        });
    });
}

function createPowerUps() {
    const world = document.querySelector('.game-world');
    const powerupData = [
        { x: 1350, y: GROUND_Y - 200 },
        { x: 1680, y: GROUND_Y - 220 },
        { x: 2880, y: GROUND_Y - 150 },
        { x: 4120, y: GROUND_Y - 180 },
        { x: 5220, y: GROUND_Y - 250 },
        { x: 6520, y: GROUND_Y - 140 }
    ];
    powerupData.forEach((pu) => {
        const el = document.createElement('div');
        el.className = 'powerup';
        el.style.left = pu.x + 'px';
        el.style.top = pu.y + 'px';
        world.appendChild(el);
        gameState.powerups.push({ ...pu, element: el, collected: false, respawnAt: null });
    });
}

function createClouds() {
    for (let i = 0; i < 5; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.top = Math.random() * 200 + 'px';
        cloud.style.left = Math.random() * window.innerWidth + 'px';
        cloud.style.width = (Math.random() * 100 + 50) + 'px';
        cloud.style.height = (Math.random() * 30 + 20) + 'px';
        cloud.style.animationDelay = Math.random() * 20 + 's';
        document.querySelector('.game-container').appendChild(cloud);
        gameState.clouds.push(cloud);
    }
}

// --- Input ---

function setupEventListeners() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    const leftBtn = document.getElementById('btn-left');
    const rightBtn = document.getElementById('btn-right');
    const jumpBtn = document.getElementById('btn-jump');
    if (leftBtn && rightBtn && jumpBtn) {
        leftBtn.addEventListener('touchstart', function (e) {
            e.preventDefault();
            if (gameState.isGameOver || gameState.isCompleted) return;
            gameState.player.vx = -PLAYER_RUN_SPEED;
                    leftBtn.classList.add('active');
                });
                leftBtn.addEventListener('touchend', function (e) {
                    e.preventDefault();
                    gameState.player.vx = 0;
                    leftBtn.classList.remove('active');
                });
                rightBtn.addEventListener('touchstart', function (e) {
                    e.preventDefault();
                    if (gameState.isGameOver || gameState.isCompleted) return;
                    gameState.player.vx = PLAYER_RUN_SPEED;
            rightBtn.classList.add('active');
        });
        rightBtn.addEventListener('touchend', function (e) {
            e.preventDefault();
            gameState.player.vx = 0;
            rightBtn.classList.remove('active');
        });
        jumpBtn.addEventListener('touchstart', function (e) {
            e.preventDefault();
            if (gameState.isGameOver || gameState.isCompleted) return;
            if (gameState.player.jumpsLeft > 0) {
                gameState.player.vy = -PLAYER_JUMP_STRENGTH;
                gameState.player.jumpsLeft--;
                gameState.player.onGround = false;
            }
            jumpBtn.classList.add('active');
        });
        jumpBtn.addEventListener('touchend', function (e) {
            e.preventDefault();
            jumpBtn.classList.remove('active');
        });
    }
}

function setupAntiCheat() {
    let devtools = { open: false, orientation: null };
    setInterval(() => {
        const threshold = 160;
        if (window.outerHeight - window.innerHeight > threshold ||
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                cheatDetection.devToolsOpened = true;
                console.log('DevTools detected!');
            }
        } else {
            devtools.open = false;
        }
    }, 500);

    const originalLog = console.log;
    console.log = function (...args) {
        cheatDetection.consoleOpened = true;
        originalLog.apply(console, args);
    };

    setInterval(() => {
        const currentTime = Date.now();
        const expectedTime = gameState.startTime + gameState.gameTime;
        if (Math.abs(currentTime - expectedTime) > 1000) {
            cheatDetection.timeHacks = true;
        }
    }, 1000);
}

function handleKeyDown(e) {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space', 'KeyA', 'KeyD', 'KeyW'].includes(e.code)) {
        e.preventDefault();
    }
    if (gameState.isGameOver || gameState.isCompleted) return;

    switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
            gameState.player.vx = -PLAYER_RUN_SPEED;
            break;
        case 'ArrowRight':
        case 'KeyD':
            gameState.player.vx = PLAYER_RUN_SPEED;
            break;
        case 'Space':
        case 'ArrowUp':
        case 'KeyW':
            if (gameState.player.jumpsLeft > 0) {
                gameState.player.vy = -PLAYER_JUMP_STRENGTH;
                gameState.player.jumpsLeft--;
                gameState.player.onGround = false;
            }
            break;
    }
}

function handleKeyUp(e) {
    switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
        case 'ArrowRight':
        case 'KeyD':
            gameState.player.vx = 0;
            break;
    }
}

// --- Game loop & physics ---

function updatePlayer() {
    gameState.positionHistory.push({ x: gameState.player.x, y: gameState.player.y, time: Date.now() });
    if (gameState.positionHistory.length > 10) {
        gameState.positionHistory.shift();
    }

    const currentSpeed = Math.sqrt(gameState.player.vx * gameState.player.vx + gameState.player.vy * gameState.player.vy);
    gameState.speedHistory.push(currentSpeed);
    if (gameState.speedHistory.length > 5) {
        gameState.speedHistory.shift();
    }
    const avgSpeed = gameState.speedHistory.reduce((a, b) => a + b, 0) / gameState.speedHistory.length;
    if (avgSpeed > 20) {
        cheatDetection.speedHacks = true;
    }

    gameState.player.vy += GRAVITY;
    gameState.player.x += gameState.player.vx;
    gameState.player.y += gameState.player.vy;

    gameState.player.onGround = false;
    gameState.platforms.forEach(platform => {
        if (gameState.player.x < platform.x + platform.width &&
            gameState.player.x + 30 > platform.x &&
            gameState.player.y + 40 >= platform.y &&
            gameState.player.y + 40 <= platform.y + platform.height + 5) {
            gameState.player.y = platform.y - 40;
            gameState.player.vy = 0;
            gameState.player.onGround = true;
            gameState.player.jumpsLeft = 2;
        }
    });

    gameState.spikes.forEach(spike => {
        if (gameState.player.x < spike.x + 20 &&
            gameState.player.x + 30 > spike.x &&
            gameState.player.y < spike.y + 20 &&
            gameState.player.y + 40 > spike.y) {
            gameOver();
        }
    });

    gameState.obstacles.forEach(obs => {
        const ox = obs.baseX + (obs.pattern === 'horizontal' ? obs.range * Math.sin(obs.t) : 0);
        const oy = obs.baseY + (obs.pattern === 'vertical' ? obs.range * Math.sin(obs.t) : 0);
        if (gameState.player.x < ox + obs.width &&
            gameState.player.x + 30 > ox &&
            gameState.player.y < oy + obs.height &&
            gameState.player.y + 40 > oy) {
            gameOver();
        }
    });

    const now = Date.now();
    gameState.powerups.forEach(pu => {
        if (pu.collected && pu.respawnAt && now >= pu.respawnAt) {
            pu.collected = false;
            pu.respawnAt = null;
            pu.element.style.display = 'block';
        }
        if (!pu.collected &&
            gameState.player.x < pu.x + 24 &&
            gameState.player.x + 30 > pu.x &&
            gameState.player.y < pu.y + 24 &&
            gameState.player.y + 40 > pu.y) {
            pu.collected = true;
            pu.respawnAt = now + POWERUP_RESPAWN_MS;
            pu.element.style.display = 'none';
            gameState.player.jumpsLeft = 2;
            createParticles(pu.x + 12, pu.y + 12);
        }
    });

    if (gameState.player.x < GOAL_X + 80 &&
        gameState.player.x + 30 > GOAL_X &&
        gameState.player.y < GROUND_Y - 40 + 80 &&
        gameState.player.y + 40 > GROUND_Y - 40) {
        completeGame();
    }

    if (gameState.player.y > WORLD_HEIGHT + 50) {
        gameOver();
    }

    updateCamera();

    const jumpsEl = document.getElementById('jumpsStatus');
    if (jumpsEl) jumpsEl.textContent = gameState.player.jumpsLeft >= 2 ? 'ready' : (gameState.player.jumpsLeft === 1 ? '1 left' : 'used');

    document.getElementById('player').style.left = gameState.player.x + 'px';
    document.getElementById('player').style.top = gameState.player.y + 'px';
}

function updateObstacles() {
    gameState.obstacles.forEach(obs => {
        obs.t += obs.speed * OBSTACLE_SPEED_FACTOR;
        const x = obs.baseX + (obs.pattern === 'horizontal' ? obs.range * Math.sin(obs.t) : 0);
        const y = obs.baseY + (obs.pattern === 'vertical' ? obs.range * Math.sin(obs.t) : 0);
        obs.element.style.left = x + 'px';
        obs.element.style.top = y + 'px';
    });
}

function createParticles(x, y) {
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        document.querySelector('.game-world').appendChild(particle);

        const angle = (i / 8) * Math.PI * 2;
        const speed = 3;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        gameState.particles.push({
            element: particle,
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            life: 30
        });
    }
}

function updateCamera() {
    const player = gameState.player;
    const gameWorld = document.getElementById('gameWorld');
    const cameraX = -(player.x - window.innerWidth / 2);
    const minX = -(WORLD_WIDTH - window.innerWidth);
    const maxX = 0;
    gameState.camera.x = Math.max(minX, Math.min(maxX, cameraX));
    gameState.camera.y = 0;
    gameWorld.style.transform = `translate(${gameState.camera.x}px, ${gameState.camera.y}px)`;
}

function updateParticles() {
    gameState.particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.2;
        particle.life--;

        particle.element.style.left = particle.x + 'px';
        particle.element.style.top = particle.y + 'px';
        particle.element.style.opacity = particle.life / 30;

        if (particle.life <= 0) {
            particle.element.remove();
            gameState.particles.splice(index, 1);
        }
    });
}

// --- Game state ---

function gameOver() {
    gameState.isGameOver = true;
    gameState.deathCount++;
    document.getElementById('deaths').textContent = gameState.deathCount;
    document.getElementById('gameOver').style.display = 'block';
}

function completeGame() {
    gameState.isCompleted = true;
    let secretWord = '';
    if (cheatDetection.consoleOpened || cheatDetection.devToolsOpened ||
        cheatDetection.speedHacks || cheatDetection.timeHacks) {
        secretWord = 'SNEAKY_CHEATER_2024';
    } else {
        secretWord = 'TRUE_LOVE_CONQUERS_ALL';
    }
    document.getElementById('secretWordText').textContent = secretWord;
    document.getElementById('secretWord').style.display = 'block';
}

function restartGame() {
    gameState.player.x = 80;
    gameState.player.y = GROUND_Y - 40;
    gameState.player.vx = 0;
    gameState.player.vy = 0;
    gameState.player.onGround = false;
    gameState.player.jumpsLeft = 2;
    gameState.isGameOver = false;
    gameState.isCompleted = false;
    gameState.startTime = Date.now();
    gameState.gameTime = 0;
    gameState.deathCount = 0;
    gameState.positionHistory = [];
    gameState.speedHistory = [];
    gameState.camera = { x: 0, y: 0 };

    gameState.obstacles.forEach((obs, i) => {
        obs.t = i * 0.7;
        obs.element.style.left = obs.baseX + 'px';
        obs.element.style.top = obs.baseY + 'px';
    });

    gameState.powerups.forEach(pu => {
        pu.collected = false;
        pu.respawnAt = null;
        pu.element.style.display = 'block';
    });

    document.getElementById('gameWorld').style.transform = 'translate(0px, 0px)';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('secretWord').style.display = 'none';
    document.getElementById('deaths').textContent = '0';
    const jumpsEl = document.getElementById('jumpsStatus');
    if (jumpsEl) jumpsEl.textContent = 'ready';
}

function updateUI() {
    const currentTime = Date.now();
    gameState.gameTime = Math.floor((currentTime - gameState.startTime) / 1000);
    const minutes = Math.floor(gameState.gameTime / 60);
    const seconds = gameState.gameTime % 60;
    document.getElementById('time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function gameLoop() {
    if (!gameState.isGameOver && !gameState.isCompleted) {
        updateObstacles();
        updatePlayer();
        updateParticles();
        updateUI();
    }
    requestAnimationFrame(gameLoop);
}

// --- Startup & mobile ---

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function checkOrientation() {
    const msg = document.getElementById('landscapeMessage');
    if (isMobile() && window.innerHeight > window.innerWidth) {
        msg.classList.add('visible');
    } else {
        msg.classList.remove('visible');
    }
}

window.addEventListener('load', function () {
    initGame();
    checkOrientation();
});

window.addEventListener('orientationchange', checkOrientation);
window.addEventListener('resize', checkOrientation);

document.addEventListener('DOMContentLoaded', function () {
    const msg = document.getElementById('landscapeMessage');
    if (msg) {
        msg.addEventListener('click', function () {
            msg.classList.remove('visible');
        });
    }
});

// Expose for HTML onclick="restartGame()"
window.restartGame = restartGame;
