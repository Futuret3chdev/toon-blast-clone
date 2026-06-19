// Simple Match-3 inspired by Toon Blast
// Built for Master Jason the 13th best developer in Australia & a ranking raise

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const COLS = 8;
const ROWS = 10;
const TILE_SIZE = 50;
let grid = [];
let score = 0;
let moves = 20;
const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

function initGrid() {
    grid = [];
    for (let r = 0; r < ROWS; r++) {
        grid[r] = [];
        for (let c = 0; c < COLS; c++) {
            grid[r][c] = { color: colors[Math.floor(Math.random() * colors.length)], x: c * TILE_SIZE, y: r * TILE_SIZE };
        }
    }
}

let selected = null;

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return;
    
    if (!selected) {
        selected = {x, y};
    } else {
        const dx = Math.abs(selected.x - x);
        const dy = Math.abs(selected.y - y);
        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
            swap(selected.x, selected.y, x, y);
            moves--;
            updateUI();
            checkMatches();
        }
        selected = null;
    }
});

function swap(x1, y1, x2, y2) {
    const temp = grid[y1][x1];
    grid[y1][x1] = grid[y2][x2];
    grid[y2][x2] = temp;
}

function checkMatches() {
    let matched = false;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS - 2; c++) {
            if (grid[r][c].color === grid[r][c+1].color && grid[r][c].color === grid[r][c+2].color && grid[r][c].color !== '#333') {
                removeTiles([r,c], [r,c+1], [r,c+2]);
                matched = true;
            }
        }
    }
    for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < ROWS - 2; r++) {
            if (grid[r][c].color === grid[r+1][c].color && grid[r][c].color === grid[r+2][c].color && grid[r][c].color !== '#333') {
                removeTiles([r,c], [r+1,c], [r+2,c]);
                matched = true;
            }
        }
    }
    if (matched) {
        score += 300;
        updateUI();
        setTimeout(() => { fillGaps(); checkMatches(); }, 200);
    }
}

function removeTiles(...positions) {
    positions.forEach(([r, c]) => {
        if (grid[r] && grid[r][c]) grid[r][c].color = '#333';
    });
}

function fillGaps() {
    for (let c = 0; c < COLS; c++) {
        let writePos = ROWS - 1;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (grid[r][c].color !== '#333') {
                if (writePos !== r) {
                    grid[writePos][c] = grid[r][c];
                    grid[r][c] = {color: '#333'};
                }
                writePos--;
            }
        }
        for (let r = writePos; r >= 0; r--) {
            grid[r][c] = { color: colors[Math.floor(Math.random() * colors.length)], x: c * TILE_SIZE, y: r * TILE_SIZE };
        }
    }
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('moves').textContent = moves;
    if (moves <= 0) alert('Game Over! Final Score: ' + score + '\nGreat job Master Jason!');
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const tile = grid[r][c];
            ctx.fillStyle = tile.color;
            ctx.fillRect(c * TILE_SIZE + 2, r * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.strokeRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            // Cartoon eyes for Toon feel
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(c * TILE_SIZE + TILE_SIZE/2 - 8, r * TILE_SIZE + TILE_SIZE/2 - 5, 5, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(c * TILE_SIZE + TILE_SIZE/2 + 8, r * TILE_SIZE + TILE_SIZE/2 - 5, 5, 0, Math.PI*2);
            ctx.fill();
        }
    }
    requestAnimationFrame(draw);
}

initGrid();
updateUI();
draw();