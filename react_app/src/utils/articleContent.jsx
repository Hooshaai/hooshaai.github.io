export function generateSubstackArticleModalHTML(art) {
  const title = art.title || 'Advanced AI Research';
  const snippet = art.snippet || 'Exploring the frontier of artificial intelligence and machine learning architectures.';
  const category = art.category || 'AI Research';

  // Seed-based random generator to ensure determinism but variety
  let seed = 0;
  for (let i = 0; i < title.length; i++) {
    seed += title.charCodeAt(i);
  }
  const random = () => {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const buzzwords = ['orthogonal', 'latent space', 'manifold', 'stochastic', 'attention', 'gradient descent', 'transformer', 'backpropagation', 'differentiable', 'heuristic', 'isomorphic', 'entropy', 'auto-regressive', 'regularization', 'hyperparameter', 'tokenization', 'causal', 'epistemic', 'embedding', 'dimensionality reduction'];
  const getBuzz = () => buzzwords[Math.floor(random() * buzzwords.length)];

  // Generator for filler paragraphs (~100 words each)
  const generateParagraph = (topic) => {
    let sentences = [];
    for(let i=0; i<8; i++) {
      const type = Math.floor(random() * 4);
      if(type === 0) sentences.push(`The ${getBuzz()} nature of ${topic} allows for robust optimization across the ${getBuzz()} landscape.`);
      if(type === 1) sentences.push(`By leveraging ${getBuzz()} structures, we observe a significant reduction in ${getBuzz()} complexity.`);
      if(type === 2) sentences.push(`Furthermore, the integration of ${getBuzz()} paradigms within the ${category} framework yields emergent ${getBuzz()} capabilities.`);
      if(type === 3) sentences.push(`Current literature often overlooks the ${getBuzz()} implications when scaling ${topic} models to millions of ${getBuzz()}s.`);
    }
    return `<p>${sentences.join(' ')} ${sentences.join(' ')} ${sentences.join(' ')}</p>`;
  };

  const sections = [
    {
      title: "1. Introduction & Context",
      content: `
        <p><b>Abstract:</b> ${snippet}</p>
        ${generateParagraph(category)}
        ${generateParagraph(title)}
      `
    },
    {
      title: "2. Theoretical Foundations",
      content: `
        ${generateParagraph("the theoretical model")}
        <div class="math-display-box my-6 p-6 bg-gray-900 rounded-xl border border-gray-700 overflow-x-auto text-center">
          $$ \\mathcal{L}_{\\text{total}} = \\mathbb{E}_{x \\sim \\mathcal{D}}[\\log P_\\theta(x)] + \\lambda \\| \\nabla_x f(x) \\|_2^2 $$
        </div>
        ${generateParagraph("gradient dynamics")}
        <p>As we can see from the equation above, the inline math $E = mc^2$ and $x_i \\in \\mathbb{R}^d$ dictate the constraints of our ${getBuzz()} optimization.</p>
        ${generateParagraph("vector spaces")}
      `
    },
    {
      title: "3. Architecture and Implementation",
      content: `
        ${generateParagraph("architecture design")}
        <div class="my-6">
          <pre class="bg-gray-900 p-4 rounded-xl border border-gray-700 overflow-x-auto text-sm text-green-400 font-mono">
<code>
import torch
import torch.nn as nn

class ${category.replace(/[^a-zA-Z]/g, '')}Module(nn.Module):
    def __init__(self, dim):
        super().__init__()
        self.proj = nn.Linear(dim, dim)
        self.act = nn.GELU()
        
    def forward(self, x):
        # Apply ${getBuzz()} transformation
        return self.act(self.proj(x))
</code>
          </pre>
        </div>
        ${generateParagraph("the implementation details")}
        ${generateParagraph("hardware utilization")}
      `
    },
    {
      title: "4. Empirical Benchmarks",
      content: `
        ${generateParagraph("empirical evaluation")}
        <div class="benchmark-table-wrap my-8 overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-gray-700 bg-gray-800">
                <th class="p-4">Model Variant</th>
                <th class="p-4">Throughput (tok/s)</th>
                <th class="p-4">Accuracy (%)</th>
                <th class="p-4">Memory (GB)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-800">
                <td class="p-4">Baseline Transformer</td>
                <td class="p-4">${Math.floor(random()*2000 + 1000)}</td>
                <td class="p-4">${(random()*20 + 60).toFixed(1)}</td>
                <td class="p-4">24.5</td>
              </tr>
              <tr class="border-b border-gray-800">
                <td class="p-4">Proposed ${category}</td>
                <td class="p-4 text-cyan-400 font-bold">${Math.floor(random()*5000 + 4000)}</td>
                <td class="p-4 text-green-400 font-bold">${(random()*10 + 80).toFixed(1)}</td>
                <td class="p-4">12.2</td>
              </tr>
            </tbody>
          </table>
        </div>
        ${generateParagraph("benchmark analysis")}
        <div class="key-takeaway my-8 p-6 bg-cyan-900/20 border-l-4 border-cyan-400 rounded-r-xl">
          <h4 class="text-xl font-bold text-cyan-400 mb-2"><i class="fas fa-lightbulb mr-2"></i> Key Takeaway</h4>
          <p class="text-gray-300">The proposed ${category} approach achieves a ${Math.floor(random()*3+2)}x throughput improvement while maintaining strict ${getBuzz()} bounds, completely altering the Pareto frontier of inference costs.</p>
        </div>
      `
    },
    {
      title: "5. Discussion & Future Work",
      content: `
        ${generateParagraph("future implications")}
        ${generateParagraph("unresolved challenges")}
        <p>Ultimately, the exploration of <b>${title}</b> represents a foundational shift in how we approach ${getBuzz()} architectures in the modern era of artificial intelligence.</p>
      `
    }
  ];

  let htmlContent = `<div class="article-section">`;
  sections.forEach(sec => {
    htmlContent += `
      <h2 id="${sec.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}" class="text-3xl font-bold mt-12 mb-6 text-white border-b border-gray-800 pb-2">${sec.title}</h2>
      ${sec.content}
    `;
  });
  htmlContent += `</div>`;

  return htmlContent;
}
