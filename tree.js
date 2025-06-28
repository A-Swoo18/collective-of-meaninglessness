const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let branches = [];

class Branch {
    constructor(x, y, length, angle, depth, parent = null) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.angle = angle;
        this.depth = depth;
        this.parent = parent; 
        this.endX = x + length * Math.cos(angle);
        this.endY = y + length * Math.sin(angle);
        this.lineWidth = Math.max(1, 10 - depth); 
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.endX, this.endY);
        ctx.strokeStyle = 'brown'; 
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
    }

    grow(newX, newY) {
        if (this.depth < 10) { // Limiting growth to avoid excessive branches
            const angleVariation = Math.PI / 4; // 45 degrees
            const newDepth = this.depth + 1;
            const newLength = this.length * 0.8; // Decrease length for new branches
            branches.push(new Branch(newX, newY, newLength, this.angle - angleVariation, newDepth, this));
            branches.push(new Branch(newX, newY, newLength, this.angle + angleVariation, newDepth, this));
        }
    }
}

function drawTree() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    branches.forEach(branch => branch.draw());
}

function cutTree(x, y) {
    for (let i = branches.length - 1; i >= 0; i--) {
        const branch = branches[i];
        // Calculate the projection of the point (x, y) on the branch line segment
        const t = ((x - branch.x) * (branch.endX - branch.x) + (y - branch.y) * (branch.endY - branch.y)) /
                ((branch.endX - branch.x) ** 2 + (branch.endY - branch.y) ** 2);
        const clampedT = Math.max(0, Math.min(1, t)); // Clamping t to the [0, 1] range
        const nearestX = branch.x + clampedT * (branch.endX - branch.x);
        const nearestY = branch.y + clampedT * (branch.endY - branch.y);

        // Check if the click is close to the branch line segment
        const dx = nearestX - x;
        const dy = nearestY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 5) { // Adjust tolerance for cutting
            // Remove the branch and its children
            removeBranchAndChildren(branch);
            // Grow new branches at the cut point
            branch.grow(nearestX, nearestY);
            // Create a new branch for the remaining bottom portion
            const remainingLength = clampedT * branch.length;
            branches.push(new Branch(branch.x, branch.y, remainingLength, branch.angle, branch.depth, branch.parent));
        }
    }
}

function removeBranchAndChildren(branch) {
    // Find all descendants of the branch
    const descendants = branches.filter(b => isDescendant(b, branch));
    // Remove all descendants
    descendants.forEach(descendant => {
        const index = branches.indexOf(descendant);
        if (index !== -1) {
            branches.splice(index, 1);
        }
    });
    // Remove the branch itself
    const index = branches.indexOf(branch);
    if (index !== -1) {
        branches.splice(index, 1);
    }
}

function isDescendant(branch, parentBranch) {
    while (branch.parent) {
        if (branch.parent === parentBranch) {
            return true;
        }
        branch = branch.parent;
    }
    return false;
}

function initTree() {
    branches = [new Branch(canvas.width / 2, canvas.height, 200, -Math.PI / 2, 0)];
    drawTree();
}

canvas.addEventListener('mousedown', (e) => {
    isCutting = true;
});

canvas.addEventListener('mouseup', (e) => {
    if (isCutting) {
        cutTree(e.offsetX, e.offsetY);
        drawTree();
        isCutting = false;
    }
});

canvas.addEventListener('mousemove', (e) => {
    // Disable cutting while dragging
    isCutting = false;
});

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function drawTree(ctx, startX, startY, length, angle, branchWidth, color, depth, maxDepth) {
  ctx.save();
  ctx.beginPath();
  ctx.translate(startX, startY);
  ctx.rotate(angle * Math.PI / 180);
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -length);
  ctx.strokeStyle = color;
  ctx.lineWidth = branchWidth;
  ctx.stroke();

  if (length < 10 || depth > maxDepth) {
    ctx.restore();
    return;
  }

  const numBranches = 2 + Math.floor(Math.random() * 3);

  for (let i = 0; i < numBranches; i++) {
    const branchAngle = -20 + (40 / (numBranches - 1)) * i + (Math.random() * 12 - 6);
    const newLength = length * (0.65 + Math.random() * 0.13);
    const newWidth = branchWidth * (0.65 + Math.random() * 0.15);
    drawTree(ctx, 0, -length, newLength, branchAngle, newWidth, color, depth + 1, maxDepth);
  }

  ctx.restore();
}

function resizeCanvasAndDraw() {
  const canvas = document.getElementById('treeCanvas');
  if (!canvas) return;
  // Make canvas fill the window
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Trunk size is always a percentage of the canvas size
  const color = getRandomColor();
  const trunkLength = Math.min(canvas.height, canvas.width) * 0.22; // 22% of smaller dimension
  const trunkWidth = Math.max(8, Math.min(canvas.width, canvas.height) * 0.012); // 1.2% of smaller dimension, min 8px
  const maxDepth = 9 + Math.floor(Math.random() * 3); // 9 to 11

  drawTree(
    ctx,
    canvas.width / 2,
    canvas.height - 30,
    trunkLength,
    0,
    trunkWidth,
    color,
    0,
    maxDepth
  );
}

window.onload = resizeCanvasAndDraw;
window.onresize = resizeCanvasAndDraw;

initTree();
