import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Project } from '@/types/project';

type TaskSectionProps = {
  projects: Project[];
  isLoading: boolean;
  error: string;
  onReload: () => void;
  onToggleTask: (projectId: string, phaseId: string, taskId: string) => void;
};

export function TaskSection({
  projects,
  isLoading,
  error,
  onReload,
  onToggleTask,
}: TaskSectionProps) {
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});
  const project = projects[0];
  const tasks = project?.phases.flatMap((phase) => phase.tasks) ?? [];
  const completedCount = tasks.filter((task) => task.status === 'done').length;

  return (
    <View style={styles.container}>
      <View style={styles.headingRow}>
        <View style={styles.headingBlock}>
          <Text style={styles.eyebrow}>TASK SECTION</Text>
          <Text style={styles.heading}>Project phases</Text>
          <Text style={styles.subheading}>
            Tasks are grouped by phase from your design document.
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={isLoading}
          onPress={onReload}
          style={({ pressed }) => [styles.reloadButton, pressed && styles.pressed]}>
          <Text style={styles.reloadLabel}>{isLoading ? 'Loading…' : 'Reload document'}</Text>
        </Pressable>
      </View>

      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}

      {project ? (
        <View style={styles.projectSummary}>
          <View style={styles.projectTitleBlock}>
            <Text style={styles.projectName}>{project.name}</Text>
            <Text style={styles.projectMeta}>
              {project.phases.length} {project.phases.length === 1 ? 'phase' : 'phases'} · {completedCount}/{tasks.length} tasks complete
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%` },
              ]}
            />
          </View>
        </View>
      ) : null}

      {isLoading && !project ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Loading design document…</Text>
          <Text style={styles.emptyDescription}>Reading phases and tasks from the project Markdown.</Text>
        </View>
      ) : null}

      {!isLoading && !project && !error ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No project document loaded</Text>
          <Text style={styles.emptyDescription}>Reload the bundled design document to load its phases.</Text>
        </View>
      ) : null}

      {project ? (
        <ScrollView
          contentContainerStyle={styles.phaseList}
          showsVerticalScrollIndicator={false}>
          {project.phases.map((phase, index) => {
            const phaseKey = `${project.id}-${phase.id}`;
            const isExpanded = expandedPhases[phaseKey] ?? true;
            const phaseCompleted = phase.tasks.filter((task) => task.status === 'done').length;

            return (
              <View key={phaseKey} style={styles.phaseCard}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ expanded: isExpanded }}
                  onPress={() =>
                    setExpandedPhases((current) => ({
                      ...current,
                      [phaseKey]: !isExpanded,
                    }))
                  }
                  style={({ pressed }) => [styles.phaseHeader, pressed && styles.pressed]}>
                  <View style={styles.phaseNumber}>
                    <Text style={styles.phaseNumberLabel}>{String(index + 1).padStart(2, '0')}</Text>
                  </View>
                  <View style={styles.phaseHeading}>
                    <Text style={styles.phaseTitle}>{phase.title}</Text>
                    <Text style={styles.phaseMeta}>
                      {phaseCompleted}/{phase.tasks.length} complete
                    </Text>
                  </View>
                  <Text style={styles.expandIcon}>{isExpanded ? '−' : '+'}</Text>
                </Pressable>
                {isExpanded ? (
                  <View style={styles.taskList}>
                    {phase.tasks.length ? phase.tasks.map((task) => {
                      const isComplete = task.status === 'done';
                      return (
                        <Pressable
                          key={task.id}
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked: isComplete }}
                          onPress={() => onToggleTask(project.id, phase.id, task.id)}
                          style={({ pressed }) => [styles.taskRow, pressed && styles.pressed]}>
                          <View style={[styles.checkbox, isComplete && styles.checkboxChecked]}>
                            {isComplete ? <Text style={styles.checkmark}>✓</Text> : null}
                          </View>
                          <Text style={[styles.taskTitle, isComplete && styles.taskTitleComplete]}>
                            {task.title}
                          </Text>
                        </Pressable>
                      );
                    }) : (
                      <Text style={styles.noTasks}>No tasks in this phase.</Text>
                    )}
                  </View>
                ) : null}
              </View>
            );
          })}
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 18,
    paddingBottom: 16,
  },
  headingBlock: {
    flex: 1,
  },
  eyebrow: {
    color: '#8ca8bc',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.6,
    marginBottom: 6,
  },
  heading: {
    color: '#f1f2f3',
    fontSize: 23,
    fontWeight: '500',
    letterSpacing: -0.6,
  },
  subheading: {
    color: '#8b9098',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
  },
  reloadButton: {
    borderWidth: 1,
    borderColor: '#303941',
    borderRadius: 17,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  reloadLabel: {
    color: '#b9cbd6',
    fontSize: 10,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.72,
  },
  error: {
    color: '#f09b91',
    fontSize: 11,
    paddingBottom: 10,
  },
  projectSummary: {
    borderWidth: 1,
    borderColor: '#242a2f',
    borderRadius: 16,
    backgroundColor: '#0b0d0f',
    paddingHorizontal: 15,
    paddingVertical: 13,
    marginBottom: 14,
  },
  projectTitleBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 12,
    marginBottom: 10,
  },
  projectName: {
    flex: 1,
    color: '#dfe3e6',
    fontSize: 12,
    fontWeight: '600',
  },
  projectMeta: {
    color: '#777f87',
    fontSize: 9,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#23282d',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#70d6a0',
  },
  phaseList: {
    gap: 10,
    paddingBottom: 20,
  },
  phaseCard: {
    borderWidth: 1,
    borderColor: '#24292e',
    borderRadius: 16,
    backgroundColor: '#0a0c0e',
    overflow: 'hidden',
  },
  phaseHeader: {
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  phaseNumber: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: '#151a1e',
  },
  phaseNumberLabel: {
    color: '#a6c5d8',
    fontSize: 10,
    fontWeight: '700',
  },
  phaseHeading: {
    flex: 1,
  },
  phaseTitle: {
    color: '#e0e4e7',
    fontSize: 12,
    fontWeight: '600',
  },
  phaseMeta: {
    color: '#777f87',
    fontSize: 9,
    marginTop: 4,
  },
  expandIcon: {
    color: '#8b98a1',
    fontSize: 17,
    paddingHorizontal: 4,
  },
  taskList: {
    borderTopWidth: 1,
    borderTopColor: '#202428',
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  taskRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#191d21',
    paddingVertical: 8,
  },
  checkbox: {
    width: 17,
    height: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#53616b',
    borderRadius: 5,
  },
  checkboxChecked: {
    borderColor: '#70d6a0',
    backgroundColor: '#183126',
  },
  checkmark: {
    color: '#8be2ae',
    fontSize: 11,
    fontWeight: '700',
  },
  taskTitle: {
    flex: 1,
    color: '#bfc5ca',
    fontSize: 11,
    lineHeight: 16,
  },
  taskTitleComplete: {
    color: '#737d77',
    textDecorationLine: 'line-through',
  },
  noTasks: {
    color: '#737b83',
    fontSize: 10,
    paddingVertical: 12,
  },
  emptyState: {
    borderWidth: 1,
    borderColor: '#242a2f',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  emptyTitle: {
    color: '#dfe3e6',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyDescription: {
    color: '#818890',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 6,
  },
});
