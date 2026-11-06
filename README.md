# Petrick Amorim

Portfólio pessoal. Angular, GSAP e tsParticles.

## Rodando localmente

```bash
npm install
npm start
```

Abre em `http://localhost:4200`.

## Testes

```bash
npm test        # unitários (Vitest)
npm run e2e     # ponta a ponta (Playwright)
```

## Adicionando um projeto

Os projetos ficam em `src/app/data/projects.ts`. Basta adicionar um item na lista; a seção de projetos se monta sozinha.

## Deploy na Vercel

1. Na Vercel, clique em "Add New > Project" e importe o repositório `petrickamorim/petrick-amorim`.
2. Framework Preset: "Other" (o `vercel.json` já define o resto).
3. Build Command: `npm run build`
4. Output Directory: `dist/petrick-amorim/browser`
5. Clique em Deploy. O endereço esperado é `petrick-amorim.vercel.app`.

O site é uma página única, sem rotas no cliente, então não precisa de rewrites. Os arquivos com hash (JS e CSS) ficam em cache por um ano; o `index.html` é sempre revalidado.
