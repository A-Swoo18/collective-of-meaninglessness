// Drawing logic
const canvas = document.getElementById('drawBoard');
const ctx = canvas.getContext('2d');
let drawing = false;
let drawnPixels = new Set();

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseleave', () => drawing = false);

canvas.addEventListener('mousemove', function(e) {
  if (!drawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor(e.clientX - rect.left);
  const y = Math.floor(e.clientY - rect.top);
  ctx.fillStyle = '#0077cc';
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, 2 * Math.PI);
  ctx.fill();
  drawnPixels.add(`${x},${y}`);
});

// Fibonacci logic
function generateFibonacci(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];
  let seq = [0, 1];
  for (let i = 2; i < n; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }
  return seq;
}

document.getElementById('generateBtn').onclick = function() {
  // Use the number of unique drawn pixels to determine sequence length (min 2, max 20)
  const n = Math.max(2, Math.min(20, drawnPixels.size));
  const fibSeq = generateFibonacci(n);
  document.getElementById('fibResult').textContent =
    `Fibonacci sequence (${n} terms): ${fibSeq.join(', ')}`;
};