import { L10n } from '../core/i18n/i18n.types';

export type LayerNo = 1 | 2 | 3 | 4 | 5;

export interface StackLayer {
  no: LayerNo;
  name: L10n;
  techs: string[];
}

export const STACK_LAYERS: StackLayer[] = [
  { no: 1, name: { pt: 'Frontend', en: 'Frontend' }, techs: ['Angular', 'TypeScript', 'JavaScript'] },
  { no: 2, name: { pt: 'Backend', en: 'Backend' }, techs: ['C#', '.NET', 'ASP.NET Core', 'EF Core'] },
  { no: 3, name: { pt: 'Banco de Dados', en: 'Databases' }, techs: ['SQL Server', 'MySQL'] },
  { no: 4, name: { pt: 'DevOps', en: 'DevOps' }, techs: ['Docker', 'GitHub Actions', 'Azure DevOps'] },
  {
    no: 5,
    name: { pt: 'Segurança & Qualidade', en: 'Security & Quality' },
    techs: ['OWASP', 'SonarQube', 'xUnit', 'OpenTelemetry'],
  },
];
