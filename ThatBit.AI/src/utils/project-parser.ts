import type { Phase, Project } from '@/types/project';

type ParseOptions = Pick<Project, 'id' | 'name'>;

export function parseProject(text: string, options: ParseOptions): Project {
  const phases: Phase[] = [];
  let currentPhase: Phase | null = null;

  for (const line of text.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('Phase ')) {
      currentPhase = {
        id: `phase-${phases.length + 1}`,
        title: trimmedLine,
        tasks: [],
      };
      phases.push(currentPhase);
      continue;
    }

    if (trimmedLine.startsWith('- ') && currentPhase) {
      const title = trimmedLine.slice(2).trim();
      if (!title) continue;

      currentPhase.tasks.push({
        id: `${currentPhase.id}-task-${currentPhase.tasks.length + 1}`,
        title,
        status: 'todo',
      });
    }
  }

  return {
    ...options,
    phases,
  };
}

export function createIssueBody(phase: Phase): string {
  const tasks = phase.tasks.map((task) => `- [ ] ${task.title}`).join('\n');

  return `## Tasks\n\n${tasks}\n\n## Definition of Done\n\nThis phase is complete when all tasks above are finished.`;
}
