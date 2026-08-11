import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CODE_PRESETS = [
  {
    id: 'kernel1',
    name: 'Linear Attention Kernel',
    description: 'Fused Triton implementation of associative linear attention (O(N) complexity).',
    code: `@triton.jit\ndef linear_attn_kernel(Q, K, V, Out, stride_qb, stride_qh, N, D):\n    # Associative matrix state computation\n    S = tl.zeros([D, D], dtype=tl.float32)\n    for i in range(N):\n        q = tl.load(Q + i*D)\n        k = tl.load(K + i*D)\n        v = tl.load(V + i*D)\n        S += tl.outer(k, v)\n        tl.store(Out + i*D, tl.dot(q, S))`,
    expectedOutput: `[INFO] Compiling Triton JIT kernel for A100 Tensor Cores...\n[SUCCESS] Kernel compiled in 14.2ms.\n[BENCHMARK] Sequence length: 65,536 tokens | Latency: 0.84ms | Memory: 1.2 GB\n[VERIFICATION] Parity against PyTorch reference: PASS (MSE < 1e-6)`
  },
  {
    id: 'kernel2',
    name: 'Mamba State Space Scan',
    description: 'Selective scan algorithm for linear state updates across multi-token streams.',
    code: `def selective_scan(x, dt, A, B, C):\n    # Discrete-time State Space representation\n    dA = torch.exp(einsum('b l d, d n -> b l d n', dt, A))\n    dB = einsum('b l d, b l n -> b l d n', dt, B)\n    # Recurrent update state h_t = dA * h_{t-1} + dB * x_t\n    state = torch.zeros(B, D, N)\n    return associative_scan(dA, dB * x)`,
    expectedOutput: `[INFO] Initializing Selective SSM State Tensor [Batch: 16, Dim: 4096]...\n[SUCCESS] Recurrent update state computed.\n[BENCHMARK] Context: 128,000 tokens | Memory: 0.45 GB (Constant O(1))\n[VERIFICATION] Memory decay check: 0.00% spill`
  },
  {
    id: 'kernel3',
    name: 'Sub-Quadratic KV Eviction',
    description: 'Dynamic key-value compression layer maintaining high attention recall.',
    code: `class DynamicKVEviction(nn.Module):\n    def __init__(self, capacity=1024):\n        super().__init__()\n        self.capacity = capacity\n    def forward(self, K, V, scores):\n        # Compress KV pairs based on linear gradient importance\n        keep_idx = torch.topk(scores, k=self.capacity, dim=-1).indices\n        return K.gather(keep_idx), V.gather(keep_idx)`,
    expectedOutput: `[INFO] Testing dynamic KV cache eviction under 100k context prompt...\n[BENCHMARK] KV size compressed from 16.4 GB -> 1.02 GB (16x reduction)\n[ACCURACY] Needle-in-haystack retrieval accuracy: 99.8%`
  }
];

export default function SandboxView() {
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator' | 'calculator' | 'interpreter'

  // Simulator state
  const [seqLength, setSeqLength] = useState(32768); // 32k
  const [batchSize, setBatchSize] = useState(8);

  // Calculator state
  const [paramSize, setParamSize] = useState(70); // 70B
  const [quantization, setQuantization] = useState('FP16'); // FP16, INT8, INT4

  // Interpreter state
  const [selectedPreset, setSelectedPreset] = useState(CODE_PRESETS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState('');

  // Calculations for Simulator
  // Softmax memory: O(N^2 * B * heads * layers)
  // Linear memory: O(N * B * dim)
  const softmaxMemGB = (Math.pow(seqLength / 1000, 2) * batchSize * 0.00045).toFixed(2);
  const linearMemGB = (seqLength / 1000 * batchSize * 0.008).toFixed(2);
  const memorySavings = Math.max(1.1, (parseFloat(softmaxMemGB) / Math.max(0.1, parseFloat(linearMemGB)))).toFixed(1);

  // Calculations for Calculator
  const bytesPerParam = quantization === 'FP16' ? 2 : quantization === 'INT8' ? 1 : 0.5;
  const vramWeightsGB = (paramSize * bytesPerParam).toFixed(1);
  const vramInferenceGB = (parseFloat(vramWeightsGB) * 1.25).toFixed(1);

  const getGPURecommendation = (vram) => {
    const v = parseFloat(vram);
    if (v <= 16) return '1x RTX 4090 (24GB VRAM)';
    if (v <= 40) return '1x A100 / H100 (40GB VRAM)';
    if (v <= 80) return '1x H100 / A100 (80GB VRAM)';
    return '4x H100 (80GB VRAM Cluster)';
  };

  const runCodeKernel = () => {
    setIsRunning(true);
    setConsoleOutput('');
    setTimeout(() => {
      setIsRunning(false);
      setConsoleOutput(selectedPreset.expectedOutput);
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>AI SANDBOXES</Text>
          <Text style={styles.headerSubtitle}>Interactive Architecture Simulators</Text>
        </View>
        <Ionicons name="hardware-chip-outline" size={24} color="#38BDF8" />
      </View>

      {/* Navigation Pills */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'simulator' && styles.tabItemActive]}
          onPress={() => setActiveTab('simulator')}
        >
          <Text style={[styles.tabText, activeTab === 'simulator' && styles.tabTextActive]}>
            Attention Sim
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'calculator' && styles.tabItemActive]}
          onPress={() => setActiveTab('calculator')}
        >
          <Text style={[styles.tabText, activeTab === 'calculator' && styles.tabTextActive]}>
            VRAM & FLOPs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'interpreter' && styles.tabItemActive]}
          onPress={() => setActiveTab('interpreter')}
        >
          <Text style={[styles.tabText, activeTab === 'interpreter' && styles.tabTextActive]}>
            Code Interpreter
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* TAB 1: ATTENTION SIMULATOR */}
        {activeTab === 'simulator' && (
          <View style={styles.section}>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle-outline" size={20} color="#38BDF8" />
              <Text style={styles.infoText}>
                Compare memory & computational complexity scaling between Standard Softmax Attention O(N²) and Linear Attention O(N).
              </Text>
            </View>

            {/* Sequence Length Controls */}
            <View style={styles.controlGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.controlLabel}>Sequence Length (Tokens)</Text>
                <Text style={styles.controlValue}>{seqLength.toLocaleString()} tokens</Text>
              </View>

              <View style={styles.presetRow}>
                {[4096, 16384, 32768, 65536, 131072].map(val => (
                  <TouchableOpacity
                    key={val}
                    style={[styles.presetChip, seqLength === val && styles.presetChipActive]}
                    onPress={() => setSeqLength(val)}
                  >
                    <Text style={[styles.presetChipText, seqLength === val && styles.presetChipTextActive]}>
                      {val >= 1000 ? `${val / 1024}k` : val}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Batch Size Controls */}
            <View style={styles.controlGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.controlLabel}>Batch Size</Text>
                <Text style={styles.controlValue}>{batchSize} streams</Text>
              </View>

              <View style={styles.presetRow}>
                {[1, 4, 8, 16, 32, 64].map(val => (
                  <TouchableOpacity
                    key={val}
                    style={[styles.presetChip, batchSize === val && styles.presetChipActive]}
                    onPress={() => setBatchSize(val)}
                  >
                    <Text style={[styles.presetChipText, batchSize === val && styles.presetChipTextActive]}>
                      {val}x
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Visual Comparison Card */}
            <View style={styles.comparisonCard}>
              <Text style={styles.cardSectionTitle}>Memory Overhead (KV Cache)</Text>

              {/* Standard Softmax Bar */}
              <View style={styles.metricRow}>
                <View style={styles.metricLabelRow}>
                  <Text style={styles.metricName}>Standard Softmax (O(N²))</Text>
                  <Text style={styles.metricValSoftmax}>{softmaxMemGB} GB</Text>
                </View>
                <View style={styles.barBackground}>
                  <View
                    style={[
                      styles.barFillSoftmax,
                      { width: `${Math.min(100, (parseFloat(softmaxMemGB) / 50) * 100)}%` }
                    ]}
                  />
                </View>
              </View>

              {/* Linear Attention Bar */}
              <View style={styles.metricRow}>
                <View style={styles.metricLabelRow}>
                  <Text style={styles.metricName}>Hoosha Linear Attention (O(N))</Text>
                  <Text style={styles.metricValLinear}>{linearMemGB} GB</Text>
                </View>
                <View style={styles.barBackground}>
                  <View
                    style={[
                      styles.barFillLinear,
                      { width: `${Math.max(8, Math.min(100, (parseFloat(linearMemGB) / 50) * 100))}%` }
                    ]}
                  />
                </View>
              </View>

              {/* Savings Highlight */}
              <View style={styles.highlightBanner}>
                <Ionicons name="flash" size={20} color="#10B981" />
                <View style={styles.highlightTextCol}>
                  <Text style={styles.highlightTitle}>{memorySavings}x VRAM Reduction</Text>
                  <Text style={styles.highlightSub}>
                    Linear attention retains constant throughput even at {seqLength.toLocaleString()} tokens.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* TAB 2: VRAM & FLOPS CALCULATOR */}
        {activeTab === 'calculator' && (
          <View style={styles.section}>
            <View style={styles.infoCard}>
              <Ionicons name="calculator-outline" size={20} color="#38BDF8" />
              <Text style={styles.infoText}>
                Estimate GPU cluster hardware requirements for running LLMs locally or on specialized inference nodes.
              </Text>
            </View>

            {/* Model Size Selection */}
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Model Parameter Size</Text>
              <View style={styles.presetRow}>
                {[7, 14, 34, 70, 180].map(val => (
                  <TouchableOpacity
                    key={val}
                    style={[styles.presetChip, paramSize === val && styles.presetChipActive]}
                    onPress={() => setParamSize(val)}
                  >
                    <Text style={[styles.presetChipText, paramSize === val && styles.presetChipTextActive]}>
                      {val}B
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Quantization Mode */}
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Quantization Precision</Text>
              <View style={styles.presetRow}>
                {['FP16', 'INT8', 'INT4'].map(mode => (
                  <TouchableOpacity
                    key={mode}
                    style={[styles.presetChip, quantization === mode && styles.presetChipActive]}
                    onPress={() => setQuantization(mode)}
                  >
                    <Text style={[styles.presetChipText, quantization === mode && styles.presetChipTextActive]}>
                      {mode}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Hardware Estimation Display */}
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{vramWeightsGB} GB</Text>
                <Text style={styles.statLabel}>Weights VRAM</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: '#38BDF8' }]}>{vramInferenceGB} GB</Text>
                <Text style={styles.statLabel}>Min Inference VRAM</Text>
              </View>
            </View>

            <View style={styles.recommendCard}>
              <Text style={styles.recommendLabel}>Recommended Hardware Target</Text>
              <View style={styles.gpuRow}>
                <Ionicons name="hardware-chip" size={24} color="#A855F7" />
                <Text style={styles.gpuName}>{getGPURecommendation(vramInferenceGB)}</Text>
              </View>
              <Text style={styles.gpuNote}>Includes overhead for activation cache and kv-state buffers.</Text>
            </View>
          </View>
        )}

        {/* TAB 3: CODE INTERPRETER */}
        {activeTab === 'interpreter' && (
          <View style={styles.section}>
            {/* Preset selector */}
            <Text style={styles.controlLabel}>Select Kernel Preset</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetRow}>
              {CODE_PRESETS.map(preset => (
                <TouchableOpacity
                  key={preset.id}
                  style={[styles.presetChip, selectedPreset.id === preset.id && styles.presetChipActive]}
                  onPress={() => {
                    setSelectedPreset(preset);
                    setConsoleOutput('');
                  }}
                >
                  <Text style={[styles.presetChipText, selectedPreset.id === preset.id && styles.presetChipTextActive]}>
                    {preset.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.presetDesc}>{selectedPreset.description}</Text>

            {/* Code Box */}
            <View style={styles.codeContainer}>
              <View style={styles.codeHeader}>
                <Ionicons name="code-slash" size={16} color="#38BDF8" />
                <Text style={styles.codeHeaderTitle}>{selectedPreset.name}.py</Text>
              </View>
              <Text style={styles.codeText}>{selectedPreset.code}</Text>
            </View>

            {/* Run Button */}
            <TouchableOpacity
              style={styles.runButton}
              onPress={runCodeKernel}
              disabled={isRunning}
            >
              {isRunning ? (
                <ActivityIndicator color="#0B0F19" />
              ) : (
                <>
                  <Ionicons name="play" size={18} color="#0B0F19" />
                  <Text style={styles.runButtonText}>Compile & Execute Kernel</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Console Output */}
            {consoleOutput.length > 0 && (
              <View style={styles.consoleContainer}>
                <View style={styles.consoleHeader}>
                  <Ionicons name="terminal" size={16} color="#10B981" />
                  <Text style={styles.consoleTitle}>Stdout Terminal</Text>
                </View>
                <Text style={styles.consoleText}>{consoleOutput}</Text>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#151C2C',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#212C42',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabItemActive: {
    backgroundColor: '#38BDF8',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#0B0F19',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    gap: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    gap: 10,
  },
  infoText: {
    flex: 1,
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 18,
  },
  controlGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlLabel: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  controlValue: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '700',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
  },
  presetChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#151C2C',
    borderWidth: 1,
    borderColor: '#212C42',
  },
  presetChipActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: '#38BDF8',
  },
  presetChipText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  presetChipTextActive: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  comparisonCard: {
    backgroundColor: '#151C2C',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#212C42',
    marginTop: 8,
  },
  cardSectionTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 16,
  },
  metricRow: {
    marginBottom: 14,
  },
  metricLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  metricName: {
    color: '#94A3B8',
    fontSize: 13,
  },
  metricValSoftmax: {
    color: '#F43F5E',
    fontSize: 13,
    fontWeight: '700',
  },
  metricValLinear: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
  },
  barBackground: {
    height: 10,
    backgroundColor: '#0B0F19',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFillSoftmax: {
    height: '100%',
    backgroundColor: '#F43F5E',
    borderRadius: 5,
  },
  barFillLinear: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 5,
  },
  highlightBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginTop: 10,
    gap: 12,
  },
  highlightTextCol: {
    flex: 1,
  },
  highlightTitle: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '700',
  },
  highlightSub: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#151C2C',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#212C42',
    alignItems: 'center',
  },
  statValue: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 12,
  },
  recommendCard: {
    backgroundColor: '#151C2C',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#212C42',
  },
  recommendLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  gpuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  gpuName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  gpuNote: {
    color: '#94A3B8',
    fontSize: 12,
  },
  presetDesc: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
  },
  codeContainer: {
    backgroundColor: '#050811',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#151C2C',
    paddingBottom: 8,
  },
  codeHeaderTitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'Platform',
    fontWeight: '600',
  },
  codeText: {
    color: '#38BDF8',
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  runButton: {
    backgroundColor: '#38BDF8',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  runButtonText: {
    color: '#0B0F19',
    fontSize: 14,
    fontWeight: '700',
  },
  consoleContainer: {
    backgroundColor: '#050811',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  consoleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  consoleTitle: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
  consoleText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
});
