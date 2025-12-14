


export class TunnelScroll {
    constructor() {
        this.container = document.getElementById('tunnel-container');

        if (!this.container) return;

        this.sections = document.querySelectorAll('.tunnel-section');
        this.zValDisplay = document.getElementById('z-val');

        this.zPos = 0;
        this.targetZ = 0;

        this.maxZ = 13000;


        this.lastTriggerZ = 0;

        this.init();
    }

    init() {
        window.addEventListener('wheel', (e) => {
            this.targetZ += e.deltaY * 4.0;
            if (this.targetZ < 0) this.targetZ = 0;
            if (this.targetZ > this.maxZ) this.targetZ = this.maxZ;
        }, { passive: true });

        this.animate();
    }

    animate() {
        const diff = this.targetZ - this.zPos;
        this.zPos += diff * 0.05;


        if (Math.abs(this.zPos - this.lastTriggerZ) > 1000) {
            this.triggerRandomEvent();
            this.lastTriggerZ = this.zPos;
        }


        if (this.zPos > 7000 && this.zPos < 9000) {
            document.body.classList.add('invert-mode');
        } else {
            document.body.classList.remove('invert-mode');
        }


        if (this.zValDisplay) {
            this.zValDisplay.innerText = Math.round(this.zPos).toString().padStart(5, '0');
        }

        this.container.style.transform = `translate(-50%, -50%) translate3d(0, 0, ${this.zPos}px)`;

        this.sections.forEach(sec => {
            const secZ = parseFloat(sec.style.getPropertyValue('--z'));
            const viewZ = secZ + this.zPos;

            let opacity = 0;
            if (viewZ < -1000) opacity = 0;
            else if (viewZ < 0) opacity = mapRange(viewZ, -1000, 0, 0, 1);
            else if (viewZ < 500) opacity = 1;
            else opacity = mapRange(viewZ, 500, 1000, 1, 0);

            sec.style.opacity = opacity;

            if (opacity > 0.1) {
                const jitterIntensity = this.zPos > 8000 ? 5 : 1;

                if (Math.random() > 0.90) {
                    const rx = (Math.random() - 0.5) * jitterIntensity;
                    const ry = (Math.random() - 0.5) * jitterIntensity;
                    sec.style.transform = `translate(-50%, -50%) translate3d(${rx}px, ${ry}px, ${secZ}px)`;
                } else {
                    sec.style.transform = `translate(-50%, -50%) translate3d(0, 0, ${secZ}px)`;
                }
            }
        });

        requestAnimationFrame(this.animate.bind(this));
    }

    triggerRandomEvent() {

        const rand = Math.random();
        if (rand < 0.3) {
            window.effectGlitch();
        } else if (rand < 0.6) {
            window.effectNova();
        }
    }
}

function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}


export class Vortex {
    constructor() {
        this.canvas = document.getElementById('vortex-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');

        this.resize();
        this.particles = [];
        this.numParticles = 400;
        this.center = { x: this.width / 2, y: this.height / 2 };
        this.isNova = false;

        this.initParticles();
        this.animate();

        window.addEventListener('resize', this.resize.bind(this));
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.center = { x: this.width / 2, y: this.height / 2 };
    }

    initParticles() {
        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push(new Particle(this.width, this.height));
        }
    }

    triggerNova() {
        this.isNova = true;
        setTimeout(() => { this.isNova = false; }, 800);
    }

    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.particles.forEach(p => {
            p.update(this.center, this.isNova);
            p.draw(this.ctx);
        });

        requestAnimationFrame(this.animate.bind(this));
    }
}

class Particle {
    constructor(w, h) {
        this.reset(w, h);
    }

    reset(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.prevX = this.x;
        this.prevY = this.y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = Math.random() * 100 + 50;
        this.color = Math.random() > 0.5 ? '#0ff' : '#555';
    }

    update(center, isNova) {
        this.prevX = this.x;
        this.prevY = this.y;

        const dx = center.x - this.x;
        const dy = center.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        if (isNova) {
            this.vx -= Math.cos(angle) * 30;
            this.vy -= Math.sin(angle) * 30;
        } else {
            this.vx += Math.cos(angle) * 0.2;
            this.vy += Math.sin(angle) * 0.2;
            this.vx -= Math.sin(angle) * 0.5;
            this.vy += Math.cos(angle) * 0.5;
        }

        this.vx *= 0.96;
        this.vy *= 0.96;

        this.x += this.vx;
        this.y += this.vy;

        this.life--;

        if (dist < 20 || this.life < 0 || Math.abs(this.x - center.x) > window.innerWidth) {
            this.reset(window.innerWidth, window.innerHeight);
        }
    }

    draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.prevX, this.prevY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
    }
}


import { AudioManager } from './audio.js';

let vortexInstance;
let audioInstance;
let audioStarted = false;

document.addEventListener('DOMContentLoaded', () => {
    new TunnelScroll();
    vortexInstance = new Vortex();
    audioInstance = new AudioManager();


    const collapseBtn = document.getElementById('collapseBtn');
    if (collapseBtn) {
        collapseBtn.addEventListener('click', triggerCollapse);
    }


    const startAudio = () => {
        if (!audioStarted && audioInstance) {
            audioInstance.start('main');
            audioStarted = true;
            audioStarted = true;
            window.removeEventListener('click', startAudio);
            window.removeEventListener('wheel', startAudio);
        }
    };

    window.addEventListener('click', startAudio);
    window.addEventListener('wheel', startAudio);
});

window.effectGlitch = () => {
    document.body.classList.add('shake-mode');
    document.body.style.filter = 'hue-rotate(90deg) contrast(200%)';
    setTimeout(() => {
        document.body.classList.remove('shake-mode');
        document.body.style.filter = '';
    }, 500);
};

window.effectNova = () => {
    if (vortexInstance) vortexInstance.triggerNova();
};

function triggerCollapse() {

    if (audioInstance) audioInstance.stop();


    document.body.style.transformOrigin = "center center";
    document.body.style.transform = "scale(0) rotate(720deg)";
    document.body.style.filter = "invert(1) contrast(500%)";
    document.body.style.transition = "all 2.5s cubic-bezier(0.8, 0, 0.2, 1)";


    setTimeout(() => {
        window.location.href = 'contact.html';
    }, 2500);
};
