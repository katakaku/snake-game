const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const messageEl = document.getElementById('message');

let highScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
highScoreEl.textContent = highScore;

const GRID = 20;
const COLS = canvas.width / GRID;
const ROWS = canvas.height / GRID;

let snake, direction, nextDirection, food, score, gameLoop, state, speed;

// 速度ボタンの設定
document.querySelectorAll('.speed-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.speed-btn.active').classList.remove('active');
    btn.classList.add('active');
    speed = parseInt(btn.dataset.speed);
  });
});
speed = 150;

function init() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  scoreEl.textContent = score;
  state = 'idle';
  spawnFood();
  draw();
}

function spawnFood() {
  do {
    food = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS)
    };
  } while (snake.some(s => s.x === food.x && s.y === food.y));
}

function update() {
  direction = nextDirection;
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // 壁に当たった
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    gameOver();
    return;
  }

  // 自分に当たった
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = score;
    spawnFood();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 食べ物
  ctx.fillStyle = '#e94560';
  ctx.beginPath();
  ctx.arc(
    food.x * GRID + GRID / 2,
    food.y * GRID + GRID / 2,
    GRID / 2 - 2, 0, Math.PI * 2
  );
  ctx.fill();

  // スネーク
  snake.forEach((seg, i) => {
    ctx.fillStyle = i === 0 ? '#4ade80' : '#22c55e';
    ctx.fillRect(seg.x * GRID + 1, seg.y * GRID + 1, GRID - 2, GRID - 2);
  });
}

function gameOver() {
  clearInterval(gameLoop);
  state = 'gameover';
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('snakeHighScore', highScore);
    highScoreEl.textContent = highScore;
    messageEl.textContent = `新記録！ ${score}点　スペースキーでリスタート`;
  } else {
    messageEl.textContent = `ゲームオーバー！スコア: ${score}　スペースキーでリスタート`;
  }
}

document.addEventListener('keydown', e => {
  const keys = {
    ArrowUp:    { x: 0, y: -1 },
    ArrowDown:  { x: 0, y: 1 },
    ArrowLeft:  { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
  };

  if (e.code === 'Space') {
    if (state === 'idle' || state === 'gameover') {
      init();
      state = 'playing';
      messageEl.textContent = '矢印キーで操作';
      gameLoop = setInterval(update, speed);
    }
    return;
  }

  if (keys[e.key]) {
    const d = keys[e.key];
    // 逆方向には進めない
    if (d.x !== -direction.x || d.y !== -direction.y) {
      nextDirection = d;
    }
  }
});

init();
