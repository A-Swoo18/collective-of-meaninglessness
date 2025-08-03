const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const namesInput = document.getElementById('namesInput');
const addNameBtn = document.getElementById('addNameBtn');
const spinBtn = document.getElementById('spinBtn');
const namesListDiv = document.getElementById('namesList');
const winnerDiv = document.getElementById('winner');

let names = [];
let angle = 0;
let spinning = false;

function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const n = names.length;
  if (n === 0) return;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 160;
  const sliceAngle = (2 * Math.PI) / n;

  for (let i = 0; i < n; i++) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, angle + i * sliceAngle, angle + (i + 1) * sliceAngle);
    ctx.closePath();
    ctx.fillStyle = `hsl(${(i * 360) / n}, 70%, 70%)`;
    ctx.fill();
    ctx.stroke();

    // Draw name
    ctx.translate(centerX, centerY);
    ctx.rotate(angle + (i + 0.5) * sliceAngle);
    ctx.textAlign = "right";
    ctx.fillStyle = "#333";
    ctx.font = "18px Arial";
    ctx.fillText(names[i], radius - 10, 8);
    ctx.restore();
  }

  // Draw pointer
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - radius - 10);
  ctx.lineTo(centerX - 15, centerY - radius + 20);
  ctx.lineTo(centerX + 15, centerY - radius + 20);
  ctx.closePath();
  ctx.fillStyle = "#e74c3c";
  ctx.fill();
  ctx.restore();
}

function updateNamesList() {
  namesListDiv.textContent = names.length ? "Names: " + names.join(", ") : "No names yet.";
  drawWheel();
}

addNameBtn.onclick = function() {
  const name = namesInput.value.trim();
  if (name && !names.includes(name)) {
    names.push(name);
    namesInput.value = "";
    updateNamesList();
    winnerDiv.textContent = "";
  }
};

spinBtn.onclick = function() {
  if (names.length === 0 || spinning) return;
  spinning = true;
  let spinTime = 0;
  let spinDuration = 3000 + Math.random() * 1000;
  let startAngle = angle;
  let spinSpeed = 0.25 + Math.random() * 0.25;

  function animate() {
    spinTime += 16;
    angle += spinSpeed;
    drawWheel();
    if (spinTime < spinDuration) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      angle = angle % (2 * Math.PI);
      // Find winner
      const n = names.length;
      const sliceAngle = (2 * Math.PI) / n;
      let winnerIndex = Math.floor(((2 * Math.PI - angle) % (2 * Math.PI)) / sliceAngle);
      winnerDiv.textContent = `Winner: ${names[winnerIndex]}`;
    }
  }
  animate();
};

// Initial draw
updateNamesList();