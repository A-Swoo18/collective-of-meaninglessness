const drawCanvas = document.getElementById('drawBoard');
const drawCtx = drawCanvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
let drawing = false;
let drawnPixels = new Set();
let currentColor = colorPicker.value;

colorPicker.addEventListener('input', function() {
  currentColor = this.value;
});

drawCanvas.addEventListener('mousedown', () => drawing = true);
drawCanvas.addEventListener('mouseup', () => drawing = false);
drawCanvas.addEventListener('mouseleave', () => drawing = false);

drawCanvas.addEventListener('mousemove', function(e) {
  if (!drawing) return;
  const rect = drawCanvas.getBoundingClientRect();
  const x = Math.floor(e.clientX - rect.left);
  const y = Math.floor(e.clientY - rect.top);
  drawCtx.fillStyle = currentColor;
  drawCtx.beginPath();
  drawCtx.arc(x, y, 4, 0, 2 * Math.PI);
  drawCtx.fill();
  drawnPixels.add(`${x},${y}`);
});

function generateFibonacci(n) {
  if (n <= 0) return [];
  if (n === 1) return [1];
  let seq = [1, 1];
  for (let i = 2; i < n; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }
  return seq;
}

function drawFibonacciDrawingSpiral(seq, userDrawing) {
  const fibCanvas = document.getElementById('fibCanvas');
  const fibCtx = fibCanvas.getContext('2d');
  fibCtx.clearRect(0, 0, fibCanvas.width, fibCanvas.height);

  // Center of the canvas
  let cx = fibCanvas.width / 2;
  let cy = fibCanvas.height / 2;

  // Start angle
  let angle = 0;

  // Initial position
  let x = cx;
  let y = cy;

  for (let i = 0; i < seq.length; i++) {
    // Scale factor for the drawing
    const scale = seq[i] / seq[seq.length - 1] * 1.2; // scale relative to largest square

    fibCtx.save();
    fibCtx.translate(x, y);
    fibCtx.rotate(angle);

    // Draw the user's drawing, scaled
    fibCtx.globalAlpha = 0.8 - i * 0.06; // fade out as spiral grows
    fibCtx.drawImage(
      userDrawing,
      -userDrawing.width * scale / 2,
      -userDrawing.height * scale / 2,
      userDrawing.width * scale,
      userDrawing.height * scale
    );
    fibCtx.restore();

    // Move to next position in spiral (Fibonacci spiral step)
    angle += Math.PI / 2; // 90 degrees
    x += Math.cos(angle) * seq[i];
    y += Math.sin(angle) * seq[i];
  }
}

document.getElementById('generateBtn').onclick = function() {
  // Hide drawing UI
  document.getElementById('drawContainer').style.display = 'none';
  document.getElementById('fibCanvas').style.display = 'block';

  // Get user-selected number of layers
  const layerInput = document.getElementById('layerCount');
  let n = parseInt(layerInput.value, 10);
  if (isNaN(n)) n = 6;
  n = Math.max(4, Math.min(12, n));

  const fibSeq = generateFibonacci(n);

  // Copy user's drawing to an offscreen canvas
  const userDrawing = document.createElement('canvas');
  userDrawing.width = drawCanvas.width;
  userDrawing.height = drawCanvas.height;
  userDrawing.getContext('2d').drawImage(drawCanvas, 0, 0);

  // Animate drawing the Fibonacci spiral one layer at a time
  const fibCanvas = document.getElementById('fibCanvas');
  const fibCtx = fibCanvas.getContext('2d');
  fibCtx.clearRect(0, 0, fibCanvas.width, fibCanvas.height);

  let cx = fibCanvas.width / 2;
  let cy = fibCanvas.height / 2;
  let angle = 0;
  let x = cx;
  let y = cy;

  let i = 0;

  function drawNextLayer() {
    if (i >= fibSeq.length) {
      document.getElementById('fibResult').textContent =
        `Fibonacci sequence image with ${n} layers generated from your drawing!`;
      return;
    }

    // Scale factor for the drawing
    const scale = fibSeq[i] / fibSeq[fibSeq.length - 1] * 1.2;

    fibCtx.save();
    fibCtx.translate(x, y);
    fibCtx.rotate(angle);
    fibCtx.globalAlpha = 0.8 - i * 0.06;
    fibCtx.drawImage(
      userDrawing,
      -userDrawing.width * scale / 2,
      -userDrawing.height * scale / 2,
      userDrawing.width * scale,
      userDrawing.height * scale
    );
    fibCtx.restore();

    // Move to next position in spiral
    angle += Math.PI / 2;
    x += Math.cos(angle) * fibSeq[i];
    y += Math.sin(angle) * fibSeq[i];

    i++;
    setTimeout(drawNextLayer, 500);
  }

  drawNextLayer();
};