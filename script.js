const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let mouse = { x: null, y: null };

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
    // Add particle on mouse move for trail
    if(Math.random() > 0.6) {
        particles.push(new Particle(mouse.x, mouse.y, true));
    }
});

class Particle {
    constructor(x, y, isTrail = false) {
        this.x = x || Math.random() * width;
        this.y = y || height + Math.random() * 100;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 1) * 0.8 - 0.2; // Float up
        this.life = 1;
        this.decay = Math.random() * 0.008 + 0.003;
        this.isTrail = isTrail;
        this.color = Math.random() > 0.5 ? '0, 245, 255' : '58, 134, 255'; // Cyan or Blue

        if(this.isTrail) {
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 1.5;
            this.speedY = (Math.random() - 0.5) * 1.5;
            this.decay = Math.random() * 0.02 + 0.01;
            this.color = '0, 245, 255'; // Trail is always cyan
        }
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        
        // Anti-gravity wobble
        this.x += Math.sin(this.y * 0.03) * 0.3;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const alpha = Math.max(0, this.life);
        ctx.fillStyle = `rgba(${this.color}, ${alpha * 0.8})`;
        ctx.fill();
        
        // Soft glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(${this.color}, 1)`;
    }
}

// Initial ambient particles
for(let i = 0; i < 70; i++) {
    particles.push(new Particle(Math.random() * width, Math.random() * height));
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    // Randomly spawn ambient particles
    if(Math.random() < 0.08) {
        particles.push(new Particle());
    }

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].life <= 0 || particles[i].y < -10) {
            particles.splice(i, 1);
            i--;
        }
    }
    
    // Draw connecting lines between close particles for a network/lab vibe
    ctx.shadowBlur = 0; // reset
    for(let i=0; i<particles.length; i++){
        for(let j=i+1; j<particles.length; j++){
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if(dist < 150) {
                const alpha = (1 - dist/150) * 0.2 * Math.min(particles[i].life, particles[j].life);
                // Line color matches particle i
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(${particles[i].color}, ${alpha})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

animate();
