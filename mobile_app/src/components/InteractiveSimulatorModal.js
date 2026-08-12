import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function InteractiveSimulatorModal({
  visible,
  onClose,
  initialSimMode = 'cfm' // 'cfm' | 'rag'
}) {
  const [simMode, setSimMode] = useState(initialSimMode);

  // ----------------------------------------------------
  // CFM ODE Trajectory State
  // ----------------------------------------------------
  const [cfmTime, setCfmTime] = useState(0.5); // t in [0, 1]
  const [cfmVectorField, setCfmVectorField] = useState('ot'); // 'ot' | 'curved' | 'vorticity'
  const [cfmSolver, setCfmSolver] = useState('rk4'); // 'euler' | 'midpoint' | 'rk4'
  const [cfmParticles, setCfmParticles] = useState(24);
  const [isCfmAnimating, setIsCfmAnimating] = useState(false);

  // Playback timer for CFM ODE continuous flow
  useEffect(() => {
    let timer;
    if (isCfmAnimating) {
      timer = setInterval(() => {
        setCfmTime(prev => {
          if (prev >= 1.0) {
            setIsCfmAnimating(false);
            return 1.0;
          }
          return parseFloat((prev + 0.05).toFixed(2));
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isCfmAnimating]);

  // CFM calculations
  const velocityError = (
    cfmVectorField === 'ot'
      ? (0.01 + Math.sin(cfmTime * Math.PI) * 0.02).toFixed(4)
      : cfmVectorField === 'curved'
      ? (0.04 + Math.sin(cfmTime * Math.PI) * 0.08).toFixed(4)
      : (0.12 + Math.sin(cfmTime * Math.PI) * 0.15).toFixed(4)
  );

  const transportCost = (
    cfmVectorField === 'ot' ? 1.02 : cfmVectorField === 'curved' ? 1.48 : 2.15
  ).toFixed(2);

  const odeStepsCount = cfmSolver === 'euler' ? 20 : cfmSolver === 'midpoint' ? 50 : 100;

  // Generate simulated particles trajectory grid positions
  const getParticlePositions = () => {
    const points = [];
    const count = Math.min(cfmParticles, 24);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI;
      const x0 = Math.cos(angle) * 80;
      const y0 = Math.sin(angle) * 80;

      // Target position x1
      const x1 = Math.cos(angle + Math.PI / 4) * 40;
      const y1 = Math.sin(angle + Math.PI / 4) * 40;

      // Trajectory based on vector field
      let xt, yt;
      if (cfmVectorField === 'ot') {
        xt = (1 - cfmTime) * x0 + cfmTime * x1;
        yt = (1 - cfmTime) * y0 + cfmTime * y1;
      } else if (cfmVectorField === 'curved') {
        const curveOffset = Math.sin(cfmTime * Math.PI) * 35;
        xt = (1 - cfmTime) * x0 + cfmTime * x1 + curveOffset;
        yt = (1 - cfmTime) * y0 + cfmTime * y1 - curveOffset * 0.5;
      } else {
        const spiral = cfmTime * Math.PI * 2;
        xt = (1 - cfmTime) * (x0 * Math.cos(spiral) - y0 * Math.sin(spiral)) + cfmTime * x1;
        yt = (1 - cfmTime) * (x0 * Math.sin(spiral) + y0 * Math.cos(spiral)) + cfmTime * y1;
      }
      points.push({ x0, y0, xt, yt, x1, y1, id: i });
    }
    return points;
  };

  const particleGrid = getParticlePositions();

  // ----------------------------------------------------
  // RAG Epistemic Uncertainty State
  // ----------------------------------------------------
  const [ragContextK, setRagContextK] = useState(5); // k retrieved documents
  const [ragOodDistance, setRagOodDistance] = useState(0.4); // 0.0 to 1.0
  const [ragDocVariance, setRagDocVariance] = useState(0.2); // 0.1 to 0.8
  const [ragTemperature, setRagTemperature] = useState(0.7);
  const [isQueryingRag, setIsQueryingRag] = useState(false);
  const [ragQueryResult, setRagQueryResult] = useState(null);

  // Compute uncertainty metrics
  const epistemicUncertainty = Math.min(1.0, (
    ragOodDistance * 0.65 + (1 / Math.max(1, ragContextK)) * 0.25 + ragDocVariance * 0.2
  )).toFixed(3);

  const aleatoricNoise = (ragDocVariance * 0.4 + ragTemperature * 0.15).toFixed(3);
  const totalEntropy = (parseFloat(epistemicUncertainty) * 0.7 + parseFloat(aleatoricNoise) * 0.3).toFixed(3);

  const getGuardrailStatus = (val) => {
    const v = parseFloat(val);
    if (v < 0.30) {
      return { label: 'SAFE • HIGH CONFIDENCE', color: '#10B981', action: 'Direct Generation Allowed' };
    } else if (v < 0.65) {
      return { label: 'MODERATE UNCERTAINTY', color: '#F59E0B', action: 'Append Citation & Soft Warnings' };
    } else {
      return { label: 'EPISTEMIC REFUSAL TRIGGERED', color: '#F43F5E', action: 'Fallback Search / Refusal Guard' };
    }
  };

  const statusGuard = getGuardrailStatus(epistemicUncertainty);

  const runRagSimulation = () => {
    setIsQueryingRag(true);
    setRagQueryResult(null);
    setTimeout(() => {
      setIsQueryingRag(false);
      setRagQueryResult({
        timestamp: new Date().toLocaleTimeString(),
        retrievedDocs: [
          { title: 'Doc #1: Hoosha Linear Attention State Space Spec', score: (0.95 - ragOodDistance * 0.3).toFixed(2) },
          { title: 'Doc #2: Continuous Flow ODE Integration Theorem', score: (0.88 - ragOodDistance * 0.35).toFixed(2) },
          { title: 'Doc #3: Triton GPU SRAM Cache Bounds', score: (0.76 - ragOodDistance * 0.4).toFixed(2) }
        ],
        epistemicScore: epistemicUncertainty,
        action: statusGuard.action
      });
    }, 800);
  };

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
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color="#F8FAFC" />
          </TouchableOpacity>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>INTERACTIVE SIMULATOR</Text>
            <Text style={styles.headerSub}>Frontier AI Physics & Information Dynamics</Text>
          </View>
          <View style={{ width: 32 }} />
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          <TouchableOpacity
            style={[styles.simTab, simMode === 'cfm' && styles.simTabActive]}
            onPress={() => setSimMode('cfm')}
          >
            <Ionicons name="git-network-outline" size={16} color={simMode === 'cfm' ? "#0B0F19" : "#94A3B8"} />
            <Text style={[styles.simTabText, simMode === 'cfm' && styles.simTabTextActive]}>
              CFM ODE Trajectory
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.simTab, simMode === 'rag' && styles.simTabActive]}
            onPress={() => setSimMode('rag')}
          >
            <Ionicons name="shield-checkmark-outline" size={16} color={simMode === 'rag' ? "#0B0F19" : "#94A3B8"} />
            <Text style={[styles.simTabText, simMode === 'rag' && styles.simTabTextActive]}>
              RAG Epistemic Uncertainty
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* ======================================================== */}
          {/* SIMULATOR 1: CONTINUOUS FLOW MATCHING (CFM) ODE          */}
          {/* ======================================================== */}
          {simMode === 'cfm' && (
            <View style={styles.simContainer}>
              {/* Formula & Concept Card */}
              <View style={styles.conceptCard}>
                <View style={styles.conceptHeader}>
                  <Ionicons name="flame-outline" size={18} color="#38BDF8" />
                  <Text style={styles.conceptTitle}>Continuous Flow Matching ODE</Text>
                </View>
                <Text style={styles.conceptFormula}>
                  dx_t / dt = v_θ(x_t, t),   x_t = (1 - t) x_0 + t x_1
                </Text>
                <Text style={styles.conceptDesc}>
                  CFM models smooth vector fields v_θ mapping source Gaussian prior noise x_0 (t=0) to target data distribution x_1 (t=1) via deterministic ODE trajectories.
                </Text>
              </View>

              {/* Vector Field Canvas / Grid Visualizer */}
              <View style={styles.canvasCard}>
                <View style={styles.canvasHeader}>
                  <Text style={styles.canvasTitle}>ODE Vector Field Visualizer</Text>
                  <Text style={styles.canvasTimeLabel}>Time t = {cfmTime.toFixed(2)}</Text>
                </View>

                {/* 2D Particle Flow Grid Simulation */}
                <View style={styles.particleGridFrame}>
                  {/* Visual Background Axes */}
                  <View style={styles.axisHorizontal} />
                  <View style={styles.axisVertical} />

                  {/* Flow Particles */}
                  {particleGrid.map(p => {
                    const posX = 130 + p.xt * 0.85;
                    const posY = 90 + p.yt * 0.85;
                    return (
                      <View
                        key={p.id}
                        style={[
                          styles.particleDot,
                          {
                            left: posX,
                            top: posY,
                            backgroundColor: cfmTime === 0 ? '#38BDF8' : cfmTime === 1 ? '#A855F7' : '#10B981'
                          }
                        ]}
                      />
                    );
                  })}

                  <View style={styles.gridLegendRow}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#38BDF8' }]} />
                      <Text style={styles.legendText}>x_0 (Noise)</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                      <Text style={styles.legendText}>x_t (Trajectory)</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#A855F7' }]} />
                      <Text style={styles.legendText}>x_1 (Target Data)</Text>
                    </View>
                  </View>
                </View>

                {/* Animation Playback Controls */}
                <View style={styles.playbackRow}>
                  <TouchableOpacity
                    style={styles.playbackBtn}
                    onPress={() => setIsCfmAnimating(!isCfmAnimating)}
                  >
                    <Ionicons name={isCfmAnimating ? "pause" : "play"} size={18} color="#0B0F19" />
                    <Text style={styles.playbackBtnText}>{isCfmAnimating ? "Pause Flow" : "Play ODE Flow"}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.resetBtn}
                    onPress={() => {
                      setIsCfmAnimating(false);
                      setCfmTime(0.0);
                    }}
                  >
                    <Ionicons name="refresh-outline" size={18} color="#94A3B8" />
                    <Text style={styles.resetBtnText}>t = 0.0</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Interactive Controls */}
              <View style={styles.controlSection}>
                <Text style={styles.controlGroupTitle}>Simulation Parameters</Text>

                {/* Time Step t Selector */}
                <View style={styles.controlCard}>
                  <View style={styles.labelRow}>
                    <Text style={styles.controlName}>Integration Step (t)</Text>
                    <Text style={styles.controlValText}>t = {cfmTime.toFixed(2)}</Text>
                  </View>
                  <View style={styles.stepBtnRow}>
                    {[0.0, 0.2, 0.4, 0.6, 0.8, 1.0].map(val => (
                      <TouchableOpacity
                        key={val}
                        style={[styles.stepChip, cfmTime === val && styles.stepChipActive]}
                        onPress={() => {
                          setIsCfmAnimating(false);
                          setCfmTime(val);
                        }}
                      >
                        <Text style={[styles.stepChipText, cfmTime === val && styles.stepChipTextActive]}>
                          {val.toFixed(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Vector Field Mode */}
                <View style={styles.controlCard}>
                  <Text style={styles.controlName}>Flow Vector Field v_θ(x,t)</Text>
                  <View style={styles.presetRow}>
                    {[
                      { id: 'ot', label: 'Optimal Transport' },
                      { id: 'curved', label: 'Curved Velocity' },
                      { id: 'vorticity', label: 'Vorticity Flow' }
                    ].map(vf => (
                      <TouchableOpacity
                        key={vf.id}
                        style={[styles.presetChip, cfmVectorField === vf.id && styles.presetChipActive]}
                        onPress={() => setCfmVectorField(vf.id)}
                      >
                        <Text style={[styles.presetChipText, cfmVectorField === vf.id && styles.presetChipTextActive]}>
                          {vf.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* ODE Solver Selection */}
                <View style={styles.controlCard}>
                  <Text style={styles.controlName}>Numerical ODE Integrator</Text>
                  <View style={styles.presetRow}>
                    {[
                      { id: 'euler', label: 'Euler' },
                      { id: 'midpoint', label: 'Midpoint' },
                      { id: 'rk4', label: 'Runge-Kutta 4' }
                    ].map(s => (
                      <TouchableOpacity
                        key={s.id}
                        style={[styles.presetChip, cfmSolver === s.id && styles.presetChipActive]}
                        onPress={() => setCfmSolver(s.id)}
                      >
                        <Text style={[styles.presetChipText, cfmSolver === s.id && styles.presetChipTextActive]}>
                          {s.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {/* Real-Time Empirical Metrics */}
              <View style={styles.metricsGrid}>
                <View style={styles.metricBox}>
                  <Text style={styles.metricBoxValue}>{velocityError}</Text>
                  <Text style={styles.metricBoxLabel}>Velocity Error ||v_θ - (x1-x0)||</Text>
                </View>
                <View style={styles.metricBox}>
                  <Text style={[styles.metricBoxValue, { color: '#38BDF8' }]}>{transportCost}</Text>
                  <Text style={styles.metricBoxLabel}>Transport Cost ∫||v_t||² dt</Text>
                </View>
                <View style={styles.metricBox}>
                  <Text style={[styles.metricBoxValue, { color: '#A855F7' }]}>{odeStepsCount}</Text>
                  <Text style={styles.metricBoxLabel}>NFE Steps</Text>
                </View>
              </View>
            </View>
          )}

          {/* ======================================================== */}
          {/* SIMULATOR 2: RAG EPISTEMIC UNCERTAINTY                   */}
          {/* ======================================================== */}
          {simMode === 'rag' && (
            <View style={styles.simContainer}>
              {/* Concept Card */}
              <View style={styles.conceptCard}>
                <View style={styles.conceptHeader}>
                  <Ionicons name="shield-checkmark" size={18} color="#10B981" />
                  <Text style={styles.conceptTitle}>RAG Epistemic Uncertainty Estimation</Text>
                </View>
                <Text style={styles.conceptFormula}>
                  σ²_epistemic(x) = k(x, x) - k_x^T ( K + σ²_n I )⁻¹ k_x
                </Text>
                <Text style={styles.conceptDesc}>
                  Quantifies structural model uncertainty when processing retrieval contexts. Disambiguates out-of-domain knowledge gaps from intrinsic data noise.
                </Text>
              </View>

              {/* Guardrail Status Card */}
              <View style={[styles.guardrailCard, { borderColor: statusGuard.color }]}>
                <View style={styles.guardrailHeader}>
                  <Ionicons name="alert-circle" size={20} color={statusGuard.color} />
                  <Text style={[styles.guardrailTitle, { color: statusGuard.color }]}>
                    {statusGuard.label}
                  </Text>
                </View>
                <Text style={styles.guardrailAction}>Recommended System Action: {statusGuard.action}</Text>
              </View>

              {/* Uncertainty Gauges */}
              <View style={styles.gaugesContainer}>
                {/* Epistemic Bar */}
                <View style={styles.gaugeRow}>
                  <View style={styles.gaugeHeader}>
                    <Text style={styles.gaugeName}>Epistemic Uncertainty σ²_epistemic</Text>
                    <Text style={[styles.gaugeVal, { color: statusGuard.color }]}>{epistemicUncertainty}</Text>
                  </View>
                  <View style={styles.gaugeTrack}>
                    <View
                      style={[
                        styles.gaugeFill,
                        { width: `${Math.min(100, parseFloat(epistemicUncertainty) * 100)}%`, backgroundColor: statusGuard.color }
                      ]}
                    />
                  </View>
                </View>

                {/* Aleatoric Bar */}
                <View style={styles.gaugeRow}>
                  <View style={styles.gaugeHeader}>
                    <Text style={styles.gaugeName}>Aleatoric Noise σ²_aleatoric</Text>
                    <Text style={styles.gaugeValNormal}>{aleatoricNoise}</Text>
                  </View>
                  <View style={styles.gaugeTrack}>
                    <View
                      style={[
                        styles.gaugeFill,
                        { width: `${Math.min(100, parseFloat(aleatoricNoise) * 100)}%`, backgroundColor: '#38BDF8' }
                      ]}
                    />
                  </View>
                </View>

                {/* Total Entropy Bar */}
                <View style={styles.gaugeRow}>
                  <View style={styles.gaugeHeader}>
                    <Text style={styles.gaugeName}>Total Output Entropy H(Y|X)</Text>
                    <Text style={styles.gaugeValNormal}>{totalEntropy}</Text>
                  </View>
                  <View style={styles.gaugeTrack}>
                    <View
                      style={[
                        styles.gaugeFill,
                        { width: `${Math.min(100, parseFloat(totalEntropy) * 100)}%`, backgroundColor: '#A855F7' }
                      ]}
                    />
                  </View>
                </View>
              </View>

              {/* Interactive RAG Controls */}
              <View style={styles.controlSection}>
                <Text style={styles.controlGroupTitle}>RAG Context Parameters</Text>

                {/* Context Documents k */}
                <View style={styles.controlCard}>
                  <View style={styles.labelRow}>
                    <Text style={styles.controlName}>Retrieved Context Passages (k)</Text>
                    <Text style={styles.controlValText}>{ragContextK} passages</Text>
                  </View>
                  <View style={styles.stepBtnRow}>
                    {[1, 3, 5, 10, 20].map(k => (
                      <TouchableOpacity
                        key={k}
                        style={[styles.stepChip, ragContextK === k && styles.stepChipActive]}
                        onPress={() => setRagContextK(k)}
                      >
                        <Text style={[styles.stepChipText, ragContextK === k && styles.stepChipTextActive]}>
                          k = {k}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Out-Of-Domain Distance */}
                <View style={styles.controlCard}>
                  <View style={styles.labelRow}>
                    <Text style={styles.controlName}>Out-Of-Domain Distance (d_OOD)</Text>
                    <Text style={styles.controlValText}>{ragOodDistance.toFixed(2)}</Text>
                  </View>
                  <View style={styles.stepBtnRow}>
                    {[0.0, 0.25, 0.50, 0.75, 1.0].map(dist => (
                      <TouchableOpacity
                        key={dist}
                        style={[styles.stepChip, ragOodDistance === dist && styles.stepChipActive]}
                        onPress={() => setRagOodDistance(dist)}
                      >
                        <Text style={[styles.stepChipText, ragOodDistance === dist && styles.stepChipTextActive]}>
                          {dist === 0.0 ? 'In-Domain' : dist === 1.0 ? 'Far OOD' : dist.toFixed(2)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Passage Variance */}
                <View style={styles.controlCard}>
                  <View style={styles.labelRow}>
                    <Text style={styles.controlName}>Passage Contradiction Noise (σ_doc)</Text>
                    <Text style={styles.controlValText}>{ragDocVariance.toFixed(2)}</Text>
                  </View>
                  <View style={styles.stepBtnRow}>
                    {[0.1, 0.3, 0.5, 0.8].map(v => (
                      <TouchableOpacity
                        key={v}
                        style={[styles.stepChip, ragDocVariance === v && styles.stepChipActive]}
                        onPress={() => setRagDocVariance(v)}
                      >
                        <Text style={[styles.stepChipText, ragDocVariance === v && styles.stepChipTextActive]}>
                          {v === 0.1 ? 'Low' : v === 0.8 ? 'Conflict' : v.toFixed(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {/* Simulation Trigger Button */}
              <TouchableOpacity
                style={styles.queryRunBtn}
                onPress={runRagSimulation}
                disabled={isQueryingRag}
              >
                {isQueryingRag ? (
                  <ActivityIndicator color="#0B0F19" />
                ) : (
                  <>
                    <Ionicons name="search" size={18} color="#0B0F19" />
                    <Text style={styles.queryRunBtnText}>Run Vector Query & Evaluate Guardrail</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* RAG Query Output */}
              {ragQueryResult && (
                <View style={styles.queryResultCard}>
                  <View style={styles.queryResultHeader}>
                    <Ionicons name="pulse" size={16} color="#10B981" />
                    <Text style={styles.queryResultTitle}>Retrieval Analysis Result</Text>
                    <Text style={styles.queryTime}>{ragQueryResult.timestamp}</Text>
                  </View>

                  <Text style={styles.resSubTitle}>Retrieved Document Similarity Scores:</Text>
                  {ragQueryResult.retrievedDocs.map((doc, idx) => (
                    <View key={idx} style={styles.docScoreRow}>
                      <Text style={styles.docTitle} numberOfLines={1}>{doc.title}</Text>
                      <Text style={styles.docScore}>Cos Sim: {doc.score}</Text>
                    </View>
                  ))}
                  <View style={styles.resDivider} />
                  <Text style={styles.resActionText}>Triggered Action: {ragQueryResult.action}</Text>
                </View>
              )}
            </View>
          )}

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
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  closeBtn: {
    padding: 4,
  },
  headerTitleBox: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#151C2C',
    marginHorizontal: 20,
    marginTop: 14,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#212C42',
  },
  simTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  simTabActive: {
    backgroundColor: '#38BDF8',
  },
  simTabText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  simTabTextActive: {
    color: '#0B0F19',
    fontWeight: '700',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  simContainer: {
    gap: 16,
  },
  conceptCard: {
    backgroundColor: '#151C2C',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#212C42',
  },
  conceptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  conceptTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  conceptFormula: {
    color: '#38BDF8',
    fontSize: 13,
    fontFamily: 'monospace',
    backgroundColor: '#0B0F19',
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  conceptDesc: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
  },
  canvasCard: {
    backgroundColor: '#070C16',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  canvasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  canvasTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  canvasTimeLabel: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  particleGridFrame: {
    height: 180,
    backgroundColor: '#0B0F19',
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#151C2C',
  },
  axisHorizontal: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#1E293B',
  },
  axisVertical: {
    position: 'absolute',
    left: 130,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#1E293B',
  },
  particleDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  gridLegendRow: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingVertical: 4,
    borderRadius: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    color: '#CBD5E1',
    fontSize: 10,
  },
  playbackRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  playbackBtn: {
    flex: 2,
    backgroundColor: '#38BDF8',
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  playbackBtnText: {
    color: '#0B0F19',
    fontWeight: '700',
    fontSize: 13,
  },
  resetBtn: {
    flex: 1,
    backgroundColor: '#151C2C',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#212C42',
  },
  resetBtnText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  controlSection: {
    gap: 12,
  },
  controlGroupTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  controlCard: {
    backgroundColor: '#151C2C',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#212C42',
    gap: 10,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlName: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
  },
  controlValText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
  stepBtnRow: {
    flexDirection: 'row',
    gap: 6,
  },
  stepChip: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#0B0F19',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  stepChipActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderColor: '#38BDF8',
  },
  stepChipText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  stepChipTextActive: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
  },
  presetChip: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#0B0F19',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  presetChipActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderColor: '#38BDF8',
  },
  presetChipText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  presetChipTextActive: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#151C2C',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#212C42',
    alignItems: 'center',
  },
  metricBoxValue: {
    color: '#F43F5E',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  metricBoxLabel: {
    color: '#94A3B8',
    fontSize: 10,
    textAlign: 'center',
  },
  guardrailCard: {
    backgroundColor: '#151C2C',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  guardrailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  guardrailTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  guardrailAction: {
    color: '#CBD5E1',
    fontSize: 12,
    marginTop: 2,
  },
  gaugesContainer: {
    backgroundColor: '#151C2C',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#212C42',
    gap: 14,
  },
  gaugeRow: {
    gap: 6,
  },
  gaugeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gaugeName: {
    color: '#94A3B8',
    fontSize: 12,
  },
  gaugeVal: {
    fontSize: 13,
    fontWeight: '800',
  },
  gaugeValNormal: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  gaugeTrack: {
    height: 8,
    backgroundColor: '#0B0F19',
    borderRadius: 4,
    overflow: 'hidden',
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 4,
  },
  queryRunBtn: {
    backgroundColor: '#38BDF8',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  queryRunBtnText: {
    color: '#0B0F19',
    fontWeight: '700',
    fontSize: 14,
  },
  queryResultCard: {
    backgroundColor: '#070C16',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  queryResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  queryResultTitle: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  queryTime: {
    color: '#64748B',
    fontSize: 11,
  },
  resSubTitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 6,
  },
  docScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  docTitle: {
    color: '#CBD5E1',
    fontSize: 12,
    flex: 1,
    marginRight: 10,
  },
  docScore: {
    color: '#38BDF8',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  resDivider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginVertical: 10,
  },
  resActionText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
});
