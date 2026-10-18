import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { parseMarkdownDocument } from '@/utils/markdown-document';

type NodeKind = 'start' | 'document' | 'task';

type GraphNode = {
  id: string;
  title: string;
  kind: NodeKind;
  parentId: string | null;
  x: number;
  y: number;
  content?: string;
  completed?: boolean;
};

const ROOT_NODE: GraphNode = {
  id: 'start',
  title: 'Start',
  kind: 'start',
  parentId: null,
  x: 0.5,
  y: 260,
};

function nodeSize(kind: NodeKind) {
  if (kind === 'start') return 124;
  if (kind === 'document') return 98;
  return 82;
}

function findPosition(
  parent: GraphNode,
  existingNodes: GraphNode[],
  canvasWidth: number,
  canvasHeight: number,
  kind: NodeKind
) {
  const size = nodeSize(kind);
  const margin = size / 2 + 10;
  const minX = Math.min(margin, canvasWidth / 2);
  const maxX = Math.max(canvasWidth - margin, canvasWidth / 2);
  const parentX = parent.x * canvasWidth;
  const parentY = parent.y;

  for (let attempt = 0; attempt < 120; attempt += 1) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 100;
    const x = Math.max(minX, Math.min(maxX, parentX + Math.cos(angle) * distance));
    const y = Math.max(margin, Math.min(canvasHeight - margin, parentY + Math.sin(angle) * distance));
    const overlaps = existingNodes.some((node) => {
      const dx = x - node.x * canvasWidth;
      const dy = y - node.y;
      const minimumDistance = (size + nodeSize(node.kind)) / 2 + 24;
      return dx * dx + dy * dy < minimumDistance * minimumDistance;
    });

    if (!overlaps) return { x: x / canvasWidth, y };
  }

  const fallbackY = Math.min(canvasHeight - margin, existingNodes.reduce(
    (lowest, node) => Math.max(lowest, node.y),
    parentY
  ) + size + 34);
  return { x: Math.random() * (maxX - minX) / canvasWidth + minX / canvasWidth, y: fallbackY };
}

export function NodeWorkspaceScreen() {
  const [canvasWidth, setCanvasWidth] = useState(300);
  const [nodes, setNodes] = useState<GraphNode[]>([ROOT_NODE]);
  const [selectedNodeId, setSelectedNodeId] = useState(ROOT_NODE.id);
  const [isComposerVisible, setComposerVisible] = useState(false);
  const [markdown, setMarkdown] = useState('');
  const [composerError, setComposerError] = useState('');
  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? ROOT_NODE;
  const canvasHeight = Math.max(580, 440 + nodes.length * 128);
  const markdownPreview = useMemo(() => parseMarkdownDocument(markdown), [markdown]);
  const graphEdges = nodes.flatMap((node) => {
    if (!node.parentId) return [];
    const parent = nodes.find((candidate) => candidate.id === node.parentId);
    return parent ? [{ node, parent }] : [];
  });

  function addMarkdownBranch() {
    if (!markdown.trim()) {
      setComposerError('Add a few lines of Markdown before creating a branch.');
      return;
    }

    const parsedDocument = parseMarkdownDocument(markdown);
    const parent = nodes.find((node) => node.id === selectedNodeId) ?? ROOT_NODE;
    const documentId = `document-${Date.now()}`;
    const plannedNodeCount = nodes.length + parsedDocument.tasks.length + 1;
    const layoutHeight = Math.max(580, 440 + plannedNodeCount * 128);
    const nextNodes = [...nodes];
    const documentNode: GraphNode = {
      id: documentId,
      title: parsedDocument.title || 'Untitled document',
      kind: 'document',
      parentId: parent.id,
      ...findPosition(parent, nextNodes, canvasWidth, layoutHeight, 'document'),
      content: parsedDocument.body,
    };
    nextNodes.push(documentNode);

    parsedDocument.tasks.forEach((task, index) => {
      const taskNode: GraphNode = {
        id: `${documentId}-task-${index}`,
        title: task.title,
        kind: 'task',
        parentId: documentId,
        ...findPosition(documentNode, nextNodes, canvasWidth, layoutHeight, 'task'),
        completed: task.completed,
      };
      nextNodes.push(taskNode);
    });

    setNodes(nextNodes);
    setSelectedNodeId(documentId);
    setMarkdown('');
    setComposerError('');
    setComposerVisible(false);
  }

  function toggleTask(taskId: string) {
    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.id === taskId ? { ...node, completed: !node.completed } : node
      )
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <Text style={styles.brandGlyph}>t</Text>
            </View>
            <Text style={styles.brandName}>thatbit</Text>
            <View style={styles.demoPill}>
              <View style={styles.demoDot} />
              <Text style={styles.demoPillLabel}>LOCAL DEMO</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Return to sign in"
              onPress={() => router.replace('/')}>
              <Text style={styles.exitLabel}>Exit</Text>
            </Pressable>
          </View>
          <Text style={styles.eyebrow}>YOUR PROJECT, CONNECTED</Text>
          <Text style={styles.heading}>A map of your context.</Text>
          <Text style={styles.subheading}>
            Add documents and tasks. Each branch builds a shared context for your AI.
          </Text>
        </View>

        <View style={styles.mapToolbar}>
          <View>
            <Text style={styles.mapLabel}>PROJECT MAP</Text>
            <Text style={styles.mapCount}>
              {nodes.length - 1} {nodes.length === 2 ? 'node' : 'nodes'}
            </Text>
          </View>
          <View style={styles.selectionPill}>
            <Text numberOfLines={1} style={styles.selectionText}>
              Branching from {selectedNode.title}
            </Text>
          </View>
        </View>

        <View
          onLayout={(event) => {
            const measuredWidth = Math.max(300, event.nativeEvent.layout.width);
            setCanvasWidth((currentWidth) =>
              Math.abs(currentWidth - measuredWidth) < 1 ? currentWidth : measuredWidth
            );
          }}
          style={styles.graphViewport}>
          {nodes.length === 1 ? (
            <View pointerEvents="none" style={styles.emptyHint}>
              <Text style={styles.emptyHintText}>Your branches appear here as you add them.</Text>
            </View>
          ) : null}
          <ScrollView
            contentContainerStyle={[styles.graphCanvas, { width: canvasWidth, height: canvasHeight }]}
            showsVerticalScrollIndicator={false}>
            {graphEdges.map(({ node, parent }) => {
              const startX = parent.x * canvasWidth;
              const startY = parent.y;
              const endX = node.x * canvasWidth;
              const endY = node.y;
              const length = Math.hypot(endX - startX, endY - startY);
              const angle = Math.atan2(endY - startY, endX - startX);

              return (
                <View
                  key={`edge-${node.id}`}
                  pointerEvents="none"
                  style={[
                    styles.edge,
                    {
                      left: (startX + endX - length) / 2,
                      top: (startY + endY) / 2,
                      width: length,
                      transform: [{ rotate: `${angle}rad` }],
                    },
                  ]}
                />
              );
            })}

            {nodes.map((node) => {
              const size = nodeSize(node.kind);
              const isSelected = node.id === selectedNodeId;

              return (
                <Pressable
                  key={node.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${node.kind === 'task' ? 'Task' : node.kind === 'document' ? 'Document' : 'Start design document'}: ${node.title}`}
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => setSelectedNodeId(node.id)}
                  style={({ pressed }) => [
                    styles.node,
                    node.kind === 'start' ? styles.startNode : null,
                    node.kind === 'document' ? styles.documentNode : null,
                    node.kind === 'task' ? styles.taskNode : null,
                    isSelected ? styles.selectedNode : null,
                    { width: size, height: size, left: node.x * canvasWidth - size / 2, top: node.y - size / 2 },
                    pressed ? styles.nodePressed : null,
                  ]}>
                  {node.kind === 'start' ? (
                    <>
                      <View style={styles.startGlyph}>
                        <Text style={styles.startGlyphText}>✳</Text>
                      </View>
                      <Text style={styles.startTitle}>{node.title}</Text>
                      <Text style={styles.nodeCaption}>DESIGN DOC</Text>
                    </>
                  ) : node.kind === 'document' ? (
                    <>
                      <Text style={styles.documentGlyph}>MD</Text>
                      <Text numberOfLines={2} style={styles.nodeTitle}>{node.title}</Text>
                    </>
                  ) : (
                    <>
                      <View style={[styles.taskDot, node.completed ? styles.taskDotComplete : null]} />
                      <Text numberOfLines={2} style={[styles.nodeTitle, node.completed ? styles.completedTitle : null]}>
                        {node.title}
                      </Text>
                    </>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.bottomBar}>
          <View style={styles.selectedSummary}>
            <Text numberOfLines={1} style={styles.selectedTitle}>{selectedNode.title}</Text>
            <Text numberOfLines={1} style={styles.selectedDescription}>
              {selectedNode.kind === 'start'
                ? 'The root design document for your project.'
                : selectedNode.kind === 'task'
                  ? selectedNode.completed ? 'Task complete' : 'Task · tap below to update'
                  : selectedNode.content ?? 'Markdown document'}
            </Text>
          </View>
          {selectedNode.kind === 'task' ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => toggleTask(selectedNode.id)}
              style={({ pressed }) => [styles.completeButton, pressed && styles.nodePressed]}>
              <Text style={styles.completeButtonLabel}>{selectedNode.completed ? 'Reopen' : 'Complete'}</Text>
            </Pressable>
          ) : (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setComposerError('');
                setComposerVisible(true);
              }}
              style={({ pressed }) => [styles.addButton, pressed && styles.nodePressed]}>
              <Text style={styles.addButtonIcon}>+</Text>
              <Text style={styles.addButtonLabel}>Add a branch</Text>
            </Pressable>
          )}
        </View>
        <Text style={styles.localNote}>This map is saved only in this session. No services are connected.</Text>
      </View>

      <Modal
        animationType="slide"
        onRequestClose={() => setComposerVisible(false)}
        transparent
        visible={isComposerVisible}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}>
          <SafeAreaView style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalEyebrow}>NEW BRANCH · MARKDOWN</Text>
                <Text style={styles.modalTitle}>Add project context</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close Markdown editor"
                onPress={() => setComposerVisible(false)}
                style={styles.closeButton}>
                <Text style={styles.closeLabel}>×</Text>
              </Pressable>
            </View>
            <Text style={styles.modalDescription}>
              A heading creates a document node. Markdown checklist items become connected tasks.
            </Text>
            <TextInput
              accessibilityLabel="Markdown document"
              autoCapitalize="sentences"
              multiline
              onChangeText={(text) => {
                setMarkdown(text);
                setComposerError('');
              }}
              placeholder={'# Design idea\n\nDescribe a source or idea.\n\n- [ ] First task'}
              placeholderTextColor="#636873"
              style={styles.markdownInput}
              textAlignVertical="top"
              value={markdown}
            />
            <Text style={styles.parsePreview}>
              {markdown.trim()
                ? `Creates 1 document and ${markdownPreview.tasks.length} ${markdownPreview.tasks.length === 1 ? 'task' : 'tasks'}`
                : 'Start with a Markdown heading and optional checklist'}
            </Text>
            {composerError ? <Text accessibilityRole="alert" style={styles.errorText}>{composerError}</Text> : null}
            <Pressable
              accessibilityRole="button"
              onPress={addMarkdownBranch}
              style={({ pressed }) => [styles.createButton, pressed && styles.nodePressed]}>
              <Text style={styles.createButtonLabel}>Parse & add to map</Text>
            </Pressable>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#050607',
  },
  screen: {
    flex: 1,
    width: '100%',
    maxWidth: 1120,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 8,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  brandRow: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 24,
  },
  brandMark: {
    width: 25,
    height: 25,
    borderRadius: 8,
    backgroundColor: '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandGlyph: {
    color: '#090a0b',
    fontSize: 17,
    fontWeight: '800',
  },
  brandName: {
    color: '#f0f1f2',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.4,
  },
  demoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#242a28',
    backgroundColor: '#101513',
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  demoDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#70d6a0',
  },
  demoPillLabel: {
    color: '#8dc8a7',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  exitLabel: {
    color: '#8b9098',
    fontSize: 12,
    padding: 8,
    marginLeft: 'auto',
  },
  eyebrow: {
    color: '#8ca8bc',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  heading: {
    color: '#f1f2f3',
    fontSize: 27,
    fontWeight: '500',
    letterSpacing: -0.9,
  },
  subheading: {
    color: '#8b9098',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
    maxWidth: 520,
  },
  mapToolbar: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#1c1f23',
    paddingHorizontal: 2,
  },
  mapLabel: {
    color: '#858a92',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  mapCount: {
    color: '#5f646b',
    fontSize: 10,
    marginTop: 3,
  },
  selectionPill: {
    maxWidth: '62%',
    borderWidth: 1,
    borderColor: '#282c32',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  selectionText: {
    color: '#9da2aa',
    fontSize: 10,
  },
  graphViewport: {
    flex: 1,
    minHeight: 250,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#191c20',
    borderRadius: 20,
    backgroundColor: '#080a0c',
  },
  graphCanvas: {
    alignSelf: 'center',
    overflow: 'hidden',
  },
  emptyHint: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  emptyHintText: {
    color: '#555a62',
    fontSize: 11,
  },
  edge: {
    position: 'absolute',
    height: 1,
    backgroundColor: 'rgba(142,170,190,0.36)',
    zIndex: 0,
  },
  node: {
    position: 'absolute',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderWidth: 1,
    zIndex: 2,
  },
  startNode: {
    backgroundColor: '#151a1e',
    borderColor: '#647786',
    shadowColor: '#a9c4d8',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  documentNode: {
    backgroundColor: '#11171b',
    borderColor: '#3e505d',
  },
  taskNode: {
    backgroundColor: '#101215',
    borderColor: '#33383e',
  },
  selectedNode: {
    borderColor: '#d2e1eb',
    borderWidth: 2,
  },
  nodePressed: {
    opacity: 0.78,
  },
  startGlyph: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#26333c',
    marginBottom: 4,
  },
  startGlyphText: {
    color: '#d5e6f0',
    fontSize: 15,
  },
  startTitle: {
    color: '#f0f3f5',
    fontSize: 15,
    fontWeight: '600',
  },
  nodeCaption: {
    color: '#8d9ca6',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 3,
  },
  documentGlyph: {
    color: '#a6c5d8',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 5,
  },
  nodeTitle: {
    color: '#e3e6e9',
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
    textAlign: 'center',
  },
  taskDot: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#8cb4cc',
    marginBottom: 6,
  },
  taskDotComplete: {
    backgroundColor: '#70d6a0',
  },
  completedTitle: {
    color: '#8b9991',
    textDecorationLine: 'line-through',
  },
  bottomBar: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 2,
    paddingTop: 12,
  },
  selectedSummary: {
    flex: 1,
    minWidth: 0,
  },
  selectedTitle: {
    color: '#e6e8ea',
    fontSize: 12,
    fontWeight: '600',
  },
  selectedDescription: {
    color: '#777d85',
    fontSize: 10,
    marginTop: 4,
  },
  addButton: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 15,
    borderRadius: 22,
    backgroundColor: '#e9edf0',
  },
  addButtonIcon: {
    color: '#15181a',
    fontSize: 19,
    lineHeight: 20,
    fontWeight: '500',
  },
  addButtonLabel: {
    color: '#111315',
    fontSize: 11,
    fontWeight: '700',
  },
  completeButton: {
    minHeight: 40,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3b5346',
    borderRadius: 20,
    paddingHorizontal: 14,
  },
  completeButtonLabel: {
    color: '#9bd4b3',
    fontSize: 11,
    fontWeight: '600',
  },
  localNote: {
    color: '#555a62',
    fontSize: 9,
    lineHeight: 14,
    textAlign: 'center',
    paddingBottom: 3,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  modalSheet: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: '#272b30',
    backgroundColor: '#0d0f11',
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalEyebrow: {
    color: '#89a9bd',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  modalTitle: {
    color: '#f0f2f4',
    fontSize: 22,
    fontWeight: '500',
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: '#1a1d20',
  },
  closeLabel: {
    color: '#c3c7cc',
    fontSize: 23,
    lineHeight: 26,
  },
  modalDescription: {
    color: '#8c929a',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
    marginBottom: 14,
  },
  markdownInput: {
    minHeight: 190,
    maxHeight: 330,
    borderWidth: 1,
    borderColor: '#292d32',
    borderRadius: 14,
    backgroundColor: '#080a0c',
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: '#e4e7ea',
    fontFamily: Platform.select({ web: 'monospace', default: undefined }),
    fontSize: 13,
    lineHeight: 20,
  },
  parsePreview: {
    color: '#8298a7',
    fontSize: 11,
    marginTop: 10,
  },
  errorText: {
    color: '#f09b91',
    fontSize: 11,
    marginTop: 8,
  },
  createButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: '#e9edf0',
    marginTop: 14,
  },
  createButtonLabel: {
    color: '#101214',
    fontSize: 13,
    fontWeight: '700',
  },
});
