const canvas = document.querySelector('canvas');
const scoreEl = document.querySelector('.scoreEl');
const canvasContext = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        }
        this.rotation = 0;
        this.opacity = 1;

        const image = new Image();
        image.src = './img/spaceship.png';
        image.onload = () => {
            const scale = 0.15;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: 550
            }
        }
    }

    // draw Player
    draw() {
        // for debugging
        //canvasContext.fillStyle = 'red';
       // canvasContext.fillRect(this.position.x, 
            //this.position.y, this.width, this.height);
        
        // save canvas snapshot
        canvasContext.save();
        canvasContext.globalAlpha = this.opacity;
        // translate to rotate Player
        canvasContext.translate(
            player.position.x, + player.width / 2, 
            player.position.y + player.height / 2);

        canvasContext.rotate(this.rotation);

        canvasContext.translate(
            -player.position.x, - player.width / 2, 
            -player.position.y - player.height / 2);

        // proper canvas object
        canvasContext.drawImage(this.image, 
                this.position.x, this.position.y,
                this.width, this.height);

        // restore canvas snapshot
        canvasContext.restore();
        } 
        
        
    // update Player's position
    update() {
        if (this.image) {
            this.draw();
            this.position.x += this.velocity.x;
        }
    }
 }
 
 class Projectile {
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 3;
    }

    // draw Projectiles
    draw() {
        canvasContext.beginPath();
        canvasContext.arc(this.position.x, this.position.y, 
            this.radius, 0, Math.PI * 2);
        canvasContext.fillStyle = "red";
        canvasContext.fill();
        canvasContext.closePath();   
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
 }

 class Particle {
    constructor({position, velocity, radius, color, fades}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.opacity = 1;
        this.fades;
    }

    // draw Projectiles
    draw() {
        canvasContext.save();
        canvasContext.globalAlpha = this.opacity;
        canvasContext.beginPath();
        canvasContext.arc(this.position.x, this.position.y, 
            this.radius, 0, Math.PI * 2);
        canvasContext.fillStyle = this.color;
        canvasContext.fill();
        canvasContext.closePath(); 
        canvasContext.restore();  
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        if (this.fades){
            this.opacity -= 0.01;
        }
        
    }
 }

 class InvaderProjectile {
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        
        this.width = 3;
        this.height = 10;
    }

    // draw Projectiles
    draw() {
        canvasContext.fillStyle = 'blue';
        canvasContext.fillRect(this.position.x, this.position.y,
                    this.width, this.height);
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
 }


 class Invader {
    constructor({position}) {
        this.velocity = {
            x: 0,
            y: 0
        }
     
        const image = new Image();
        image.src = './img/invader.png';
        image.onload = () => {
            const scale = 1;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: position.x,
                y: position.y
            }
        }
    }

    // draw Invader
    draw() {
        // for debugging
        //canvasContext.fillStyle = 'red';
       // canvasContext.fillRect(this.position.x, 
            //this.position.y, this.width, this.height);
       
        // proper canvas object
        canvasContext.drawImage(this.image, 
                this.position.x, this.position.y,
                this.width, this.height);    
        } 
        
        
    // update Invader's position
    update({velocity}) {
        if (this.image) {
            this.draw();
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        }
    }

    // shooting
    shoot(invaderProjectiles) {
        invaderProjectiles.push(
            new InvaderProjectile({    
                 position: {
                    x: this.position.x + this.width / 2,
                    y: this.position.y + this.height
                   },
                   velocity: {
                    x: 0,
                    y: 5
                   } 
                }))     
    }
 }

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 3,
            y: 0 
        }
        this.invaders = [];

        const rows = Math.floor(Math.random() * 5 + 2);
        const cols = Math.floor(Math.random() * 10 + 5);

        this.width = cols * 30;
        
        for (let x = 0; x < rows; x++) {
            for (let y = 0; y < cols; y++)
            {
                this.invaders.push(new Invader({position: {
                    x: x *  30,
                    y: y * 30
                }}));
            }   
        }
        console.log(this.invaders);
    }
 
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.velocity.y = 0;

        if (this.position.x + this.width >= canvas.width 
            || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x;
            this.velocity.y = 30;
        }
    }
}

const player = new Player();
const projectiles = []; 
const invaderProjectiles = [];
const particles = [];
const grids = [];
const keys = {
    a: {
        pressed: false
    },
    d: { 
        pressed: false
    },
    p: {
        pressed: false
    }
}

let frames = 0;
let randomInterval = Math.floor(Math.random() * 500 + 500);
let game = {
    over: false,
    active: true
}
let score = 0;

for (let i = 0; i < 100; i++){
    particles.push(new Particle(
        {   
            position: {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height
            },
            velocity: {
                x: 0,
                y: 0.03
            },
            radius: Math.random() * 2, 
            color: "white"
        }));
}

function createParticles({object, color, fades}){
    for (let i = 0; i < 15; i++){
        particles.push(new Particle(
            {   
                position: {
                    x: object.position.x + object.width / 2,
                    y: object.position.y + object.height / 2
                },
                velocity: {
                    x: (Math.random() - 0.5) * 2,
                    y: (Math.random() - 0.5) * 2
                },
                radius: Math.random() * 3, 
                color: color || "#BAA0DE",
                fades
            }));
    }
}

function animate() {
    if (!game.active) return

    requestAnimationFrame(animate); 
    canvasContext.fillStyle = "black";
    canvasContext.fillRect(0, 0,
         canvas.width, canvas.height);
    player.update(); 
    particles.forEach((particle, i) => {
        if (particle.position.y - particle.radius >= 
            canvas.height) {
                particle.position.x = Math.random() * canvas.width;
                particle.position.y = -particle.radius;
            }

        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(i, 1);
            }, 0);      
        } else {
            particle.update();
        }
    });
    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (invaderProjectile.position.y + invaderProjectile.height
            >= canvas.height) {
                setTimeout(() => {
                    invaderProjectiles.splice(index, 1);
                }, 0); 
        } else {
            invaderProjectile.update();
        }

        // InvaderProjectile hits Player
        if (invaderProjectile.position.y + invaderProjectile.height
            >= player.position.y && invaderProjectile.position.x +
            invaderProjectile.width >= player.position.x 
            && invaderProjectile.position.x <= player.position.x +
            player.width) {
                console.log("bang!!!");
                setTimeout(() => {
                    invaderProjectiles.splice(index, 1);
                    player.opacity = 0;
                    game.over = true;
                }, 0); 

                setTimeout(() => {
                    game.active = false;
                }, 2000); 

                createParticles({
                    object: player,
                    color: 'orange',
                    fades: true
                }); 
        }
    });
    projectiles.forEach((projectile, index) => {

        // remove Projectiles if array is full or update view
        if (projectile.position.y + projectile.radius <= 0)
        {
            // flushing Projectiles
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);    
        } else {
            projectile.update();
        } 
    });
  
    grids.forEach((grid, gridIndex) => {
        grid.update();

        // spawning InvadersProjectiles
        if (frames % 100 ===0 && grid.invaders.length > 0){
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles);
                        
        }   
        grid.invaders.forEach((invader, i) => {
            invader.update({velocity : grid.velocity});

            // Projectiles hit Invaders
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius 
                    <= invader.position.y + invader.height
                    && projectile.position.x + projectile.radius 
                    >= invader.position.x && projectile.position.x - projectile.radius <= invader.position.x &&
                   projectile.position.y + projectile.radius >= invader.position.y)
                  {   
                   setTimeout(() => {
                        const invaderFound = grid.invaders.find((invaderNext) =>{
                            return invaderNext === invader;
                        });
                        
                        
                        // removing Invaders and Projectiles
                        if (invaderFound)
                        {    
                            score += 100; 
                            scoreEl.innerHTML = score;   
                              
                            createParticles({
                                object: invader,
                                fades: true
                            });        
                            grid.invaders.splice(i, 1);
                            projectiles.splice(j, 1);
                            
                            // limited shape of Invaders group
                            if (grid.invaders.length > 0) 
                            {
                                const firstInvader = grid.invaders[0];
                                const lastInvader = grid.invaders[grid.invaders.length - 1];

                                grid.width = lastInvader.position.x 
                                            - firstInvader.position.x
                                            + lastInvader.width;
                                
                                grid.position.x = firstInvader.position.x;
                            } else {
                                grid.splice(gridIndex, 1);
                            }

                        }
                   }, 0); 
                }
            });
        });
    });
    

    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -5;
        player.rotation = -0.10;
    } else if (keys.d.pressed && player.position.x + 
        player.width <= canvas.width) {
        player.velocity.x = 5;
        player.rotation = 0.10;
    } else {
        player.velocity.x = 0;
        player.rotation = 0;
    }
    console.log(frames);

    // spawning Invaders
    if (frames % randomInterval === 0) 
    {
        grids.push(new Grid());
        randomInterval = Math.floor(Math.random() * 500 + 500);
        frames = 0;
    }
    frames ++;
}
animate();

addEventListener('keydown', ({key}) => {
    if (game.over) return

    switch (key) {
        case 'a': 
            console.log("left");
            keys.a.pressed = true;
            break;
        case 'd': 
            console.log("right");
            keys.d.pressed = true;
            break;     
        case 'p': 
            console.log("shoot");
            projectiles.push(
                new Projectile({ 
                    position: {
                        x: player.position.x + player.width /2,
                        y: player.position.y
                    },
                    velocity: {
                        x: 0,
                        y: -8
                    }                
                }));
            console.log(projectiles);
            break;
    }
}); 

addEventListener('keyup', ({key}) => {
    switch (key) {
        case 'a': 
            console.log("left");
            keys.a.pressed = false;
            break;
        case 'd': 
            console.log("right");
            keys.d.pressed = false;
            break;     
        case 'p': 
            console.log("shoot");
            break;
    }
}); 