const canvas = document.getElementById('neuralCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let nodes = [];
const numNodes = 80;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Node {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }
  
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#00f0ff';
    ctx.fill();
  }
}

for (let i = 0; i < numNodes; i++) {
  nodes.push(new Node());
}

let mouseX = -1000;
let mouseY = -1000;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animate() {
  ctx.clearRect(0, 0, width, height);
  
  nodes.forEach(node => {
    node.update();
    node.draw();
    
    // Connect to other nodes
    nodes.forEach(other => {
      const dx = node.x - other.x;
      const dy = node.y - other.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(other.x, other.y);
        ctx.strokeStyle = `rgba(0, 240, 255, ${1 - dist/120})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
    
    // Connect to mouse
    const dxm = node.x - mouseX;
    const dym = node.y - mouseY;
    const distm = Math.sqrt(dxm*dxm + dym*dym);
    if (distm < 150) {
      ctx.beginPath();
      ctx.moveTo(node.x, node.y);
      ctx.lineTo(mouseX, mouseY);
      ctx.strokeStyle = `rgba(138, 43, 226, ${1 - distm/150})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  });
  
  requestAnimationFrame(animate);
}

animate();

// Intersection Observer for scroll animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-up, .card, .repo-card').forEach((el) => {
  el.classList.add('fade-up');
  observer.observe(el);
});
