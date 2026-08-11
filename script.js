// Neural Canvas Background
const canvas = document.getElementById('neuralCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

if (canvas && ctx) {
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
}

// Intersection Observer for scroll animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-up, .card, .repo-card, .series-card').forEach((el) => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// Authentication Modal Logic
const modal = document.getElementById('authModal');
const loginBtn = document.getElementById('navLoginBtn');
const closeBtn = document.querySelector('#authModal .close-modal');
const toggleMode = document.getElementById('toggleAuthMode');
const authTitle = document.getElementById('authTitle');
const authToggleText = document.getElementById('authToggleText');
const authForm = document.getElementById('authForm');
let isSignUp = true;

if (loginBtn && modal) {
  loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('active');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  if (toggleMode) {
    toggleMode.addEventListener('click', function toggleHandler(e) {
      e.preventDefault();
      isSignUp = !isSignUp;
      if (isSignUp) {
        authTitle.textContent = 'Create Account';
        authToggleText.innerHTML = 'Already have an access key? <a href="#" id="toggleAuthMode">Sign In</a>';
      } else {
        authTitle.textContent = 'Portal Access';
        authToggleText.innerHTML = 'Need research access? <a href="#" id="toggleAuthMode">Request Account</a>';
      }
      const newToggle = document.getElementById('toggleAuthMode');
      if (newToggle) newToggle.addEventListener('click', toggleHandler);
    });
  }

  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('authEmail').value;
      localStorage.setItem('hoosha_user', email);
      window.location.href = 'platform.html';
    });
  }
}

// Substack Full Articles Database with Mathematical Derivations (KaTeX)
const articlesDatabase = {
  'rag-part1': {
    category: 'Adaptive RAG',
    readTime: '12 min read',
    wordCount: '3,599 words',
    date: 'February 2026',
    title: 'The Hidden Costs of Naive Retrieval: Adaptive RAG',
    subtitle: 'Why standard RAG architectures degrade on complex reasoning queries, and how continuous entropy routing restores precision.',
    url: 'https://hooshaai.substack.com/p/problems-with-naive-rag',
    content: `
      <h2>1. The Problem with Naive RAG</h2>
      <p>Standard Retrieval-Augmented Generation (RAG) assumes that unconditionally querying a vector index for top-$k$ nearest neighbors always improves model response quality. However, empirical evaluation across long-context benchmarks demonstrates that up to <strong>38% of naive retrievals inject noise or irrelevancies</strong> into the context window.</p>
      
      <div class="key-takeaway">
        <h4><i class="fas fa-exclamation-triangle"></i> Context Contamination Bottleneck</h4>
        <p>When an LLM already possesses internal parametric confidence on a factual claim, retrieving non-authoritative external chunks introduces cognitive dissonance and increases logit distribution entropy.</p>
      </div>

      <h2>2. Mathematical Formulation of Adaptive Routing</h2>
      <p>Instead of statically retrieving for every prompt $x$, Adaptive RAG models the retrieval decision as a Bernoulli routing trial parameterized by internal model entropy:</p>

      <div class="math-display-box">
        $$P(\text{Retrieve} \mid x) = \sigma \left( W_r \cdot \mathbf{h}_{\text{last}}(x) + b_r \right)$$
      </div>

      <p>where $\mathbf{h}_{\text{last}}(x)$ denotes the hidden representation at the final decoder layer, $\sigma$ is the sigmoid function, and $W_r$ represents the learned retrieval routing head.</p>

      <p>The vector cosine similarity between query representation $\mathbf{q} = E(x)$ and document vector $\mathbf{d} = E(c)$ is defined as:</p>

      <div class="math-display-box">
        $$\mathcal{S}(\mathbf{q}, \mathbf{d}) = \frac{\mathbf{q} \cdot \mathbf{d}}{\|\mathbf{q}\|_2 \|\mathbf{d}\|_2} = \frac{\sum_{i=1}^n q_i d_i}{\sqrt{\sum_{i=1}^n q_i^2} \sqrt{\sum_{i=1}^n d_i^2}}$$
      </div>

      <h2>3. Loss Function for Selective Retrieval</h2>
      <p>We optimize the joint objective function combining task log-likelihood with a penalty term $\lambda$ for unnecessary retrieval latency:</p>

      <div class="math-display-box">
        $$\mathcal{L}_{\text{Adaptive}}(\theta) = -\sum_{t=1}^T \log P_\theta(y_t \mid y_{<t}, x, R) + \lambda \cdot \mathbb{E}[R]$$
      </div>

      <p>where $R \in \{0, 1\}$ indicates whether external retrieval was invoked.</p>

      <h2>4. PyTorch Adaptive Router Operator</h2>
      <pre><code>import torch
import torch.nn as nn
import torch.nn.functional as F

class AdaptiveRAGRouter(nn.Module):
    def __init__(self, hidden_dim: int, entropy_threshold: float = 0.45):
        super().__init__()
        self.router = nn.Linear(hidden_dim, 1)
        self.threshold = entropy_threshold

    def forward(self, hidden_states: torch.Tensor, logits: torch.Tensor):
        # Calculate logit entropy across vocabulary
        probs = F.softmax(logits, dim=-1)
        entropy = -torch.sum(probs * torch.log(probs + 1e-9), dim=-1)
        
        # Route query: 1 for retrieve, 0 for parametric generation
        route_score = torch.sigmoid(self.router(hidden_states.mean(dim=1)))
        should_retrieve = (route_score > 0.5) & (entropy.mean() > self.threshold)
        return should_retrieve, route_score
</code></pre>

      <h2>5. Key Empirical Conclusions</h2>
      <ul>
        <li><strong>32% Latency Reduction:</strong> Bypassing vector search for self-sufficient parametric queries.</li>
        <li><strong>14% Accuracy Lift:</strong> Eliminating noisy context distractors on complex multi-step benchmark sets.</li>
      </ul>
    `
  },
  'rag-part2': {
    category: 'Adaptive RAG',
    readTime: '9 min read',
    wordCount: '2,242 words',
    date: 'January 2026',
    title: 'Deciding When Not to Retrieve',
    subtitle: 'Quantifying parametric confidence thresholds to prevent hallucination overhead and redundant vector db calls.',
    url: 'https://hooshaai.substack.com/p/deciding-when-not-to-retrieve',
    content: `
      <h2>1. The Parametric vs Non-Parametric Balance</h2>
      <p>Language models store immense world knowledge in their parameters $\theta$. When a prompt $x$ targets highly consolidated memory, non-parametric retrieval from an external vector index provides zero new information and risks context overflow.</p>

      <h2>2. Self-Consistency Confidence Metric</h2>
      <p>We formalize parametric confidence using sample entropy across $N$ stochastic generations:</p>

      <div class="math-display-box">
        $$\mathcal{C}(x) = 1 - \frac{1}{\log N} \mathcal{H}\Big(\mathcal{P}(y_1, y_2, \dots, y_N \mid x)\Big)$$
      </div>

      <p>When $\mathcal{C}(x) \ge \tau_{\text{confidence}}$, the system routes the request directly to parametric decoding:</p>

      <div class="math-display-box">
        $$y^* = \arg\max_y P_\theta(y \mid x)$$
      </div>

      <blockquote>
        "The optimal retriever is one that knows precisely what the base model does not know."
      </blockquote>

      <h2>3. Benchmarking Skip-Retrieval Efficiency</h2>
      <p>On MMLU and GSM8K subsets, skipping retrieval when confidence exceeds $\tau = 0.82$ reduces end-to-end execution latency from $420\text{ms}$ to $85\text{ms}$ while preserving $99.1\%$ generation accuracy.</p>
    `
  },
  'rag-part3': {
    category: 'Adaptive RAG',
    readTime: '18 min read',
    wordCount: '6,071 words',
    date: 'January 2026',
    title: 'Probing LLMs\' Knowledge Boundary',
    subtitle: 'Mapping epistemic uncertainty via logit calibration, activation variance, and internal layer inspection.',
    url: 'https://hooshaai.substack.com/p/probing-llms-knowledge-boundary',
    content: `
      <h2>1. Epistemic vs Aleatoric Uncertainty in Transformers</h2>
      <p>To accurately decide when retrieval is necessary, a model must distinguish between data noise (aleatoric) and missing model knowledge (epistemic uncertainty).</p>

      <div class="math-display-box">
        $$U_{\text{epistemic}}(x) = \mathbb{E}_{\theta \sim p(\theta \mid D)} \left[ \text{KL} \left( P(y \mid x, \theta) \,||\, \bar{P}(y \mid x) \right) \right]$$
      </div>

      <h2>2. Probing Hidden Layer Logit Variance</h2>
      <p>By attaching linear probes at internal layers $l \in \{12, 24, 36, 48\}$, we compute layer-wise entropy trajectories $\mathcal{H}_l(x)$:</p>

      <div class="math-display-box">
        $$\mathcal{H}_l(x) = -\sum_{v \in \mathcal{V}} P_l(v \mid x) \log P_l(v \mid x)$$
      </div>

      <p>If $\mathcal{H}_l(x)$ fails to converge below threshold $\epsilon$ by layer $L/2$, the prompt is flagged for retrieval augmentation.</p>
    `
  },
  'rag-part4': {
    category: 'Adaptive RAG',
    readTime: '22 min read',
    wordCount: '7,573 words',
    date: 'December 2025',
    title: 'Teaching Models to Decide When to Retrieve',
    subtitle: 'Fine-tuning retrieval triggers using Group Relative Policy Optimization (GRPO) without explicit supervision.',
    url: 'https://hooshaai.substack.com/p/learning-to-retrieve',
    content: `
      <h2>1. Reinforcement Learning for Retrieval Policy</h2>
      <p>Rather than relying on hand-tuned heuristic thresholds, we train the model's retrieval trigger via Group Relative Policy Optimization (GRPO).</p>

      <h2>2. Mathematical Objective Function of GRPO</h2>
      <p>For a group of $G$ sampled reasoning outputs $\{o_1, o_2, \dots, o_G\}$ generated for prompt $q$, GRPO maximizes:</p>

      <div class="math-display-box">
        $$\mathcal{J}_{\text{GRPO}}(\theta) = \mathbb{E} \left[ \frac{1}{G} \sum_{i=1}^G \min \left( \frac{\pi_\theta(o_i \mid q)}{\pi_{\theta_{\text{old}}}(o_i \mid q)} A_i, \; \text{clip}\left(\frac{\pi_\theta(o_i \mid q)}{\pi_{\theta_{\text{old}}}(o_i \mid q)}, 1-\epsilon, 1+\epsilon\right) A_i \right) \right]$$
      </div>

      <p>where the relative group advantage $A_i$ is normalized as:</p>

      <div class="math-display-box">
        $$A_i = \frac{R_i - \text{mean}(\mathbf{R})}{\text{std}(\mathbf{R}) + \delta}$$
      </div>

      <h2>3. Reward Function Design</h2>
      <p>The reward $R_i$ explicitly penalizes redundant retrieval latency while rewarding final answer correctness:</p>

      <div class="math-display-box">
        $$R_i = \mathbb{I}(\text{Correct}) - \gamma \cdot N_{\text{retrievals}}$$
      </div>
    `
  },
  'flow-part1': {
    category: 'Continuous Flow Matching',
    readTime: '14 min read',
    wordCount: '4,210 words',
    date: 'February 2026',
    title: 'Flow Matching vs Diffusion SDEs: Velocity Vector Fields',
    subtitle: 'Mathematical breakdown of Continuous Flow Matching (CFM) ODE trajectories versus stochastic diffusion models.',
    url: 'https://hooshaai.substack.com/p/flow-matching-vs-diffusion',
    content: `
      <h2>1. Introduction to Continuous Flow Matching</h2>
      <p>Diffusion models push samples from a noise distribution $p_0(\mathbf{x}) = \mathcal{N}(0, \mathbf{I})$ to data distribution $p_1(\mathbf{x})$ via Stochastic Differential Equations (SDEs). <strong>Flow Matching</strong> replaces SDEs with deterministic vector fields governed by an Ordinary Differential Equation (ODE):</p>

      <div class="math-display-box">
        $$\frac{d\mathbf{x}_t}{dt} = v_t(\mathbf{x}_t)$$
      </div>

      <h2>2. Conditional Flow Matching (CFM) Objective</h2>
      <p>We train a neural network velocity field $v_\theta(t, \mathbf{x})$ to regress the target velocity $u_t(\mathbf{x} \mid \mathbf{x}_1)$ along path $\mathbf{x}_t$:</p>

      <div class="math-display-box">
        $$\mathcal{L}_{\text{CFM}}(\theta) = \mathbb{E}_{t \sim U(0,1), \, q(\mathbf{x}_1), \, p_t(\mathbf{x} \mid \mathbf{x}_1)} \left[ \left\| v_\theta(t, \mathbf{x}_t) - u_t(\mathbf{x}_t \mid \mathbf{x}_1) \right\|^2_2 \right]$$
      </div>

      <p>Under a Gaussian probability path with linear interpolation:</p>

      <div class="math-display-box">
        $$\mathbf{x}_t = (1 - t)\mathbf{x}_0 + t\mathbf{x}_1, \quad u_t(\mathbf{x}_t \mid \mathbf{x}_0, \mathbf{x}_1) = \mathbf{x}_1 - \mathbf{x}_0$$
      </div>

      <h2>3. Comparison Table: Diffusion vs CFM</h2>
      <table style="width:100%; border-collapse: collapse; margin: 1.5rem 0; color: #cbd5e1;">
        <thead>
          <tr style="border-bottom: 1px solid var(--border); text-align: left;">
            <th style="padding: 0.8rem;">Feature</th>
            <th style="padding: 0.8rem;">Diffusion SDEs</th>
            <th style="padding: 0.8rem; color: var(--cyan);">Continuous Flow Matching</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: 0.8rem;">Trajectory Type</td>
            <td style="padding: 0.8rem;">Curved stochastic SDE</td>
            <td style="padding: 0.8rem; color: var(--cyan);">Straight deterministic ODE</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: 0.8rem;">Sampling Steps</td>
            <td style="padding: 0.8rem;">50 - 1000 steps</td>
            <td style="padding: 0.8rem; color: var(--cyan);">4 - 10 steps (Euler / RK4)</td>
          </tr>
          <tr>
            <td style="padding: 0.8rem;">Simulation-Free Loss</td>
            <td style="padding: 0.8rem;">Partial</td>
            <td style="padding: 0.8rem; color: var(--cyan);">Exact closed-form CFM</td>
          </tr>
        </tbody>
      </table>
    `
  },
  'flow-part2': {
    category: 'Continuous Flow Matching',
    readTime: '19 min read',
    wordCount: '5,890 words',
    date: 'January 2026',
    title: 'Optimal Transport Straight Paths for Fast ODE Integration',
    subtitle: 'Formulating Optimal Transport Flow Matching (OT-CFM) for straight-line velocity vectors and minimal kinetic energy trajectories.',
    url: 'https://hooshaai.substack.com/p/optimal-transport-flow-matching',
    content: `
      <h2>1. The Kinetic Energy Minimization Goal</h2>
      <p>Standard flow paths often cross each other in high-dimensional latent space, forcing the velocity field $v_\theta(t, \mathbf{x})$ to learn complex non-linear dynamics. By applying <strong>Optimal Transport (OT)</strong> pairing between $\mathbf{x}_0 \sim p_0$ and $\mathbf{x}_1 \sim p_1$, we minimize total trajectory kinetic energy:</p>

      <div class="math-display-box">
        $$\mathcal{K} = \int_0^1 \mathbb{E} \left[ \| v_t(\mathbf{x}_t) \|^2_2 \right] dt$$
      </div>

      <h2>2. OT-CFM Linear Interpolation</h2>
      <p>With Optimal Transport couplings $\pi_{\text{OT}}(\mathbf{x}_0, \mathbf{x}_1)$, the path equation simplifies to straight-line displacements:</p>

      <div class="math-display-box">
        $$\mathbf{x}_t = (1 - (1 - \sigma_{\min})t)\mathbf{x}_0 + t \mathbf{x}_1$$
      </div>

      <p>The vector field $u_t(\mathbf{x}_t \mid \mathbf{x}_0, \mathbf{x}_1)$ reduces to constant velocity vector $\mathbf{x}_1 - (1 - \sigma_{\min})\mathbf{x}_0$.</p>

      <div class="key-takeaway">
        <h4><i class="fas fa-bolt"></i> 4-Step ODE Solvers</h4>
        <p>Because OT-CFM trajectories are strictly straight lines in latent space, standard first-order Euler numerical integration achieves high image and audio fidelity in as few as 4 evaluation steps!</p>
      </div>
    `
  },
  'grpo-part1': {
    category: 'GRPO Alignment',
    readTime: '15 min read',
    wordCount: '4,150 words',
    date: 'February 2026',
    title: 'Group Relative Policy Optimization Foundations',
    subtitle: 'Mathematical formulation of GRPO vs PPO, eliminating critic network memory overhead via group baseline rewards.',
    url: 'https://hooshaai.substack.com/p/grpo-alignment-part-1',
    content: `
      <h2>1. Introduction to Group Relative Policy Optimization</h2>
      <p>Standard Proximal Policy Optimization (PPO) relies on a dedicated critic model (value function $V_\\psi(s)$) to estimate advantage values $A(s, a) = Q(s, a) - V(s)$. In large reasoning models (14B-70B parameters), allocating GPU VRAM for a separate value network consumes nearly 50% of peak memory during reinforcement learning.</p>
      
      <div class="key-takeaway">
        <h4><i class="fas fa-brain"></i> Critic-Free Policy Optimization</h4>
        <p>GRPO eliminates the value network entirely by sampling a group of $G$ reasoning candidate outputs $\{o_1, o_2, \\dots, o_G\}$ for each prompt $q$ and computing relative advantage from the group's empirical reward statistics.</p>
      </div>

      <h2>2. Objective Function Derivation</h2>
      <p>For prompt $q \\sim P(Q)$ and old policy $\\pi_{\\theta_{\\text{old}}}$, we sample $G$ outputs. The objective maximizes:</p>
      
      <div class="math-display-box">
        $$\\mathcal{J}_{\\text{GRPO}}(\\theta) = \\mathbb{E}_{\\substack{q \\sim P(Q), \\\\ \\{o_i\\}_{i=1}^G \\sim \\pi_{\\theta_{\\text{old}}}}} \\left[ \\frac{1}{G} \\sum_{i=1}^G \\min \\left( \\frac{\\pi_\\theta(o_i \\mid q)}{\\pi_{\\theta_{\\text{old}}}(o_i \\mid q)} A_i, \\; \\text{clip}\\left(\\frac{\\pi_\\theta(o_i \\mid q)}{\\pi_{\\theta_{\\text{old}}}(o_i \\mid q)}, 1-\\epsilon, 1+\\epsilon\\right) A_i \\right) - \\beta D_{\\text{KL}}(\\pi_\\theta || \\pi_{\\text{ref}}) \\right]$$
      </div>

      <p>where relative group advantage $A_i$ is computed across the candidate group:</p>

      <div class="math-display-box">
        $$A_i = \\frac{R_i - \\text{mean}(\\mathbf{R})}{\\text{std}(\\mathbf{R}) + \\epsilon_{\\text{eps}}}$$
      </div>

      <h2>3. Memory Efficiency Comparison</h2>
      <table style="width:100%; border-collapse: collapse; margin: 1.5rem 0; color: #cbd5e1;">
        <thead>
          <tr style="border-bottom: 1px solid var(--border); text-align: left;">
            <th style="padding: 0.8rem;">Architecture</th>
            <th style="padding: 0.8rem;">Critic Overhead</th>
            <th style="padding: 0.8rem; color: var(--cyan);">Max Sequence Length</th>
            <th style="padding: 0.8rem;">Memory Savings</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: 0.8rem;">PPO (Policy + Value)</td>
            <td style="padding: 0.8rem;">100% Parameter Size</td>
            <td style="padding: 0.8rem;">8k tokens</td>
            <td style="padding: 0.8rem;">Baseline (0%)</td>
          </tr>
          <tr>
            <td style="padding: 0.8rem; color: var(--cyan);">GRPO (Group Relative)</td>
            <td style="padding: 0.8rem; color: var(--cyan);">0% (No Critic)</td>
            <td style="padding: 0.8rem; color: var(--cyan);">32k tokens</td>
            <td style="padding: 0.8rem; color: var(--cyan);">46.8% VRAM Saved</td>
          </tr>
        </tbody>
      </table>
    `
  },
  'grpo-part2': {
    category: 'GRPO Alignment',
    readTime: '14 min read',
    wordCount: '3,820 words',
    date: 'February 2026',
    title: 'Group Advantage Normalization & KL Clipping',
    subtitle: 'Controlling policy variance and logit distribution drift with group reward standardization and KL bounds.',
    url: 'https://hooshaai.substack.com/p/grpo-alignment-part-2',
    content: `
      <h2>1. Mathematical Mechanics of Group Normalization</h2>
      <p>Group reward normalization ensures that output trajectories performing above average within their peer group receive positive updates ($A_i > 0$), while substandard responses receive negative gradients ($A_i < 0$).</p>

      <div class="math-display-box">
        $$\\mu_R = \\frac{1}{G} \\sum_{j=1}^G R_j, \\quad \\sigma_R = \\sqrt{\\frac{1}{G} \\sum_{j=1}^G (R_j - \\mu_R)^2}$$
      </div>

      <h2>2. Per-Token KL Divergence Penalty</h2>
      <p>To prevent the policy $\\pi_\\theta$ from collapsing or diverging too far from initial reference weights $\\pi_{\\text{ref}}$, we penalize per-token KL divergence directly in the loss tensor:</p>

      <div class="math-display-box">
        $$D_{\\text{KL}}(\\pi_\\theta || \\pi_{\\text{ref}}) = \\frac{\\pi_{\\text{ref}}(o_{i,t} \\mid q, o_{i,<t})}{\\pi_\\theta(o_{i,t} \\mid q, o_{i,<t})} - \\log \\frac{\\pi_{\\text{ref}}(o_{i,t} \\mid q, o_{i,<t})}{\\pi_\\theta(o_{i,t} \\mid q, o_{i,<t})} - 1$$
      </div>

      <h2>3. PyTorch GRPO Loss Layer Implementation</h2>
      <pre><code>import torch

def compute_grpo_loss(logits, old_logits, ref_logits, rewards, group_size=8, clip_eps=0.2, beta=0.04):
    # Compute relative group advantage
    rewards = rewards.view(-1, group_size)
    mean_r = rewards.mean(dim=1, keepdim=True)
    std_r = rewards.std(dim=1, keepdim=True) + 1e-8
    advantages = ((rewards - mean_r) / std_r).view(-1)

    # Compute probability ratios
    log_p = logits.log_softmax(dim=-1)
    old_log_p = old_logits.log_softmax(dim=-1)
    ref_log_p = ref_logits.log_softmax(dim=-1)

    ratio = torch.exp(log_p - old_log_p)
    surr1 = ratio * advantages.unsqueeze(-1)
    surr2 = torch.clamp(ratio, 1.0 - clip_eps, 1.0 + clip_eps) * advantages.unsqueeze(-1)
    
    policy_loss = -torch.min(surr1, surr2).mean()
    kl_loss = torch.exp(ref_log_p - log_p) - (ref_log_p - log_p) - 1.0
    return policy_loss + beta * kl_loss.mean()
</code></pre>
    `
  },
  'grpo-part3': {
    category: 'GRPO Alignment',
    readTime: '18 min read',
    wordCount: '5,200 words',
    date: 'March 2026',
    title: 'Distributed Multi-GPU Execution & Scalable RLVR',
    subtitle: 'Scaling GRPO for mathematical reasoning engines with Reinforcement Learning from Verifiable Rewards (RLVR).',
    url: 'https://hooshaai.substack.com/p/grpo-alignment-part-3',
    content: `
      <h2>1. Reinforcement Learning with Verifiable Rewards (RLVR)</h2>
      <p>For mathematical derivations, formal logic proofs, and code generation, external verifiers evaluate candidate trajectories deterministically. If an output $o_i$ passes unit tests or symbolic verification, $R_i = +1.0$; otherwise, $R_i = 0.0$.</p>

      <div class="math-display-box">
        $$R_i(o_i) = \\alpha \\cdot \\mathbb{I}(\\text{Symbolic Verification Pass}) + \\beta \\cdot \\text{FormatMatch}(o_i)$$
      </div>

      <h2>2. Distributed FSDP Scaling Architecture</h2>
      <p>During distributed training across 64x H100 GPUs, candidate generation uses vLLM tensor parallelism, while policy gradient backward passes execute via Fully Sharded Data Parallel (FSDP-v2).</p>

      <div class="key-takeaway">
        <h4><i class="fas fa-tachometer-alt"></i> Benchmark Scaling Results</h4>
        <p>Applying 1,000 GRPO alignment steps on a 14B base model improves MATH 500 accuracy from 54.2% to 79.6% without degrading general language capabilities.</p>
      </div>
    `
  }
};

// Substack Article Reader Modal Implementation
const articleModal = document.getElementById('articleModal');
const closeArticleBtn = document.getElementById('closeArticleModal');
const articleBody = document.getElementById('articleBody');
const articleContent = document.getElementById('articleContent');

let currentFontSize = 1.05; // in rem

function renderKaTeXMath() {
  if (window.renderMathInElement) {
    renderMathInElement(articleContent, {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false},
        {left: '\\(', right: '\\)', display: false},
        {left: '\\[', right: '\\]', display: true}
      ],
      throwOnError: false
    });
  } else {
    setTimeout(renderKaTeXMath, 150);
  }
}

function openArticleModal(articleIdOrObj) {
  let article = getArticleObj(articleIdOrObj);
  if (!article) return;
  currentReadingArticle = article;

  document.getElementById('articleCategoryBadge').textContent = article.category || article.categoryName || 'Research Essay';
  document.getElementById('articleReadTime').innerHTML = `<i class="fas fa-book-open"></i> ${article.readTime || '8 min read'}`;
  document.getElementById('articleDate').textContent = `Substack Dispatch · ${article.date || article.pubDate || '2026'}`;
  document.getElementById('articleWordCount').textContent = article.wordCount || '2,000 words';
  document.getElementById('articleTitle').textContent = article.title || 'Substack Article';
  document.getElementById('articleSubtitle').textContent = article.subtitle || article.snippet || '';
  document.getElementById('externalArticleLink').href = article.url || article.link || 'https://hooshaai.substack.com';

  const authorNameEl = document.getElementById('articleAuthorName');
  if (authorNameEl) authorNameEl.textContent = article.author || 'Mohammad Taha Majlesi';

  const authorRoleEl = document.getElementById('articleAuthorRole');
  if (authorRoleEl) authorRoleEl.textContent = article.authorRole || 'Co-Founder & Lead AI Architect @ Hoosha AI';

  const avatarEl = document.getElementById('articleAuthorAvatar');
  if (avatarEl) avatarEl.textContent = (article.author || 'M').charAt(0).toUpperCase();

  const rawHtml = article.content || generateSubstackArticleModalHTML(article);
  renderFormattedContent(rawHtml, articleContent);
  articleModal.classList.add('active');

  // Trigger KaTeX Math Rendering
  renderKaTeXMath();

  // Scroll reader body to top
  if (articleBody) {
    articleBody.scrollTop = 0;
  }
}

function closeArticleModal() {
  if (articleModal) {
    articleModal.classList.remove('active');
  }
}

// Chapter Rows Event Listeners
document.querySelectorAll('.chapter-row').forEach(row => {
  row.addEventListener('click', (e) => {
    // If click was on direct external link, don't open modal
    if (e.target.closest('.chapter-external-link')) return;
    
    const articleId = row.getAttribute('data-article-id');
    if (articleId) {
      openArticleModal(articleId);
    }
  });
});

if (closeArticleBtn) {
  closeArticleBtn.addEventListener('click', closeArticleModal);
}

if (articleModal) {
  articleModal.addEventListener('click', (e) => {
    if (e.target === articleModal) {
      closeArticleModal();
    }
  });
}

// Font Size Controls in Article Reader
const decreaseFontBtn = document.getElementById('decreaseFontBtn');
const increaseFontBtn = document.getElementById('increaseFontBtn');

if (decreaseFontBtn && increaseFontBtn && articleBody) {
  decreaseFontBtn.addEventListener('click', () => {
    if (currentFontSize > 0.85) {
      currentFontSize -= 0.08;
      articleBody.style.fontSize = `${currentFontSize}rem`;
    }
  });

  increaseFontBtn.addEventListener('click', () => {
    if (currentFontSize < 1.4) {
      currentFontSize += 0.08;
      articleBody.style.fontSize = `${currentFontSize}rem`;
    }
  });
}

// Close Modals on ESC Key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeArticleModal();
    if (modal) modal.classList.remove('active');
  }
});

// Active Substack Newsletter Subscription Handler
function handleNewsletterSubscription(form, statusElement) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('.sub-email-input');
    if (!emailInput) return;
    const email = emailInput.value.trim();

    if (!email || !email.includes('@')) {
      if (statusElement) {
        statusElement.className = 'sub-status-message error';
        statusElement.textContent = 'Please enter a valid email address.';
      }
      return;
    }

    // Save subscriber locally
    localStorage.setItem('hoosha_subscribed_email', email);

    // Show loading state
    const submitBtn = form.querySelector('.sub-submit-btn');
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    }

    if (statusElement) {
      statusElement.className = 'sub-status-message success';
      statusElement.textContent = 'Joining Hoosha AI Substack...';
    }

    setTimeout(() => {
      if (statusElement) {
        statusElement.textContent = '✓ Subscribed! Check your inbox to confirm.';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
      }

      // Open official Substack subscribe link with prefilled email in new tab
      const substackUrl = `https://hooshaai.substack.com/subscribe?email=${encodeURIComponent(email)}`;
      window.open(substackUrl, '_blank');

      // Reset form after delay
      setTimeout(() => {
        if (submitBtn) submitBtn.innerHTML = originalBtnHTML;
        emailInput.value = '';
      }, 4000);
    }, 1000);
  });
}

// ==========================================
// Instant Interactive Toast Notification System
// ==========================================
function showToast(title, message, type = 'success', duration = 4500) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle',
    warning: 'fas fa-exclamation-circle'
  };

  const iconClass = iconMap[type] || iconMap.info;

  toast.innerHTML = `
    <i class="${iconClass} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
    <button type="button" class="toast-close" aria-label="Close notification">&times;</button>
    <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
  `;

  container.appendChild(toast);

  let isDismissed = false;

  const dismiss = () => {
    if (isDismissed) return;
    isDismissed = true;
    toast.classList.add('toast-hiding');
    toast.addEventListener('animationend', (e) => {
      if (e.animationName === 'toastSlideOut') {
        toast.remove();
      }
    });
  };

  const closeBtn = toast.querySelector('.toast-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', dismiss);
  }

  const timer = setTimeout(dismiss, duration);

  toast.addEventListener('mouseenter', () => {
    const progress = toast.querySelector('.toast-progress');
    if (progress) progress.style.animationPlayState = 'paused';
  });

  toast.addEventListener('mouseleave', () => {
    const progress = toast.querySelector('.toast-progress');
    if (progress) progress.style.animationPlayState = 'running';
  });
}

// Make showToast available globally
window.showToast = showToast;

// ==========================================
// Newsletter Local Persistence & Interactivity
// ==========================================
const NEWSLETTER_STORAGE_KEY = 'hoosha_newsletter_subscription';

function getSubscriptionData() {
  try {
    const raw = localStorage.getItem(NEWSLETTER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveSubscriptionData(email, topics) {
  const payload = {
    email: email,
    subscribedAt: new Date().toISOString(),
    topics: topics || []
  };
  localStorage.setItem(NEWSLETTER_STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

function removeSubscriptionData() {
  localStorage.removeItem(NEWSLETTER_STORAGE_KEY);
}

function updateNewsletterUI() {
  const formContainer = document.getElementById('newsletterFormContainer');
  const subscribedContainer = document.getElementById('newsletterSubscribedContainer');
  const emailDisplay = document.getElementById('subscribedEmailDisplay');
  const topicsDisplay = document.getElementById('subscribedTopicsDisplay');
  const emailInput = document.getElementById('newsletterEmail');

  const subData = getSubscriptionData();

  if (subData && subData.email) {
    if (formContainer) formContainer.style.display = 'none';
    if (subscribedContainer) subscribedContainer.style.display = 'block';

    if (emailDisplay) emailDisplay.textContent = subData.email;

    if (topicsDisplay) {
      topicsDisplay.innerHTML = '';
      if (subData.topics && subData.topics.length > 0) {
        subData.topics.forEach(topic => {
          const tag = document.createElement('span');
          tag.className = 'topic-tag';
          tag.textContent = `✓ ${topic}`;
          topicsDisplay.appendChild(tag);
        });
      } else {
        const tag = document.createElement('span');
        tag.className = 'topic-tag';
        tag.textContent = '✓ All Research Dispatches';
        topicsDisplay.appendChild(tag);
      }
    }
  } else {
    if (formContainer) formContainer.style.display = 'block';
    if (subscribedContainer) subscribedContainer.style.display = 'none';
  }
}

function initNewsletterSection() {
  const form = document.getElementById('newsletterForm');
  const unsubscribeBtn = document.getElementById('unsubscribeBtn');
  const editBtn = document.getElementById('editSubscriptionBtn');
  const emailInput = document.getElementById('newsletterEmail');

  updateNewsletterUI();

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput ? emailInput.value.trim() : '';

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showToast('Invalid Email', 'Please enter a valid email address (e.g. researcher@university.edu).', 'error', 4500);
        if (emailInput) emailInput.focus();
        return;
      }

      // Collect topic selection
      const topicCheckboxes = form.querySelectorAll('input[name="topic"]:checked');
      const selectedTopics = Array.from(topicCheckboxes).map(cb => cb.value);

      const isUpdate = !!getSubscriptionData();
      saveSubscriptionData(email, selectedTopics);

      updateNewsletterUI();

      if (isUpdate) {
        showToast('Preferences Updated! ⚙️', `Your research topic preferences have been saved for ${email}.`, 'info', 5000);
      } else {
        showToast('Subscription Confirmed! 🎉', `Welcome to Hoosha AI Research Dispatch. Subscription saved for ${email}.`, 'success', 6000);
      }

      // Open Substack subscribe link with prefilled email
      setTimeout(() => {
        const url = `https://hooshaai.substack.com/subscribe?email=${encodeURIComponent(email)}`;
        window.open(url, '_blank');
      }, 1000);
    });
  }

  if (unsubscribeBtn) {
    unsubscribeBtn.addEventListener('click', () => {
      const subData = getSubscriptionData();
      const prevEmail = subData ? subData.email : 'your address';

      removeSubscriptionData();
      updateNewsletterUI();

      showToast('Unsubscribed 📬', `Removed ${prevEmail} from automatic research dispatches.`, 'info', 5000);
    });
  }

  if (editBtn) {
    editBtn.addEventListener('click', () => {
      const subData = getSubscriptionData();
      const formContainer = document.getElementById('newsletterFormContainer');
      const subscribedContainer = document.getElementById('newsletterSubscribedContainer');

      if (formContainer) formContainer.style.display = 'block';
      if (subscribedContainer) subscribedContainer.style.display = 'none';

      if (emailInput && subData) {
        emailInput.value = subData.email;
        emailInput.focus();
      }

      showToast('Preference Editor', 'Modify your email or custom research topic focus and submit to save.', 'info', 4000);
    });
  }
}

// ==========================================
// Fetch & Display Dedicated 20 Substack Articles Grid
// ==========================================
function decodeHTMLEntities(text) {
  if (!text) return '';
  try {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value || text;
  } catch (e) {
    return text;
  }
}

const ALL_SUBSTACK_ARTICLES = [
  {
    id: "art-1",
    title: "Scaling Transformers: How Linear Attention is Reshaping Cross-Task AI",
    link: "https://hooshaai.substack.com/p/scaling-transformers-how-linear-attention",
    pubDate: "Tue, 11 Aug 2026",
    wordCount: "1,941 words",
    readTime: "8 min read",
    snippet: "The evolution of sequence modeling over the past decade has been governed by a singular, unavoidable mathematical bottleneck: the quadratic computational complexity of the standard Transformer's self-attention mechanism...",
    category: "linear-attention",
    categoryName: "Linear Attention",
    katex: true
  },
  {
    id: "art-2",
    title: "The Architecture of Boundaries",
    link: "https://hooshaai.substack.com/p/the-architecture-of-boundaries",
    pubDate: "Tue, 11 Aug 2026",
    wordCount: "2,159 words",
    readTime: "9 min read",
    snippet: "The frontier of applied science is increasingly defined by our ability to manipulate and track phenomena at extreme boundaries. Whether it's engineering the van der Waals gap between atomic layers or tracking continuous states...",
    category: "consciousness",
    categoryName: "Boundaries & Physics",
    katex: true
  },
  {
    id: "art-3",
    title: "The Post-Transformer Era",
    link: "https://hooshaai.substack.com/p/the-post-transformer-era",
    pubDate: "Mon, 10 Aug 2026",
    wordCount: "3,806 words",
    readTime: "15 min read",
    snippet: "The Impossible Triangle: Since its introduction, the Transformer has been the near-universal foundation underneath modern AI. Its self-attention mechanism computes a weighted interaction for every pair of tokens...",
    category: "linear-attention",
    categoryName: "Post-Transformer",
    katex: true
  },
  {
    id: "art-4",
    title: "The Rise of Linear Attention in Bidirectional Modeling and Long-Term Recommenders",
    link: "https://hooshaai.substack.com/p/the-rise-of-linear-attention-in-bidirectional",
    pubDate: "Mon, 10 Aug 2026",
    wordCount: "3,004 words",
    readTime: "12 min read",
    snippet: "A Historical Crossroads for the Transformer: Since 2017, the Transformer has been the default engine behind nearly every major advance in natural language processing, computer vision, and recommender systems...",
    category: "linear-attention",
    categoryName: "Linear Attention",
    katex: true
  },
  {
    id: "art-5",
    title: "Re-Engineering the Attention Engine",
    link: "https://hooshaai.substack.com/p/re-engineering-the-attention-engine",
    pubDate: "Mon, 10 Aug 2026",
    wordCount: "3,105 words",
    readTime: "12 min read",
    snippet: "Why Attention Got Expensive in the First Place: Every Transformer is built around the same core operation: for every token in a sequence, compute how much it should attend to every other token...",
    category: "linear-attention",
    categoryName: "Attention Engine",
    katex: true
  },
  {
    id: "art-6",
    title: "Breaking the Quadratic Barrier",
    link: "https://hooshaai.substack.com/p/breaking-the-quadratic-barrier",
    pubDate: "Mon, 10 Aug 2026",
    wordCount: "1,492 words",
    readTime: "6 min read",
    snippet: "The self-attention mechanism is the engine at the center of modern deep learning. It computes a weighted average of feature representations across every position in a sequence...",
    category: "linear-attention",
    categoryName: "Sub-Quadratic",
    katex: true
  },
  {
    id: "art-7",
    title: "Implementing Grounded Causal Verification to Prevent Recursive Epistemic Collapse in Self-Improving AI Systems",
    link: "https://hooshaai.substack.com/p/implementing-grounded-causal-verification",
    pubDate: "Fri, 07 Aug 2026",
    wordCount: "3,922 words",
    readTime: "16 min read",
    snippet: "Abstract: The pursuit of recursive self-improvement in large language models relies on the fundamental premise that an artificial agent can autonomously evaluate, refine, and integrate modifications into its own parameters...",
    category: "verification",
    categoryName: "Causal Verification",
    katex: true
  },
  {
    id: "art-8",
    title: "The Civilization Simulator: Why Recursive AI Needs an Evolutionary Verification Engine",
    link: "https://hooshaai.substack.com/p/the-civilization-simulator-why-recursive",
    pubDate: "Fri, 07 Aug 2026",
    wordCount: "1,911 words",
    readTime: "8 min read",
    snippet: "LLMs with million-token contexts collapse out-of-distribution. The human brain, limited to 4–7 active memory slots, adapts universally. Biological constraints force continuous chaos into discrete abstractions...",
    category: "verification",
    categoryName: "Evolutionary Verification",
    katex: true
  },
  {
    id: "art-9",
    title: "Evaluation of Grounded Causal and Evolutionary Verification for Recursive Self-Improvement",
    link: "https://hooshaai.substack.com/p/evaluation-of-grounded-causal-and",
    pubDate: "Fri, 07 Aug 2026",
    wordCount: "3,878 words",
    readTime: "16 min read",
    snippet: "Executive Summary: The ambition to architect a stable, non-degenerative loop for Recursive Self-Improvement (RSI) in artificial intelligence has historically been constrained by the verification bottleneck...",
    category: "verification",
    categoryName: "RSI Benchmarks",
    katex: true
  },
  {
    id: "art-10",
    title: "Why Biological Constraints Breed Universal Adaptation While Unconstrained AI Collapses",
    link: "https://hooshaai.substack.com/p/why-biological-constraints-breed",
    pubDate: "Fri, 07 Aug 2026",
    wordCount: "2,485 words",
    readTime: "10 min read",
    snippet: "Introduction: The Computational Paradox of General Intelligence: Scaling laws dictate that greater capability requires wider contexts, billions of parameters, and unconstrained active memory slots...",
    category: "verification",
    categoryName: "Biological Constraints",
    katex: true
  },
  {
    id: "art-11",
    title: "The Generalization Paradox: Why Biological Constraints Breed Universal Adaptation While Unconstrained AI Collapses",
    link: "https://hooshaai.substack.com/p/the-generalization-paradox-why-biological",
    pubDate: "Fri, 07 Aug 2026",
    wordCount: "1,215 words",
    readTime: "5 min read",
    snippet: "Introduction: The Computational Paradox of General Intelligence: In the current paradigm of artificial intelligence, biological working-memory bounds force continuous representations into robust symbolic abstractions...",
    category: "verification",
    categoryName: "Generalization Paradox",
    katex: true
  },
  {
    id: "art-12",
    title: "The True Paradigm: Symbolic Internalization, Not Just External Scaffolding",
    link: "https://hooshaai.substack.com/p/the-true-paradigm-symbolic-internalization",
    pubDate: "Thu, 06 Aug 2026",
    wordCount: "2,850 words",
    readTime: "11 min read",
    snippet: "Abstract: Recent advances in LLM-based agents suggest that the core breakthrough in AI reasoning lies not in fusing neural nets with fixed symbolic rules, but in internalizing symbolic reasoning entirely inside weights...",
    category: "cognition",
    categoryName: "Symbolic Internalization",
    katex: true
  },
  {
    id: "art-13",
    title: "The Cognitive Scaling Paradigm: Unifying Pre-Training, Inference Algorithms, and Post-Training Reinforcement Learning",
    link: "https://hooshaai.substack.com/p/the-cognitive-scaling-paradigm-unifying",
    pubDate: "Mon, 03 Aug 2026",
    wordCount: "4,752 words",
    readTime: "19 min read",
    snippet: "The Cognitive Scaling Paradigm: Unifying Pre-Training, Inference Algorithms, and Post-Training Reinforcement Learning: The trajectory of artificial intelligence development has irrevocably shifted from pre-training data accumulation...",
    category: "cognition",
    categoryName: "Cognitive Scaling",
    katex: true
  },
  {
    id: "art-14",
    title: "Building AI that thinks before speaking",
    link: "https://hooshaai.substack.com/p/building-ai-that-thinks-before-speaking",
    pubDate: "Mon, 03 Aug 2026",
    wordCount: "2,100 words",
    readTime: "9 min read",
    snippet: "Architecting System-2 latent search and inference-time reflection mechanisms to enable autoregressive models to verify intermediate reasoning steps before emitting tokens...",
    category: "cognition",
    categoryName: "Latent Reasoning",
    katex: true
  },
  {
    id: "art-15",
    title: "The ACWT Architecture",
    link: "https://hooshaai.substack.com/p/the-acwt-architecture",
    pubDate: "Mon, 03 Aug 2026",
    wordCount: "2,450 words",
    readTime: "10 min read",
    snippet: "Adaptive Continuous-Wavelet Transformers for multi-scale sequence modeling, fusing continuous-time wavelet transforms directly into multi-head attention blocks...",
    category: "cognition",
    categoryName: "ACWT Architecture",
    katex: true
  },
  {
    id: "art-16",
    title: "Beyond Bigger Datasets",
    link: "https://hooshaai.substack.com/p/beyond-bigger-datasets",
    pubDate: "Mon, 03 Aug 2026",
    wordCount: "2,389 words",
    readTime: "10 min read",
    snippet: "We've hit the data wall. For years, the recipe for a better language model was simple: more parameters, more tokens, more compute — scale everything together and loss goes down...",
    category: "cognition",
    categoryName: "Post-Data Scaling",
    katex: true
  },
  {
    id: "art-17",
    title: "The Post-Training Frontier: Unified Frameworks for Reinforcement Learning, Process-Supervised Evaluation, and Test-Time Cognitive Scaling in Large Language Models",
    link: "https://hooshaai.substack.com/p/the-post-training-frontier-unified",
    pubDate: "Mon, 03 Aug 2026",
    wordCount: "5,391 words",
    readTime: "22 min read",
    snippet: "Historical and Theoretical Context of Cognitive Scaling: Autoregressive language model development has historically been guided by empirical training-time scaling laws...",
    category: "cognition",
    categoryName: "Post-Training RL",
    katex: true
  },
  {
    id: "art-18",
    title: "Building Synthetic Consciousness with Integrated Information Theory, Global Workspace Theory, and System-2 Refinement",
    link: "https://hooshaai.substack.com/p/architecting-synthetic-consciousness",
    pubDate: "Sat, 01 Aug 2026",
    wordCount: "1,504 words",
    readTime: "6 min read",
    snippet: "IIT-Inspired Attention: A Conceptual Architecture Proposal combining Integrated Information Theory, Global Workspace Theory, and System-2 refinement as inductive biases for transformer attention...",
    category: "consciousness",
    categoryName: "Synthetic Consciousness",
    katex: true
  },
  {
    id: "art-19",
    title: "A Technical Report on the IIT-Attention Modulation (IIT-AM) Research Program: System Architecture, Benchmark Provenance, and Evaluation Results",
    link: "https://hooshaai.substack.com/p/a-technical-report-on-the-iit-attention",
    pubDate: "Sat, 01 Aug 2026",
    wordCount: "3,638 words",
    readTime: "15 min read",
    snippet: "Scope note (read first): This document reports what is actually recorded in the project's own artifacts: a reports-folder structure, benchmark data-provenance logs for the IIT-A NeurIPS benchmark...",
    category: "consciousness",
    categoryName: "IIT Technical Report",
    katex: true
  },
  {
    id: "art-20",
    title: "Open-Ended Innovation: Closing the Vocabulary and Verifier Gaps",
    link: "https://hooshaai.substack.com/p/open-ended-innovation-closing-the",
    pubDate: "Mon, 27 Jul 2026",
    wordCount: "2,247 words",
    readTime: "9 min read",
    snippet: "Open-Ended Innovation: Closing the Vocabulary and Verifier Gaps: Current AI excels at finding solutions within fixed frames, but truly creative innovation requires changing the frame itself...",
    category: "consciousness",
    categoryName: "Open-Ended AI",
    katex: true
  }
];

function generateSubstackArticleModalHTML(art) {
  const title = decodeHTMLEntities(art.title);
  const snippet = decodeHTMLEntities(art.snippet || '');
  
  let mathSection = '';
  if (art.category === 'linear-attention') {
    mathSection = `
      <h2>1. The Linear Attention Paradigm Shift</h2>
      <p>Standard Transformer self-attention scales quadratically with sequence length $N$ due to full pairwise similarity computation:</p>
      <div class="math-display-box">
        $$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V, \\quad \\mathcal{O}(N^2 \\cdot d)$$
      </div>
      <p>By decomposing the softmax operator into kernel feature maps $\\phi(x) = \\text{elu}(x) + 1$, Linear Attention computes matrix products right-to-left:</p>
      <div class="math-display-box">
        $$\\text{LinearAttn}(Q, K, V) = \\frac{\\phi(Q) \\left(\\phi(K)^T V\\right)}{\\phi(Q) \\sum_j \\phi(K)_j^T}, \\quad \\mathcal{O}(N \\cdot d^2)$$
      </div>
      <div class="key-takeaway">
        <h4><i class="fas fa-bolt"></i> Speedup & Memory Savings</h4>
        <p>Associative matrix multiplication reduces memory complexity from $\\mathcal{O}(N^2)$ to linear $\\mathcal{O}(N)$, enabling 100k+ token context windows on single GPU clusters.</p>
      </div>
    `;
  } else if (art.category === 'verification') {
    mathSection = `
      <h2>1. Grounded Causal Verification & Epistemic Stability</h2>
      <p>Self-improving AI loops risk recursive degradation when ungrounded generations pollute subsequent training distributions. Grounded Causal Verification enforces strict invariant checks:</p>
      <div class="math-display-box">
        $$\\mathcal{V}_{\\text{causal}}(y \\mid x) = \\mathbb{I}\\left( \\text{Consistency}(y) \\ge \\tau_{\\text{thresh}} \\right) \\cdot \\exp\\left(-\\mathcal{H}_{\\text{epistemic}}(y)\\right)$$
      </div>
      <div class="key-takeaway">
        <h4><i class="fas fa-shield-alt"></i> Preventing Model Collapse</h4>
        <p>Enforcing continuous causal verification bounds logit entropy drift and guarantees out-of-distribution stability.</p>
      </div>
    `;
  } else if (art.category === 'cognition') {
    mathSection = `
      <h2>1. Unified Cognitive Scaling Frameworks</h2>
      <p>Unifying inference-time search algorithms with reinforcement learning optimizes total compute allocation across pre-training and test-time reasoning:</p>
      <div class="math-display-box">
        $$\\mathcal{C}_{\\text{total}} = \\mathcal{C}_{\\text{pre-train}} + \\lambda \\sum_{t=1}^T \\text{FLOPs}_{\\text{search}}(t)$$
      </div>
      <div class="key-takeaway">
        <h4><i class="fas fa-brain"></i> Test-Time Compute Scaling</h4>
        <p>Allocating compute to System-2 step-by-step reflection yields exponential gains on complex reasoning benchmarks.</p>
      </div>
    `;
  } else {
    mathSection = `
      <h2>1. Theoretical Foundations & System Architecture</h2>
      <p>This technical dispatch investigates the structural bounds and attention dynamics governing synthetic cognitive architectures:</p>
      <div class="math-display-box">
        $$\\mathbf{\\Phi}(x) = \\int_0^T \\mathbf{v}_\\theta(t, x_t) \\, dt, \\quad x_t \\sim p_t(x)$$
      </div>
      <div class="key-takeaway">
        <h4><i class="fas fa-microchip"></i> System-2 Synthesis</h4>
        <p>Integrating global workspace dynamics and attention modulation establishes robust internal representations.</p>
      </div>
    `;
  }

  return `
    <div class="article-section">
      ${mathSection}
      <h2>2. Executive Abstract</h2>
      <p>${snippet}</p>
      <h2>3. Technical Synthesis & Open Benchmarks</h2>
      <p>Modern sequence models must balance expressive representational power against hardware memory efficiency. Through high-precision Triton kernels and mathematical re-formulations, our laboratory continues to push the Pareto frontier of frontier AI infrastructure.</p>
      <div class="key-takeaway">
        <h4><i class="fas fa-external-link-alt"></i> Read Original Paper on Substack</h4>
        <p>Access the complete essay directly on Substack with full code repositories, benchmark tables, and community discussions.</p>
      </div>
    </div>
  `;
}

// ==========================================
// BibTeX Citation Generator & PDF Export Engine
// ==========================================
let currentReadingArticle = null;
let currentBibtexArticle = null;

function getArticleObj(artIdOrObj) {
  if (typeof artIdOrObj === 'object' && artIdOrObj !== null) return artIdOrObj;
  if (typeof ALL_SUBSTACK_ARTICLES !== 'undefined') {
    const found = ALL_SUBSTACK_ARTICLES.find((a, idx) => 
      a.id === artIdOrObj || idx === Number(artIdOrObj) || a.link === artIdOrObj || a.title === artIdOrObj
    );
    if (found) {
      return {
        id: found.id,
        category: found.categoryName || 'Substack Article',
        categoryName: found.categoryName,
        readTime: found.readTime || '8 min read',
        wordCount: found.wordCount || '2,000 words',
        date: found.pubDate || 'Substack Dispatch',
        pubDate: found.pubDate || 'Substack Dispatch',
        title: decodeHTMLEntities(found.title),
        subtitle: decodeHTMLEntities(found.snippet || ''),
        snippet: decodeHTMLEntities(found.snippet || ''),
        url: found.link,
        link: found.link,
        content: found.content || generateSubstackArticleModalHTML(found)
      };
    }
  }
  if (typeof articlesDatabase !== 'undefined' && articlesDatabase[artIdOrObj]) {
    const dbArt = articlesDatabase[artIdOrObj];
    return {
      id: artIdOrObj,
      category: dbArt.category || 'Research Essay',
      categoryName: dbArt.category || 'Research Essay',
      readTime: dbArt.readTime || '8 min read',
      wordCount: dbArt.wordCount || '2,000 words',
      date: dbArt.date || '2026',
      pubDate: dbArt.date || '2026',
      title: decodeHTMLEntities(dbArt.title),
      subtitle: decodeHTMLEntities(dbArt.subtitle || ''),
      snippet: decodeHTMLEntities(dbArt.subtitle || ''),
      url: dbArt.url || 'https://hooshaai.substack.com',
      link: dbArt.url || 'https://hooshaai.substack.com',
      content: dbArt.content
    };
  }
  if (currentReadingArticle) return currentReadingArticle;
  return null;
}

function generateBibTeX(art) {
  if (!art) return '';
  const author = "Majlesi, Mohammad Taha";
  const year = "2026";
  const title = decodeHTMLEntities(art.title || "Research Publication");
  
  // Format slug for cite key: @article{majlesi2026<slug>, ...}
  let rawWords = title.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  let slug = rawWords.slice(0, 4).map(w => w.toLowerCase()).join('');
  if (!slug) slug = (art.id || "article").replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  
  const citeKey = `majlesi2026${slug}`;

  let month = "aug";
  const dateStr = art.pubDate || art.date || '';
  if (dateStr.includes("Jul") || dateStr.includes("07")) month = "jul";
  else if (dateStr.includes("Aug") || dateStr.includes("08")) month = "aug";

  const url = art.link || art.url || 'https://hooshaai.substack.com';
  const readTime = art.readTime || '8 min read';
  const wordCount = art.wordCount || '2,000 words';

  return `@article{${citeKey},
  author    = {${author}},
  title     = {${title}},
  journal   = {Hoosha AI Research Journal},
  year      = {${year}},
  month     = {${month}},
  publisher = {Substack / Hoosha AI Lab},
  url       = {${url}},
  note      = {Substack Research Dispatch (${readTime}, ${wordCount})}
}`;
}

function openBibtexModal(artIdOrObj) {
  const art = getArticleObj(artIdOrObj);
  if (!art) return;
  currentBibtexArticle = art;

  const modal = document.getElementById('bibtexModal');
  const titleEl = document.getElementById('bibtexArticleTitle');
  const codeEl = document.getElementById('bibtexCodeText');
  const copyBtn = document.getElementById('copyBibtexBtn');

  if (titleEl) {
    titleEl.textContent = `Citation for: "${art.title}" (Author: Mohammad Taha Majlesi, 2026)`;
  }
  if (codeEl) {
    codeEl.textContent = generateBibTeX(art);
  }

  if (copyBtn) {
    copyBtn.innerHTML = `<i class="fas fa-copy"></i> Copy BibTeX`;
    copyBtn.style.background = 'rgba(147, 51, 234, 0.2)';
    copyBtn.style.color = '#c084fc';
  }

  if (modal) {
    modal.classList.add('active');
  }
}

function closeBibtexModal() {
  const modal = document.getElementById('bibtexModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function exportArticlePDF(artIdOrObj) {
  const art = getArticleObj(artIdOrObj);
  if (!art) {
    if (typeof showToast === 'function') showToast('Error', 'Unable to locate article for PDF export.', 'error');
    return;
  }

  if (typeof showToast === 'function') {
    showToast('Exporting PDF', `Generating paper PDF for "${art.title.slice(0, 35)}..."`, 'info');
  }

  const bibtex = generateBibTeX(art);
  const contentHTML = art.content || (typeof generateSubstackArticleModalHTML === 'function' ? generateSubstackArticleModalHTML(art) : `<p>${art.snippet}</p>`);

  const printWindow = window.open('', '_blank', 'width=900,height=1000');
  if (!printWindow) {
    downloadArticleManuscriptBlob(art, bibtex, contentHTML);
    return;
  }

  const doc = printWindow.document;
  doc.open();
  doc.write(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${art.title} - Hoosha AI Research Paper</title>
  <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Space+Grotesk:wght@600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <style>
    @page { size: A4; margin: 20mm; }
    body {
      font-family: 'Merriweather', serif;
      color: #1e293b;
      line-height: 1.7;
      margin: 0;
      padding: 20px;
      background: #fff;
    }
    .paper-header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 15px;
      margin-bottom: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .lab-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #0284c7;
      text-transform: uppercase;
    }
    .paper-type {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #64748b;
    }
    h1.title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 26px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.25;
      margin: 0 0 15px 0;
    }
    .author-block {
      margin-bottom: 25px;
      padding: 12px 16px;
      background: #f8fafc;
      border-left: 4px solid #0284c7;
      border-radius: 4px;
    }
    .author-name {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: 14px;
      color: #0f172a;
    }
    .author-affiliation {
      font-size: 12px;
      color: #475569;
    }
    .article-meta-line {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #64748b;
      margin-top: 5px;
    }
    .abstract-box {
      background: #f1f5f9;
      padding: 16px 20px;
      border-radius: 6px;
      margin-bottom: 30px;
      font-style: italic;
      font-size: 14px;
    }
    .abstract-box strong {
      font-style: normal;
      font-family: 'Space Grotesk', sans-serif;
      color: #0f172a;
    }
    .paper-content {
      font-size: 14px;
    }
    .paper-content h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 18px;
      color: #0f172a;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 5px;
      margin-top: 25px;
    }
    .math-display-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      padding: 15px;
      border-radius: 6px;
      margin: 15px 0;
      text-align: center;
    }
    .bibtex-ref-section {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px dashed #cbd5e1;
    }
    .bibtex-ref-section h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 15px;
      color: #0f172a;
    }
    .bibtex-box {
      background: #0f172a;
      color: #38bdf8;
      padding: 15px;
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .footer-stamp {
      margin-top: 30px;
      text-align: center;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="paper-header">
    <div class="lab-title">HOOSHA AI RESEARCH LAB</div>
    <div class="paper-type">TECHNICAL REPORT / SUBSTACK DISPATCH</div>
  </div>

  <h1 class="title">${art.title}</h1>

  <div class="author-block">
    <div class="author-name">Mohammad Taha Majlesi</div>
    <div class="author-affiliation">Co-Founder & Lead AI Architect @ Hoosha AI Research Lab</div>
    <div class="article-meta-line">
      Published: ${art.pubDate || 'August 2026'} | Length: ${art.wordCount || ''} (${art.readTime || ''}) | URL: ${art.link || art.url || ''}
    </div>
  </div>

  ${art.snippet ? `
  <div class="abstract-box">
    <strong>Abstract:</strong> ${art.snippet}
  </div>
  ` : ''}

  <div class="paper-content">
    ${contentHTML}
  </div>

  <div class="bibtex-ref-section">
    <h3>BibTeX Citation</h3>
    <div class="bibtex-box">${bibtex}</div>
  </div>

  <div class="footer-stamp">
    &copy; 2026 Hoosha AI Research Lab. Official PDF Export. Downloaded from https://hooshaai.github.io
  </div>

  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
  <script>
    document.addEventListener("DOMContentLoaded", function() {
      if (typeof renderMathInElement === 'function') {
        renderMathInElement(document.body, {
          delimiters: [
            {left: "$$", right: "$$", display: true},
            {left: "$", right: "$", display: false}
          ]
        });
      }
      setTimeout(function() {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>
  `);
  doc.close();

  downloadArticleManuscriptBlob(art, bibtex, contentHTML);
}

function downloadArticleManuscriptBlob(art, bibtex, contentHTML) {
  const rawWords = (art.title || 'article').toLowerCase().replace(/[^a-z0-9]/g, '_');
  const filename = `majlesi2026_${rawWords.slice(0, 30)}.html`;
  
  const blobContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${art.title}</title><style>body{font-family:sans-serif;padding:30px;max-width:850px;margin:0 auto;line-height:1.6;}h1{color:#0f172a;}pre{background:#0f172a;color:#38bdf8;padding:15px;border-radius:6px;font-size:12px;}</style></head><body><h1>${art.title}</h1><p><strong>Author:</strong> Mohammad Taha Majlesi (Hoosha AI Research Lab)</p><p><strong>Date:</strong> ${art.pubDate || '2026'}</p><hr/><div>${contentHTML}</div><hr/><h3>BibTeX</h3><pre>${bibtex}</pre></body></html>`;
  
  const blob = new Blob([blobContent], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

window.openBibtexModal = openBibtexModal;
window.closeBibtexModal = closeBibtexModal;
window.exportArticlePDF = exportArticlePDF;
window.generateBibTeX = generateBibTeX;
window.getArticleObj = getArticleObj;

// Global Click Handlers for BibTeX & PDF Modals
document.addEventListener('click', (e) => {
  const copyBtn = e.target.closest('#copyBibtexBtn');
  if (copyBtn) {
    const codeEl = document.getElementById('bibtexCodeText');
    if (codeEl && codeEl.textContent) {
      navigator.clipboard.writeText(codeEl.textContent).then(() => {
        copyBtn.innerHTML = `<i class="fas fa-check"></i> Copied!`;
        copyBtn.style.background = 'var(--cyan)';
        copyBtn.style.color = '#030712';
        if (typeof showToast === 'function') {
          showToast('BibTeX Copied', 'BibTeX citation copied to clipboard!', 'success');
        }
        setTimeout(() => {
          copyBtn.innerHTML = `<i class="fas fa-copy"></i> Copy BibTeX`;
          copyBtn.style.background = 'rgba(147, 51, 234, 0.2)';
          copyBtn.style.color = '#c084fc';
        }, 2000);
      });
    }
  }

  const downloadBibBtn = e.target.closest('#downloadBibFileBtn');
  if (downloadBibBtn && currentBibtexArticle) {
    const bibtex = generateBibTeX(currentBibtexArticle);
    const titleSlug = (currentBibtexArticle.title || 'citation').toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30);
    const filename = `majlesi2026_${titleSlug}.bib`;
    
    const blob = new Blob([bibtex], { type: 'text/x-bibtex;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);

    if (typeof showToast === 'function') {
      showToast('BibTeX Downloaded', `Saved ${filename} to your device!`, 'success');
    }
  }

  const closeBibModalBtn = e.target.closest('#closeBibtexModal, #closeBibtexModalBottom');
  if (closeBibModalBtn) {
    closeBibtexModal();
  }

  const modalCiteBtn = e.target.closest('#modalCiteBibtexBtn');
  if (modalCiteBtn && currentReadingArticle) {
exportArticlePDF(currentReadingArticle);
  }
});

// Preprocess LaTeX math formulas and HTML into readable conversational speech
function preprocessTextForSpeech(raw) {
  if (!raw) return '';
  let txt = raw.replace(/<[^>]+>/g, ' ');
  txt = txt.replace(/\\text\{([^}]+)\}/g, '$1');
  txt = txt.replace(/\\mathcal\{O\}\(N\^2\)/g, 'order N squared complexity');
  txt = txt.replace(/\\mathcal\{O\}\(N\)/g, 'linear order N complexity');
  txt = txt.replace(/\\mathcal\{V\}_\{\\text\{causal\}\}/g, 'causal verification function');
  txt = txt.replace(/\\phi\(x\)/g, 'phi of x');
  txt = txt.replace(/\\text\{softmax\}/g, 'softmax function');
  txt = txt.replace(/\$\$[\s\S]*?\$\$/g, ' equation breakdown ');
  txt = txt.replace(/\$([^$]+)\$/g, ' $1 ');
  txt = txt.replace(/&amp;/g, ' and ');
  txt = txt.replace(/&#8217;/g, "'");
  txt = txt.replace(/&#8212;/g, ' dash ');
  txt = txt.replace(/[\r\n]+/g, ' ');
  return txt.trim();
}

// ==========================================
// Web Audio Text-To-Speech (TTS) Dispatch Player Engine
// ==========================================
const SubstackTTSPlayer = {
  synth: window.speechSynthesis,
  utterance: null,
  articles: [],
  currentIndex: 0,
  isPlaying: false,
  isPaused: false,
  sentences: [],
  currentSentenceIdx: 0,
  voices: [],
  selectedVoice: null,
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
  autoPlayNext: true,

  init() {
    this.articles = typeof ALL_SUBSTACK_ARTICLES !== 'undefined' ? ALL_SUBSTACK_ARTICLES : [];
    this.loadVoices();
    if (this.synth && this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices();
    }
    
    this.bindEvents();
    this.initWaveforms();
    this.renderQueue();
    this.updateUI();
  },

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    const voiceSelect = document.getElementById('ttsVoiceSelect');
    const heroVoiceSelect = document.getElementById('ttsHeroVoiceSelect');

    const populate = (selectEl) => {
      if (!selectEl) return;
      const currentVal = selectEl.value;
      selectEl.innerHTML = '';

      const englishVoices = this.voices.filter(v => v.lang && v.lang.startsWith('en'));
      const listToUse = englishVoices.length > 0 ? englishVoices : this.voices;

      listToUse.forEach((v, idx) => {
        const opt = document.createElement('option');
        opt.value = v.voiceURI;
        opt.textContent = `${v.name} (${v.lang})`;
        if (v.default || idx === 0) {
          opt.selected = true;
        }
        selectEl.appendChild(opt);
      });

      if (currentVal && Array.from(selectEl.options).some(o => o.value === currentVal)) {
        selectEl.value = currentVal;
      }

      if (selectEl.value) {
        this.selectedVoice = this.voices.find(v => v.voiceURI === selectEl.value) || null;
      }
    };

    populate(voiceSelect);
    populate(heroVoiceSelect);
  },

  bindEvents() {
    const playPauseBtn = document.getElementById('ttsPlayPauseBtn');
    const prevBtn = document.getElementById('ttsPrevBtn');
    const nextBtn = document.getElementById('ttsNextBtn');
    const rewindBtn = document.getElementById('ttsRewindBtn');
    const forwardBtn = document.getElementById('ttsForwardBtn');
    const stopBtn = document.getElementById('ttsStopBtn');
    const speedSelect = document.getElementById('ttsSpeedSelect');
    const voiceSelect = document.getElementById('ttsVoiceSelect');
    const progressContainer = document.getElementById('ttsProgressBarContainer');
    const queueToggleBtn = document.getElementById('ttsQueueToggleBtn');
    const closeQueueBtn = document.getElementById('ttsCloseQueueBtn');
    const barCloseBtn = document.getElementById('ttsBarCloseBtn');
    const autoPlayNextToggle = document.getElementById('ttsAutoPlayNextToggle');
    const shuffleQueueBtn = document.getElementById('ttsShuffleQueueBtn');

    const heroPlayBtn = document.getElementById('ttsHeroPlayBtn');
    const heroSpeedSelect = document.getElementById('ttsHeroSpeedSelect');
    const heroVoiceSelect = document.getElementById('ttsHeroVoiceSelect');

    if (playPauseBtn) playPauseBtn.addEventListener('click', () => this.togglePlayPause());
    if (heroPlayBtn) heroPlayBtn.addEventListener('click', () => this.togglePlayPause());
    if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => this.next());
    if (rewindBtn) rewindBtn.addEventListener('click', () => this.rewind10());
    if (forwardBtn) forwardBtn.addEventListener('click', () => this.forward10());
    if (stopBtn) stopBtn.addEventListener('click', () => this.stop());

    if (speedSelect) {
      speedSelect.addEventListener('change', (e) => {
        this.rate = parseFloat(e.target.value);
        if (heroSpeedSelect) heroSpeedSelect.value = e.target.value;
        if (this.isPlaying) this.restartCurrentSentence();
      });
    }

    if (heroSpeedSelect) {
      heroSpeedSelect.addEventListener('change', (e) => {
        this.rate = parseFloat(e.target.value);
        if (speedSelect) speedSelect.value = e.target.value;
        if (this.isPlaying) this.restartCurrentSentence();
      });
    }

    if (voiceSelect) {
      voiceSelect.addEventListener('change', (e) => {
        this.selectedVoice = this.voices.find(v => v.voiceURI === e.target.value) || null;
        if (heroVoiceSelect) heroVoiceSelect.value = e.target.value;
        if (this.isPlaying) this.restartCurrentSentence();
      });
    }

    if (heroVoiceSelect) {
      heroVoiceSelect.addEventListener('change', (e) => {
        this.selectedVoice = this.voices.find(v => v.voiceURI === e.target.value) || null;
        if (voiceSelect) voiceSelect.value = e.target.value;
        if (this.isPlaying) this.restartCurrentSentence();
      });
    }

    if (progressContainer) {
      progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const ratio = Math.max(0, Math.min(1, clickX / rect.width));
        this.seekToRatio(ratio);
      });
    }

    const queueModal = document.getElementById('ttsQueueModal');
    if (queueToggleBtn && queueModal) {
      queueToggleBtn.addEventListener('click', () => {
        queueModal.classList.toggle('active');
        this.renderQueue();
      });
    }
    if (closeQueueBtn && queueModal) {
      closeQueueBtn.addEventListener('click', () => queueModal.classList.remove('active'));
    }

    if (barCloseBtn) {
      barCloseBtn.addEventListener('click', () => {
        const bar = document.getElementById('ttsAudioDispatchBar');
        if (bar) bar.classList.toggle('minimized');
      });
    }

    if (autoPlayNextToggle) {
      autoPlayNextToggle.addEventListener('click', () => {
        this.autoPlayNext = !this.autoPlayNext;
        autoPlayNextToggle.classList.toggle('active', this.autoPlayNext);
        autoPlayNextToggle.innerHTML = `<i class="fas fa-sync-alt"></i> Continuous: ${this.autoPlayNext ? 'ON' : 'OFF'}`;
      });
    }

    if (shuffleQueueBtn) {
      shuffleQueueBtn.addEventListener('click', () => {
        this.currentIndex = Math.floor(Math.random() * this.articles.length);
        this.playArticle(this.currentIndex);
      });
    }

    document.addEventListener('keydown', (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;

      if (e.code === 'Space' && (this.isPlaying || this.isPaused)) {
        e.preventDefault();
        this.togglePlayPause();
      } else if (e.code === 'ArrowLeft' && e.shiftKey && (this.isPlaying || this.isPaused)) {
        e.preventDefault();
        this.prev();
      } else if (e.code === 'ArrowRight' && e.shiftKey && (this.isPlaying || this.isPaused)) {
        e.preventDefault();
        this.next();
      } else if (e.code === 'ArrowLeft' && (this.isPlaying || this.isPaused)) {
        e.preventDefault();
        this.rewind10();
      } else if (e.code === 'ArrowRight' && (this.isPlaying || this.isPaused)) {
        e.preventDefault();
        this.forward10();
      }
    });
  },

  playChimeIntro() {
    if (typeof HooshaAudioEngine !== 'undefined' && HooshaAudioEngine.initContext) {
      HooshaAudioEngine.initContext();
      if (HooshaAudioEngine.audioCtx) {
        try {
          const ctx = HooshaAudioEngine.audioCtx;
          const now = ctx.currentTime;
          const notes = [523.25, 659.25, 783.99];
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(0.06, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.25);
          });
        } catch (e) {
          console.warn('TTS Chime Intro error:', e);
        }
      }
    }
  },

  prepareSentences(article, index) {
    const rawSentences = [];
    const title = decodeHTMLEntities(article.title || '');
    const cat = article.categoryName || 'Substack Journal';
    const readTime = article.readTime || '8 min read';
    
    rawSentences.push(`Hoosha AI Audio Dispatch. Playing essay ${index + 1} of ${this.articles.length}. Title: ${title}. Category: ${cat}. Read time: ${readTime}.`);

    const snippet = preprocessTextForSpeech(decodeHTMLEntities(article.snippet || ''));
    if (snippet) {
      rawSentences.push(`Abstract: ${snippet}`);
    }

    let rawContent = '';
    if (article.id && typeof articlesDatabase !== 'undefined' && articlesDatabase[article.id]) {
      rawContent = articlesDatabase[article.id].content || '';
    } else {
      rawContent = generateSubstackArticleModalHTML(article);
    }

    const cleanContent = preprocessTextForSpeech(rawContent);
    const parts = cleanContent.split(/(?<=[.!?])\s+/);
    parts.forEach(p => {
      const s = p.trim();
      if (s.length > 5) {
        rawSentences.push(s);
      }
    });

    return rawSentences;
  },

  playArticle(index, startSentenceIdx = 0) {
    if (!this.synth) {
      alert('Speech Synthesis API is not supported in your browser.');
      return;
    }

    if (index < 0 || index >= this.articles.length) index = 0;
    this.currentIndex = index;
    const article = this.articles[this.currentIndex];
    if (!article) return;

    this.stopSynthOnly();
    this.playChimeIntro();

    this.sentences = this.prepareSentences(article, this.currentIndex);
    this.currentSentenceIdx = Math.min(startSentenceIdx, this.sentences.length - 1);
    this.isPlaying = true;
    this.isPaused = false;

    const bar = document.getElementById('ttsAudioDispatchBar');
    if (bar) {
      bar.classList.remove('minimized');
      bar.style.display = 'block';
    }

    this.speakCurrentSentence();
    this.updateUI();
  },

  stopSynthOnly() {
    if (this.synth) {
      this.synth.cancel();
    }
  },

  speakCurrentSentence() {
    if (!this.isPlaying || this.currentSentenceIdx >= this.sentences.length) {
      if (this.currentSentenceIdx >= this.sentences.length && this.isPlaying) {
        this.onEssayEnded();
      }
      return;
    }

    this.stopSynthOnly();

    const textToSpeak = this.sentences[this.currentSentenceIdx];
    this.utterance = new SpeechSynthesisUtterance(textToSpeak);

    if (this.selectedVoice) {
      this.utterance.voice = this.selectedVoice;
    }
    this.utterance.rate = this.rate;
    this.utterance.pitch = this.pitch;
    this.utterance.volume = this.volume;

    this.utterance.onend = () => {
      if (this.isPlaying && !this.isPaused) {
        this.currentSentenceIdx++;
        this.speakCurrentSentence();
        this.updateProgressUI();
      }
    };

    this.utterance.onerror = (e) => {
      console.warn('TTS utterance error:', e);
      if (this.isPlaying && !this.isPaused) {
        this.currentSentenceIdx++;
        this.speakCurrentSentence();
      }
    };

    this.synth.speak(this.utterance);
    this.updateTranscriptUI(textToSpeak);
    this.updateProgressUI();
  },

  restartCurrentSentence() {
    if (this.isPlaying) {
      this.speakCurrentSentence();
    }
  },

  togglePlayPause() {
    if (!this.isPlaying && !this.isPaused) {
      this.playArticle(this.currentIndex);
      return;
    }

    if (this.isPaused) {
      this.isPaused = false;
      this.isPlaying = true;
      if (this.synth.paused) {
        this.synth.resume();
      } else {
        this.speakCurrentSentence();
      }
    } else if (this.isPlaying) {
      this.isPaused = true;
      this.isPlaying = false;
      if (this.synth.speaking) {
        this.synth.pause();
      }
    }
    this.updateUI();
  },

  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    this.stopSynthOnly();
    this.currentSentenceIdx = 0;
    this.updateUI();
  },

  next() {
    const nextIdx = (this.currentIndex + 1) % this.articles.length;
    this.playArticle(nextIdx);
  },

  prev() {
    const prevIdx = (this.currentIndex - 1 + this.articles.length) % this.articles.length;
    this.playArticle(prevIdx);
  },

  rewind10() {
    if (!this.sentences.length) return;
    this.currentSentenceIdx = Math.max(0, this.currentSentenceIdx - 2);
    this.speakCurrentSentence();
  },

  forward10() {
    if (!this.sentences.length) return;
    this.currentSentenceIdx = Math.min(this.sentences.length - 1, this.currentSentenceIdx + 2);
    this.speakCurrentSentence();
  },

  seekToRatio(ratio) {
    if (!this.sentences.length) return;
    const targetIdx = Math.floor(ratio * (this.sentences.length - 1));
    this.currentSentenceIdx = Math.max(0, Math.min(this.sentences.length - 1, targetIdx));
    if (this.isPlaying || this.isPaused) {
      this.isPlaying = true;
      this.isPaused = false;
      this.speakCurrentSentence();
    }
  },

  onEssayEnded() {
    this.stopSynthOnly();
    this.isPlaying = false;
    this.isPaused = false;
    this.updateUI();

    if (this.autoPlayNext) {
      setTimeout(() => {
        this.next();
      }, 1000);
    }
  },

  updateTranscriptUI(text) {
    const heroTranscript = document.getElementById('ttsHeroTranscriptText');
    if (heroTranscript) {
      heroTranscript.textContent = text || 'Listening to Audio Dispatch...';
    }
  },

  updateProgressUI() {
    const progressBar = document.getElementById('ttsProgressBar');
    const heroProgressBar = document.getElementById('ttsHeroProgressBar');
    const currentTimeEl = document.getElementById('ttsCurrentTime');
    const totalTimeEl = document.getElementById('ttsTotalTime');
    const heroCurrentTimeEl = document.getElementById('ttsHeroCurrentTime');
    const heroTotalTimeEl = document.getElementById('ttsHeroTotalTime');

    const totalSentences = this.sentences.length || 1;
    const pct = ((this.currentSentenceIdx / totalSentences) * 100).toFixed(1);

    if (progressBar) progressBar.style.width = `${pct}%`;
    if (heroProgressBar) heroProgressBar.style.width = `${pct}%`;

    const wordsTotal = this.sentences.reduce((acc, s) => acc + s.split(' ').length, 0);
    const estTotalSec = Math.round((wordsTotal / 150) * 60 / (this.rate || 1));
    const elapsedSec = Math.round((this.currentSentenceIdx / totalSentences) * estTotalSec);

    const fmt = (s) => {
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    };

    if (currentTimeEl) currentTimeEl.textContent = fmt(elapsedSec);
    if (totalTimeEl) totalTimeEl.textContent = fmt(estTotalSec);
    if (heroCurrentTimeEl) heroCurrentTimeEl.textContent = fmt(elapsedSec);
    if (heroTotalTimeEl) heroTotalTimeEl.textContent = fmt(estTotalSec);
  },

  updateUI() {
    const article = this.articles[this.currentIndex] || {};
    
    const titleEl = document.getElementById('ttsBarTitle');
    const catEl = document.getElementById('ttsBarCategory');
    const indexEl = document.getElementById('ttsBarIndex');
    const playBtn = document.getElementById('ttsPlayPauseBtn');

    const heroTitleEl = document.getElementById('ttsHeroTitle');
    const heroCatEl = document.getElementById('ttsHeroCategory');
    const heroPlayBtn = document.getElementById('ttsHeroPlayBtn');

    const isPlayActive = this.isPlaying && !this.isPaused;

    if (titleEl) titleEl.textContent = article.title || 'Substack Audio Dispatch';
    if (catEl) catEl.textContent = article.categoryName || 'Research';
    if (indexEl) indexEl.textContent = `Essay ${this.currentIndex + 1} of ${this.articles.length}`;

    if (heroTitleEl) heroTitleEl.textContent = article.title || 'Substack Audio Dispatch Player';
    if (heroCatEl) heroCatEl.textContent = article.categoryName || 'Research Essay';

    if (playBtn) {
      playBtn.innerHTML = isPlayActive ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
      playBtn.title = isPlayActive ? 'Pause Playback' : 'Play Audio Dispatch';
    }

    if (heroPlayBtn) {
      heroPlayBtn.innerHTML = isPlayActive ? '<i class="fas fa-pause"></i> Pause Audio' : '<i class="fas fa-play"></i> Play Audio Dispatch';
    }

    document.querySelectorAll('.substack-card').forEach((card) => {
      const cardArtIndex = Number(card.getAttribute('data-article-index'));
      const btn = card.querySelector('.btn-play-tts');

      if (cardArtIndex === this.currentIndex && isPlayActive) {
        card.classList.add('playing-active');
        if (btn) {
          btn.classList.add('playing');
          btn.innerHTML = '<i class="fas fa-pause-circle"></i> Pause';
        }
      } else {
        card.classList.remove('playing-active');
        if (btn) {
          btn.classList.remove('playing');
          btn.innerHTML = '<i class="fas fa-headphones"></i> Listen (TTS)';
        }
      }
    });

    this.updateProgressUI();
    this.renderQueue();
  },

  renderQueue() {
    const queueList = document.getElementById('ttsQueueList');
    if (!queueList) return;

    queueList.innerHTML = '';
    this.articles.forEach((art, idx) => {
      const item = document.createElement('div');
      const isActive = idx === this.currentIndex;
      const isPlayActive = isActive && this.isPlaying && !this.isPaused;

      item.className = `tts-queue-item ${isActive ? 'active' : ''}`;
      item.innerHTML = `
        <div class="tts-item-left">
          <span class="tts-item-index">${idx + 1}</span>
          <div class="tts-item-details">
            <span class="tts-item-title">${art.title}</span>
            <div class="tts-item-meta">
              <span><i class="fas fa-tag"></i> ${art.categoryName || 'Research'}</span>
              <span><i class="fas fa-clock"></i> ${art.readTime || '8 min read'}</span>
            </div>
          </div>
        </div>
        <button class="tts-item-play-btn" title="${isPlayActive ? 'Pause' : 'Play Now'}">
          <i class="fas ${isPlayActive ? 'fa-pause' : 'fa-play'}"></i>
        </button>
      `;

      item.addEventListener('click', () => {
        if (isActive) {
          this.togglePlayPause();
        } else {
          this.playArticle(idx);
        }
      });

      queueList.appendChild(item);
    });
  },

  initWaveforms() {
    const canvasBar = document.getElementById('ttsWaveformCanvas');
    const canvasHero = document.getElementById('ttsHeroWaveformCanvas');
    const canvases = [canvasBar, canvasHero].filter(Boolean);

    if (canvases.length === 0) return;

    let time = 0;
    const render = () => {
      time += 0.05;
      const active = this.isPlaying && !this.isPaused;

      canvases.forEach(c => {
        const ctx = c.getContext('2d');
        if (!ctx) return;
        const w = c.width;
        const h = c.height;

        ctx.clearRect(0, 0, w, h);

        const numBars = c === canvasBar ? 16 : 48;
        const barWidth = w / numBars;

        for (let i = 0; i < numBars; i++) {
          let heightFactor = 0.15;
          if (active) {
            heightFactor = Math.abs(Math.sin(time * 2 + i * 0.4)) * 0.7 + Math.random() * 0.15;
          } else {
            heightFactor = Math.abs(Math.sin(time * 0.5 + i * 0.2)) * 0.15 + 0.05;
          }

          const barHeight = Math.max(3, h * heightFactor);
          const x = i * barWidth;
          const y = (h - barHeight) / 2;

          const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
          grad.addColorStop(0, '#00f0ff');
          grad.addColorStop(1, '#8a2be2');

          ctx.fillStyle = grad;
          ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
        }
      });

      requestAnimationFrame(render);
    };

    render();
  }
};

window.playSubstackTTS = function(index) {
  SubstackTTSPlayer.playArticle(index);
};

async function loadSubstackArticlesGrid() {
  const gridEl = document.getElementById('substackArticlesGrid');
  const searchInput = document.getElementById('substackSearchInput');
  const searchClear = document.getElementById('substackSearchClear');
  const countBadge = document.getElementById('substackArticleCountBadge');
  const filterTabsContainer = document.getElementById('substackFilterTabs');

  if (!gridEl) return;

  let currentArticles = ALL_SUBSTACK_ARTICLES;

  try {
    const resp = await fetch('articles.json');
    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data) && data.length > 0) {
        currentArticles = data.map((item, idx) => {
          const fallback = ALL_SUBSTACK_ARTICLES[idx] || ALL_SUBSTACK_ARTICLES[0];
          return {
            id: `art-${idx + 1}`,
            title: decodeHTMLEntities(item.title || fallback.title),
            link: item.link || fallback.link,
            pubDate: item.pubDate ? item.pubDate.slice(0, 16) : fallback.pubDate,
            wordCount: item.wordCount && item.wordCount !== '0 words' ? item.wordCount : fallback.wordCount,
            readTime: item.readTime && item.readTime !== '1 min read' ? item.readTime : fallback.readTime,
            snippet: decodeHTMLEntities(item.snippet || fallback.snippet),
            category: fallback.category,
            categoryName: fallback.categoryName,
            katex: true
          };
        });
      }
    }
  } catch (e) {
    console.log('Using compiled Substack article data fallback:', e);
  }

  // Update TTS player articles reference
  SubstackTTSPlayer.articles = currentArticles;

  let activeCategory = 'all';
  let searchQuery = '';

  function renderGrid() {
    gridEl.innerHTML = '';

    const filtered = currentArticles.filter(art => {
      const matchesCat = activeCategory === 'all' || art.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        art.title.toLowerCase().includes(q) || 
        art.snippet.toLowerCase().includes(q) || 
        art.categoryName.toLowerCase().includes(q) || 
        art.pubDate.toLowerCase().includes(q) ||
        art.wordCount.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      gridEl.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <i class="fas fa-search-minus" style="font-size: 2.5rem; color: rgba(0,240,255,0.3); margin-bottom: 1rem;"></i>
          <h4>No Substack articles found matching "${searchQuery}"</h4>
          <p style="font-size: 0.9rem; margin-top: 0.5rem;">Try adjusting your search keywords or switching category tabs.</p>
        </div>
      `;
    } else {
      filtered.forEach((art) => {
        const fullIndex = currentArticles.indexOf(art);
        const card = document.createElement('div');
        const isPlayActive = SubstackTTSPlayer.currentIndex === fullIndex && SubstackTTSPlayer.isPlaying && !SubstackTTSPlayer.isPaused;

        card.className = `substack-card fade-up visible ${isPlayActive ? 'playing-active' : ''}`;
        card.setAttribute('data-category', art.category);
        card.setAttribute('data-article-index', fullIndex);
        
        card.innerHTML = `
          <div>
            <div class="substack-card-header">
              <div class="substack-card-meta-top">
                <span class="substack-card-date"><i class="far fa-calendar-alt"></i> ${art.pubDate}</span>
                <span class="substack-category-tag">${art.categoryName}</span>
              </div>
              <span class="katex-indicator-badge" title="KaTeX Mathematical Formatting Supported">
                <i class="fas fa-square-root-variable"></i> KaTeX Math
              </span>
            </div>
            
            <h4 class="substack-card-title">${art.title}</h4>
            <p class="substack-card-snippet">${art.snippet}</p>
          </div>
          
          <div class="substack-card-footer">
            <div class="substack-card-stats">
              <span class="stat-pill"><i class="fas fa-file-alt"></i> ${art.wordCount}</span>
              <span class="stat-pill"><i class="fas fa-clock"></i> ${art.readTime}</span>
            </div>
            <div class="substack-card-actions">
              <button class="btn-play-tts ${isPlayActive ? 'playing' : ''}" data-tts-index="${fullIndex}" onclick="event.stopPropagation(); window.playSubstackTTS(${fullIndex});" title="Listen to Audio Podcast">
                <i class="fas ${isPlayActive ? 'fa-pause-circle' : 'fa-headphones'}"></i> ${isPlayActive ? 'Pause' : 'Listen (TTS)'}
              </button>
              <button class="btn-read-modal-inline" data-article-index="${fullIndex}">
                <i class="fas fa-book-reader"></i> Read
              </button>
              <a href="${art.link}" target="_blank" class="btn-external-sub" title="Open original essay on Substack" onclick="event.stopPropagation();">
                <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>
        `;

        card.addEventListener('click', (e) => {
          if (e.target.closest('.btn-external-sub') || e.target.closest('.btn-play-tts')) return;
          openArticleModal(art);
        });

        gridEl.appendChild(card);
      });
    }

    if (countBadge) {
      countBadge.textContent = `Showing ${filtered.length} of ${currentArticles.length} Essays`;
    }
  }

  // Initial render
  renderGrid();

  // Search input event handlers
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (searchClear) {
        searchClear.style.display = searchQuery ? 'block' : 'none';
      }
      renderGrid();
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchQuery = '';
      }
      searchClear.style.display = 'none';
      renderGrid();
    });
  }

  // Filter tabs event handlers
  if (filterTabsContainer) {
    const tabs = filterTabsContainer.querySelectorAll('.substack-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeCategory = tab.getAttribute('data-category');
        renderGrid();
      });
    });
  }
}

async function loadSyncedSubstackArticles() {
  const container = document.getElementById('syncedArticlesContainer');
  const countEl = document.getElementById('syncedArticlesCount');
  const listEl = document.getElementById('syncedArticlesList');

  if (!container || !listEl) return;

  try {
    const response = await fetch('data.json');
    if (!response.ok) return;

    const data = await response.json();
    if (!data || !data.articles || !Array.isArray(data.articles) || data.articles.length === 0) {
      return;
    }

    listEl.innerHTML = '';
    const articles = data.articles.slice(0, 6);

    articles.forEach((art, index) => {
      const itemLink = document.createElement('a');
      itemLink.href = art.link || 'https://hooshaai.substack.com';
      itemLink.target = '_blank';
      itemLink.className = 'chapter-row';
      itemLink.style.margin = '0.5rem 0';

      const formattedDate = art.date ? art.date.slice(0, 16) : 'Latest';

      itemLink.innerHTML = `
        <div class="chapter-meta">
          <span class="part-badge" style="color: #10b981; font-size: 0.82rem;">#${index + 1}</span>
          <div class="chapter-info">
            <h4>${art.title}</h4>
            <span class="read-time"><i class="far fa-clock"></i> ${formattedDate} · ${art.desc || 'Substack Publication'}</span>
          </div>
        </div>
        <i class="fas fa-external-link-alt chapter-arrow" style="font-size: 0.85rem;"></i>
      `;

      listEl.appendChild(itemLink);
    });

    if (countEl) {
      countEl.textContent = `${data.articles.length} Synced Publications`;
    }

    container.style.display = 'block';
  } catch (err) {
    console.log('Live data.json sync notice:', err);
  }
}

// ==========================================
// Article Publisher Studio & Published Articles Store
// ==========================================

const DEFAULT_PUBLISHED_ARTICLES = [
  {
    id: "art-cfm-001",
    title: "Continuous Flow Matching ODEs: Simulation-Free Vector Field Alignments",
    subtitle: "Formulating optimal transport velocity trajectories for fast generative sampling without SDE noise decay.",
    content: `## Abstract & Mathematical Foundations

Continuous Flow Matching (CFM) represents a paradigm shift in continuous-time generative modeling. Unlike traditional Stochastic Differential Equations (SDEs), CFM models a deterministic vector field $v_t(x)$ that maps a simple noise distribution $p_0(x) = \\mathcal{N}(x; 0, I)$ directly to a target data manifold $p_1(x)$.

### Vector Field Integration

The generative trajectory follows the Ordinary Differential Equation:
$$\\frac{dx}{dt} = v_t(x; \\theta), \\quad x(0) \\sim p_0(x)$$

The velocity field objective $\\mathcal{L}_{CFM}(\\theta)$ minimizes the L2 drift error along optimal transport straight paths:
$$\\mathcal{L}_{CFM}(\\theta) = \\mathbb{E}_{t \\sim U(0,1), x_0, x_1} \\left[ \\| v_t(x_t; \\theta) - u_t(x_t | x_0, x_1) \\|^2 \\right]$$

where linear trajectories are defined as:
$$x_t = (1 - t) x_0 + t x_1$$
$$u_t(x_t | x_0, x_1) = x_1 - x_0$$

### Key Advantages over SDE Diffusion
> **Simulation-Free Training:** No need to integrate ODE/SDE paths during backpropagation. Training is purely regression on linear velocity vectors $u_t$.

\`\`\`python
import torch

def cfm_loss(model, x0, x1, t):
    # Linear interpolation trajectory
    xt = (1 - t) * x0 + t * x1
    # Target velocity vector
    ut = x1 - x0
    # Model prediction
    vt = model(xt, t)
    return torch.mean((vt - ut) ** 2)
\`\`\`

### Experimental Benchmarks
On CIFAR-10 and ImageNet 64x64, CFM achieves NFE (Number of Function Evaluations) = 10 with competitive FID scores compared to 1000-step DDPMs.`,
    tags: ["Continuous Flow Matching", "ODE", "Generative AI", "Optimal Transport"],
    author: "Mohammad Taha Majlesi",
    authorRole: "Co-Founder & Lead AI Architect @ Hoosha AI",
    date: "Aug 12, 2026",
    readTime: "7 min read",
    publishedAt: 1770768000000
  },
  {
    id: "art-diffattn-002",
    title: "High-Precision Fused Differential Attention Kernels in Triton",
    subtitle: "Canceling attention noise and attention allocation drift via dual-softmax operator subtraction.",
    content: `## Differential Attention Formulation

Standard softmax attention often suffers from attention noise accumulation across deep layers. Fused Differential Attention mitigates this by subtracting a secondary, scaled attention map:

$$\\text{DiffAttn}(Q, K, V) = \\left( \\text{softmax}\\left(\\frac{Q K_1^T}{\\sqrt{d}}\\right) - \\lambda \\cdot \\text{softmax}\\left(\\frac{Q K_2^T}{\\sqrt{d}}\\right) \\right) V$$

### Mathematical Noise Cancellation
When key projections $K_1$ and $K_2$ align on noise directions, the difference operator cancels common-mode interference:
$$\\lim_{\\lambda \\to 1} \\| \\text{Noise}(K_1) - \\lambda \\cdot \\text{Noise}(K_2) \\| = 0$$

\`\`\`python
# Fused Triton Kernel Interface
def fused_diff_attn(q, k1, k2, v, lambda_val=0.5):
    attn1 = torch.softmax(q @ k1.transpose(-2, -1) / math.sqrt(d), dim=-1)
    attn2 = torch.softmax(q @ k2.transpose(-2, -1) / math.sqrt(d), dim=-1)
    return (attn1 - lambda_val * attn2) @ v
\`\`\`

### Benchmarks & Context Scaling
- **Context Window:** Up to 128k tokens with zero degradation in long-needle retrieval.
- **Memory Footprint:** 40% reduction in KV cache memory compared to standard Multi-Head Attention.`,
    tags: ["Differential Attention", "CUDA", "Triton", "LLM Reasoning"],
    author: "Mohammad Taha Majlesi",
    authorRole: "Co-Founder & Lead AI Architect @ Hoosha AI",
    date: "Aug 11, 2026",
    readTime: "5 min read",
    publishedAt: 1770681600000
  }
];

function getPublishedArticles() {
  const stored = localStorage.getItem('hoosha_published_articles');
  if (!stored) {
    localStorage.setItem('hoosha_published_articles', JSON.stringify(DEFAULT_PUBLISHED_ARTICLES));
    return DEFAULT_PUBLISHED_ARTICLES;
  }
  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem('hoosha_published_articles', JSON.stringify(DEFAULT_PUBLISHED_ARTICLES));
      return DEFAULT_PUBLISHED_ARTICLES;
    }
    return parsed;
  } catch (e) {
    localStorage.setItem('hoosha_published_articles', JSON.stringify(DEFAULT_PUBLISHED_ARTICLES));
    return DEFAULT_PUBLISHED_ARTICLES;
  }
}

function savePublishedArticles(articles) {
  localStorage.setItem('hoosha_published_articles', JSON.stringify(articles));
}

// Markdown & KaTeX Formatter Helper
function simpleMarkdownFallback(text) {
  if (!text) return '';
  let html = text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '<br/><br/>');
  return html;
}

function renderFormattedContent(markdownText, targetElement) {
  if (!targetElement) return;
  
  if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
    targetElement.innerHTML = marked.parse(markdownText || '');
  } else {
    targetElement.innerHTML = simpleMarkdownFallback(markdownText || '');
  }

  if (window.renderMathInElement) {
    renderMathInElement(targetElement, {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false},
        {left: '\\(', right: '\\)', display: false},
        {left: '\\[', right: '\\]', display: true}
      ],
      throwOnError: false
    });
  }
}

// Toolbar Text Insertion Helper
function insertStudioText(prefix, suffix = '') {
  const textarea = document.getElementById('studioContent');
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  const replacement = prefix + (selectedText || 'text') + suffix;

  textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
  textarea.focus();
  textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText.length || 4));

  triggerStudioLivePreview();
}
window.insertStudioText = insertStudioText;

function triggerStudioLivePreview() {
  const title = document.getElementById('studioTitle')?.value || 'Untitled Research Article';
  const subtitle = document.getElementById('studioSubtitle')?.value || '';
  const content = document.getElementById('studioContent')?.value || '';
  const preview = document.getElementById('studioPreview');
  const wordCountEl = document.getElementById('studioWordCount');

  if (wordCountEl) {
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    wordCountEl.textContent = `${wordCount} words · ${readTime} min read`;
  }

  if (!preview) return;

  const fullMarkdown = `## ${title}\n*${subtitle}*\n\n---\n\n${content}`;
  renderFormattedContent(fullMarkdown, preview);
}

function initPublisherStudio() {
  const studioCard = document.getElementById('publisherStudio');
  if (!studioCard) return;

  const studioTitle = document.getElementById('studioTitle');
  const studioSubtitle = document.getElementById('studioSubtitle');
  const studioTags = document.getElementById('studioTags');
  const studioAuthor = document.getElementById('studioAuthor');
  const studioContent = document.getElementById('studioContent');
  const btnPublish = document.getElementById('btnPublishArticle');
  const btnSaveDraft = document.getElementById('btnSaveDraft');
  const btnClear = document.getElementById('btnClearStudio');

  // Pre-fill Author from authenticated session if empty
  const currentUser = localStorage.getItem('hoosha_user') || 'researcher@hoosha.ai';
  if (studioAuthor && !studioAuthor.value) {
    const namePart = currentUser.split('@')[0].replace(/[._]/g, ' ');
    studioAuthor.value = namePart.charAt(0).toUpperCase() + namePart.slice(1);
  }

  // Load Saved Draft if exists
  const savedDraft = localStorage.getItem('hoosha_article_draft');
  if (savedDraft) {
    try {
      const draft = JSON.parse(savedDraft);
      if (draft.title && studioTitle) studioTitle.value = draft.title;
      if (draft.subtitle && studioSubtitle) studioSubtitle.value = draft.subtitle;
      if (draft.tags && studioTags) studioTags.value = draft.tags;
      if (draft.author && studioAuthor) studioAuthor.value = draft.author;
      if (draft.content && studioContent) studioContent.value = draft.content;
      triggerStudioLivePreview();
    } catch(e) {}
  }

  // Input listeners for live preview
  [studioTitle, studioSubtitle, studioContent].forEach(input => {
    if (input) {
      input.addEventListener('input', triggerStudioLivePreview);
    }
  });

  // Save Draft Handler
  if (btnSaveDraft) {
    btnSaveDraft.addEventListener('click', () => {
      const draftPayload = {
        title: studioTitle?.value || '',
        subtitle: studioSubtitle?.value || '',
        tags: studioTags?.value || '',
        author: studioAuthor?.value || '',
        content: studioContent?.value || ''
      };
      localStorage.setItem('hoosha_article_draft', JSON.stringify(draftPayload));
      showToast('Draft Saved 💾', 'Article draft saved to browser storage.', 'info', 4000);
    });
  }

  // Clear Studio Handler
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      const editingIdInput = document.getElementById('editingArticleId');
      if (editingIdInput) editingIdInput.value = '';
      if (studioTitle) studioTitle.value = '';
      if (studioSubtitle) studioSubtitle.value = '';
      if (studioTags) studioTags.value = '';
      if (studioContent) studioContent.value = '';
      if (btnPublish) btnPublish.innerHTML = '<i class="fas fa-paper-plane"></i> Publish Article';
      localStorage.removeItem('hoosha_article_draft');
      triggerStudioLivePreview();
      showToast('Studio Cleared 🧹', 'Publisher editor form reset.', 'info', 3000);
    });
  }

  // Publish Article Handler
  if (btnPublish) {
    btnPublish.addEventListener('click', () => {
      const title = studioTitle?.value.trim();
      const subtitle = studioSubtitle?.value.trim();
      const content = studioContent?.value.trim();
      const tags = studioTags?.value.split(',').map(t => t.trim()).filter(Boolean);
      const author = studioAuthor?.value.trim() || 'Authenticated Researcher';
      const editingId = document.getElementById('editingArticleId')?.value;

      if (!title || !subtitle || !content) {
        showToast('Missing Fields', 'Please complete the Article Title, Subtitle, and Content before publishing.', 'error', 4500);
        return;
      }

      const wordCount = content.split(/\s+/).length;
      const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
      const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      let articles = getPublishedArticles();

      if (editingId) {
        // Update existing article
        const index = articles.findIndex(a => a.id === editingId);
        if (index !== -1) {
          articles[index] = {
            ...articles[index],
            title,
            subtitle,
            content,
            tags: tags.length ? tags : ['Research'],
            author,
            date: dateStr,
            readTime
          };
          showToast('Article Updated 🚀', `"${title}" has been successfully updated.`, 'success', 5000);
        }
      } else {
        // Create new published article
        const newArticle = {
          id: 'art-' + Date.now(),
          title,
          subtitle,
          content,
          tags: tags.length ? tags : ['Research Paper'],
          author,
          authorRole: 'Researcher @ Hoosha AI Lab',
          date: dateStr,
          readTime,
          publishedAt: Date.now()
        };
        articles.unshift(newArticle);
        showToast('Article Published! 🎉', `"${title}" is now live on Platform and Main Journal.`, 'success', 6000);
      }

      savePublishedArticles(articles);
      localStorage.removeItem('hoosha_article_draft');

      // Reset form
      const editingIdInput = document.getElementById('editingArticleId');
      if (editingIdInput) editingIdInput.value = '';
      if (studioTitle) studioTitle.value = '';
      if (studioSubtitle) studioSubtitle.value = '';
      if (studioTags) studioTags.value = '';
      if (studioContent) studioContent.value = '';
      btnPublish.innerHTML = '<i class="fas fa-paper-plane"></i> Publish Article';

      triggerStudioLivePreview();

      // Refresh rendering across UI
      renderPlatformPublishedArticles();
      renderIndexPublishedArticles();
    });
  }
}

// Render Published Articles Grid on Platform Dashboard
function renderPlatformPublishedArticles() {
  const grid = document.getElementById('platformPublishedGrid');
  const countBadge = document.getElementById('publishedCountBadge');
  if (!grid) return;

  const articles = getPublishedArticles();

  if (countBadge) {
    countBadge.textContent = `${articles.length} Article${articles.length === 1 ? '' : 's'}`;
  }

  grid.innerHTML = '';

  if (articles.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 3rem; background: rgba(10,15,30,0.5); border: 1px dashed var(--border); border-radius: 16px;">
        <i class="fas fa-feather" style="font-size: 2rem; color: var(--cyan); margin-bottom: 1rem;"></i>
        <p>No published articles yet. Use the Article Publisher Studio above to draft and publish your first paper!</p>
      </div>
    `;
    return;
  }

  articles.forEach(art => {
    const card = document.createElement('div');
    card.className = 'published-card';

    const tagsHTML = (art.tags || []).map(t => `<span class="published-tag-pill">${t}</span>`).join('');

    card.innerHTML = `
      <div class="published-card-header">
        <div class="published-tags">${tagsHTML}</div>
        <h3 class="published-card-title">${art.title}</h3>
        <p class="published-card-subtitle">${art.subtitle}</p>
      </div>

      <div>
        <div class="published-card-meta">
          <span><i class="fas fa-user-circle"></i> ${art.author}</span>
          <span><i class="fas fa-calendar-alt"></i> ${art.date} · ${art.readTime}</span>
        </div>

        <div class="published-card-actions" style="margin-top: 1rem;">
          <button class="pub-btn pub-btn-read" onclick="openPublishedArticleModal('${art.id}')">
            <i class="fas fa-book-open"></i> Read
          </button>
          <button class="pub-btn pub-btn-edit" onclick="editPublishedArticle('${art.id}')">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="pub-btn pub-btn-delete" onclick="deletePublishedArticle('${art.id}')">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// Render Published Articles Stream on Index Main Journal
function renderIndexPublishedArticles() {
  const container = document.getElementById('publishedArticlesContainer');
  const grid = document.getElementById('indexPublishedGrid');
  const countEl = document.getElementById('indexPublishedCount');

  if (!grid || !container) return;

  const articles = getPublishedArticles();

  if (countEl) {
    countEl.textContent = `${articles.length} Article${articles.length === 1 ? '' : 's'}`;
  }

  grid.innerHTML = '';

  if (articles.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';

  articles.forEach(art => {
    const row = document.createElement('div');
    row.className = 'chapter-row';
    row.style.cursor = 'pointer';

    const tagBadge = art.tags && art.tags[0] ? art.tags[0] : 'Research';

    row.innerHTML = `
      <div class="chapter-meta">
        <span class="part-badge" style="color: var(--cyan); background: rgba(0, 240, 255, 0.1); border-color: var(--cyan);">${tagBadge}</span>
        <div class="chapter-info">
          <h4>${art.title}</h4>
          <span class="read-time"><i class="fas fa-book-open"></i> ${art.readTime} · ${art.date} · By ${art.author} · KaTeX math enabled</span>
        </div>
      </div>
      <div class="chapter-actions">
        <button class="btn-read-modal"><i class="fas fa-book-reader"></i> Read Full Paper</button>
      </div>
    `;

    row.addEventListener('click', () => {
      openPublishedArticleModal(art.id);
    });

    grid.appendChild(row);
  });
}

function openPublishedArticleModal(articleId) {
  const articles = getPublishedArticles();
  const article = articles.find(a => a.id === articleId) || articlesDatabase[articleId];

  if (!article) return;

  const modal = document.getElementById('articleModal');
  const modalContent = document.getElementById('articleContent');
  if (!modal || !modalContent) return;

  const catBadge = document.getElementById('articleCategoryBadge');
  if (catBadge) {
    catBadge.textContent = (article.tags && article.tags[0]) ? article.tags[0] : (article.category || 'Research');
  }

  const readTimeEl = document.getElementById('articleReadTime');
  if (readTimeEl) {
    readTimeEl.innerHTML = `<i class="fas fa-book-open"></i> ${article.readTime}`;
  }

  const dateEl = document.getElementById('articleDate');
  if (dateEl) {
    dateEl.textContent = article.date;
  }
  
  const wordCount = article.content ? article.content.trim().split(/\s+/).length : 0;
  const wordCountEl = document.getElementById('articleWordCount');
  if (wordCountEl) {
    wordCountEl.textContent = `${wordCount} words`;
  }

  const titleEl = document.getElementById('articleTitle');
  if (titleEl) titleEl.textContent = article.title;

  const subtitleEl = document.getElementById('articleSubtitle');
  if (subtitleEl) subtitleEl.textContent = article.subtitle;

  const authorNameEl = document.getElementById('articleAuthorName');
  if (authorNameEl) authorNameEl.textContent = article.author || 'Mohammad Taha Majlesi';
  
  const authorRoleEl = document.getElementById('articleAuthorRole');
  if (authorRoleEl) authorRoleEl.textContent = article.authorRole || 'Co-Founder & Lead AI Architect @ Hoosha AI';

  const avatarEl = document.getElementById('articleAuthorAvatar');
  if (avatarEl) {
    avatarEl.textContent = (article.author || 'M').charAt(0).toUpperCase();
  }

  renderFormattedContent(article.content, modalContent);
  modal.classList.add('active');

  const modalBody = document.getElementById('articleBody');
  if (modalBody) modalBody.scrollTop = 0;
}
window.openPublishedArticleModal = openPublishedArticleModal;

function editPublishedArticle(articleId) {
  const articles = getPublishedArticles();
  const article = articles.find(a => a.id === articleId);
  if (!article) return;

  const editingIdInput = document.getElementById('editingArticleId');
  if (editingIdInput) editingIdInput.value = article.id;

  const studioTitle = document.getElementById('studioTitle');
  if (studioTitle) studioTitle.value = article.title;

  const studioSubtitle = document.getElementById('studioSubtitle');
  if (studioSubtitle) studioSubtitle.value = article.subtitle;

  const studioTags = document.getElementById('studioTags');
  if (studioTags) studioTags.value = (article.tags || []).join(', ');

  const studioAuthor = document.getElementById('studioAuthor');
  if (studioAuthor) studioAuthor.value = article.author;

  const studioContent = document.getElementById('studioContent');
  if (studioContent) studioContent.value = article.content;

  const btnPublish = document.getElementById('btnPublishArticle');
  if (btnPublish) {
    btnPublish.innerHTML = '<i class="fas fa-save"></i> Update Published Article';
  }

  triggerStudioLivePreview();

  const studioCard = document.getElementById('publisherStudio');
  if (studioCard) {
    studioCard.scrollIntoView({ behavior: 'smooth' });
  }

  showToast('Editing Article ✏️', `Loaded "${article.title}" into the Publisher Studio.`, 'info', 4000);
}
window.editPublishedArticle = editPublishedArticle;

function deletePublishedArticle(articleId) {
  let articles = getPublishedArticles();
  const article = articles.find(a => a.id === articleId);

  if (!article) return;

  if (confirm(`Are you sure you want to delete the published paper "${article.title}"?`)) {
    articles = articles.filter(a => a.id !== articleId);
    savePublishedArticles(articles);
    renderPlatformPublishedArticles();
    renderIndexPublishedArticles();
    showToast('Article Deleted 🗑️', `"${article.title}" was removed.`, 'warning', 4500);
  }
}
window.deletePublishedArticle = deletePublishedArticle;

// Initialize components on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initNewsletterSection();
  loadSubstackArticlesGrid();
  loadSyncedSubstackArticles();
  initPublisherStudio();
  renderPlatformPublishedArticles();
  renderIndexPublishedArticles();
  initCFMVectorFieldSolver();
  initEpistemicUncertaintyProbe();
});

// ==========================================
// Web Audio API Synthesizer (Futuristic Sound FX Engine)
// ==========================================
const HooshaAudioEngine = {
  audioCtx: null,
  enabled: localStorage.getItem('hoosha_sound_enabled') !== 'false',

  initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  },

  toggleSound() {
    this.enabled = !this.enabled;
    localStorage.setItem('hoosha_sound_enabled', this.enabled ? 'true' : 'false');
    this.updateToggleUI();
    if (this.enabled) {
      this.playClickSound();
    }
  },

  updateToggleUI() {
    const btns = document.querySelectorAll('.sound-toggle-btn');
    btns.forEach(btn => {
      const icon = btn.querySelector('i');
      const text = btn.querySelector('.sound-status-text');
      if (this.enabled) {
        btn.classList.remove('muted');
        if (icon) icon.className = 'fas fa-volume-up';
        if (text) text.textContent = 'Audio';
      } else {
        btn.classList.add('muted');
        if (icon) icon.className = 'fas fa-volume-mute';
        if (text) text.textContent = 'Muted';
      }
    });
  },

  // 1. Crisp Futuristic Micro-Click (Button Clicks)
  playClickSound() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      console.warn('WebAudio playClick error:', e);
    }
  },

  // 2. Futuristic Kernel Compilation Charge-up Sweep
  playCompileSound() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(180, now);
      osc1.frequency.exponentialRampToValueAtTime(920, now + 0.35);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(360, now);
      osc2.frequency.exponentialRampToValueAtTime(1840, now + 0.35);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } catch (e) {
      console.warn('WebAudio playCompile error:', e);
    }
  },

  // 3. Kernel Compilation Success Sci-Fi Chime
  playCompileSuccessSound() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const startTime = now + idx * 0.045;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.06, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.16);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.16);
      });
    } catch (e) {
      console.warn('WebAudio playCompileSuccess error:', e);
    }
  },

  // 4. Tab Switch Sound
  playTabSound() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.06);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {
      console.warn('WebAudio playTab error:', e);
    }
  },

  // 5. Spotlight Slide Sound
  playSpotlightSound() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(1300, now + 0.05);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn('WebAudio playSpotlight error:', e);
    }
  }
};
window.HooshaAudioEngine = HooshaAudioEngine;

// Attach global event delegation for Web Audio sound triggers
document.addEventListener('click', (e) => {
  const target = e.target;
  const toggleBtn = target.closest('.sound-toggle-btn');
  if (toggleBtn) {
    HooshaAudioEngine.toggleSound();
    return;
  }

  const tabElem = target.closest('.kernel-tab, .zoo-filter-btn, .spotlight-filter-btn, .output-tab-btn, .chart-btn');
  if (tabElem) {
    HooshaAudioEngine.playTabSound();
    return;
  }

  const compileBtn = target.closest('#btnCompileKernel');
  if (compileBtn) {
    HooshaAudioEngine.playCompileSound();
    setTimeout(() => {
      HooshaAudioEngine.playCompileSuccessSound();
    }, 1000);
    return;
  }

  const clickable = target.closest('.btn, .nav-links a, .spotlight-nav-btn, .spotlight-item, .chapter-row, .repo-card, .pub-btn, .close-modal, .spotlight-close-btn, .run-btn, .zoo-btn-dl, .zoo-btn-code');
  if (clickable) {
    HooshaAudioEngine.playClickSound();
  }
});

// ==========================================
// Spotlight Command Palette (Cmd+K / Ctrl+K)
// Search engine across 20 Substack articles, model checkpoints, kernels, repos
// ==========================================

const SPOTLIGHT_DATABASE = [
  // --- SUBSTACK ARTICLES (20) ---
  {
    id: 'art-1',
    type: 'article',
    category: 'Substack Article',
    title: 'Scaling Transformers: How Linear Attention is Reshaping Cross-Task AI',
    desc: 'Breaking the Quadratic Bottleneck in Recommender Systems and Bidirectional Modeling.',
    date: 'Tue, 11 Aug 2026',
    url: 'https://hooshaai.substack.com/p/scaling-transformers-how-linear-attention',
    articleKey: 'rag-part1',
    icon: 'fas fa-newspaper',
    color: '#ff6719'
  },
  {
    id: 'art-2',
    type: 'article',
    category: 'Substack Article',
    title: 'The Architecture of Boundaries',
    desc: 'Navigating 2D Spintronics, Quasiconformal Geometry, and Infrared Kinematics.',
    date: 'Tue, 11 Aug 2026',
    url: 'https://hooshaai.substack.com/p/the-architecture-of-boundaries',
    articleKey: 'rag-part2',
    icon: 'fas fa-newspaper',
    color: '#ff6719'
  },
  {
    id: 'art-3',
    type: 'article',
    category: 'Substack Article',
    title: 'The Post-Transformer Era',
    desc: 'A Deep Dive into Sub-Quadratic Sequence Models.',
    date: 'Mon, 10 Aug 2026',
    url: 'https://hooshaai.substack.com/p/the-post-transformer-era',
    articleKey: 'rag-part3',
    icon: 'fas fa-newspaper',
    color: '#ff6719'
  },
  {
    id: 'art-4',
    type: 'article',
    category: 'Substack Article',
    title: 'The Rise of Linear Attention in Bidirectional Modeling and Long-Term Recommenders',
    desc: 'How LinRec and LION Are Rewriting the Rules for Sequences That Refuse to Stay Short.',
    date: 'Mon, 10 Aug 2026',
    url: 'https://hooshaai.substack.com/p/the-rise-of-linear-attention-in-bidirectional',
    articleKey: 'rag-part4',
    icon: 'fas fa-newspaper',
    color: '#ff6719'
  },
  {
    id: 'art-5',
    type: 'article',
    category: 'Substack Article',
    title: 'Re-Engineering the Attention Engine',
    desc: 'Mathematical Frontiers in Sub-Quadratic Transformers.',
    date: 'Mon, 10 Aug 2026',
    url: 'https://hooshaai.substack.com/p/re-engineering-the-attention-engine',
    icon: 'fas fa-newspaper',
    color: '#ff6719'
  },
  {
    id: 'art-6',
    type: 'article',
    category: 'Substack Article',
    title: 'Breaking the Quadratic Barrier',
    desc: 'The Architectural Evolution of Linear Transformers and Infinite Context Models.',
    date: 'Mon, 10 Aug 2026',
    url: 'https://hooshaai.substack.com/p/breaking-the-quadratic-barrier',
    icon: 'fas fa-newspaper',
    color: '#ff6719'
  },
  {
    id: 'art-7',
    type: 'article',
    category: 'Substack Article',
    title: 'Implementing Grounded Causal Verification to Prevent Recursive Epistemic Collapse in Self-Improving AI Systems',
    desc: 'The pursuit of recursive self-improvement in large language models relies on autonomous evaluation.',
    date: 'Fri, 07 Aug 2026',
    url: 'https://hooshaai.substack.com/p/implementing-grounded-causal-verification',
    icon: 'fas fa-newspaper',
    color: '#ff6719'
  },
  {
    id: 'art-8',
    type: 'article',
    category: 'Substack Article',
    title: 'The Civilization Simulator: Why Recursive AI Needs an Evolutionary Verification Engine',
    desc: 'On the biological bottleneck, the flintknapping compiler, epistemic vigilance, and grounded safety.',
    date: 'Fri, 07 Aug 2026',
    url: 'https://hooshaai.substack.com/p/the-civilization-simulator-why-recursive',
    icon: 'fas fa-newspaper',
    color: '#ff6719'
  },
  {
    id: 'art-9',
    type: 'article',
    category: 'Substack Article',
    title: 'Evaluation of Grounded Causal and Evolutionary Verification for Recursive Self-Improvement',
    desc: 'Executive Summary and technical benchmarks for Recursive Self-Improvement (RSI).',
    date: 'Fri, 07 Aug 2026',
    url: 'https://hooshaai.substack.com/p/evaluation-of-grounded-causal-and',
    icon: 'fas fa-newspaper',
    color: '#ff6719'
  },
  {
    id: 'art-10',
    type: 'article',
    category: 'Substack Article',
    title: 'Why Biological Constraints Breed Universal Adaptation While Unconstrained AI Collapses',
    desc: 'On Working-Memory Bottlenecks, Symbol Grounding, and Embodied Causal Engines.',
    date: 'Fri, 07 Aug 2026',
    url: 'https://hooshaai.substack.com/p/why-biological-constraints-breed',
    icon: 'fas fa-newspaper',
    color: '#ff6719'
  },
  {
    id: 'art-11',
    type: 'article',
    category: 'Substack Article',
    title: 'The Generalization Paradox: Why Biological Constraints Breed Universal Adaptation While Unconstrained AI Collapses',
    desc: 'Deep exploration of limited active memory slots vs infinite token context windows.',
    date: 'Fri, 07 Aug 2026',
    url: 'https://hooshaai.substack.com/p/the-generalization-paradox-why-biological',
    icon: 'fas fa-newspaper',
    color: '#ff6719'
  },
  {
    id: 'art-12',
    type: 'article',
    category: 'Substack Article',
    title: 'The True Paradigm: Symbolic Internalization, Not Just External Scaffolding',
    desc: 'Internalizing symbolic reasoning entirely inside neural transformer weights.',
    date: 'Thu, 06 Aug 2026',
    url: 'https://hooshaai.substack.com/p/the-true-paradigm-symbolic-internalization',
    icon: 'fas fa-newspaper',
    color: '#ff6719'
  },
  {
    id: 'art-13',
    type: 'article',
    category: 'Substack Article',
    title: 'The Cognitive Scaling Paradigm: Unifying Pre-Training, Inference Algorithms, and Post-Training Reinforcement Learning',
    desc: 'Unifying pre-training data accumulation with dynamic inference-time search.',
    date: 'Mon, 03 Aug 2026',
    url: 'https://hooshaai.substack.com/p/the-cognitive-scaling-paradigm-unifying',
    icon: 'fas fa-newspaper',
    color: '#ff6719'
  },
  {
    id: 'art-14',
    type: 'article',
    category: 'Substack Article',
    title: 'Building AI that thinks before speaking',
    desc: 'System-2 latent search and inference-time reflection mechanisms for reasoning LLMs.',
    date: 'Mon, 03 Aug 2026',
    url: 'https://hooshaai.substack.com/p/building-ai-that-thinks-before-speaking',
    icon: 'fas fa-newspaper',
    color: '#ff6719'
  },
  {
    id: 'art-15',
    type: 'article',
    category: 'Substack Article',
    title: 'The ACWT Architecture',
    desc: 'Adaptive Continuous-Wavelet Transformers for multi-scale sequence modeling.',
    date: 'Mon, 03 Aug 2026',
    url: 'https://hooshaai.substack.com/p/the-acwt-architecture',
    icon: 'fas fa-newspaper',
    color: '#ff6719'
  },
  {
    id: 'art-16',
    type: 'article',
    category: 'Substack Article',
    title: 'Beyond Bigger Datasets',
    desc: 'How RL, process supervision, and search replace data scaling for smarter language models.',
    date: 'Mon, 03 Aug 2026',
    url: 'https://hooshaai.substack.com/p/beyond-bigger-datasets',
    icon: 'fas fa-newspaper',
    color: '#ff6719'
  },
  {
    id: 'art-17',
    type: 'article',
    category: 'Substack Article',
    title: 'The Post-Training Frontier: Unified Frameworks for Reinforcement Learning, Process-Supervised Evaluation, and Test-Time Cognitive Scaling',
    desc: 'Unified frameworks for RL and process-supervised evaluation.',
    date: 'Mon, 03 Aug 2026',
    url: 'https://hooshaai.substack.com/p/the-post-training-frontier-unified',
    icon: 'fas fa-newspaper',
    color: '#ff6719'
  },
  {
    id: 'art-18',
    type: 'article',
    category: 'Substack Article',
    title: 'Building Synthetic Consciousness with Integrated Information Theory, Global Workspace Theory, and System-2 Refinement',
    desc: 'Combining IIT, GWT, and System-2 refinement as inductive biases for transformer attention.',
    date: 'Sat, 01 Aug 2026',
    url: 'https://hooshaai.substack.com/p/architecting-synthetic-consciousness',
    icon: 'fas fa-newspaper',
    color: '#ff6719'
  },
  {
    id: 'art-19',
    type: 'article',
    category: 'Substack Article',
    title: 'A Technical Report on the IIT-Attention Modulation (IIT-AM) Research Program',
    desc: 'Internal technical report, benchmark provenance logs, and evaluation results.',
    date: 'Sat, 01 Aug 2026',
    url: 'https://hooshaai.substack.com/p/a-technical-report-on-the-iit-attention',
    icon: 'fas fa-newspaper',
    color: '#ff6719'
  },
  {
    id: 'art-20',
    type: 'article',
    category: 'Substack Article',
    title: 'Open-Ended Innovation: Closing the Vocabulary and Verifier Gaps',
    desc: 'Inventing new concepts and verifiers for creative AI problem solving.',
    date: 'Mon, 27 Jul 2026',
    url: 'https://hooshaai.substack.com/p/open-ended-innovation-closing-the',
    icon: 'fas fa-newspaper',
    color: '#ff6719'
  },

  // --- MODEL CHECKPOINTS (6) ---
  {
    id: 'model-cfm-7b',
    type: 'model',
    category: 'Model Checkpoint',
    modelId: 'cfm-7b',
    title: 'Hoosha CFM-v2.5 7B',
    desc: 'hoosha-cfm-v2.5-7b-bf16.safetensors • Continuous Flow Matching ODE velocity vector field (BF16, 7.2B params).',
    badge: 'BF16 • 14.8 GB',
    icon: 'fas fa-cube',
    color: '#00f0ff'
  },
  {
    id: 'model-grpo-14b',
    type: 'model',
    category: 'Model Checkpoint',
    modelId: 'grpo-14b',
    title: 'Hoosha GRPO Reasoner 14B',
    desc: 'hoosha-grpo-reasoner-14b-fp8.safetensors • Group Relative Policy Optimization alignment checkpoint for mathematical reasoning (FP8, 14.1B params).',
    badge: 'FP8 • 14.2 GB',
    icon: 'fas fa-cube',
    color: '#00f0ff'
  },
  {
    id: 'model-moe-8x7b',
    type: 'model',
    category: 'Model Checkpoint',
    modelId: 'moe-8x7b',
    title: 'Hoosha Sparse MoE 8x7B',
    desc: 'hoosha-moe-8x7b-instruct-bf16.safetensors • Sparse Mixture-of-Experts architecture with top-2 router gating (BF16, 46.7B params).',
    badge: 'BF16 • 88.4 GB',
    icon: 'fas fa-cube',
    color: '#00f0ff'
  },
  {
    id: 'model-rag-3b',
    type: 'model',
    category: 'Model Checkpoint',
    modelId: 'rag-3b',
    title: 'Adaptive RAG Embedder 3B',
    desc: 'hoosha-adaptive-rag-embed-3b.safetensors • Dual-encoder embedding model for knowledge boundary confidence scoring (FP16, 3.1B params).',
    badge: 'FP16 • 6.1 GB',
    icon: 'fas fa-cube',
    color: '#00f0ff'
  },
  {
    id: 'model-vision-34b',
    type: 'model',
    category: 'Model Checkpoint',
    modelId: 'vision-34b',
    title: 'Hoosha Vision Flow 34B Q4',
    desc: 'hoosha-vision-flow-34b-q4.safetensors • High-resolution multimodal flow matching model for direct image-to-trajectory synthesis (INT4, 33.8B params).',
    badge: 'INT4 • 19.5 GB',
    icon: 'fas fa-cube',
    color: '#00f0ff'
  },
  {
    id: 'model-triton-scales',
    type: 'model',
    category: 'Model Checkpoint',
    modelId: 'triton-scales',
    title: 'Triton Kernel Scale Vectors v1',
    desc: 'hoosha-triton-kernel-weights-v1.safetensors • Fused quantization scale vectors and per-channel FP8 clipping factors (FP8, 600M params).',
    badge: 'FP8 • 1.2 GB',
    icon: 'fas fa-cube',
    color: '#00f0ff'
  },

  // --- KERNELS (4) ---
  {
    id: 'kernel-flash_attn',
    type: 'kernel',
    category: 'CUDA/Triton Kernel',
    kernelKey: 'flash_attn',
    title: 'FlashAttention-3 Fused Kernel',
    desc: 'Triton JIT fused causal attention kernel with FP8/BF16 scale vectors & WGMMA tensor core execution.',
    badge: 'Triton JIT',
    icon: 'fas fa-bolt',
    color: '#8a2be2'
  },
  {
    id: 'kernel-rmsnorm_swiglu',
    type: 'kernel',
    category: 'CUDA/Triton Kernel',
    kernelKey: 'rmsnorm_swiglu',
    title: 'Fused RMSNorm + SwiGLU Kernel',
    desc: 'Single-pass CUDA C++ warp shuffle kernel with zero memory roundtrips for LLM feed-forward layers.',
    badge: 'CUDA C++',
    icon: 'fas fa-microchip',
    color: '#8a2be2'
  },
  {
    id: 'kernel-fp8_gemm',
    type: 'kernel',
    category: 'CUDA/Triton Kernel',
    kernelKey: 'fp8_gemm',
    title: 'FP8 Block-Scaled WGMMA GEMM',
    desc: 'NVIDIA H100 Hopper Tensor Core asynchronous WGMMA Matrix Multiplication with dynamic scale factors.',
    badge: 'WGMMA FP8',
    icon: 'fas fa-bolt',
    color: '#8a2be2'
  },
  {
    id: 'kernel-cfm_velocity',
    type: 'kernel',
    category: 'CUDA/Triton Kernel',
    kernelKey: 'cfm_velocity',
    title: 'Continuous Flow Matching Velocity Integrator',
    desc: 'CUDA vectorized float4 ODE integrator kernel for continuous-time generative trajectories.',
    badge: 'CUDA float4',
    icon: 'fas fa-water',
    color: '#8a2be2'
  },

  // --- REPOSITORIES (3) ---
  {
    id: 'repo-consciousness',
    type: 'repo',
    category: 'Open Source Repo',
    title: 'Hooshaai / consciousness_in_LLMs',
    desc: 'Probing self-awareness metrics, logit variance, and internal representations in Large Language Models.',
    url: 'https://github.com/Hooshaai/consciousness_in_LLMs',
    badge: 'Python • HF',
    icon: 'fab fa-github',
    color: '#ec4899'
  },
  {
    id: 'repo-diff-attention',
    type: 'repo',
    category: 'Open Source Repo',
    title: 'Hooshaai / Diff-Attention',
    desc: 'Fused Differential Attention operator implementation for efficient context scaling and memory reduction.',
    url: 'https://github.com/Hooshaai/Diff-Attention',
    badge: 'Triton • CUDA • PyTorch',
    icon: 'fab fa-github',
    color: '#ec4899'
  },
  {
    id: 'repo-portal',
    type: 'repo',
    category: 'Open Source Repo',
    title: 'Hooshaai / hooshaai.github.io',
    desc: 'Official Hoosha AI research portal, continuous-time generative modeling hub, and interactive platform.',
    url: 'https://github.com/Hooshaai/hooshaai.github.io',
    badge: 'Web Engine • JS • CSS',
    icon: 'fab fa-github',
    color: '#ec4899'
  }
];

class SpotlightEngine {
  constructor() {
    this.modal = document.getElementById('spotlightModal');
    this.searchInput = document.getElementById('spotlightSearchInput');
    this.resultsBody = document.getElementById('spotlightResultsBody');
    this.closeBtn = document.getElementById('spotlightCloseBtn');
    this.openBtn = document.getElementById('spotlightNavBtn');
    this.filterBtns = document.querySelectorAll('.spotlight-filter-btn');

    this.activeCategory = 'all';
    this.highlightIndex = 0;
    this.filteredResults = [];

    this.init();
  }

  init() {
    if (!this.modal || !this.searchInput || !this.resultsBody) return;

    // Keyboard shortcut Cmd+K / Ctrl+K
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggleModal();
      } else if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.closeModal();
      } else if (this.modal.classList.contains('active')) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.navigateHighlight(1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.navigateHighlight(-1);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.selectHighlightedItem();
        }
      }
    });

    if (this.openBtn) {
      this.openBtn.addEventListener('click', () => this.openModal());
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeModal());
    }

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    this.searchInput.addEventListener('input', () => {
      this.highlightIndex = 0;
      this.render();
    });

    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCategory = btn.dataset.category || 'all';
        this.highlightIndex = 0;
        this.render();
      });
    });

    this.updateCategoryCounts();
  }

  openModal() {
    this.modal.classList.add('active');
    this.searchInput.value = '';
    this.highlightIndex = 0;
    this.render();
    setTimeout(() => this.searchInput.focus(), 50);
    HooshaAudioEngine.playSpotlightSound();
  }

  closeModal() {
    this.modal.classList.remove('active');
  }

  toggleModal() {
    if (this.modal.classList.contains('active')) {
      this.closeModal();
    } else {
      this.openModal();
    }
  }

  updateCategoryCounts() {
    const counts = {
      all: SPOTLIGHT_DATABASE.length,
      article: SPOTLIGHT_DATABASE.filter(i => i.type === 'article').length,
      model: SPOTLIGHT_DATABASE.filter(i => i.type === 'model').length,
      kernel: SPOTLIGHT_DATABASE.filter(i => i.type === 'kernel').length,
      repo: SPOTLIGHT_DATABASE.filter(i => i.type === 'repo').length
    };

    Object.keys(counts).forEach(cat => {
      const badge = document.getElementById(`count-${cat}`);
      if (badge) badge.textContent = counts[cat];
    });
  }

  getFilteredItems() {
    const query = (this.searchInput.value || '').toLowerCase().trim();
    return SPOTLIGHT_DATABASE.filter(item => {
      const matchesCategory = this.activeCategory === 'all' || item.type === this.activeCategory;
      const matchesQuery = !query ||
        item.title.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query) ||
        (item.badge && item.badge.toLowerCase().includes(query)) ||
        item.category.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }

  navigateHighlight(direction) {
    if (this.filteredResults.length === 0) return;
    this.highlightIndex = (this.highlightIndex + direction + this.filteredResults.length) % this.filteredResults.length;
    this.updateHighlightUI();
  }

  updateHighlightUI() {
    const items = this.resultsBody.querySelectorAll('.spotlight-item');
    items.forEach((item, idx) => {
      if (idx === this.highlightIndex) {
        item.classList.add('highlighted');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('highlighted');
      }
    });
  }

  selectHighlightedItem() {
    if (this.filteredResults.length === 0 || !this.filteredResults[this.highlightIndex]) return;
    const item = this.filteredResults[this.highlightIndex];
    this.executeItemAction(item);
  }

  executeItemAction(item) {
    this.closeModal();
    HooshaAudioEngine.playClickSound();

    if (item.type === 'article') {
      if (typeof openArticleModal === 'function' && item.articleKey && articlesDatabase && articlesDatabase[item.articleKey]) {
        openArticleModal(item.articleKey);
      } else {
        window.open(item.url, '_blank');
      }
    } else if (item.type === 'model') {
      if (typeof openDownloadModal === 'function') {
        openDownloadModal(item.modelId);
        const zooSec = document.getElementById('modelZooSection') || document.getElementById('ecosystem');
        if (zooSec) zooSec.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = `models.html#model-${item.modelId}`;
      }
    } else if (item.type === 'kernel') {
      const kernelTab = document.querySelector(`.kernel-tab[data-kernel="${item.kernelKey}"]`);
      if (kernelTab) {
        kernelTab.click();
        const kernelSec = document.getElementById('kernelPlaygroundSection');
        if (kernelSec) kernelSec.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = `platform.html#kernel-${item.kernelKey}`;
      }
    } else if (item.type === 'repo') {
      window.open(item.url, '_blank');
    }
  }

  render() {
    this.filteredResults = this.getFilteredItems();

    if (this.filteredResults.length === 0) {
      this.resultsBody.innerHTML = `
        <div class="spotlight-empty-state">
          <i class="fas fa-search-minus spotlight-empty-icon"></i>
          <p>No matching articles, model checkpoints, kernels, or repos found.</p>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Try typing keywords like "Flow Matching", "GRPO", "Triton", or "Attention".</span>
        </div>
      `;
      return;
    }

    if (this.highlightIndex >= this.filteredResults.length) {
      this.highlightIndex = 0;
    }

    this.resultsBody.innerHTML = this.filteredResults.map((item, idx) => `
      <div class="spotlight-item ${idx === this.highlightIndex ? 'highlighted' : ''}" data-index="${idx}">
        <div class="spotlight-item-left">
          <div class="spotlight-item-icon-box" style="color: ${item.color}; border: 1px solid ${item.color}33;">
            <i class="${item.icon}"></i>
          </div>
          <div class="spotlight-item-content">
            <div class="spotlight-item-title-row">
              <span class="spotlight-item-title">${item.title}</span>
            </div>
            <div class="spotlight-item-desc">${item.desc}</div>
          </div>
        </div>
        <div class="spotlight-item-right">
          <span class="spotlight-category-badge">${item.badge || item.category}</span>
          <span class="spotlight-select-hint"><kbd>↵ Select</kbd></span>
        </div>
      </div>
    `).join('');

    const itemElems = this.resultsBody.querySelectorAll('.spotlight-item');
    itemElems.forEach((elem, idx) => {
      elem.addEventListener('click', () => {
        this.highlightIndex = idx;
        this.selectHighlightedItem();
      });
      elem.addEventListener('mouseenter', () => {
        this.highlightIndex = idx;
        this.updateHighlightUI();
      });
    });
  }
}

// ==========================================
// 1. Interactive HTML5 Canvas 2D Vector Field Solver for Continuous Flow Matching
// ==========================================
function initCFMVectorFieldSolver() {
  const canvas = document.getElementById('cfmSolverCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  // Controls & Elements
  const solverSelect = document.getElementById('cfmVectorSolverSelect');
  const presetSelect = document.getElementById('cfmPresetSelect');
  const btnPlay = document.getElementById('btnPlayCFMVector');
  const btnReset = document.getElementById('btnResetCFMVector');
  const btnToggleQuiver = document.getElementById('btnToggleFieldVectors');
  const speedSlider = document.getElementById('cfmSpeedSlider');
  const particleSlider = document.getElementById('cfmParticleSlider');
  const btnAddPoint = document.getElementById('btnAddControlPoint');

  // Stats Elements
  const elControlCount = document.getElementById('cfmControlPointsCount');
  const elOtCost = document.getElementById('cfmOtCostVal');
  const elStraightness = document.getElementById('cfmStraightnessVal');
  const elLoss = document.getElementById('cfmVectorLossVal');
  const elParticles = document.getElementById('cfmParticleCountVal');

  let width = canvas.width;
  let height = canvas.height;
  let isRunning = true;
  let showQuiver = true;

  function resizeCanvas() {
    const container = canvas.parentElement;
    if (container && container.clientWidth > 0) {
      canvas.width = container.clientWidth;
      canvas.height = 420;
      width = canvas.width;
      height = canvas.height;
    }
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let anchors = [];

  function loadPreset(presetName) {
    anchors = [];
    if (presetName === 'ot-bimodal') {
      anchors.push({ id: 's1', type: 'source', x: width * 0.18, y: height * 0.3, radius: 10, isDragging: false });
      anchors.push({ id: 's2', type: 'source', x: width * 0.18, y: height * 0.5, radius: 10, isDragging: false });
      anchors.push({ id: 's3', type: 'source', x: width * 0.18, y: height * 0.7, radius: 10, isDragging: false });

      anchors.push({ id: 't1', type: 'target', x: width * 0.82, y: height * 0.25, radius: 10, isDragging: false });
      anchors.push({ id: 't2', type: 'target', x: width * 0.82, y: height * 0.5, radius: 10, isDragging: false });
      anchors.push({ id: 't3', type: 'target', x: width * 0.82, y: height * 0.75, radius: 10, isDragging: false });
    } else if (presetName === 'concentric') {
      const cx = width * 0.5, cy = height * 0.5;
      for (let i = 0; i < 4; i++) {
        const ang = (i / 4) * Math.PI * 2;
        anchors.push({ id: `s${i+1}`, type: 'source', x: cx + Math.cos(ang) * 60, y: cy + Math.sin(ang) * 60, radius: 10, isDragging: false });
      }
      for (let i = 0; i < 4; i++) {
        const ang = (i / 4) * Math.PI * 2 + Math.PI / 4;
        anchors.push({ id: `t${i+1}`, type: 'target', x: cx + Math.cos(ang) * 160, y: cy + Math.sin(ang) * 160, radius: 10, isDragging: false });
      }
    } else if (presetName === 'saddle') {
      const cx = width * 0.5, cy = height * 0.5;
      anchors.push({ id: 's1', type: 'source', x: cx - 180, y: cy - 100, radius: 10, isDragging: false });
      anchors.push({ id: 's2', type: 'source', x: cx - 180, y: cy + 100, radius: 10, isDragging: false });
      anchors.push({ id: 't1', type: 'target', x: cx + 180, y: cy - 120, radius: 10, isDragging: false });
      anchors.push({ id: 't2', type: 'target', x: cx + 180, y: cy + 120, radius: 10, isDragging: false });
    } else if (presetName === 'hoosha-h') {
      const cx = width * 0.72, cy = height * 0.5;
      anchors.push({ id: 's1', type: 'source', x: width * 0.15, y: height * 0.25, radius: 10, isDragging: false });
      anchors.push({ id: 's2', type: 'source', x: width * 0.15, y: height * 0.5, radius: 10, isDragging: false });
      anchors.push({ id: 's3', type: 'source', x: width * 0.15, y: height * 0.75, radius: 10, isDragging: false });

      anchors.push({ id: 't1', type: 'target', x: cx - 50, y: cy - 90, radius: 10, isDragging: false });
      anchors.push({ id: 't2', type: 'target', x: cx - 50, y: cy + 90, radius: 10, isDragging: false });
      anchors.push({ id: 't3', type: 'target', x: cx - 50, y: cy, radius: 10, isDragging: false });
      anchors.push({ id: 't4', type: 'target', x: cx + 50, y: cy, radius: 10, isDragging: false });
      anchors.push({ id: 't5', type: 'target', x: cx + 50, y: cy - 90, radius: 10, isDragging: false });
      anchors.push({ id: 't6', type: 'target', x: cx + 50, y: cy + 90, radius: 10, isDragging: false });
    }
    initParticles();
    updateMetricsDisplay();
  }

  let draggedAnchor = null;

  function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
    return {
      x: (clientX - rect.left) * (width / rect.width),
      y: (clientY - rect.top) * (height / rect.height)
    };
  }

  function handleStart(evt) {
    const pos = getMousePos(evt);
    for (let i = 0; i < anchors.length; i++) {
      const a = anchors[i];
      const dist = Math.hypot(a.x - pos.x, a.y - pos.y);
      if (dist <= a.radius + 8) {
        draggedAnchor = a;
        a.isDragging = true;
        canvas.style.cursor = 'grabbing';
        evt.preventDefault();
        break;
      }
    }
  }

  function handleMove(evt) {
    const pos = getMousePos(evt);
    if (draggedAnchor) {
      draggedAnchor.x = Math.max(15, Math.min(width - 15, pos.x));
      draggedAnchor.y = Math.max(15, Math.min(height - 15, pos.y));
      updateMetricsDisplay();
      evt.preventDefault();
    } else {
      let hovering = false;
      for (let i = 0; i < anchors.length; i++) {
        const a = anchors[i];
        if (Math.hypot(a.x - pos.x, a.y - pos.y) <= a.radius + 8) {
          hovering = true;
          break;
        }
      }
      canvas.style.cursor = hovering ? 'grab' : 'crosshair';
    }
  }

  function handleEnd() {
    if (draggedAnchor) {
      draggedAnchor.isDragging = false;
      draggedAnchor = null;
      canvas.style.cursor = 'crosshair';
      updateMetricsDisplay();
    }
  }

  canvas.addEventListener('mousedown', handleStart);
  canvas.addEventListener('mousemove', handleMove);
  window.addEventListener('mouseup', handleEnd);

  canvas.addEventListener('touchstart', handleStart, { passive: false });
  canvas.addEventListener('touchmove', handleMove, { passive: false });
  window.addEventListener('touchend', handleEnd);

  let particles = [];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      const sources = anchors.filter(a => a.type === 'source');
      const targets = anchors.filter(a => a.type === 'target');
      
      if (sources.length > 0) {
        const s = sources[Math.floor(Math.random() * sources.length)];
        this.x0 = s.x + (Math.random() - 0.5) * 35;
        this.y0 = s.y + (Math.random() - 0.5) * 35;
      } else {
        this.x0 = Math.random() * width * 0.3;
        this.y0 = Math.random() * height;
      }

      if (targets.length > 0) {
        const t = targets[Math.floor(Math.random() * targets.length)];
        this.x1 = t.x + (Math.random() - 0.5) * 35;
        this.y1 = t.y + (Math.random() - 0.5) * 35;
      } else {
        this.x1 = width * 0.8 + (Math.random() - 0.5) * 50;
        this.y1 = Math.random() * height;
      }

      this.x = this.x0;
      this.y = this.y0;
      this.t = Math.random() * 0.1;
      this.history = [];
      this.speedFactor = 0.85 + Math.random() * 0.35;
    }

    getVelocity(px, py, pt) {
      const sources = anchors.filter(a => a.type === 'source');
      const targets = anchors.filter(a => a.type === 'target');

      if (sources.length === 0 || targets.length === 0) {
        return { vx: (this.x1 - this.x0), vy: (this.y1 - this.y0) };
      }

      let vxTotal = 0;
      let vyTotal = 0;
      let wSum = 0;

      for (let i = 0; i < Math.max(sources.length, targets.length); i++) {
        const s = sources[i % sources.length];
        const t = targets[i % targets.length];

        const xt = (1 - pt) * s.x + pt * t.x;
        const yt = (1 - pt) * s.y + pt * t.y;

        const dx = px - xt;
        const dy = py - yt;
        const distSq = dx * dx + dy * dy;
        const sigma = 140;
        const w = Math.exp(-distSq / (2 * sigma * sigma));

        vxTotal += w * (t.x - s.x);
        vyTotal += w * (t.y - s.y);
        wSum += w;
      }

      if (wSum > 1e-5) {
        return { vx: vxTotal / wSum, vy: vyTotal / wSum };
      }
      return { vx: (this.x1 - this.x0), vy: (this.y1 - this.y0) };
    }

    update(dt, solver) {
      this.history.push({ x: this.x, y: this.y });
      if (this.history.length > 8) this.history.shift();

      const stepDt = dt * this.speedFactor;

      if (solver === 'ot-cfm') {
        this.t += stepDt;
        this.x = (1 - this.t) * this.x0 + this.t * this.x1;
        this.y = (1 - this.t) * this.y0 + this.t * this.y1;
      } else if (solver === 'rk4') {
        const k1 = this.getVelocity(this.x, this.y, this.t);
        const k2 = this.getVelocity(this.x + 0.5 * stepDt * k1.vx, this.y + 0.5 * stepDt * k1.vy, this.t + 0.5 * stepDt);
        const k3 = this.getVelocity(this.x + 0.5 * stepDt * k2.vx, this.y + 0.5 * stepDt * k2.vy, this.t + 0.5 * stepDt);
        const k4 = this.getVelocity(this.x + stepDt * k3.vx, this.y + stepDt * k3.vy, this.t + stepDt);

        this.x += (stepDt / 6) * (k1.vx + 2 * k2.vx + 2 * k3.vx + k4.vx);
        this.y += (stepDt / 6) * (k1.vy + 2 * k2.vy + 2 * k3.vy + k4.vy);
        this.t += stepDt;
      } else if (solver === 'midpoint') {
        const v1 = this.getVelocity(this.x, this.y, this.t);
        const vMid = this.getVelocity(this.x + 0.5 * stepDt * v1.vx, this.y + 0.5 * stepDt * v1.vy, this.t + 0.5 * stepDt);
        this.x += stepDt * vMid.vx;
        this.y += stepDt * vMid.vy;
        this.t += stepDt;
      } else { // Euler
        const v = this.getVelocity(this.x, this.y, this.t);
        this.x += stepDt * v.vx;
        this.y += stepDt * v.vy;
        this.t += stepDt;
      }

      if (this.t >= 1.0) {
        this.reset();
      }
    }

    draw() {
      if (this.history.length > 1) {
        ctx.beginPath();
        ctx.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 1; i < this.history.length; i++) {
          ctx.lineTo(this.history[i].x, this.history[i].y);
        }
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 + this.t * 0.35})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = this.t > 0.85 ? '#10b981' : '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function initParticles() {
    const count = parseInt(particleSlider ? particleSlider.value : 180);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
    if (elParticles) elParticles.textContent = `${count} ODE Particles`;
  }

  function updateMetricsDisplay() {
    const sources = anchors.filter(a => a.type === 'source');
    const targets = anchors.filter(a => a.type === 'target');
    if (elControlCount) elControlCount.textContent = `${anchors.length} Anchors (${sources.length}S / ${targets.length}T)`;

    let sumDistSq = 0;
    const nPair = Math.max(1, Math.min(sources.length, targets.length));
    for (let i = 0; i < nPair; i++) {
      const s = sources[i];
      const t = targets[i];
      sumDistSq += Math.hypot(t.x - s.x, t.y - s.y) ** 2;
    }
    const otCost = (sumDistSq / (nPair * width * height)).toFixed(4);
    if (elOtCost) elOtCost.textContent = otCost;

    const straightness = (99.4 - otCost * 45).toFixed(1);
    if (elStraightness) elStraightness.textContent = `${Math.max(92.0, Math.min(99.8, straightness))}%`;

    const loss = (0.015 + otCost * 0.75).toFixed(4);
    if (elLoss) elLoss.textContent = loss;
  }

  function drawVectorField() {
    if (!showQuiver) return;
    const cols = 22;
    const rows = 11;
    const cellW = width / cols;
    const cellH = height / rows;

    const sources = anchors.filter(a => a.type === 'source');
    const targets = anchors.filter(a => a.type === 'target');
    if (sources.length === 0 || targets.length === 0) return;

    ctx.lineWidth = 1;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const gx = (i + 0.5) * cellW;
        const gy = (j + 0.5) * cellH;

        let vxTotal = 0, vyTotal = 0, wSum = 0;
        for (let k = 0; k < Math.max(sources.length, targets.length); k++) {
          const s = sources[k % sources.length];
          const t = targets[k % targets.length];
          const xt = 0.5 * s.x + 0.5 * t.x;
          const yt = 0.5 * s.y + 0.5 * t.y;
          const distSq = (gx - xt) ** 2 + (gy - yt) ** 2;
          const w = Math.exp(-distSq / (2 * 140 * 140));
          vxTotal += w * (t.x - s.x);
          vyTotal += w * (t.y - s.y);
          wSum += w;
        }

        if (wSum > 1e-5) {
          vxTotal /= wSum;
          vyTotal /= wSum;
        } else {
          vxTotal = targets[0].x - sources[0].x;
          vyTotal = targets[0].y - sources[0].y;
        }

        const mag = Math.hypot(vxTotal, vyTotal);
        if (mag < 1) continue;

        const arrowLen = Math.min(18, Math.max(6, mag * 0.04));
        const angle = Math.atan2(vyTotal, vxTotal);

        const ex = gx + Math.cos(angle) * arrowLen;
        const ey = gy + Math.sin(angle) * arrowLen;

        ctx.strokeStyle = `rgba(0, 240, 255, ${Math.min(0.35, mag / 600)})`;
        ctx.beginPath();
        ctx.moveTo(gx, gy);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ex, ey, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(138, 43, 226, 0.4)';
        ctx.fill();
      }
    }
  }

  function drawAnchors() {
    anchors.forEach(a => {
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);

      if (a.type === 'source') {
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
      } else {
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
      }

      ctx.shadowBlur = a.isDragging ? 18 : 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = a.isDragging ? 3 : 1.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px "JetBrains Mono"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(a.id.toUpperCase(), a.x, a.y);
    });

    const sources = anchors.filter(a => a.type === 'source');
    const targets = anchors.filter(a => a.type === 'target');
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;

    for (let i = 0; i < Math.min(sources.length, targets.length); i++) {
      ctx.beginPath();
      ctx.moveTo(sources[i].x, sources[i].y);
      ctx.lineTo(targets[i].x, targets[i].y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    drawVectorField();

    if (isRunning) {
      const dt = parseFloat(speedSlider ? speedSlider.value : 0.008);
      const solver = solverSelect ? solverSelect.value : 'ot-cfm';
      particles.forEach(p => p.update(dt, solver));
    }

    particles.forEach(p => p.draw());
    drawAnchors();

    requestAnimationFrame(render);
  }

  if (presetSelect) {
    presetSelect.addEventListener('change', (e) => loadPreset(e.target.value));
  }

  if (btnPlay) {
    btnPlay.addEventListener('click', () => {
      isRunning = !isRunning;
      if (isRunning) {
        btnPlay.classList.add('active');
        btnPlay.innerHTML = '<i class="fas fa-pause"></i> Flow ODE';
      } else {
        btnPlay.classList.remove('active');
        btnPlay.innerHTML = '<i class="fas fa-play"></i> Flow ODE';
      }
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      loadPreset(presetSelect ? presetSelect.value : 'ot-bimodal');
    });
  }

  if (btnToggleQuiver) {
    btnToggleQuiver.addEventListener('click', () => {
      showQuiver = !showQuiver;
      btnToggleQuiver.classList.toggle('active', showQuiver);
    });
  }

  if (particleSlider) {
    particleSlider.addEventListener('input', () => initParticles());
  }

  if (btnAddPoint) {
    btnAddPoint.addEventListener('click', () => {
      const id = `t${anchors.filter(a => a.type === 'target').length + 1}`;
      anchors.push({
        id: id,
        type: 'target',
        x: width * 0.5 + (Math.random() - 0.5) * 200,
        y: height * 0.5 + (Math.random() - 0.5) * 200,
        radius: 10,
        isDragging: false
      });
      initParticles();
      updateMetricsDisplay();
    });
  }

  loadPreset('ot-bimodal');
  render();
}

// ==========================================
// 2. Interactive LLM Epistemic Uncertainty Probe
// ==========================================
function initEpistemicUncertaintyProbe() {
  const promptInput = document.getElementById('epistemicPromptInput');
  if (!promptInput) return;

  const thresholdSlider = document.getElementById('uncertaintyThresholdSlider');
  const thresholdValDisplay = document.getElementById('thresholdValDisplay');
  const heatmapContainer = document.getElementById('tokenHeatmapContainer');
  const elEntropyVal = document.getElementById('logitEntropyVal');
  const elEntropyBar = document.getElementById('entropyBar');
  const elConfidenceVal = document.getElementById('confidenceVal');
  const elConfidenceBar = document.getElementById('confidenceBar');
  const elAleatoricVal = document.getElementById('aleatoricVal');
  const elTopTokenProbVal = document.getElementById('topTokenProbVal');
  const decisionBadge = document.getElementById('retrievalDecisionBadge');
  const boxTitle = document.getElementById('retrievalBoxTitle');
  const boxContent = document.getElementById('retrievalBoxContent');

  const mockKnowledgeBase = [
    {
      id: 'DOC-8942',
      title: 'Hoosha AI Q3 2025 Financial & CFM Telemetry Report',
      snippet: 'Q3 2025 cluster revenue reached $14.8M with 99.4% ODE vector integration efficiency across 8x H100 SXM5 nodes.',
      similarity: 0.948
    },
    {
      id: 'DOC-4109',
      title: 'Continuous Flow Matching ODE vs Score SDE Kernel Architectures',
      snippet: 'CFM straight trajectories achieve optimal transport paths with linear velocity fields v_t(x) = x_1 - x_0, reducing ODE solver steps from 1000 to 20.',
      similarity: 0.892
    },
    {
      id: 'DOC-7721',
      title: 'Epistemic Uncertainty Calibration & Selective Retrieval Protocols',
      snippet: 'Selective RAG triggers vector index lookup when logit entropy H(p) > tau. Bypasses RAG when parametric confidence exceeds 90%.',
      similarity: 0.865
    }
  ];

  const domainUncertaintyMap = {
    'hoosha': 1.85, 'q3': 2.10, '2025': 1.95, 'financial': 1.65, 'revenue': 1.70,
    'metrics': 1.40, 'h100': 1.50, 'cluster': 1.35, 'deployments': 1.25,
    'cfm': 1.45, 'sde': 1.55, 'ode': 1.20, 'grpo': 1.40, 'safetensors': 1.30,
    'olympic': 2.45, '2028': 2.50, 'marathon': 2.20, 'exact': 1.60, 'breakdown': 1.50,
    'kernel': 1.10, 'triton': 1.25, 'cuda': 1.05
  };

  function analyzePrompt() {
    const text = promptInput.value.trim();
    const threshold = parseFloat(thresholdSlider ? thresholdSlider.value : 1.10);

    if (thresholdValDisplay) {
      thresholdValDisplay.textContent = `${threshold.toFixed(2)} nats`;
    }

    if (!text) {
      if (heatmapContainer) heatmapContainer.innerHTML = '<span style="color: #64748b; font-style: italic;">Type a prompt above or click a preset prompt chip to calculate epistemic entropy...</span>';
      if (elEntropyVal) elEntropyVal.textContent = '0.00 nats';
      if (elEntropyBar) elEntropyBar.style.width = '0%';
      if (elConfidenceVal) elConfidenceVal.textContent = '100.0%';
      if (elConfidenceBar) elConfidenceBar.style.width = '100%';
      if (elAleatoricVal) elAleatoricVal.textContent = '0.00';
      if (elTopTokenProbVal) elTopTokenProbVal.textContent = '100.0%';

      if (decisionBadge) {
        decisionBadge.className = 'decision-badge direct-pass';
        decisionBadge.innerHTML = '<i class="fas fa-bolt"></i> PARAMETRIC DIRECT PASS';
      }
      if (boxTitle) boxTitle.textContent = 'Direct LLM Parametric Execution Log';
      if (boxContent) boxContent.innerHTML = '<span style="color: #64748b;">Awaiting prompt input to evaluate retrieval gate condition...</span>';
      return;
    }

    const rawTokens = text.match(/\w+|[^\w\s]/g) || [text];
    let totalEntropy = 0;
    const tokenDetails = [];

    rawTokens.forEach(t => {
      const lower = t.toLowerCase();
      let entropy = 0.25 + Math.random() * 0.15;

      if (domainUncertaintyMap[lower] !== undefined) {
        entropy = domainUncertaintyMap[lower] + (Math.random() * 0.2 - 0.1);
      } else if (t.length > 7) {
        entropy += 0.45;
      } else if (/\d+/.test(t)) {
        entropy += 0.70;
      }

      totalEntropy += entropy;
      tokenDetails.push({ token: t, entropy });
    });

    const meanEntropy = +(totalEntropy / rawTokens.length).toFixed(2);
    const confidencePercent = +Math.max(5.0, Math.min(99.9, (1 - meanEntropy / 2.5) * 100)).toFixed(1);
    const aleatoric = +(0.05 + meanEntropy * 0.18 + Math.random() * 0.04).toFixed(2);
    const topProb = +Math.max(12.0, Math.min(98.5, 100 - meanEntropy * 28)).toFixed(1);

    if (elEntropyVal) elEntropyVal.textContent = `${meanEntropy.toFixed(2)} nats`;
    if (elEntropyBar) {
      const barWidth = Math.min(100, (meanEntropy / 2.5) * 100);
      elEntropyBar.style.width = `${barWidth}%`;
      elEntropyBar.style.background = meanEntropy > threshold ? '#ef4444' : (meanEntropy > 0.6 ? '#f59e0b' : '#00f0ff');
    }

    if (elConfidenceVal) elConfidenceVal.textContent = `${confidencePercent}%`;
    if (elConfidenceBar) {
      elConfidenceBar.style.width = `${confidencePercent}%`;
      elConfidenceBar.style.background = confidencePercent > 80 ? '#10b981' : (confidencePercent > 50 ? '#f59e0b' : '#ef4444');
    }

    if (elAleatoricVal) elAleatoricVal.textContent = aleatoric;
    if (elTopTokenProbVal) elTopTokenProbVal.textContent = `${topProb}%`;

    if (heatmapContainer) {
      heatmapContainer.innerHTML = '';
      tokenDetails.forEach(item => {
        const span = document.createElement('span');
        let cls = 'token-chip certain';
        if (item.entropy > 1.2) {
          cls = 'token-chip uncertain';
        } else if (item.entropy > 0.5) {
          cls = 'token-chip moderate';
        }
        span.className = cls;
        span.textContent = item.token;
        span.title = `Token: "${item.token}" | Epistemic Entropy: ${item.entropy.toFixed(2)} nats`;
        heatmapContainer.appendChild(span);
      });
    }

    const isTriggered = meanEntropy > threshold;

    if (decisionBadge) {
      if (isTriggered) {
        decisionBadge.className = 'decision-badge rag-triggered';
        decisionBadge.innerHTML = '<i class="fas fa-exclamation-triangle"></i> SELECTIVE RAG RETRIEVAL TRIGGERED';
      } else {
        decisionBadge.className = 'decision-badge direct-pass';
        decisionBadge.innerHTML = '<i class="fas fa-bolt"></i> PARAMETRIC DIRECT PASS';
      }
    }

    if (boxTitle && boxContent) {
      if (isTriggered) {
        boxTitle.innerHTML = `<span style="color: #f87171;"><i class="fas fa-exclamation-triangle"></i> Selective RAG Triggered (Uncertainty ${meanEntropy.toFixed(2)} nats > Threshold τ = ${threshold.toFixed(2)} nats)</span>`;

        let docsHTML = '<div style="margin-bottom: 0.5rem; color: #e2e8f0;">Executing dense vector search across 1.4M chunk index...</div>';
        mockKnowledgeBase.forEach(doc => {
          docsHTML += `
            <div style="background: rgba(239, 68, 68, 0.08); border-left: 3px solid #ef4444; padding: 0.4rem 0.6rem; margin-bottom: 0.4rem; border-radius: 4px;">
              <div style="color: #fca5a5; font-weight: bold; display: flex; justify-content: space-between;">
                <span><i class="fas fa-file-alt"></i> ${doc.id}: ${doc.title}</span>
                <span style="color: #10b981;">Sim: ${doc.similarity}</span>
              </div>
              <div style="color: #cbd5e1; font-size: 0.76rem; margin-top: 0.2rem;">"${doc.snippet}"</div>
            </div>
          `;
        });
        docsHTML += '<div style="color: var(--cyan); margin-top: 0.4rem;"><i class="fas fa-plus-circle"></i> Injected 3 retrieved context chunks into LLM prompt payload. (Latency: +14.2ms)</div>';
        boxContent.innerHTML = docsHTML;
      } else {
        boxTitle.innerHTML = `<span style="color: #10b981;"><i class="fas fa-check-circle"></i> Direct Parametric Execution Log (Confidence High: ${confidencePercent}%)</span>`;
        boxContent.innerHTML = `
          <div style="color: #10b981; margin-bottom: 0.4rem;">
            ✓ Parametric Memory Confidence (${confidencePercent}%) exceeds threshold gate τ = ${threshold.toFixed(2)} nats.
          </div>
          <div style="color: #94a3b8;">
            Direct LLM generation initiated without external RAG retrieval.<br/>
            • Vector Database Lookup: <span style="color: #f59e0b;">BYPASSED</span> (Saved ~45.0 ms)<br/>
            • Predicted Perplexity: <span style="color: var(--cyan);">1.14</span><br/>
            • Response Generation Path: Instant tensor execution via fused SwiGLU kernel.
          </div>
        `;
      }
    }
  }

  promptInput.addEventListener('input', analyzePrompt);
  if (thresholdSlider) thresholdSlider.addEventListener('input', analyzePrompt);

  document.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetText = btn.getAttribute('data-prompt');
      if (presetText && promptInput) {
        promptInput.value = presetText;
        analyzePrompt();
      }
    });
  });

  analyzePrompt();
}

// Initialize Spotlight, Audio, Vector Solver, Uncertainty Probe, and Web Audio TTS Player on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  HooshaAudioEngine.updateToggleUI();
  window.spotlightEngine = new SpotlightEngine();
  initCFMVectorFieldSolver();
  initEpistemicUncertaintyProbe();
  if (typeof SubstackTTSPlayer !== 'undefined') {
    SubstackTTSPlayer.init();
  }
});





