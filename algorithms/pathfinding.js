class MinHeap {
    constructor() { this.heap = []; }
    push(val) { this.heap.push(val); this.bubbleUp(); }
    pop() { if(this.heap.length===0) return null; const min=this.heap[0]; const end=this.heap.pop(); if(this.heap.length>0){this.heap[0]=end; this.sinkDown();} return min; }
    bubbleUp() { let idx=this.heap.length-1; const el=this.heap[idx]; while(idx>0){ let pIdx=Math.floor((idx-1)/2); let p=this.heap[pIdx]; if(el.f >= p.f) break; this.heap[idx]=p; idx=pIdx; } this.heap[idx]=el; }
    sinkDown() { let idx=0; const len=this.heap.length; const el=this.heap[0]; while(true){ let lC=2*idx+1, rC=2*idx+2; let swap=null; if(lC<len && this.heap[lC].f < el.f) swap=lC; if(rC<len && this.heap[rC].f < (swap===null?el.f:this.heap[lC].f)) swap=rC; if(swap===null) break; this.heap[idx]=this.heap[swap]; idx=swap; } this.heap[idx]=el; }
    size() { return this.heap.length; }
}

const getNeighbors = (grid, node) => {
    const rows = grid.length;
    const cols = grid[0].length;
    const dirs = [[0,1], [1,0], [0,-1], [-1,0]]; 
    const neighbors = [];
    for (let [dr, dc] of dirs) {
        const nr = node.y + dr;
        const nc = node.x + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !grid[nr][nc].isWall) {
            neighbors.push(grid[nr][nc]);
        }
    }
    return neighbors;
};

export const bfs = {
    name: "Breadth-First Search",
    complexity: { time: "O(V+E)", space: "O(V)", guarantee: "Shortest Path (Unweighted)" },
    code: `procedure BFS(G, start):
  Q = queue(); Q.push(start)
  start.visited = true
  while not Q.empty():
    v = Q.pop()
    if v == goal: return reconstructPath(v)
    for w in neighbors(v):
      if not w.visited:
        w.visited = true; w.parent = v
        Q.push(w)`,
    funFact: "BFS spreads like a wave (or wildfire) uniformly in all directions. It guarantees the shortest path in unweighted graphs.",
    run: function* (grid, startNode, endNode) {
        let visited = new Set();
        let queue = [startNode];
        visited.add(`${startNode.y},${startNode.x}`);
        let visits = 0;

        yield { type: 'grid', visited: [], path: [], line: 2, narrative: "Initialized Queue with Start Node." };

        while (queue.length > 0) {
            let curr = queue.shift();
            visits++;
            
            yield { type: 'grid', current: curr, line: 4, metrics: { visits }, narrative: `Visiting node (${curr.x}, ${curr.y}).` };

            if (curr.x === endNode.x && curr.y === endNode.y) {

                let path = [];
                let temp = curr;
                while (temp) {
                    path.push(temp);
                    temp = temp.parent;
                }
                yield { type: 'grid', path: path, line: 6, narrative: "Destination reached. Reconstructing path." };
                return;
            }

            const neighbors = getNeighbors(grid, curr);
            for (let n of neighbors) {
                if (!visited.has(`${n.y},${n.x}`)) {
                    visited.add(`${n.y},${n.x}`);
                    n.parent = curr;
                    queue.push(n);
                    yield { type: 'grid', visited: [n], line: 9, metrics: { visits }, narrative: `Adding neighbor (${n.x}, ${n.y}) to queue.` };
                }
            }
        }
        yield { type: 'grid', narrative: "No path found." };
    }
};

export const dfs = {
    name: "Depth-First Search",
    complexity: { time: "O(V+E)", space: "O(V)", guarantee: "No Guarantee" },
    code: `procedure DFS(G, v):
  v.visited = true
  if v == goal: return true
  for w in neighbors(v):
    if not w.visited:
      if DFS(G, w): return true
  return false`,
    funFact: "DFS can get 'lost' in infinite branches if not careful. It's often used for maze generation, not solving.",
    run: function* (grid, startNode, endNode) {
        let stack = [startNode];
        let visited = new Set();
        let visits = 0;

        while (stack.length > 0) {
            let curr = stack.pop();
            
            if (!visited.has(`${curr.y},${curr.x}`)) {
                visited.add(`${curr.y},${curr.x}`);
                visits++;
                yield { type: 'grid', current: curr, visited: [curr], line: 2, metrics: {visits}, narrative: `Exploring deep into (${curr.x}, ${curr.y}).` };

                if (curr.x === endNode.x && curr.y === endNode.y) {
                    let path = [];
                    let temp = curr;
                    while (temp) {
                        path.push(temp);
                        temp = temp.parent;
                    }
                    yield { type: 'grid', path: path, line: 3, narrative: "Found target!" };
                    return;
                }

                const neighbors = getNeighbors(grid, curr);
                for (let n of neighbors) {
                    if (!visited.has(`${n.y},${n.x}`)) {
                        n.parent = curr;
                        stack.push(n);
                    }
                }
            }
        }
        yield { type: 'grid', narrative: "No path found." };
    }
};
export const dijkstra = {
    name: "Dijkstra's Algorithm",
    complexity: { time: "O(E + V log V)", space: "O(V)", guarantee: "Shortest Path" },
    code: `procedure Dijkstra(G, start):
  PQ = priority_queue(); start.dist = 0
  PQ.push(start)
  while not PQ.empty():
    u = PQ.pop()
    for v in neighbors(u):
      alt = u.dist + weight(u, v)
      if alt < v.dist:
        v.dist = alt; v.parent = u
        PQ.push(v)`,
    funFact: "Edsger Dijkstra came up with this algorithm in 20 minutes while having coffee at a cafe in Amsterdam in 1956.",
    run: function* (grid, startNode, endNode) {
        
        for(let row of grid) for(let n of row) n.distance = Infinity;
        startNode.distance = 0;
        
        let pq = new MinHeap();
        pq.push({ node: startNode, f: 0 }); 
        let visited = new Set();
        let visits = 0;

        while(pq.size() > 0) {
            let { node: u } = pq.pop();
            
            if (visited.has(`${u.y},${u.x}`)) continue;
            visited.add(`${u.y},${u.x}`);
            visits++;

            yield { type: 'grid', current: u, visited: [u], line: 4, metrics: {visits}, narrative: `Relaxing node (${u.x}, ${u.y}) with dist ${u.distance}.` };

            if (u.x === endNode.x && u.y === endNode.y) {
                let path = [];
                let temp = u;
                while (temp) {
                    path.push(temp);
                    temp = temp.parent;
                }
                yield { type: 'grid', path: path, line: 6, narrative: "Shortest path found." };
                return;
            }

            const neighbors = getNeighbors(grid, u);
            for(let v of neighbors) {
                let alt = u.distance + 1; 
                if (alt < v.distance) {
                    v.distance = alt;
                    v.parent = u;
                    pq.push({ node: v, f: alt });
                    yield { type: 'grid', line: 8, narrative: `Updated neighbor (${v.x}, ${v.y}) distance to ${alt}.` };
                }
            }
        }
        yield { type: 'grid', narrative: "No path possible." };
    }
};
export const aStar = {
    name: "A* Search",
    complexity: { time: "O(E)", space: "O(V)", guarantee: "Shortest Path" },
    code: `procedure A*(start, goal):
  openSet = {start}; start.g = 0
  start.f = heuristic(start, goal)
  while openSet not empty:
    current = node with lowest f
    if current == goal: return path
    openSet.remove(current)
    for neighbor in neighbors(current):
      gScore = current.g + weight
      if gScore < neighbor.g:
        neighbor.g = gScore; neighbor.f = gScore + h(neighbor)
        if neighbor not in openSet: openSet.add(neighbor)`,
    funFact: "A* uses a heuristic (Manhattan distance in grids) to guide the search towards the target, minimizing visited nodes.",
    run: function* (grid, startNode, endNode) {

        const h = (n) => Math.abs(n.x - endNode.x) + Math.abs(n.y - endNode.y);

        for(let row of grid) for(let n of row) { n.g = Infinity; n.f = Infinity; }
        startNode.g = 0;
        startNode.f = h(startNode);

        let pq = new MinHeap();
        pq.push({ node: startNode, f: startNode.f });
        let openSetHash = new Set([`${startNode.y},${startNode.x}`]);
        let closedSet = new Set();
        let visits = 0;

        while(pq.size() > 0) {
            let { node: current } = pq.pop();
            openSetHash.delete(`${current.y},${current.x}`);
            closedSet.add(`${current.y},${current.x}`);
            visits++;

            yield { type: 'grid', current: current, visited: [current], line: 4, metrics: {visits}, narrative: `Processing best node (${current.x}, ${current.y}). f=${current.f}` };

            if (current.x === endNode.x && current.y === endNode.y) {
                let path = [];
                let temp = current;
                while (temp) {
                    path.push(temp);
                    temp = temp.parent;
                }
                yield { type: 'grid', path: path, line: 6, narrative: "Target reached efficiently." };
                return;
            }

            const neighbors = getNeighbors(grid, current);
            for(let neighbor of neighbors) {
                if (closedSet.has(`${neighbor.y},${neighbor.x}`)) continue;

                let tentative_g = current.g + 1;

                if (tentative_g < neighbor.g) {
                    neighbor.parent = current;
                    neighbor.g = tentative_g;
                    neighbor.f = neighbor.g + h(neighbor);
                    
                    if (!openSetHash.has(`${neighbor.y},${neighbor.x}`)) {
                        openSetHash.add(`${neighbor.y},${neighbor.x}`);
                        pq.push({ node: neighbor, f: neighbor.f });
                        yield { type: 'grid', visited: [neighbor], line: 11, narrative: `Discovered neighbor (${neighbor.x}, ${neighbor.y}). Est cost: ${neighbor.f}` };
                    }
                }
            }
        }
        yield { type: 'grid', narrative: "No path." };
    }
};