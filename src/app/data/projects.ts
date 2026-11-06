import { L10n } from '../core/i18n/i18n.types';
import { LayerNo } from './stack-layers';

export interface FlowNode {
  icon: string;
  label: L10n | string;
}

interface ProjectBase {
  slug: string;
  order: number;
  title: string;
  fullTitle: string;
  stackShort: string;
  kicker: L10n;
  status: { label: L10n | string; baseMs: number };
  story: { challenge: L10n; whatIDid: L10n; result: L10n };
  /** Exactly three. Numeric values count up from zero. */
  metrics: { value: string; label: L10n }[];
  tags: { layer: LayerNo; name: string }[];
  flow: FlowNode[];
  /** Never a "visit site" link: sites get that button in their preview. */
  links: { label: string; href: string }[];
}

export interface SiteProject extends ProjectBase {
  kind: 'site';
  /** Without protocol, e.g. "my-site.vercel.app". */
  url: string;
  desktopImage: string;
  mobileImage: string;
}

export interface ApiProject extends ProjectBase {
  kind: 'api';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  requestBody: string;
  responseStatus: string;
  responseBody: string;
}

export type Project = SiteProject | ApiProject;

const GH = 'https://github.com/petrickamorim';

export const PROJECTS: Project[] = [
  {
    kind: 'site',
    slug: 'ju-duarte',
    order: 1,
    title: 'Ju Duarte',
    fullTitle: 'Ju Duarte Beauty Studio',
    stackShort: 'Angular 21 · SCSS',
    kicker: { pt: 'cliente real · em produção', en: 'real client · in production' },
    status: { label: { pt: 'no ar', en: 'live' }, baseMs: 142 },
    url: 'site-julia-opal.vercel.app',
    desktopImage: '/projects/ju-desk.jpg',
    mobileImage: '/projects/ju-mob.jpg',
    story: {
      challenge: {
        pt: 'Um estúdio de beleza sem presença digital própria, dependendo só do Instagram para fechar horários.',
        en: 'A beauty studio with no website of its own, relying only on Instagram to book appointments.',
      },
      whatIDid: {
        pt: 'Landing page em Angular 21 com identidade sofisticada, prova social do Google e agendamento direto pelo WhatsApp.',
        en: 'An Angular 21 landing page with a refined identity, Google social proof and direct booking through WhatsApp.',
      },
      result: {
        pt: 'Site no ar na Vercel, rápido e responsivo, convertendo visitas em conversas no WhatsApp.',
        en: 'Live on Vercel, fast and responsive, turning visits into WhatsApp conversations.',
      },
    },
    metrics: [
      { value: '5,0★', label: { pt: 'avaliação Google', en: 'Google rating' } },
      { value: '100%', label: { pt: 'responsivo', en: 'responsive' } },
      { value: '<1s', label: { pt: 'carregamento', en: 'load time' } },
    ],
    tags: [
      { layer: 1, name: 'Angular 21' },
      { layer: 1, name: 'TypeScript' },
      { layer: 1, name: 'SCSS' },
      { layer: 4, name: 'Vercel' },
    ],
    flow: [
      { icon: '◉', label: { pt: 'Visitante', en: 'Visitor' } },
      { icon: 'A', label: 'Angular' },
      { icon: '▲', label: 'Vercel' },
      { icon: '✆', label: 'WhatsApp' },
    ],
    links: [{ label: 'GitHub', href: `${GH}/ju-duarte-beauty-studio-landing-page` }],
  },
  {
    kind: 'api',
    slug: 'secure-auth',
    order: 2,
    title: 'SecureAuth',
    fullTitle: 'SecureUserAuthAPI',
    stackShort: '.NET 8 · JWT',
    kicker: { pt: 'backend · segurança', en: 'backend · security' },
    status: { label: '200 OK', baseMs: 38 },
    method: 'POST',
    path: '/api/auth/login',
    requestBody: '{\n  "email": "visitante@portfolio.dev",\n  "password": "••••••••"\n}',
    responseStatus: '200 OK',
    responseBody: '{\n  "accessToken": "eyJhbGciOiJIUzUxMiJ9…",\n  "refreshToken": "c9f2a1e7…",\n  "expiresIn": 900\n}',
    story: {
      challenge: {
        pt: 'Autenticação é onde a maioria das APIs falha em segurança: tokens eternos, senhas mal guardadas.',
        en: 'Authentication is where most APIs fail at security: never-expiring tokens, badly stored passwords.',
      },
      whatIDid: {
        pt: 'API em .NET 8 com JWT de curta duração + Refresh Token, hash HMACSHA512 e rotas protegidas.',
        en: 'A .NET 8 API with short-lived JWT + Refresh Token, HMACSHA512 hashing and protected routes.',
      },
      result: {
        pt: 'Pronta para plugar em qualquer frontend, documentada no Swagger e alinhada ao OWASP.',
        en: 'Ready to plug into any frontend, documented with Swagger and aligned with OWASP.',
      },
    },
    metrics: [
      { value: '15min', label: { pt: 'vida do token', en: 'token lifetime' } },
      { value: '512', label: { pt: 'bits de hash', en: 'hash bits' } },
      { value: 'OWASP', label: { pt: 'alinhada', en: 'aligned' } },
    ],
    tags: [
      { layer: 2, name: '.NET 8' },
      { layer: 2, name: 'EF Core' },
      { layer: 3, name: 'SQLite' },
      { layer: 5, name: 'JWT' },
      { layer: 5, name: 'OWASP' },
    ],
    flow: [
      { icon: '◉', label: { pt: 'Cliente', en: 'Client' } },
      { icon: '⌁', label: '.NET API' },
      { icon: '🔒', label: 'JWT' },
      { icon: '▤', label: 'SQLite' },
    ],
    links: [{ label: 'GitHub', href: `${GH}/SecureUserAuthAPI` }],
  },
  {
    kind: 'api',
    slug: 'delivery',
    order: 3,
    title: 'Delivery',
    fullTitle: 'Delivery System',
    stackShort: '.NET · Clean Arch',
    kicker: { pt: 'backend · arquitetura', en: 'backend · architecture' },
    status: { label: '201 Created', baseMs: 54 },
    method: 'POST',
    path: '/api/orders',
    requestBody: '{\n  "customerId": 42,\n  "items": 3\n}',
    responseStatus: '201 Created',
    responseBody: '{\n  "id": "ord_8f21",\n  "status": "Dispatched",\n  "eta": "00:32:00"\n}',
    story: {
      challenge: {
        pt: 'Sistemas de entrega crescem rápido e viram um emaranhado difícil de manter.',
        en: 'Delivery systems grow fast and turn into a tangle that is hard to maintain.',
      },
      whatIDid: {
        pt: 'Backend em .NET com Clean Architecture, Design Patterns e API REST bem definida.',
        en: 'A .NET backend with Clean Architecture, design patterns and a well defined REST API.',
      },
      result: {
        pt: 'Domínio isolado, fácil de testar e de evoluir sem quebrar o resto.',
        en: 'An isolated domain, easy to test and to evolve without breaking the rest.',
      },
    },
    metrics: [
      { value: '4', label: { pt: 'camadas', en: 'layers' } },
      { value: 'REST', label: { pt: 'padrão', en: 'standard' } },
      { value: 'SOLID', label: { pt: 'princípios', en: 'principles' } },
    ],
    tags: [
      { layer: 2, name: '.NET' },
      { layer: 2, name: 'C#' },
      { layer: 2, name: 'Clean Arch' },
    ],
    flow: [
      { icon: '◉', label: { pt: 'Cliente', en: 'Client' } },
      { icon: '⌁', label: 'API' },
      { icon: '◇', label: { pt: 'Domínio', en: 'Domain' } },
      { icon: '▤', label: { pt: 'Banco', en: 'Database' } },
    ],
    links: [{ label: 'GitHub', href: `${GH}/delivery-system` }],
  },
  {
    kind: 'api',
    slug: 'taskflow',
    order: 4,
    title: 'TaskFlow',
    fullTitle: 'TaskFlow',
    stackShort: 'Full stack · Swagger',
    kicker: { pt: 'full stack', en: 'full stack' },
    status: { label: '200 OK', baseMs: 41 },
    method: 'GET',
    path: '/api/tasks?done=false',
    requestBody: '',
    responseStatus: '200 OK',
    responseBody: '[\n  { "id": 7, "title": "Deploy v2" },\n  { "id": 9, "title": "Revisar PR" }\n]',
    story: {
      challenge: { pt: 'Organizar tarefas do dia a dia.', en: 'Organizing everyday tasks.' },
      whatIDid: {
        pt: 'Frontend + backend + API documentada no Swagger.',
        en: 'Frontend + backend + an API documented with Swagger.',
      },
      result: { pt: 'Fluxo completo, ponta a ponta.', en: 'A complete, end to end flow.' },
    },
    metrics: [
      { value: '2', label: { pt: 'camadas', en: 'layers' } },
      { value: 'CRUD', label: { pt: 'completo', en: 'complete' } },
      { value: 'Swagger', label: { pt: 'docs', en: 'docs' } },
    ],
    tags: [
      { layer: 1, name: 'Frontend' },
      { layer: 2, name: 'API' },
      { layer: 2, name: 'Swagger' },
    ],
    flow: [
      { icon: '◉', label: { pt: 'Usuário', en: 'User' } },
      { icon: '▣', label: 'Front' },
      { icon: '⌁', label: 'API' },
      { icon: '▤', label: { pt: 'Banco', en: 'Database' } },
    ],
    links: [{ label: 'GitHub', href: `${GH}/TaskFlow` }],
  },
];
