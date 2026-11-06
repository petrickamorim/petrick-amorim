import { L10n } from '../core/i18n/i18n.types';

export interface ExperienceItem {
  id: string;
  period: L10n;
  current?: boolean;
  place?: L10n;
  org: string;
  role: L10n;
  roleSuffix?: string;
  highlight?: string;
  /** May contain <b> markup. */
  bullets: L10n[];
  tags: string[];
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: 'senior',
    period: { pt: 'dez 2025 — hoje', en: 'dec 2025 — present' },
    current: true,
    place: { pt: 'São Paulo · Híbrido', en: 'São Paulo · Hybrid' },
    org: 'Senior Sistemas',
    role: { pt: 'Software Developer', en: 'Software Developer' },
    roleSuffix: 'Hypnobox',
    bullets: [
      {
        pt: 'Plataforma de <b>Pós-Venda imobiliário</b> e motor de <b>Régua de Cobrança</b>, atendendo incorporadoras e construtoras.',
        en: '<b>Real estate after-sales</b> platform and <b>billing workflow</b> engine for developers and builders.',
      },
      {
        pt: 'APIs em <b>C# e .NET 10</b> com arquitetura <b>multi-tenant</b>, com um banco MySQL dedicado por cliente.',
        en: '<b>C# and .NET 10</b> APIs on a <b>multi-tenant</b> architecture, with a dedicated MySQL database per client.',
      },
      {
        pt: 'Integração com os ERPs <b>UAU e Mega</b>: contratos, parcelas, boletos por portal e WhatsApp, e informe de IRPF.',
        en: 'Integration with the <b>UAU and Mega</b> ERPs: contracts, installments, bank slips via portal and WhatsApp, and tax reports.',
      },
      {
        pt: 'Provisionamento <b>automático de ambientes</b> para novos clientes, com banco, migrations e canais configurados.',
        en: '<b>Automated environment provisioning</b> for new clients: database, migrations and channels configured.',
      },
      {
        pt: 'Correções do <b>OWASP Top 10</b>, imagens Docker endurecidas e cobertura de testes acima de <b>80%</b> no SonarQube.',
        en: '<b>OWASP Top 10</b> fixes, hardened Docker images and test coverage above <b>80%</b> on SonarQube.',
      },
      {
        pt: 'Jobs resilientes com <b>Hangfire</b> e observabilidade com <b>OpenTelemetry</b> e Graylog.',
        en: 'Resilient jobs with <b>Hangfire</b> and observability with <b>OpenTelemetry</b> and Graylog.',
      },
    ],
    tags: ['C#', '.NET 10', 'Angular', 'MySQL', 'Hangfire', 'Docker', 'GitHub Actions', 'Ansible', 'SonarQube', 'xUnit', 'OpenTelemetry'],
  },
  {
    id: 'antlia',
    period: { pt: 'out 2024 — dez 2025', en: 'oct 2024 — dec 2025' },
    place: { pt: 'São Paulo · Remoto', en: 'São Paulo · Remote' },
    org: 'Antlia',
    role: { pt: 'Desenvolvedor full stack', en: 'Full stack developer' },
    highlight: 'BNP Paribas',
    bullets: [
      {
        pt: 'Sistemas críticos do <b>BNP Paribas</b>, com foco em segurança operacional.',
        en: 'Critical systems for <b>BNP Paribas</b>, focused on operational security.',
      },
      {
        pt: 'Análise e correção de vulnerabilidades <b>OWASP Top 10</b> em C#, .NET e SQL Server, usando <b>Fortify</b> e SonarQube.',
        en: 'Analysis and remediation of <b>OWASP Top 10</b> vulnerabilities in C#, .NET and SQL Server, using <b>Fortify</b> and SonarQube.',
      },
      {
        pt: 'Liderou a <b>padronização completa</b> do sistema interno: paleta, tipografia, diálogos e fluxos, com uma melhoria clara de UX.',
        en: 'Led the <b>full standardization</b> of the internal system: palette, typography, dialogs and flows, with a clear UX improvement.',
      },
      {
        pt: 'Refatoração de módulos .NET, validação de pipelines (Jenkins e Azure DevOps) e correção de bugs em produção.',
        en: 'Refactoring of .NET modules, pipeline validation (Jenkins and Azure DevOps) and production bug fixes.',
      },
    ],
    tags: ['C#', '.NET', 'SQL Server', 'Fortify', 'SonarQube', 'Jenkins', 'Azure DevOps', 'Jira'],
  },
  {
    id: 'anhanguera',
    period: { pt: 'jul 2024 — dez 2026 · formação', en: 'jul 2024 — dec 2026 · education' },
    org: 'Anhanguera',
    role: { pt: 'Análise e Desenvolvimento de Sistemas', en: 'Systems Analysis and Development' },
    bullets: [],
    tags: [],
  },
];
