class Watchout {
    constructor() {
        // Utilities
        this.running = true;
        this.date = new Date();
        this.time = this.date.getTime();
        this.score = 0;
        this.highScore = 0;
        this.collisionDetected = false;
        this.playerRadius = 25;
        this.enemyRadius = 15;

        // Capture available width and height for more intuitive use later
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Generate enemies
        this.maxEnemies = 20;
        this.enemies = this.generateEnemies();
        this.updateEnemyPos();

        // Generate Player, and set position to center of screen
        this.player = new Player(this.width / 2, this.height / 2, this.playerRadius);
    }

    // Main game loop
    run() {
        this.update();
        window.requestAnimationFrame(() => { this.run(); });
    }

    checkCollisions() {
        let playerCircle = {
            x: this.player.x,
            y: this.player.y,
            r: this.playerRadius
        };
        
        let enemyCircle = {};

        this.enemies.forEach(enemy => {
            enemyCircle.x = enemy.pos.x;
            enemyCircle.y = enemy.pos.y;
            enemyCircle.r = enemy.radius;
            if(this.circleCollision({...playerCircle}, {...enemyCircle})) this.collisionDetected = true;
        });
    }

    circleCollision(circle1, circle2) {
        circle1.x = circle1.x - (circle1.r * 1.5);
        circle1.y = circle1.y - (circle1.r * 1.5);

        let dx = circle1.x - circle2.x;
        let dy = circle1.y - circle2.y;

        let distance =  Math.sqrt(dx * dx + dy * dy);
        
        if ( distance < ( circle1.r + circle2.r ) ) 
        {
            return true;
        } 
        return false;
    }

    update() {
        this.date = new Date();
        let currentTime = this.date.getTime();
        let delta = ((currentTime - this.time) / 1000);

        d3.select('#time')
            .text(`Time: ${this.time}`);
        d3.select('#currentTime')
            .text(`Current Time: ${currentTime}`);
        d3.select('#difference')
            .text(`Difference: ${currentTime - this.time}`);

        if(delta >= 0.995) {
            this.time = currentTime;
            this.updateEnemyPos();
            this.score++;
            delta = 1;
        }

        this.updateEnemies(delta);
        this.updateScore();
        this.checkCollisions();

    }

    // Generate array of enemies
    generateEnemies() {
        let enemies = [];

        for(let i = 0; i < this.maxEnemies; i++) {
            let pos = this.randomPos();
            enemies.push(new Enemy(pos, this.enemyRadius, i));
        }

        return enemies;
    }

    updateEnemies(delta) {
        this.enemies.forEach(enemy => enemy.move(delta));
    }

    updateEnemyPos() {
        this.enemies.forEach(enemy => enemy.updatePosition(this.randomPos()));
    }

    updateScore() {
        if(this.collisionDetected) {this.score = 0; this.collisionDetected = false};
        if(this.score > this.highScore) { this.highScore = this.score };
        d3.select('#current-score').text(`Current Score: ${this.score}`);
        d3.select('#high-score').text(`High Score: ${this.highScore}`);
    }

    randomPos() {
        let pos = {};
        pos.x = Math.floor(Math.random() * (this.width - 30));
        pos.y = Math.floor(Math.random() * (this.height - 30));

        return pos;
    }
}

class Enemy {
    constructor(pos, r, id) {
        // Position objects
        this.pos = {...pos};
        this.lastPos = {...pos};
        this.nextPos = {...pos};
        this.id = id;
        this.radius = r;
        this.createElement();
        this.initPosition();

        this.print = true;
    }

    createElement() {
        d3.select('body')
            .append('svg')
            .attr('id', `enemy${this.id}`)
            .attr('width', this.radius * 2)
            .attr('height', this.radius * 2)
            .append('circle')
            .attr('class', 'enemy')
            .attr('cx', this.radius)
            .attr('cy', this.radius)
            .attr('r', this.radius)
            .attr('fill', 'black');
    }

    initPosition() {
        d3.select(`#enemy${this.id}`)
            .style('position', 'absolute')
            .style('left', `${this.pos.x}`)
            .style('top', `${this.pos.y}`);
    }

    updatePosition(pos) {
        this.lastPos = {x: this.pos.x, y: this.pos.y};
        this.nextPos = {...pos};
    }

    move(delta) { 
        if (delta === 1) {
            this.pos = {...this.lastPos}
        } else {
            this.pos.x = Math.floor(this.lerp(this.lastPos.x, this.nextPos.x, delta));
            this.pos.y = Math.floor(this.lerp(this.lastPos.y, this.nextPos.y, delta));
        }

        d3.select(`#enemy${this.id}`)
            .style('left', `${this.pos.x}`)
            .style('top', `${this.pos.y}`)
    }
    
    // Shamelessly stolen from Wikipedia
    lerp(v0, v1, t) {
        return v0 * (1-t) + v1 * t;
    }
}

class Player {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.createElement();
        this.updatePosition();
    }

    createElement() {
        d3.select('body')
            .append('svg')
            .attr('id', 'player')
            .attr('width', this.r * 2)
            .attr('height', this.r * 2)
            .append('circle')
            .attr('cx', this.r)
            .attr('cy', this.r)
            .attr('r', this.r)
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