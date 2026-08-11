// Neural Canvas Background
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

function openArticleModal(articleId) {
  const article = articlesDatabase[articleId];
  if (!article) return;

  document.getElementById('articleCategoryBadge').textContent = article.category;
  document.getElementById('articleReadTime').innerHTML = `<i class="fas fa-book-open"></i> ${article.readTime}`;
  document.getElementById('articleDate').textContent = `Substack Dispatch · ${article.date}`;
  document.getElementById('articleWordCount').textContent = article.wordCount;
  document.getElementById('articleTitle').textContent = article.title;
  document.getElementById('articleSubtitle').textContent = article.subtitle;
  document.getElementById('externalArticleLink').href = article.url;

  articleContent.innerHTML = article.content;
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

const mainSubstackForm = document.getElementById('substackMainForm');
const subStatusMessage = document.getElementById('subStatusMessage');
if (mainSubstackForm) {
  handleNewsletterSubscription(mainSubstackForm, subStatusMessage);
}

document.querySelectorAll('.modal-sub-form').forEach(modalForm => {
  handleNewsletterSubscription(modalForm, null);
});

