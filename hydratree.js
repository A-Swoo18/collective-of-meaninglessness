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
        this.parent = parent; // Add parent to track parent branch
        this.endX = x + length * Math.cos(angle);
        this.endY = y + length * Math.sin(angle);
        this.lineWidth = Math.max(1, 10 - depth); // Line width decreases with depth
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.endX, this.endY);
        ctx.strokeStyle = 'brown'; // Ensure the color is correct
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

initTree();
