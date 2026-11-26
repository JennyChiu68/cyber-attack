const canvas = document.querySelector('#radar');
const context = canvas.getContext('2d');

function draw() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (!width || !height) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  context.scale(dpr, dpr);

  const centerX = width * .57;
  const centerY = height * .49;
  const radius = Math.min(width * .40, height * .64);
  const grid = 28;

  function line(x1, y1, x2, y2) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  context.globalAlpha = .19;
  context.strokeStyle = '#a381ac';
  for (let x = centerX % grid; x < width; x += grid) line(x, 8, x, height - 6);
  for (let y = centerY % grid; y < height; y += grid) line(0, y, width, y);
  context.globalAlpha = 1;

  context.save();
  context.translate(centerX, centerY);
  const aura = context.createRadialGradient(0, 0, 0, 0, 0, radius);
  aura.addColorStop(0, '#b273842e');
  aura.addColorStop(1, '#8f557800');
  context.fillStyle = aura;
  context.fillRect(-radius, -radius, radius * 2, radius * 2);

  for (const ring of [.18, .34, .51, .68, .86, 1]) {
    context.strokeStyle = ring === .68 ? '#d79aaf77' : '#b18ca454';
    context.setLineDash(ring === .86 || ring === 1 ? [2, 5] : []);
    context.beginPath();
    context.arc(0, 0, radius * ring, 0, Math.PI * 2);
    context.stroke();
  }
  context.setLineDash([]);
  context.strokeStyle = '#e9b7c83d';
  line(-radius, 0, radius, 0);
  line(0, -radius, 0, radius);
  for (let step = 0; step < 48; step++) {
    const angle = step * Math.PI / 24;
    const inner = radius * (step % 4 ? .869 : .86);
    const outer = radius * (step % 4 ? .886 : .903);
    line(Math.cos(angle) * inner, Math.sin(angle) * inner, Math.cos(angle) * outer, Math.sin(angle) * outer);
  }

  const sweep = context.createConicGradient(-Math.PI * .28, 0, 0);
  sweep.addColorStop(0, '#fba18260');
  sweep.addColorStop(.19, '#fba18200');
  sweep.addColorStop(1, '#fba18200');
  context.fillStyle = sweep;
  context.beginPath();
  context.arc(0, 0, radius * .86, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = '#ffb0989b';
  line(0, 0, Math.cos(-Math.PI * .28) * radius * .86, Math.sin(-Math.PI * .28) * radius * .86);
  context.fillStyle = '#ffb79e';
  context.beginPath();
  context.arc(0, 0, 3.5, 0, Math.PI * 2);
  context.fill();

  for (const [rx, ry, color] of [[.51, -.36, '#ffb08b'], [-.48, -.19, '#e9b8e5'], [.35, .53, '#ed9baf'], [-.25, .4, '#ffb08b'], [.08, -.67, '#dfacc9'], [.69, .14, '#deb0d7']]) {
    const x = rx * radius;
    const y = ry * radius;
    context.strokeStyle = color + '63';
    context.beginPath();
    context.arc(x, y, 11, 0, Math.PI * 2);
    context.stroke();
    context.fillStyle = color;
    context.shadowColor = color;
    context.shadowBlur = 12;
    context.beginPath();
    context.arc(x, y, 3.4, 0, Math.PI * 2);
    context.fill();
    context.shadowBlur = 0;
  }
  context.restore();

  const fade = context.createLinearGradient(0, 0, width, 0);
  fade.addColorStop(0, '#0000');
  fade.addColorStop(.24, '#000f');
  fade.addColorStop(.89, '#000f');
  fade.addColorStop(1, '#0004');
  context.globalCompositeOperation = 'destination-in';
  context.fillStyle = fade;
  context.fillRect(0, 0, width, height);
}

if (context) new ResizeObserver(draw).observe(canvas);
