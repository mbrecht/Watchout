class Watchout {
    constructor() {
        this.init();
    }

    // Initialize Game
    init() {
        // Capture available width and height for more intuitive use later
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Generate enemies
        this.maxEnemies = 10;
        this.enemies = this.generateEnemies();

        // Start Game
        this.run();
    }

    // Main game loop
    run() {
        // Handle Input
        this.handleInput();

        // Update
        this.update();
    }

    update() {

    }

    handleInput() {

    }

    // Generate array of enemies
    generateEnemies() {
        let enemies = [];

        for(let i = 0; i < this.maxEnemies; i++) {
            let x = Math.floor(Math.random() * this.width);
            let y = Math.floor(Math.random() * this.height);
            enemies.push(new Enemy(x, y, i));
        }

        return enemies;
    }
}

class Enemy {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.createElement();
        this.updatePosition();
    }

    createElement() {
        d3.select('body')
            .append('svg')
            .attr('id', `enemy${this.id}`)
            .attr('width', 50)
            .attr('height', 50)
            .append('circle')
            .attr('cx', 25)
            .attr('cy', 25)
            .attr('r', 25)
            .style('fill', 'black');
    }

    updatePosition() {
        d3.select(`#enemy${this.id}`)
            .style('position', 'absolute')
            .style('left', `${this.x - 50}`)
            .style('top', `${this.y - 50}`);
    }
}

let game = new Watchout();