import { GeneratorConfig } from '@prisma/generator-helper';
import { promises } from 'fs';

const { readFile } = promises;

export type ProjectOptions = {
  name: string;
  databaseType: string;
  note: string;
  isMd: boolean;
};

export function generateProject({
  name,
  databaseType,
  note,
  isMd = false,
}: ProjectOptions): string[] {
  const projectNote = isMd
    ? `'''\n` + `    ${note.replace('\n', '\n    ')}  '''`
    : `'${note}'`;
  const project = [
    `Project ${name} {\n` +
      `  database_type: '${databaseType}'\n` +
      `  Note: ${projectNote}\n}`,
  ];

  return name ? project : [];
}

export async function getProjectOptions({
  projectName,
  projectDatabaseType,
  projectNote,
  projectNotePath,
}: GeneratorConfig['config']): Promise<ProjectOptions> {
  let projectNoteMd = '';

  if (projectNotePath) {
    try {
      const fullPath = `${process.cwd()}/${projectNotePath}`;
      projectNoteMd = await readFile(fullPath, 'utf-8');
    } catch (e) {
      console.log(`Error: file not found: ${e.path}`);
    }
  }

  return {
    name: projectName,
    databaseType: projectDatabaseType,
    note: projectNoteMd || projectNote || '', // noteMd takes precedence
    isMd: projectNoteMd !== '',
  };
}
