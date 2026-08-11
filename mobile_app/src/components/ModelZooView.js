import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  SafeAreaView,
  Clipboard,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MODELS = [
  {
    id: '1',
    name: 'Hoosha-Linear-70B',
    type: 'Linear Attention LLM',
    tag: 'Flagship',
    modality: 'Text',
    params: '70 Billion',
    context: '128,000 tokens',
    mmlu: '86.4%',
    gsm8k: '91.2%',
    hfPath: 'hoosha-ai/hoosha-linear-70b-v1',
    license: 'Apache 2.0',
    description: 'Frontier 70B parameter LLM featuring fused linear attention kernels with zero context decay and 14x faster decoding.',
    architecture: {
      layers: 80,
      hiddenDim: 8192,
      heads: 64,
      attentionType: 'Associative Linear Attention',
      minVram: '40 GB (INT8)'
    }
  },
  {
    id: '2',
    name: 'Hoosha-Flash-8B',
    type: 'Ultra-low Latency Edge LLM',
    tag: 'Edge Specialized',
    modality: 'Text',
    params: '8 Billion',
    context: '65,536 tokens',
    mmlu: '78.1%',
    gsm8k: '84.6%',
    hfPath: 'hoosha-ai/hoosha-flash-8b-v1',
    license: 'Apache 2.0',
    description: 'Distilled 8B parameter model optimized for sub-5ms generation on mobile devices and edge GPUs.',
    architecture: {
      layers: 32,
      hiddenDim: 4096,
      heads: 32,
      attentionType: 'Linear Flash-Attention Kernel',
      minVram: '5.2 GB (INT4)'
    }
  },
  {
    id: '3',
    name: 'Mamba-Hoosha-14B',
    type: 'Hybrid State Space Model',
    tag: '1M Context',
    modality: 'State Space',
    params: '14 Billion',
    context: '1,000,000 tokens',
    mmlu: '81.5%',
    gsm8k: '88.0%',
    hfPath: 'hoosha-ai/mamba-hoosha-14b',
    license: 'Apache 2.0',
    description: 'Interleaved Mamba-2 state space layers with associative linear attention for infinite context window processing.',
    architecture: {
      layers: 48,
      hiddenDim: 5120,
      heads: 40,
      attentionType: 'Selective State Space + Linear Attn',
      minVram: '12 GB (INT8)'
    }
  },
  {
    id: '4',
    name: 'Hoosha-Vision-v2',
    type: 'Multimodal Spatial Transformer',
    tag: 'Multimodal',
    modality: 'Multimodal',
    params: '12 Billion',
    context: '4K High-Res Stream',
    mmlu: '79.8%',
    gsm8k: '82.4%',
    hfPath: 'hoosha-ai/hoosha-vision-v2',
    license: 'Hoosha Open',
    description: 'Real-time spatial video & point-cloud processing model for robotic perception and multimodal reasoning.',
    architecture: {
      layers: 40,
      hiddenDim: 4096,
      heads: 32,
      attentionType: 'Spatial Linear Patch Attention',
      minVram: '16 GB (FP16)'
    }
  }
];

const MODALITIES = ['All', 'Text', 'State Space', 'Multimodal'];

export default function ModelZooView() {
  const [selectedModality, setSelectedModality] = useState('All');
  const [selectedModel, setSelectedModel] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (path, id) => {
    Clipboard.setString(path);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredModels = MODELS.filter(m =>
    selectedModality === 'All' || m.modality === selectedModality
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>MODEL ZOO</Text>
          <Text style={styles.headerSubtitle}>Open Weights & Benchmark Explorer</Text>
        </View>
        <Ionicons name="cube-outline" size={24} color="#38BDF8" />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {MODALITIES.map(mod => (
            <TouchableOpacity
              key={mod}
              style={[styles.filterChip, selectedModality === mod && styles.filterChipActive]}
              onPress={() => setSelectedModality(mod)}
            >
              <Text style={[styles.filterChipText, selectedModality === mod && styles.filterChipTextActive]}>
                {mod}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Model List */}
      <FlatList
        data={filteredModels}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          const isCopied = copiedId === item.id;
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.titleRow}>
                  <Text style={styles.modelName}>{item.name}</Text>
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagText}>{item.tag}</Text>
                  </View>
                </View>
                <Text style={styles.modelType}>{item.type}</Text>
              </View>

              <Text style={styles.description}>{item.description}</Text>

              {/* Benchmarks Grid */}
              <View style={styles.benchGrid}>
                <View style={styles.benchItem}>
                  <Text style={styles.benchLabel}>Params</Text>
                  <Text style={styles.benchValue}>{item.params}</Text>
                </View>

                <View style={styles.benchItem}>
                  <Text style={styles.benchLabel}>Context</Text>
                  <Text style={styles.benchValue}>{item.context}</Text>
                </View>

                <View style={styles.benchItem}>
                  <Text style={styles.benchLabel}>MMLU</Text>
                  <Text style={[styles.benchValue, { color: '#10B981' }]}>{item.mmlu}</Text>
                </View>

                <View style={styles.benchItem}>
                  <Text style={styles.benchLabel}>GSM8K</Text>
                  <Text style={[styles.benchValue, { color: '#38BDF8' }]}>{item.gsm8k}</Text>
                </View>
              </View>

              {/* Action Bar */}
              <View style={styles.cardFooter}>
                <TouchableOpacity
                  style={styles.hfButton}
                  onPress={() => copyToClipboard(item.hfPath, item.id)}
                >
                  <Ionicons name={isCopied ? "checkmark-circle" : "copy-outline"} size={16} color={isCopied ? "#10B981" : "#94A3B8"} />
                  <Text style={[styles.hfPathText, isCopied && { color: '#10B981' }]}>
                    {isCopied ? "Copied HF Path!" : item.hfPath}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.inspectButton}
                  onPress={() => setSelectedModel(item)}
                >
                  <Text style={styles.inspectText}>Specs</Text>
                  <Ionicons name="chevron-forward" size={14} color="#38BDF8" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      {/* Model Spec Modal */}
      {selectedModel && (
        <Modal
          visible={!!selectedModel}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setSelectedModel(null)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setSelectedModel(null)}
              >
                <Ionicons name="arrow-back" size={24} color="#F8FAFC" />
              </TouchableOpacity>
              <Text style={styles.modalHeaderTitle}>{selectedModel.name}</Text>
              <View style={{ width: 32 }} />
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.modalTagBadge}>
                <Text style={styles.modalTagText}>{selectedModel.type}</Text>
              </View>

              <Text style={styles.modalDesc}>{selectedModel.description}</Text>

              <Text style={styles.sectionTitle}>Architecture Breakdown</Text>
              <View style={styles.specTable}>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Attention Kernel</Text>
                  <Text style={styles.specValue}>{selectedModel.architecture.attentionType}</Text>
                </View>

                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Transformer Layers</Text>
                  <Text style={styles.specValue}>{selectedModel.architecture.layers}</Text>
                </View>

                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Hidden Dimension</Text>
                  <Text style={styles.specValue}>{selectedModel.architecture.hiddenDim}</Text>
                </View>

                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Attention Heads</Text>
                  <Text style={styles.specValue}>{selectedModel.architecture.heads}</Text>
                </View>

                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Min Hardware VRAM</Text>
                  <Text style={[styles.specValue, { color: '#38BDF8' }]}>{selectedModel.architecture.minVram}</Text>
                </View>

                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>License</Text>
                  <Text style={styles.specValue}>{selectedModel.license}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.modalHfBtn}
                onPress={() => {
                  copyToClipboard(selectedModel.hfPath, selectedModel.id);
                  Alert.alert("HuggingFace Path", `Copied: ${selectedModel.hfPath}`);
                }}
              >
                <Ionicons name="download-outline" size={18} color="#0B0F19" />
                <Text style={styles.modalHfBtnText}>Copy HuggingFace Weights Identifier</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}
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
  filterWrapper: {
    marginBottom: 14,
  },
  filterRow: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#151C2C',
    borderWidth: 1,
    borderColor: '#212C42',
  },
  filterChipActive: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  filterChipTextActive: {
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
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modelName: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
  },
  tagBadge: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  tagText: {
    color: '#A855F7',
    fontSize: 11,
    fontWeight: '700',
  },
  modelType: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  description: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  benchGrid: {
    flexDirection: 'row',
    backgroundColor: '#0B0F19',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-around',
    marginBottom: 14,
  },
  benchItem: {
    alignItems: 'center',
  },
  benchLabel: {
    color: '#64748B',
    fontSize: 11,
    marginBottom: 2,
  },
  benchValue: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 12,
  },
  hfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hfPathText: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  inspectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  inspectText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
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
  },
  closeBtn: {
    padding: 6,
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalTagBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  modalTagText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  modalDesc: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  specTable: {
    backgroundColor: '#151C2C',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#212C42',
    marginBottom: 24,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  specLabel: {
    color: '#94A3B8',
    fontSize: 13,
  },
  specValue: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  modalHfBtn: {
    backgroundColor: '#38BDF8',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 40,
  },
  modalHfBtnText: {
    color: '#0B0F19',
    fontSize: 14,
    fontWeight: '700',
  },
});
