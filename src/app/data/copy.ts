import { L10n } from '../core/i18n/i18n.types';

export const COPY = {
  hello: { pt: 'Olá! Meu nome é', en: 'Hi! My name is' },
  scrollHint: { pt: 'ROLE ↓', en: 'SCROLL ↓' },
  stackTitle: { pt: 'Como eu construo.', en: 'How I build.' },
  projectsTitle: { pt: 'Projetos', en: 'Projects' },
  projectsHint: { pt: '// passe o mouse · clique para abrir', en: '// hover · click to open' },
  expTitle: { pt: 'Experiência', en: 'Experience' },
  expHint: { pt: '// a linha acompanha a sua rolagem', en: '// the line follows your scroll' },
  current: { pt: 'ATUAL', en: 'CURRENT' },
  contactTitle: { pt: 'Vamos<br>conversar?', en: "Let's<br>talk?" },
  contactSub: {
    pt: 'Tem um projeto, uma vaga ou uma ideia? Me chama, eu respondo rápido.',
    en: 'Got a project, a role or an idea? Reach out, I reply fast.',
  },
  copy: { pt: 'copiar', en: 'copy' },
  copied: { pt: '✓ copiado', en: '✓ copied' },
  available: { pt: 'disponível para novos projetos', en: 'available for new projects' },
  visitSite: { pt: 'Visitar site', en: 'Visit site' },
  send: { pt: 'Enviar', en: 'Send' },
  opening: { pt: 'abrindo', en: 'opening' },
  connected: { pt: 'conectado', en: 'connected' },
  ready: { pt: 'pronto', en: 'ready' },
  challenge: { pt: 'DESAFIO', en: 'CHALLENGE' },
  whatIDid: { pt: 'O QUE FIZ', en: 'WHAT I DID' },
  result: { pt: 'RESULTADO', en: 'RESULT' },
} satisfies Record<string, L10n>;
