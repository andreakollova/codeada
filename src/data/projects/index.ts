import { InteractiveProject } from '@/types';
import { calculatorProject } from './calculator';
import { passwordGeneratorProject } from './password-generator';

export const projects: InteractiveProject[] = [
  calculatorProject,
  passwordGeneratorProject,
];

export function getProject(id: string): InteractiveProject | undefined {
  return projects.find(p => p.id === id);
}
