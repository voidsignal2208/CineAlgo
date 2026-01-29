import * as SortAlgo from './algorithms/sorting.js';
import * as SearchAlgo from './algorithms/searching.js';
import * as PathAlgo from './algorithms/pathfinding.js';

const CONFIG = {
    canvasColor: '#ffffff',
    barColor: '#30336b',
    highlightColor: '#eb4d4b',
    sortedColor: '#00b894',
    pivotColor: '#f9ca24',
    gridWall: '#2d3436',
    gridEmpty: '#f4f7f6',
    gridPath: '#f9ca24',
    gridVisited: '#74b9ff',
    gridStart: '#6c5ce7',
    gridEnd: '#d63031'
};

const STATE = {
    mode: 'single',
    category: 'sorting',
    isPlaying: false,
    speed: 30,
    algorithms: { A: null, B: null },
    generators: { A: null, B: null },
    data: { A: null, B: null },
    input: null,
    target: null,
    grids: { A: null, B: null },
    lastFrameTime: 0
};

const canvas = document.getElementById('cinemaCanvas');
const ctx = canvas.getContext('2d');

function init() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    setupControls();
    loadCategory('sorting');
    loop();
}

function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    renderFrame();
}

function setupControls() {
    document.getElementById('categorySelect').addEventListener('change', (e) => loadCategory(e.target.value));
    document.getElementById('modeSelect').addEventListener('change', (e) => setMode(e.target.value));
    document.getElementById('algoSelectA').addEventListener('change', resetSimulation);
    document.getElementById('algoSelectB').addEventListener('change', resetSimulation);
    document.getElementById('btnPlayPause').addEventListener('click', togglePlay);
    document.getElementById('btnStep').addEventListener('click', stepForward);
    document.getElementById('btnReset').addEventListener('click', resetSimulation);
    document.getElementById('speedRange').addEventListener('input', (e) => STATE.speed = parseInt(e.target.value));
}

function loadCategory(cat) {
    STATE.category = cat;
    STATE.isPlaying = false;
    
    const algos = getAlgosForCategory(cat);
    const selA = document.getElementById('algoSelectA');
    const selB = document.getElementById('algoSelectB');
    
    selA.innerHTML = '';
    selB.innerHTML = '';
    
    Object.keys(algos).forEach(key => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = algos[key].name;
        selA.appendChild(opt.cloneNode(true));
        selB.appendChild(opt);
    });

    generateInput();
    resetSimulation();
}

function getAlgosForCategory(cat) {
    if (cat === 'sorting') return SortAlgo;
    if (cat === 'searching') return SearchAlgo;
    if (cat === 'pathfinding') return PathAlgo;
    return {};
}

function setMode(mode) {
    STATE.mode = mode;
    const groupB = document.getElementById('groupB');
    const panelB = document.getElementById('panelB');
    const layer = document.getElementById('learningLayer');

    if (mode === 'compare') {
        groupB.style.display = 'flex';
        panelB.style.display = 'flex';
        layer.classList.add('compare-mode');
    } else {
        groupB.style.display = 'none';
        panelB.style.display = 'none';
        layer.classList.remove('compare-mode');
    }
    resetSimulation();
}

function generateInput() {
    if (STATE.category === 'sorting') {
        STATE.input = Array.from({length: 40}, () => Math.floor(Math.random() * 90) + 10);
    } else if (STATE.category === 'searching') {
        STATE.input = Array.from({length: 40}, (_, i) => i * 2 + Math.floor(Math.random()*2)).sort((a,b)=>a-b);
        STATE.target = STATE.input[Math.floor(Math.random() * STATE.input.length)];
    } else if (STATE.category === 'pathfinding') {
        const rows = 20;
        const cols = 40;
        const grid = [];
        for(let y=0; y<rows; y++) {
            const row = [];
            for(let x=0; x<cols; x++) {
                row.push({
                    x, y, 
                    isWall: Math.random() < 0.3,
                    isStart: false, isEnd: false,
                    parent: null, distance: Infinity, visited: false
                });
            }
            grid.push(row);
        }
        grid[10][5].isWall = false; grid[10][5].isStart = true;
        grid[10][35].isWall = false; grid[10][35].isEnd = true;
        STATE.input = { grid, start: grid[10][5], end: grid[10][35] };
    }
}

function resetSimulation() {
    STATE.isPlaying = false;
    document.getElementById('btnPlayPause').textContent = "Play";
    
    if (STATE.category === 'pathfinding') {
        const gA = STATE.input.grid;
        for(let r of gA) for(let n of r) {
            n.visited = false; n.parent = null; n.distance = Infinity; n.f = 0; n.g = 0;
        }
        STATE.grids.A = gA;
    }

    const algoLib = getAlgosForCategory(STATE.category);
    const nameA = document.getElementById('algoSelectA').value;
    STATE.algorithms.A = algoLib[nameA];
    
    if (STATE.category === 'sorting') {
        STATE.generators.A = STATE.algorithms.A.run([...STATE.input]);
    } else if (STATE.category === 'searching') {
        STATE.generators.A = STATE.algorithms.A.run([...STATE.input], STATE.target);
    } else {
        STATE.generators.A = STATE.algorithms.A.run(STATE.grids.A, STATE.grids.A[10][5], STATE.grids.A[10][35]);
    }
    
    updateUI('A', STATE.algorithms.A);

    if (STATE.mode === 'compare') {
        const nameB = document.getElementById('algoSelectB').value;
        STATE.algorithms.B = algoLib[nameB];
        
        if (STATE.category === 'sorting') {
            STATE.generators.B = STATE.algorithms.B.run([...STATE.input]);
        } else if (STATE.category === 'searching') {
            STATE.generators.B = STATE.algorithms.B.run([...STATE.input], STATE.target);
        } else {
            const gB = JSON.parse(JSON.stringify(STATE.input.grid));
            STATE.grids.B = gB;
            STATE.generators.B = STATE.algorithms.B.run(STATE.grids.B, STATE.grids.B[10][5], STATE.grids.B[10][35]);
        }
        updateUI('B', STATE.algorithms.B);
    }

    stepForward();
}

function updateUI(id, algo) {
    document.getElementById(`title${id}`).textContent = algo.name;
    document.getElementById(`code${id}`).textContent = algo.code;
    
    const c = algo.complexity;
    let html = `<table class="complexity-table">
        <tr><td>Time:</td><td>${c.time}</td></tr>
        <tr><td>Space:</td><td>${c.space}</td></tr>
        ${c.stability ? `<tr><td>Stability:</td><td>${c.stability}</td></tr>` : ''}
    </table>`;
    document.getElementById(`complexity${id}`).innerHTML = html;
    
    document.getElementById('insightText').textContent = algo.funFact;
}

function togglePlay() {
    STATE.isPlaying = !STATE.isPlaying;
    document.getElementById('btnPlayPause').textContent = STATE.isPlaying ? "Pause" : "Play";
}

function loop(timestamp) {
    if (STATE.isPlaying) {
        const interval = 1000 / STATE.speed;
        if (timestamp - STATE.lastFrameTime > interval) {
            stepForward();
            STATE.lastFrameTime = timestamp;
        }
    }
    requestAnimationFrame(loop);
}

function stepForward() {
    let doneA = true, doneB = true;

    if (STATE.generators.A) {
        const res = STATE.generators.A.next();
        if (!res.done) {
            STATE.data.A = res.value;
            doneA = false;
            updatePanel('A', res.value);
        }
    }

    if (STATE.mode === 'compare' && STATE.generators.B) {
        const res = STATE.generators.B.next();
        if (!res.done) {
            STATE.data.B = res.value;
            doneB = false;
            updatePanel('B', res.value);
        }
    }

    renderFrame();

    if (doneA && (STATE.mode !== 'compare' || doneB)) {
        STATE.isPlaying = false;
        document.getElementById('btnPlayPause').textContent = "Replay";
    }
}

function updatePanel(id, state) {
    if (state.metrics) {
        const mEl = document.getElementById(`metrics${id}`);
        mEl.innerHTML = '';
        Object.entries(state.metrics).forEach(([k, v]) => {
            mEl.innerHTML += `<div class="metric-item"><span>${k}:</span> <span class="val">${v}</span></div>`;
        });
    }
    if (state.narrative) {
        document.getElementById(`narrative${id}`).textContent = state.narrative;
    }
    
    const codeWin = document.getElementById(`code${id}`);
    const lines = codeWin.textContent.split('\n');
    codeWin.innerHTML = lines.map((l, i) => {
        const num = i + 1;
        return `<span class="code-line ${state.line === num ? 'active' : ''}">${l}</span>`;
    }).join('');
    
    const active = codeWin.querySelector('.active');
    if(active) active.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

function renderFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (STATE.mode === 'compare') {
        const w = canvas.width / 2;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, w, canvas.height);
        ctx.clip();
        drawVisual(STATE.data.A, 0, 0, w, canvas.height, 'A');
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.rect(w, 0, w, canvas.height);
        ctx.clip();
        ctx.beginPath();
        ctx.moveTo(w, 0);
        ctx.lineTo(w, canvas.height);
        ctx.strokeStyle = '#BCAAA4';
        ctx.stroke();
        drawVisual(STATE.data.B, w, 0, w, canvas.height, 'B');
        ctx.restore();
    } else {
        drawVisual(STATE.data.A, 0, 0, canvas.width, canvas.height, 'A');
    }
}

function drawVisual(data, x, y, w, h, id) {
    if (!data) return;

    if (STATE.category === 'pathfinding') {
        drawGrid(data, x, y, w, h, id);
    } else {
        drawArray(data, x, y, w, h);
    }
}

function drawArray(state, x, y, w, h) {
    const arr = state.data;
    if(!arr) return;

    const len = arr.length;
    const barW = (w - 40) / len;
    const maxVal = Math.max(...arr, 100);
    const scaleY = (h - 60) / maxVal;

    const startX = x + 20;
    const baseLine = y + h - 30;

    arr.forEach((val, i) => {
        const barH = val * scaleY;
        let color = CONFIG.barColor;
        
        if (state.highlights && state.highlights.includes(i)) {
            color = CONFIG.highlightColor;
        }
        if (state.activeRange && i >= state.activeRange[0] && i <= state.activeRange[1]) {
            ctx.fillStyle = 'rgba(41, 128, 185, 0.2)';
            ctx.fillRect(startX + i*barW, y, barW, h);
            color = CONFIG.barColor;
        }
        if (state.highlights && state.highlights.includes(i)) {
            color = CONFIG.highlightColor;
        }
        
        ctx.fillStyle = color;
        ctx.fillRect(startX + i * barW + 1, baseLine - barH, barW - 2, barH);
        
        if (barW > 20) {
            ctx.fillStyle = '#000';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(val, startX + i * barW + barW/2, baseLine + 15);
        }
    });
}

function drawGrid(state, x, y, w, h, id) {
    const grid = (id === 'B') ? STATE.grids.B : STATE.grids.A;
    if(!grid) return;

    const rows = grid.length;
    const cols = grid[0].length;
    
    const cellW = (w - 20) / cols;
    const cellH = (h - 20) / rows;
    const offX = x + 10;
    const offY = y + 10;

    for(let r=0; r<rows; r++) {
        for(let c=0; c<cols; c++) {
            const node = grid[r][c];
            let color = CONFIG.gridEmpty;
            
            if (node.isWall) color = CONFIG.gridWall;
            else if (node.isStart) color = CONFIG.gridStart;
            else if (node.isEnd) color = CONFIG.gridEnd;
            else if (state.path && state.path.find(n=>n.x===c && n.y===r)) color = CONFIG.gridPath;
            else if (node.visited || (node.distance !== Infinity && node.distance !== undefined)) color = CONFIG.gridVisited;
            
            if (state.current && state.current.x === c && state.current.y === r) color = CONFIG.highlightColor;

            ctx.fillStyle = color;
            ctx.fillRect(offX + c*cellW, offY + r*cellH, cellW-1, cellH-1);
        }
    }
}

init();