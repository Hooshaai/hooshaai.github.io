import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  SafeAreaView,
  Share,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ArticleDetailModal from './ArticleDetailModal';


const INITIAL_ARTICLES = [
  {
    id: '1',
    title: 'Scaling Transformers: How Linear Attention is Reshaping Cross-Task AI',
    pubDate: 'Aug 11, 2026',
    wordCount: '1,941 words',
    readTime: '8 min read',
    category: 'Linear Attention',
    likes: 142,
    isBookmarked: false,
    snippet: 'The evolution of sequence modeling over the past decade has been governed by a singular mathematical bottleneck: quadratic computational complexity in standard attention.',
    abstract: 'Standard self-attention scales quadratically O(N²) with sequence length N, creating severe memory and latency bottlenecks for long-context reasoning. Linear Attention reformulates the kernel computation to associative matrix multiplication, reducing complexity to O(N). This paper demonstrates how linear attention primitives match standard softmax attention performance across cross-task LLMs while decoding 14x faster on 128k sequence contexts.',
    keyTakeaways: [
      'Reduces KV cache footprint from 32GB to under 2GB at 100k tokens.',
      'Achieves zero-shot parity on MMLU and GSM8K benchmarks.',
      'Enables real-time streaming inference on edge devices.'
    ]
  },
  {
    id: '2',
    title: 'The Architecture of Boundaries: Van der Waals Interfaces in AI Hardware',
    pubDate: 'Aug 11, 2026',
    wordCount: '2,159 words',
    readTime: '9 min read',
    category: 'Hardware',
    likes: 98,
    isBookmarked: false,
    snippet: 'The frontier of applied science is increasingly defined by our ability to manipulate phenomena at extreme physical boundaries in specialized neural accelerators.',
    abstract: 'Energy dissipation in silicon-based matrix multiplication units limits modern compute cluster scaling. By engineering van der Waals hetero-structures in 2D materials, we fabricate ultra-low power neuromorphic crossbars capable of executing 100 TOPS/W for linear attention state space updates.',
    keyTakeaways: [
      '100x efficiency boost for recurrent state update kernels.',
      'Physical implementation of linear attention associative memory.',
      'Compatible with existing CMOS semiconductor fabrication backends.'
    ]
  },
  {
    id: '3',
    title: 'The Post-Transformer Era: Hybrid State Space & Attention Architectures',
    pubDate: 'Aug 10, 2026',
    wordCount: '3,806 words',
    readTime: '15 min read',
    category: 'State Space',
    likes: 215,
    isBookmarked: true,
    snippet: 'Since 2017, the Transformer has been the default engine of deep learning. We examine emerging hybrid Mamba-Transformer models that break quadratic bounds.',
    abstract: 'We present Hoosha-Hybrid, a novel architecture interspersing selective state space layers (Mamba-2) with sub-quadratic linear attention blocks. We evaluate 70B parameter models trained on 3 Trillion tokens, proving superior associative recall while eliminating context window decay.',
    keyTakeaways: [
      'Constant O(1) inference memory overhead per token generation.',
      'Sub-linear latency scaling across multi-million token contexts.',
      'State-of-the-art results on long-context needle-in-a-haystack tasks.'
    ]
  },
  {
    id: '4',
    title: 'Re-Engineering the Attention Engine for Low-Latency Decoding',
    pubDate: 'Aug 10, 2026',
    wordCount: '3,105 words',
    readTime: '12 min read',
    category: 'Transformers',
    likes: 176,
    isBookmarked: false,
    snippet: 'Every modern LLM relies on matrix inner-products across tokens. We detail kernel level fused Flash Linear Attention algorithms for TensorRT and Triton.',
    abstract: 'Software hardware co-design remains key to unlocking full GPU FLOP utilization. We introduce Hoosha-Flash-Kernel, a custom CUDA/Triton implementation for linear attention that bypasses high-bandwidth memory access overheads, reaching 92% peak theoretical A100 TFLOPS.',
    keyTakeaways: [
      'Fused CUDA kernel yielding 3.2x speedup over standard FlashAttention-2.',
      'Supports mixed-precision FP8 state accumulators.',
      'Open-sourced under Apache 2.0 license for community integration.'
    ]
  },
  {
    id: '5',
    title: 'Multimodal Spatial Transformers in Robotic Manipulation',
    pubDate: 'Aug 09, 2026',
    wordCount: '2,450 words',
    readTime: '10 min read',
    category: 'Multimodal',
    likes: 112,
    isBookmarked: false,
    snippet: 'Applying sub-quadratic attention primitives to high-resolution spatial point clouds and continuous action dynamics in robotic control.',
    abstract: 'Robotic perception requires processing 4K video feeds alongside high-frequency proprioceptive sensor streams. By leveraging spatial linear attention, our model unifies visual tokens and motor commands into a single 500Hz control loop.',
    keyTakeaways: [
      'Real-time 500Hz action generation on embedded edge GPUs.',
      'Zero-shot generalization across 15 dexterous manipulation tasks.',
      'Robust to sensor noise and lighting variations.'
    ]
  }
];

const CATEGORIES = ['All', 'Linear Attention', 'State Space', 'Hardware', 'Transformers', 'Multimodal'];

export default function ResearchFeed() {
  const [articles, setArticles] = useState(INITIAL_ARTICLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const toggleBookmark = (id) => {
    setArticles(prev =>
      prev.map(art => art.id === id ? { ...art, isBookmarked: !art.isBookmarked } : art)
    );
  };

  const handleLike = (id) => {
    setArticles(prev =>
      prev.map(art => art.id === id ? { ...art, likes: art.likes + 1 } : art)
    );
  };

  const handleShare = async (article) => {
    try {
      await Share.share({
        title: article.title,
        message: `Check out this Hoosha AI paper: "${article.title}" - ${article.snippet}`,
      });
    } catch (error) {
      Alert.alert('Share', `Sharing: ${article.title}`);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.snippet.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>HOOSHA AI</Text>
          <Text style={styles.headerSubtitle}>Frontier Research & Papers</Text>
        </View>
        <TouchableOpacity style={styles.badgeContainer}>
          <Text style={styles.badgeText}>v1.0 LIVE</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search research papers & architectures..."
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Pills */}
      <View style={styles.categoryWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Articles Feed */}
      <FlatList
        data={filteredArticles}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => setSelectedArticle(item)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{item.category}</Text>
              </View>
              <Text style={styles.metaText}>{item.pubDate} • {item.readTime}</Text>
            </View>

            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSnippet} numberOfLines={2}>{item.snippet}</Text>

            <View style={styles.cardFooter}>
              <View style={styles.footerLeft}>
                <Text style={styles.wordCountText}>{item.wordCount}</Text>
              </View>

              <View style={styles.footerActions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleLike(item.id)}
                >
                  <Ionicons name="heart-outline" size={16} color="#F43F5E" />
                  <Text style={styles.actionText}>{item.likes}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => toggleBookmark(item.id)}
                >
                  <Ionicons
                    name={item.isBookmarked ? "bookmark" : "bookmark-outline"}
                    size={16}
                    color={item.isBookmarked ? "#38BDF8" : "#94A3B8"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleShare(item)}
                >
                  <Ionicons name="share-social-outline" size={16} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color="#475569" />
            <Text style={styles.emptyTitle}>No Papers Found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search query or topic filter.</Text>
          </View>
        }
      />

      {/* Article Detail Modal (Substack Reader + KaTeX Math Rendering) */}
      <ArticleDetailModal
        visible={!!selectedArticle}
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onShare={handleShare}
        onBookmark={toggleBookmark}
        isBookmarked={selectedArticle ? selectedArticle.isBookmarked : false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  badgeContainer: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151C2C',
    marginHorizontal: 20,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#212C42',
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
  },
  categoryWrapper: {
    marginBottom: 14,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#151C2C',
    borderWidth: 1,
    borderColor: '#212C42',
  },
  categoryPillActive: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  categoryTextActive: {
    color: '#0B0F19',
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14,
  },
  card: {
    backgroundColor: '#151C2C',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#212C42',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  metaText: {
    color: '#64748B',
    fontSize: 12,
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 8,
  },
  cardSnippet: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 12,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordCountText: {
    color: '#64748B',
    fontSize: 12,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySubtitle: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  modalHeaderTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  closeBtn: {
    padding: 6,
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalCategoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  modalTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: 12,
  },
  modalMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalMetaItem: {
    color: '#94A3B8',
    fontSize: 13,
  },
  modalMetaDot: {
    color: '#64748B',
    marginHorizontal: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginVertical: 16,
  },
  sectionHeading: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modalAbstract: {
    color: '#CBD5E1',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 24,
  },
  takeawayItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  takeawayText: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 20,
  },
  modalActionCard: {
    backgroundColor: '#151C2C',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#212C42',
    marginTop: 24,
    marginBottom: 40,
  },
  actionCardTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  actionCardSub: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  primaryModalBtn: {
    backgroundColor: '#38BDF8',
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryBtnText: {
    color: '#0B0F19',
    fontWeight: '700',
    fontSize: 14,
  },
});
