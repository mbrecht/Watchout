class Watchout {
    constructor() {
        this.init();
    }

    // Initialize Game
    init() {
        // Utilities
        this.running = true;
        this.date = new Date();
        this.time = this.date.getTime();

        // Capture available width and height for more intuitive use later
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Generate enemies
        this.maxEnemies = 10;
        this.enemies = this.generateEnemies();

        // Generate Player, and set position to center of screen
        this.player = new Player(this.width / 2, this.height / 2);
    }

    // Main game loop
    run() {
        this.handleInput();
        this.update();
        window.requestAnimationFrame(() => { this.run(); });
    }

    update() {
        this.date = new Date();
        let currentTime = this.date.getTime();

        d3.select('#time')
            .text(`Time: ${this.time}`);
        d3.select('#currentTime')
            .text(`Current Time: ${currentTime}`);
        d3.select('#difference')
            .text(`Difference: ${currentTime - this.time}`);

        if(currentTime - this.time > 1000) {
            this.time = currentTime;
            this.updateEnemies();
        }
    } 

    handleInput() {

    }

    // Generate array of enemies
    generateEnemies() {
        let enemies = [];

        for(let i = 0; i < this.maxEnemies; i++) {
            let pos = this.randomPos();
            enemies.push(new Enemy(pos, i));
        }

        return enemies;
    }

    updateEnemies() {
        for(let i = 0; i < this.maxEnemies; i++) {
            let pos = this.randomPos();
            this.enemies[i].updatePosition(pos);
        }
    }

    randomPos() {
        let pos = {};
        pos.x = Math.floor(Math.random() * (this.width - 30));
        pos.y = Math.floor(Math.random() * (this.height - 30));
        return pos;
    }
}

class Enemy {
    constructor(pos, id) {
        this.x = pos.x;
        this.y = pos.y;
        this.id = id;
        this.createElement();
        this.initPosition();
    }

    createElement() {
        d3.select('body')
            .append('svg')
            .attr('id', `enemy${this.id}`)
            .attr('width', 30)
            .attr('height', 30)
            .append('circle')
            .attr('cx', 15)
            .attr('cy', 15)
            .attr('r', 15)
            .style('fill', 'black');
    }

    initPosition() {
        d3.select(`#enemy${this.id}`)
            .style('position', 'absolute')
            .style('left', `${this.x}`)
            .style('top', `${this.y}`);
    }

    updatePosition(pos) {
        this.x = pos.x;
        this.y = pos.y;

        d3.select(`#enemy${this.id}`)
            .style('left', `${this.x}`)
            .style('top', `${this.y}`)
            .style('transition', 'all 500ms ease-in-out');
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.createElement();
        this.updatePosition();
    }

    createElement() {
        d3.select('body')
            .append('svg')
            .attr('id', 'player')
            .attr('width', 50)
            .attr('height', 50)
            .append('circle')
            .attr('cx', 25)
            .attr('cy', 25)
            .attr('r', 25)
            .style('fill', 'orange');
        document.getElementById('player').onmousedown = (e) => {this.clickPlayer(e)};
    }

    updatePosition() {
        d3.select(`#player`)
            .style('position', 'absolute')
            .style('left', `${this.x - 50}`)
            .style('top', `${this.y - 50}`);
    }

    clickPlayer(event) {
        event = event || window.event;
        event.preventDefault();
        document.onmouseup = this.stopMoving;
        document.onmousemove = (e) => { this.movePlayer(); };
    }

    movePlayer(event) {
        event = event || window.event;
        event.preventDefault();
        if(event.clientX < 0) {
            this.x = 25;
        } else if(event.clientX > window.width) {
            this.x = window.width + 25;
        } else {
            this.x = event.clientX + 25;
        }
        if(event.clientY < 0) {
            this.y = 25;
        } else if(event.clientY > window.height) {
            this.y = window.height + 25;
        } else {
            this.y = event.clientY + 25;
        }
        this.updatePosition();
    }

    stopMoving() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Create Game
let game = new Watchout();
// Start Game
window.requestAnimationFrame(() => { game.run(); });