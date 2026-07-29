import { InteractiveProject } from '@/types';
import { calculatorProject } from './calculator';
import { passwordGeneratorProject } from './password-generator';
import { todoListProject } from './todo-list';

export const projects: InteractiveProject[] = [
  calculatorProject,
  passwordGeneratorProject,
  todoListProject,
];

export function getProject(id: string): InteractiveProject | undefined {
  return projects.find(p => p.id === id);
}
