const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
const replayButton = document.getElementById('replayButton');
const speedRange = document.getElementById('speedRange');

let animationFrame;
let startTime;
let speed = 1;
const duration = 5200;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function heartPoint(t, scale, centerX, centerY) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return {
    x: centerX + x * scale,
    y: centerY - y * scale,
  };
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function drawBackground(width, height) {
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createRadialGradient(
    width * 0.5,
    height * 0.5,
    10,
    width * 0.5,
    height * 0.5,
    width * 0.47
  );
  gradient.addColorStop(0, 'rgba(255, 65, 125, 0.08)');
  gradient.addColorStop(1, 'rgba(255, 65, 125, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawHeart(progress) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  drawBackground(width, height);

  const scale = Math.min(width, height) / 40;
  const centerX = width / 2;
  const centerY = height / 2 + height * 0.035;
  const maxT = Math.PI * 2 * progress;
  const steps = Math.max(2, Math.floor(720 * progress));

  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = maxT * (i / steps);
    const point = heartPoint(t, scale, centerX, centerY);
    if (i === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  }

  const lineGradient = ctx.createLinearGradient(0, 0, width, height);
  lineGradient.addColorStop(0, '#ffbfd3');
  lineGradient.addColorStop(0.45, '#ff3979');
  lineGradient.addColorStop(1, '#ff8ab0');

  ctx.strokeStyle = lineGradient;
  ctx.lineWidth = Math.max(3, width * 0.008);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(255, 45, 110, 0.9)';
  ctx.shadowBlur = 22;
  ctx.stroke();

  if (progress > 0 && progress < 1) {
    const point = heartPoint(maxT, scale, centerX, centerY);
    ctx.beginPath();
    ctx.arc(point.x, point.y, Math.max(4, width * 0.012), 0, Math.PI * 2);
    ctx.fillStyle = '#fff5f8';
    ctx.shadowColor = '#ff3d79';
    ctx.shadowBlur = 24;
    ctx.fill();
  }
}

function animate(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsed = (timestamp - startTime) * speed;
  const linearProgress = Math.min(elapsed / duration, 1);
  const progress = easeInOutCubic(linearProgress);

  drawHeart(progress);

  if (linearProgress < 1) {
    animationFrame = requestAnimationFrame(animate);
  }
}

function replay() {
  cancelAnimationFrame(animationFrame);
  startTime = undefined;
  animationFrame = requestAnimationFrame(animate);
}

speedRange.addEventListener('input', (event) => {
  speed = Number(event.target.value);
  replay();
});

replayButton.addEventListener('click', replay);
window.addEventListener('resize', () => {
  resizeCanvas();
  replay();
});

resizeCanvas();
replay();
