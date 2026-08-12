import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  Share,
  Alert,
  Clipboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Formatted KaTeX Math Expression Component
function KaTeXMathBlock({ tex, renderedText, label, showSource }) {
  const [copied, setCopied] = useState(false);

  const copyTex = () => {
    Clipboard.setString(tex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <View style={styles.mathBlockCard}>
      <View style={styles.mathHeader}>
        <View style={styles.mathBadge}>
          <Ionicons name="calculator-outline" size={12} color="#38BDF8" />
          <Text style={styles.mathBadgeText}>{label || 'KaTeX Equation'}</Text>
        </View>
        <TouchableOpacity style={styles.copyTexBtn} onPress={copyTex}>
          <Ionicons name={copied ? "checkmark-circle" : "copy-outline"} size={14} color={copied ? "#10B981" : "#94A3B8"} />
          <Text style={[styles.copyTexText, copied && { color: '#10B981' }]}>
            {copied ? "Copied TeX" : "Copy TeX"}
          </Text>
        </TouchableOpacity>
      </View>

      {showSource ? (
        <View style={styles.texSourceBox}>
          <Text style={styles.texSourceText}>{tex}</Text>
        </View>
      ) : (
        <View style={styles.renderedMathBox}>
          <Text style={styles.renderedMathText}>{renderedText}</Text>
        </View>
      )}
    </View>
  );
}

export default function ArticleDetailModal({
  visible,
  article,
  onClose,
  onShare,
  onBookmark,
  isBookmarked
}) {
  const [showRawTex, setShowRawTex] = useState(false);
  const [fontSizeMode, setFontSizeMode] = useState('medium'); // 'small' | 'medium' | 'large'
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(article ? article.likes : 0);

  if (!article) return null;

  const handleLikeToggle = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      setLiked(true);
      setLikeCount(prev => prev + 1);
    }
  };

  const getFontSize = () => {
    switch (fontSizeMode) {
      case 'small': return 14;
      case 'large': return 18;
      default: return 16;
    }
  };

  const getLineHeight = () => {
    switch (fontSizeMode) {
      case 'small': return 22;
      case 'large': return 28;
      default: return 25;
    }
  };

  // Detailed article body content with KaTeX math equations tailored for each paper
  const getSubstackSections = (art) => {
    if (art.id === '1') {
      return {
        subtitle: 'Breaking Quadratic Boundaries in Sub-Quadratic LLM Decoding',
        intro: 'Standard self-attention mechanisms compute inner products across all query-key pairs, scaling quadratically O(N²) with sequence length N. Linear attention reformulates kernel computations into associative matrix multiplications, allowing state updates in constant time O(1) per decoding token.',
        equations: [
          {
            label: 'Softmax Attention Bottleneck',
            tex: '\\text{Attn}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d}}\\right) V \\quad \\in \\mathbb{R}^{N \\times d}',
            renderedText: 'Attn(Q, K, V) = Softmax( Q · Kᵀ / √d ) · V   ∈  ℝ^(N × d)'
          },
          {
            label: 'Kernel-Based Associative Linear Reformulation',
            tex: 'O_i = \\frac{\\sum_{j=1}^i \\phi(Q_i) \\phi(K_j)^T V_j}{\\sum_{j=1}^i \\phi(Q_i) \\phi(K_j)^T} = \\frac{\\phi(Q_i) S_i}{\\phi(Q_i) z_i}',
            renderedText: 'O_i = [ φ(Q_i) · S_i ]  /  [ φ(Q_i) · z_i ]\nwhere  S_i = S_{i-1} + φ(K_i)^T V_i   (Associative State Memory)'
          }
        ],
        codeSnippet: `# Fused Triton Linear Attention Kernel
@triton.jit
def fused_linear_attn_kernel(Q, K, V, Out, stride_qb, N: tl.constexpr, D: tl.constexpr):
    # Associative matrix state accumulator
    S = tl.zeros([D, D], dtype=tl.float32)
    for i in range(N):
        q = tl.load(Q + i * D)
        k = tl.load(K + i * D)
        v = tl.load(V + i * D)
        S += tl.outer(k, v)
        tl.store(Out + i * D, tl.dot(q, S))`,
        analysis: 'By avoiding high-bandwidth memory (HBM) read/writes for N x N matrix tiles, our CUDA Triton kernel operates within L1/L2 cache SRAM boundaries, unlocking 14x decoding speed improvements on 128k context benchmarks.'
      };
    } else if (art.id === '3') {
      return {
        subtitle: 'Continuous Flow Matching (CFM) & State Space Integration',
        intro: 'Combining selective state space representations (Mamba-2) with continuous probability flow ODEs allows modeling long-range temporal dependencies without vanishing gradients or context window saturation.',
        equations: [
          {
            label: 'Selective State Space Update Rule',
            tex: 'h_t = \\bar{A}_t h_{t-1} + \\bar{B}_t x_t, \\quad y_t = C_t h_t + D_t x_t',
            renderedText: 'h_t = Ā_t · h_(t-1) + B̄_t · x_t\ny_t = C_t · h_t + D_t · x_t'
          },
          {
            label: 'Flow Vector ODE Velocity Field',
            tex: '\\frac{d x_t}{d t} = v_\\theta(x_t, t), \\quad x_t = (1-t) x_0 + t x_1',
            renderedText: 'dx_t / dt = v_θ(x_t, t),    x_t = (1 - t) x_0 + t x_1'
          }
        ],
        codeSnippet: `def selective_ssm_scan(u, delta, A, B, C):
    # Discrete parameter discretization
    deltaA = torch.exp(torch.einsum('b l d, d n -> b l d n', delta, A))
    deltaB = torch.einsum('b l d, b l n -> b l d n', delta, B)
    # Recurrent scan state
    state = torch.zeros(u.size(0), u.size(2), A.size(1))
    return associative_scan(deltaA, deltaB * u.unsqueeze(-1))`,
        analysis: 'State space linear scans replace heavy KV cache storage with compact hidden state matrices h_t ∈ R^(D x N), keeping memory footprints invariant to context length.'
      };
    } else {
      return {
        subtitle: 'Substack Deep Dive: Frontier AI Architecture Analysis',
        intro: art.abstract || 'Detailed technical analysis of modern neural network architectures and hardware optimization routines.',
        equations: [
          {
            label: 'Epistemic Uncertainty Variance Bound',
            tex: '\\sigma_{\\text{epistemic}}^2(x) = \\mathbf{k}(x,x) - \\mathbf{k}^T (\\mathbf{K} + \\sigma_n^2 \\mathbf{I})^{-1} \\mathbf{k}',
            renderedText: 'σ²_epistemic(x) = k(x, x) - k_x^T · ( K + σ²_n · I )⁻¹ · k_x'
          }
        ],
        codeSnippet: `# Epistemic Uncertainty Estimation
def calculate_epistemic_uncertainty(embeddings, kernel_matrix):
    k_x = compute_kernel_vector(embeddings)
    inv_K = torch.linalg.inv(kernel_matrix + 1e-4 * torch.eye(kernel_matrix.size(0)))
    variance = 1.0 - torch.dot(k_x, torch.mv(inv_K, k_x))
    return torch.clamp(variance, min=0.0)`,
        analysis: 'Uncertainty quantification isolates out-of-distribution prompts before decoding begins, reducing hallucination frequency.'
      };
    }
  };

  const substackData = getSubstackSections(article);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Navigation Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="#F8FAFC" />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <View style={styles.substackTag}>
              <Ionicons name="newspaper-outline" size={12} color="#FF6719" />
              <Text style={styles.substackTagText}>Substack Article</Text>
            </View>
            <Text style={styles.headerTitle} numberOfLines={1}>{article.title}</Text>
          </View>

          <TouchableOpacity style={styles.headerBtn} onPress={() => onShare && onShare(article)}>
            <Ionicons name="share-social-outline" size={22} color="#38BDF8" />
          </TouchableOpacity>
        </View>

        {/* Math & Reader Controls Toolbar */}
        <View style={styles.toolbar}>
          <View style={styles.toolbarLeft}>
            <TouchableOpacity
              style={[styles.toolbarChip, !showRawTex && styles.toolbarChipActive]}
              onPress={() => setShowRawTex(false)}
            >
              <Ionicons name="sparkles" size={13} color={!showRawTex ? "#0B0F19" : "#94A3B8"} />
              <Text style={[styles.toolbarChipText, !showRawTex && styles.toolbarChipTextActive]}>
                KaTeX Math
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolbarChip, showRawTex && styles.toolbarChipActive]}
              onPress={() => setShowRawTex(true)}
            >
              <Ionicons name="code-slash" size={13} color={showRawTex ? "#0B0F19" : "#94A3B8"} />
              <Text style={[styles.toolbarChipText, showRawTex && styles.toolbarChipTextActive]}>
                LaTeX TeX
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.toolbarRight}>
            <Text style={styles.fontSizeLabel}>Font:</Text>
            {['small', 'medium', 'large'].map(mode => (
              <TouchableOpacity
                key={mode}
                style={[styles.fontBtn, fontSizeMode === mode && styles.fontBtnActive]}
                onPress={() => setFontSizeMode(mode)}
              >
                <Text style={[styles.fontBtnText, fontSizeMode === mode && styles.fontBtnTextActive]}>
                  {mode === 'small' ? 'S' : mode === 'medium' ? 'M' : 'L'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Scrollable Article Reader */}
        <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
          {/* Substack Branding Banner */}
          <View style={styles.substackBanner}>
            <View style={styles.substackHeaderRow}>
              <View style={styles.authorAvatar}>
                <Text style={styles.authorAvatarText}>HA</Text>
              </View>
              <View>
                <Text style={styles.authorName}>Hoosha AI Research</Text>
                <Text style={styles.authorSub}>hooshaai.substack.com • Verified Publication</Text>
              </View>
            </View>
          </View>

          {/* Article Header Info */}
          <View style={styles.articleHeader}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{article.category}</Text>
            </View>

            <Text style={styles.mainTitle}>{article.title}</Text>
            <Text style={styles.subtitle}>{substackData.subtitle}</Text>

            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={14} color="#64748B" />
              <Text style={styles.metaText}>{article.pubDate}</Text>
              <Text style={styles.metaDot}>•</Text>
              <Ionicons name="time-outline" size={14} color="#64748B" />
              <Text style={styles.metaText}>{article.readTime}</Text>
              <Text style={styles.metaDot}>•</Text>
              <Ionicons name="document-text-outline" size={14} color="#64748B" />
              <Text style={styles.metaText}>{article.wordCount}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Abstract Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>Abstract & Motivation</Text>
            <Text style={[styles.bodyText, { fontSize: getFontSize(), lineHeight: getLineHeight() }]}>
              {article.abstract}
            </Text>
          </View>

          {/* Section 2: Mathematical Formulation */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>Mathematical Formulation (KaTeX)</Text>
            <Text style={[styles.bodyText, { fontSize: getFontSize(), lineHeight: getLineHeight() }]}>
              {substackData.intro}
            </Text>

            {/* Render KaTeX Equations */}
            {substackData.equations.map((eq, idx) => (
              <KaTeXMathBlock
                key={idx}
                label={eq.label}
                tex={eq.tex}
                renderedText={eq.renderedText}
                showSource={showRawTex}
              />
            ))}
          </View>

          {/* Section 3: CUDA & Triton Code Implementation */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>Kernel & Implementation</Text>
            <View style={styles.codeBlockCard}>
              <View style={styles.codeHeader}>
                <Ionicons name="code-working-outline" size={16} color="#38BDF8" />
                <Text style={styles.codeHeaderTitle}>kernel_implementation.py</Text>
              </View>
              <Text style={styles.codeBody}>{substackData.codeSnippet}</Text>
            </View>
            <Text style={[styles.bodyText, { fontSize: getFontSize(), lineHeight: getLineHeight(), marginTop: 12 }]}>
              {substackData.analysis}
            </Text>
          </View>

          {/* Section 4: Key Takeaways */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>Key Takeaways & Impact</Text>
            {article.keyTakeaways && article.keyTakeaways.map((point, index) => (
              <View key={index} style={styles.takeawayRow}>
                <Ionicons name="checkmark-circle" size={18} color="#38BDF8" style={styles.checkIcon} />
                <Text style={[styles.takeawayText, { fontSize: getFontSize() - 1 }]}>
                  {point}
                </Text>
              </View>
            ))}
          </View>

          {/* Interactive Footer & Substack Callout */}
          <View style={styles.footerCallout}>
            <Ionicons name="newspaper" size={32} color="#38BDF8" />
            <Text style={styles.footerCalloutTitle}>Enjoyed this paper breakdown?</Text>
            <Text style={styles.footerCalloutSub}>
              Subscribe to Hoosha AI on Substack for weekly frontier architecture deep dives, open-source weights releases, and Triton kernel tutorials.
            </Text>

            <TouchableOpacity
              style={styles.substackActionBtn}
              onPress={() => {
                Alert.alert(
                  "Substack Article",
                  `Redirecting to full Substack post for "${article.title}" at hooshaai.substack.com`,
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Open Substack", onPress: () => {} }
                  ]
                );
              }}
            >
              <Text style={styles.substackActionBtnText}>Read Full Article on Substack</Text>
              <Ionicons name="open-outline" size={16} color="#0B0F19" />
            </TouchableOpacity>

            <View style={styles.modalActionRow}>
              <TouchableOpacity style={styles.modalActionItem} onPress={handleLikeToggle}>
                <Ionicons
                  name={liked ? "heart" : "heart-outline"}
                  size={20}
                  color={liked ? "#F43F5E" : "#94A3B8"}
                />
                <Text style={[styles.modalActionText, liked && { color: '#F43F5E' }]}>
                  {likeCount} Likes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalActionItem}
                onPress={() => onBookmark && onBookmark(article.id)}
              >
                <Ionicons
                  name={isBookmarked ? "bookmark" : "bookmark-outline"}
                  size={20}
                  color={isBookmarked ? "#38BDF8" : "#94A3B8"}
                />
                <Text style={[styles.modalActionText, isBookmarked && { color: '#38BDF8' }]}>
                  {isBookmarked ? "Saved" : "Save Paper"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 50 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerBtn: {
    padding: 6,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  substackTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 103, 25, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 2,
  },
  substackTagText: {
    color: '#FF6719',
    fontSize: 10,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#151C2C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#212C42',
  },
  toolbarLeft: {
    flexDirection: 'row',
    gap: 8,
  },
  toolbarChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#0B0F19',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  toolbarChipActive: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  toolbarChipText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  toolbarChipTextActive: {
    color: '#0B0F19',
    fontWeight: '700',
  },
  toolbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fontSizeLabel: {
    color: '#64748B',
    fontSize: 11,
    marginRight: 2,
  },
  fontBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#0B0F19',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  fontBtnActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderColor: '#38BDF8',
  },
  fontBtnText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  fontBtnTextActive: {
    color: '#38BDF8',
  },
  contentScroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  substackBanner: {
    backgroundColor: '#151C2C',
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#212C42',
  },
  substackHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorAvatarText: {
    color: '#0B0F19',
    fontWeight: '800',
    fontSize: 14,
  },
  authorName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  authorSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  articleHeader: {
    marginTop: 18,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  categoryPillText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  mainTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: 8,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
    fontStyle: 'italic',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: '#64748B',
    fontSize: 12,
  },
  metaDot: {
    color: '#334155',
  },
  divider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginVertical: 20,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeading: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  bodyText: {
    color: '#CBD5E1',
  },
  mathBlockCard: {
    backgroundColor: '#070C16',
    borderRadius: 12,
    padding: 14,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  mathHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#151C2C',
    paddingBottom: 6,
  },
  mathBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mathBadgeText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  copyTexBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  copyTexText: {
    color: '#94A3B8',
    fontSize: 11,
  },
  renderedMathBox: {
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: '#38BDF8',
  },
  renderedMathText: {
    color: '#38BDF8',
    fontSize: 14,
    fontFamily: 'monospace',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '600',
  },
  texSourceBox: {
    backgroundColor: '#050811',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#A855F7',
  },
  texSourceText: {
    color: '#A855F7',
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  codeBlockCard: {
    backgroundColor: '#050811',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#151C2C',
    paddingBottom: 6,
  },
  codeHeaderTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  codeBody: {
    color: '#38BDF8',
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  takeawayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  checkIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  takeawayText: {
    flex: 1,
    color: '#E2E8F0',
    lineHeight: 22,
  },
  footerCallout: {
    backgroundColor: '#151C2C',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#212C42',
    alignItems: 'center',
    marginTop: 12,
  },
  footerCalloutTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 6,
  },
  footerCalloutSub: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
  },
  substackActionBtn: {
    backgroundColor: '#38BDF8',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 16,
  },
  substackActionBtnText: {
    color: '#0B0F19',
    fontWeight: '700',
    fontSize: 14,
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 12,
  },
  modalActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalActionText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
});
