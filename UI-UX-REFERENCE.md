# UI/UX Reference — repertório visual e de interação

> Pesquisa conduzida em **18/11/2026**, por inspeção real em Chromium 159 (headless), viewport desktop **1440×900** e mobile **390×844**.
> Dados de tipografia, cores, raios, grids e transições foram extraídos de `getComputedStyle`; screenshots estão em `docs/ui-references/screenshots/`.
> Este documento **não altera o produto**. Ele serve de repertório para as próximas decisões de frontend do Patio.

---

## 1. Resumo executivo

### O que foi feito

- **23 URLs visitadas**, incluindo homepages, páginas de preço, páginas de produto, documentação de componentes e galerias de padrões.
- **20 acessíveis**; 3 bloqueadas ou indisponíveis (detalhes na seção 1.4).
- **51 screenshots** capturadas (desktop e mobile), organizadas por referência.
- Métricas reais coletadas: fonte, tamanho/peso do H1, cor de fundo/texto, contraste, paleta dominante, raios, altura da navegação, grids, largura máxima, quantidade de transições, animações em execução, presença de `focus-visible`, imagens sem `alt`, landmarks e botões sem nome acessível.
- Nenhuma conclusão foi baseada em site que não abriu. Onde a coleta foi parcial, isso está marcado.

### Os 6 padrões que mais se repetem nas referências fortes

1. **Uma cor de destaque, usada com parcimônia.** Linear usa lavanda (`#5e6ad2`) sobre quase-preto; Stripe usa roxo (`#533afd`) sobre branco; Resend usa verde (`#22ff99`) sobre preto; Vercel fica no quase-mono e reserva azul para links/estados. O destaque não pinta cards inteiros.
2. **Tipografia é a hierarquia.** H1s de 48–96 px, com `letter-spacing` negativo (-1 a -4 px) e linha de 1.0–1.1. Corpo em 14–16 px com linha 1.5–1.7. Mono entra como acento **funcional** (dados, atalhos, labels, código), não como decoração.
3. **Bordas de 1 px em vez de sombras.** Linear, Vercel, shadcn, Resend e Raycast constroem superfícies com borda de baixo contraste e fundos chapados. Sombra fica reservada para o que flutua (modal, dropdown, toast).
4. **Espaço negativo é estrutural.** Vercel e Mobbin usam seções com 96–160 px de respiro; os cards são poucos e grandes. A densidade alta aparece só onde o usuário precisa comparar dados (tabelas, pricing, listas).
5. **Movimento curto e consistente.** As transições de UI medidas ficam entre **100–300 ms**; reveals maiores chegam a 300–400 ms. As bibliotecas de efeito (Aceternity, Magic UI, React Bits) usam animação longa — e são usadas em marketing, não em telas de operação.
6. **Uma assinatura memorável, não dez.** Resend tem a serifa display; Linear tem o quase-preto com lavanda e tipografia apertada; Vercel tem o triângulo e o mono-espaço; Raycast tem a barra flutuante e os atalhos. O resto da interface é disciplinado e neutro.

### O que **não** importar

- Glassmorphism, aurora gradients e feixes de luz em telas de dados.
- Cards com raio de 24–32 px em um produto que já tem identidade industrial de 3–4 px.
- Excesso de animação em tabelas e formulários.
- Navs com 12+ itens e pop-ups que cobrem conteúdo no mobile (Stripe, Dribbble e Landingfolio aparecem assim nas capturas).
- Bento grid como layout principal de dashboard; ele funciona como **resumo**, não como sistema de informação.

---

## 1.1 Referências que mais se destacaram

| Referência | Por que |
|---|---|
| **Linear** | Dark UI precisa, tipografia com tracking negativo, pricing em colunas sem cards, 1 px separando tudo, motion de 100–160 ms. O melhor modelo para o "console de operação" do Patio. |
| **shadcn/ui** | Base neutra, acessível e componível. A tabela de dados e a documentação em 3 colunas são diretamente aplicáveis a Histórico, Usuários e Configurações. |
| **Vercel** | Disciplina monocromática, hierarquia por escala tipográfica, mobile com CTAs empilhados. Referência para landing e estados vazios. |
| **Resend** | Contraste serifa display + mono de interface; pricing em 4 colunas sobre preto. Excelente para dar personalidade "técnica premium" sem virar template. |
| **Raycast** | Barra flutuante, busca com atalho (`⌘K`), grid de ícones e bordas de 1 px. Referência para command palette e ações rápidas. |
| **Stripe** | Um único momento de marca (a faixa gradiente) + UI de produto em card. Mostra como usar gradiente **uma vez**, não como sistema. |
| **SaaS UI / Mobbin** | Índices de padrões reais (dashboards, data tables, pricing, empty states) para consulta futura, mesmo sem acesso ao produto autenticado. |

---

## 1.2 Método

- Navegação real com Chromium, UA de Chrome estável, locale `en-US`.
- Para cada homepage: screenshot 1440×900, extração de estilos computados e teste de overflow horizontal em 390×844.
- Para páginas internas: screenshots adicionais de pricing, produto, docs, store e galerias.
- Medição de movimento: propriedades, durações e easings de elementos visíveis; contagem de `@keyframes` e regras `:hover`.
- Não foi feito teste com usuários, leitor de tela real, zoom de 200% ou aparelho físico. Acessibilidade aqui é **observação automatizada**, não auditoria WCAG completa.

## 1.3 Limites da coleta

- **Áreas autenticadas** (dashboards reais de Stripe, Linear, Mobbin, SaaS UI) não foram acessadas. As conclusões sobre dashboards vêm de screenshots públicos, páginas de produto e índices de padrões.
- Sites mudam. As capturas refletem **18/11/2026**.
- A Stripe abriu em **português** na primeira captura (geo/locale), com banners de cookie, país e vendas sobrepostos. A página `stripe.com/en-us/payments` foi capturada em inglês.
- Dados de cor podem vir em `oklch()`/`lab()`; as tabelas usam aproximações legíveis, não valores oficiais de marca.
- Contraste calculado é uma amostra de corpo de texto/botão, não de cada elemento.

## 1.4 Status de acesso

| Site | Status | Observação |
|---|---|---|
| awwwards.com | ✅ 200 | Galeria carregou; cookie modal presente |
| recent.design | ❌ | Timeout / página vazia na sessão |
| land-book.com | ✅ 200 | Galeria e filtros visíveis |
| siteinspire.com | ✅ 200 | Listagem e categorias visíveis |
| linear.app | ✅ 200 | Home, features, pricing |
| mobbin.com | ✅ 200 | Index público; telas completas exigem login |
| saasui.design | ✅ 200 | Índices de padrões e páginas de categoria |
| dribbble.com | ⚠️ 202 | Conteúdo renderizou; status incomum (proteção/bot) |
| 21st.dev | ✅ 200 | Home, componentes, data-viz |
| ui.aceternity.com | ✅ 200 | Home, componentes, bento |
| magicui.design | ✅ 200 | Home, componentes, marquee |
| reactbits.dev | ✅ 200 | Home e biblioteca |
| ui.shadcn.com | ✅ 200 | Home, button, data table |
| rive.app | ✅ 200 | Home |
| lapa.ninja | ✅ 200 | Home e categorias |
| saaspo.com | ✅ 200 | Home |
| onepagelove.com | ❌ 525 | SSL handshake failed (Cloudflare) |
| landingfolio.com | ✅ 200 | Home, hero examples |
| behance.net | ❌ 403 | Bloqueio de bot; não analisado |
| stripe.com | ✅ 200 | Home (pt-BR) e payments (en-US) |
| vercel.com | ✅ 200 | Home e pricing |
| raycast.com | ✅ 200 | Home e store |
| resend.com | ✅ 200 | Home e pricing |

---

## 2. O que diferencia interfaces boas de interfaces genéricas

### 2.1 Marcadores observados

1. **Escala tipográfica com intenção.** Não é "tudo 16 px". Há display (48–96), seção (24–32), corpo (14–16), meta (11–13) e mono para dados. Exemplos: Linear 64/64, Vercel 64/64, Resend 96/96, shadcn 48/52.8.
2. **Tracking negativo no display.** Linear `-1.4 px`, Vercel `-3.84 px`, shadcn `-2.4 px`, 21st `-4.25 px`. Em tamanhos grandes, o texto fica mais coeso; em corpo, o tracking volta ao normal.
3. **Uma decisão de cor dominante.** Fundo quase-preto + um acento (Linear, Raycast, 21st, React Bits) ou branco + tinta escura + um acento (Stripe, shadcn, Vercel, SaaSpo). A paleta não tenta ser "colorida".
4. **Bordas finas, raios contidos.** shadcn usa 8–10 px e cartões com 18–24 px em blocos demonstrativos; Linear 8–12 px; Raycast 8–16 px; Resend 4–16 px; Vercel 6 px. Nenhum produto de operação usa raio 32 px em tudo.
5. **Densidade com respiro.** Tabelas compactas, mas com padding de seção generoso. O contraste entre zona densa e zona vazia é o que evita poluição.
6. **Navegação previsível.** 56–76 px de altura, itens de 13–15 px, CTA destacado à direita, login discreto. Mobile: hambúrguer, drawer ou barra flutuante; CTAs viram largura total.
7. **Estados completos.** Hover, focus-visible, disabled, loading, empty e erro aparecem nas referências. shadcn e Linear são especialmente consistentes.
8. **Detalhes de operação.** `⌘K` para busca (Raycast, shadcn, 21st), ícones de teclado, contadores mono, status com ponto colorido, datas em mono.
9. **Assinatura sem ruído.** Resend usa serifa apenas no display; Raycast usa uma barra flutuante; Stripe usa uma faixa gradiente. O resto permanece neutro.
10. **Conteúdo real, não placeholder.** As galerias funcionam porque mostram produto real; os dashboards de referência mostram dados plausíveis, não "Lorem ipsum".

### 2.2 Anti-padrões vistos nas capturas

| Anti-padrão | Onde foi observado | Por que evitar |
|---|---|---|
| Pop-ups empilhados cobrindo o herói | Stripe mobile (cookie + país + vendas + chat) | Interrompe a primeira tarefa e esconde o CTA |
| Banner promocional competindo com a navegação | Dribbble, Lapa | Desloca o foco e aumenta carga visual |
| Survey modal sobre o conteúdo | Landingfolio | Cobre justamente o que o usuário veio ver |
| Screenshots decorativas atrás do texto no mobile | SaaSpo | Reduz legibilidade; a H1 se mistura às imagens |
| Muitos efeitos de fundo | Aceternity/Magic UI/React Bits em excesso | Em produto, cansa e distrai |
| Texto muted sem checar contraste | Vários sites | `#737373` em 12 px pode ficar abaixo de 4.5:1 |
| Nav com many items + CTA + busca + login | Lapa, 21st | Exige decisões demais; melhor agrupar em sidebar/menu |

---

## 3. Referências analisadas

### 3.1 Galerias e inspiração

#### Awwwards — https://www.awwwards.com/
- **Visual:** cinza claro (`#e9e9e9` aprox.), tipografia Inter Tight, título de destaque em 126,7 px (nome do site premiado), moldura de screenshot grande, navegação em 54 px com busca central.
- **Estudar:** como uma galeria dá protagonismo à obra (título enorme + imagem), sem competir com ela; escala tipográfica editorial.
- **Reutilizar:** capa de portfólio/case; hero de "site do dia"; grid de imagens com legendas discretas.
- **Contexto:** inspiração e marketing, não produto.
- **Screenshot:** `docs/ui-references/screenshots/awwwards-desktop.jpg`

#### Land-book — https://land-book.com/
- **Visual:** fundo claro, nav de 61 px com busca em pílula, tiles de categoria com raio 12–16 px, filtros em pílulas, grid de screenshots com legendas/tags.
- **Estudar:** navegação por categoria + busca + filtros; como manter uma galeria densa legível.
- **Reutilizar:** tela de "spots" ou "histórico" com filtros em chips; catálogo de templates.
- **Contexto:** galerias, catálogos, listagens com muitos itens.
- **Screenshot:** `docs/ui-references/screenshots/land-book-desktop.jpg`

#### Siteinspire — https://www.siteinspire.com/
- **Visual:** Scto Grotesk A, logo em ponto vermelho, introdução em duas colunas com taxonomia em texto grande, cards de 2 colunas com muito respiro, legendas autor/data.
- **Estudar:** listagem editorial sem cards "pesados"; tipografia como navegação; uso de uma única cor de marca (vermelho) em um detalhe.
- **Reutilizar:** página de referências/curadoria; listas de casos; índice tipográfico.
- **Contexto:** conteúdo editorial, não dashboard.
- **Screenshot:** `docs/ui-references/screenshots/siteinspire-desktop.jpg` e `siteinspire-websites-desktop.jpg`

#### Recent.design — https://www.recent.design/
- **Status:** não abriu na sessão (timeout/página vazia). **Não analisado visualmente.** Não há afirmações sobre ele neste documento.

---

### 3.2 SaaS, dashboards e aplicações

#### Linear — https://linear.app/
- **Visual:** fundo `#08090a`, texto `#f7f8f8`, muted `#8a8f98`, acento lavanda `#5e6ad2`; Inter Variable (400/510/590) + Berkeley Mono. H1 64 px/510, tracking -1.4 px; nav fixa de 73 px; conteúdo em 1320/1344 px; raios 8–12 px + pílulas; 346 elementos com transição.
- **Páginas vistas:** home, `/features`, `/pricing`.
- **Estudar:** pricing em 4 colunas sem cards (separação por espaço e regras); lista de features com check; toggle de cobrança; CTA no rodapé da coluna; hero que vende "sistema" e não "feature".
- **Reutilizar:** layout de pricing; navegação fixa; tipografia apertada; 1 px de borda; tab bar de produto; dark UI operacional.
- **Contexto:** console de operação, pricing, landing técnica.
- **Screenshots:** `linear-desktop.jpg`, `linear-mobile.jpg`, `linear-features-desktop.jpg`, `linear-pricing-desktop.jpg`

#### Mobbin — https://mobbin.com/
- **Visual:** fundo branco, `saans` (400/456/600/652), H1 80 px/652 com tracking -0.6 px; grid de 16 colunas com gaps de 20–200 px; raios 32/18/8 px e pílulas; ícones de apps embutidos no texto do H1 ("stickers").
- **Estudar:** título com ícones inline; CTAs em pílula; mockup de produto em painel arredondado; uso de "stickers" como personalidade sem poluir.
- **Reutilizar:** hero de produto com screenshot grande; tabs Apps/Sites; página de descoberta.
- **Contexto:** marketing de produto, biblioteca de referências.
- **Screenshot:** `mobbin-desktop.jpg`, `mobbin-mobile.jpg`

#### SaaS UI — https://saasui.design/
- **Visual:** Plus Jakarta Sans, H1 60 px/700 com uma palavra em vermelho; nav 65 px; busca central; botão vermelho + secundário outline; faixa de estatísticas em painel com borda.
- **Estudar:** destacar **uma palavra** do título com a cor de marca; faixa de números (169+, 3.500+, 22+, 40+) como prova; organização por "UI patterns" (data table, analytics, pricing, empty state, settings).
- **Reutilizar:** faixa de métricas; página de índice de padrões; taxonomia de problemas.
- **Contexto:** marketing de biblioteca, página de recursos.
- **Screenshots:** `saas-ui-desktop.jpg`, `saas-ui-data-table-desktop.jpg`, `saas-ui-analytics-desktop.jpg`, `saas-ui-pricing-desktop.jpg`, `saas-ui-dashboard-detail-desktop.jpg`

#### Dribbble — https://dribbble.com/
- **Visual:** Mona Sans, H1 52 px/600 com "web design" em rosa; hero split (texto à esquerda, card de imagem à direita); pílulas de categoria; busca grande; muito arredondamento (pílulas, card 16–24 px).
- **Estudar:** hero de dois blocos com prova (bullets com check) e CTA; alternância Hire Talent/Get Hired; busca como elemento central.
- **Reutilizar:** hero de marketplace; busca com filtros; cards de portfólio.
- **Contexto:** marketplace/curadoria, não operação.
- **Screenshot:** `dribbble-desktop.jpg`

---

### 3.3 Componentes e experiências interativas

#### shadcn/ui — https://ui.shadcn.com/
- **Visual:** Geist (500/400/600), H1 48 px/600, tracking -2.4 px; fundo branco/cinza `#f5f5f5`; bordas 1 px; raios 8–10 px, com blocos de 18–24 px; nav sticky de 64 px; 4 colunas de cards no bento.
- **Páginas vistas:** home, `/docs/components/button`, `/docs/components/data-table`.
- **Estudar:** a melhor referência de **contenção**: quase nenhuma animação (0 animações em execução na home), foco em acessibilidade e estados; data table com filtro, "Columns", checkbox, sort, ações de linha, paginação e contador.
- **Reutilizar:** estrutura de docs em 3 colunas (nav 290 px + conteúdo + TOC 220 px); tabela de dados; botões (default/outline/secondary/ghost/destructive/link); tabs; empty; command.
- **Contexto:** base de design system, telas administrativas, documentação.
- **Screenshots:** `shadcn-desktop.jpg`, `shadcn-mobile.jpg`, `shadcn-buttons-desktop.jpg`, `shadcn-data-table-desktop.jpg`

#### 21st.dev — https://21st.dev/
- **Visual:** dark `#09090b`, General Sans 700 para display 85 px + Inter 450 para UI, tracking -4.25 px; nav 56 px; raios 10/8 + pílulas; sidebar de categorias; grid de componentes em 4 colunas.
- **Páginas vistas:** home, community components, data visualization.
- **Estudar:** catálogo navegável por categoria com contagem; thumbnails reais; busca com `⌘K`; sidebar fixa; "copy prompt" e código.
- **Reutilizar:** taxonomia de componentes; página de catálogo; previews escuros/claros lado a lado.
- **Contexto:** biblioteca de componentes, documentação interna.
- **Screenshots:** `21st-dev-desktop.jpg`, `21st-dev-mobile.jpg`, `21st-components-desktop.jpg`, `21st-data-viz-desktop.jpg`

#### Aceternity UI — https://ui.aceternity.com/
- **Visual:** branco/cinza, azul royal, H1 48 px/600; nav 64 px; hero split com screenshots inclinados; sidebar de templates; raio 10 px; muita animação de marketing.
- **Páginas vistas:** home, components, bento grid.
- **Estudar:** bento grid com cards de tamanhos diferentes; preview/código lado a lado; "copy prompt"; organização por blocks/pages/templates.
- **Reutilizar:** bento apenas em resumo de dashboard; preview de componente; sidebar de navegação de docs.
- **Contexto:** landing pages e marketing; usar com moderação em produto.
- **Screenshots:** `aceternity-desktop.jpg`, `aceternity-components-desktop.jpg`, `aceternity-bento-desktop.jpg`

#### Magic UI — https://magicui.design/
- **Visual:** branco, Geist, H1 72 px/600; nav 56 px; banner roxo; botões grandes com gradiente sutil embaixo; lista de componentes em 3 colunas (Marquee, Terminal, Bento, Dock, etc.); detalhe do componente em 3 colunas com Preview/Code.
- **Estudar:** página de componente (preview + código + props + "On this page"); nomes claros; exemplos visuais; animações como *marquee*, *dock*, *animated list*, *blur fade*.
- **Reutilizar:** documentação de componentes; carrossel infinito para logos; dock para ações; lista animada para atividade.
- **Contexto:** marketing, docs, microinterações de produto.
- **Screenshots:** `magic-ui-desktop.jpg`, `magic-ui-components-desktop.jpg`, `magic-ui-marquee-desktop.jpg`

#### React Bits — https://www.reactbits.dev/
- **Visual:** preto `#0a0a0a` com glow roxo, Geist 500, H1 42 px; nav 56 px; dois CTAs (branco + escuro); mockup de editor de código com syntax colors; modal de novidades.
- **Estudar:** posicionamento "componentes animados para sites memoráveis"; preview de código; presets (Ocean, Dune, Dusk, Silk, Aurora); público dev.
- **Reutilizar:** apenas efeitos de fundo/texto em landing; nunca em telas de operação.
- **Contexto:** marketing criativo, portfólio.
- **Screenshot:** `reactbits-desktop.jpg`

#### Rive — https://rive.app/
- **Visual:** preto absoluto, display 48 px/900 em caixa alta/mono, logo gigante "RIVE", divisória de 1 px, nav 63 px, uppercase em labels.
- **Estudar:** identidade "engine/creative tool"; tipografia display como assinatura; contraste máximo sem cor.
- **Reutilizar:** uma página de "produto criativo"; ilustração interativa em empty state/onboarding.
- **Contexto:** produto criativo, não administrativo.
- **Screenshot:** `rive-desktop.jpg`

---

### 3.4 Landing pages e galerias

#### Lapa Ninja — https://www.lapa.ninja/
- **Visual:** Inter, H1 48 px/700, nav 65 px, banner de anúncio no topo, screenshots reais, muitos links de categoria.
- **Estudar:** arquivo de landing pages com filtros por categoria; "screenshot completo" como unidade; volume alto.
- **Reutilizar:** referência de estrutura de landing (não de estética).
- **Contexto:** pesquisa de landing pages.
- **Screenshot:** `lapa-ninja-desktop.jpg`

#### SaaSpo — https://www.saaspo.com/
- **Visual:** Geist, H1 56 px/500, fundo `#fafafa`, texto `#1f1f1f`, nav 72 px; screenshots de sites espalhados ao redor do herói; cards de 48 px de raio; pílulas de filtro.
- **Estudar:** herói cercado por exemplos; contraste entre moldura e conteúdo; filtros de landing.
- **Reutilizar:** hero de galeria; grid de screenshots; **evitar** a sobreposição no mobile.
- **Contexto:** galeria de SaaS.
- **Screenshots:** `saaspo-desktop.jpg`, `saaspo-mobile.jpg`

#### Landingfolio — https://www.landingfolio.com/
- **Visual:** Plus Jakarta Sans, H1 52 px/600 com segunda linha em cinza; layout com sidebar de filtros + conteúdo; pílulas de categoria; cards de 3 colunas; slot de patrocínio.
- **Estudar:** composição "título preto + título cinza"; sidebar de filtros persistente; busca + "Add component"; sort.
- **Reutilizar:** página de biblioteca com sidebar; hierarquia tipográfica em duas cores.
- **Contexto:** biblioteca de landing pages/componentes.
- **Screenshots:** `landingfolio-desktop.jpg`, `landingfolio-hero-desktop.jpg`

#### Behance — https://www.behance.net/
- **Status:** HTTP 403 (bloqueio de bot). **Não analisado.** O título e parte do DOM carregaram, mas a experiência não é confiável; nenhuma conclusão visual é feita aqui.

#### One Page Love — https://www.onepagelove.com/
- **Status:** erro 525 (SSL handshake). **Não analisado.**

#### Awwwards / Land-book / Siteinspire
Ver seção 3.1. As três são melhores como **fonte de repertório** do que como modelo de UI de produto.

---

### 3.5 Produtos reais

#### Stripe — https://stripe.com/
- **Visual:** Söhne variable, H1 48 px/300, tracking -0.96 px; fundo branco; tinta `#061b31`; muted `#50617a`; acento `#533afd`; raio 4 px; nav 76 px; grid de 12 colunas em 1232 px; faixa gradiente (azul/roxo/rosa/laranja) no herói.
- **Páginas vistas:** home (pt-BR) e `/en-us/payments` (inglês).
- **Estudar:** gradiente como **um** momento de marca; card de produto à direita com borda sutil; tab bar interna (Overview/Features/Payment methods/...); botão primário preenchido + link "Contact sales"; prova social em logos monocromáticos; copy que explica o produto, não slogans.
- **Reutilizar:** tab bar de seção; card de checkout/preview; hero assimétrico; uma faixa de cor; botões de 40 px com raio 4 px.
- **Contexto:** landing de infraestrutura financeira; inspiração para a landing do Patio se um dia houver uma.
- **Screenshots:** `stripe-desktop.jpg`, `stripe-mobile.jpg`, `stripe-payments-desktop.jpg`

#### Vercel — https://vercel.com/
- **Visual:** GeistSans, H1 64 px/400, tracking -3.84 px; fundo `#fafafa`, tinta `#171717`; nav 64 px sticky; grid de 12 colunas em 1392 px; raio 6 px e pílulas; quase nenhuma animação (1 em execução).
- **Páginas vistas:** home e `/pricing`.
- **Estudar:** hierarquia por escala e espaço; triângulo como assinatura gráfica; três promessas curtas à direita; pricing em 3 colunas com separadores de 1 px, preço grande (`$0`, `$20`, `Custom`), "Popular" em pílula, CTA no rodapé.
- **Reutilizar:** pricing; seções com muito respiro; CTA preto/branco; mobile com botões full-width; estados vazios.
- **Contexto:** landing e pricing; pode inspirar o "modo claro" do Patio.
- **Screenshots:** `vercel-desktop.jpg`, `vercel-mobile.jpg`, `vercel-pricing-desktop.jpg`

#### Raycast — https://www.raycast.com/
- **Visual:** fundo `#07080a`, texto branco, muted `#9c9c9d`, acento `#00b1ff`; Inter + fontes de sistema; H1 64 px/600; nav flutuante em pílula; raios 12/16/8 px; 381 elementos com transição; 162 regras `:hover`.
- **Páginas vistas:** home e `/store`.
- **Estudar:** barra de navegação flutuante; busca com `⌘K`; grid de ícones de apps; cards escuros com borda 1 px; CTA de download; hierarquia "Store" 80 px.
- **Reutilizar:** command palette; grid de atalhos; busca global; navegação flutuante em desktop; dark UI.
- **Contexto:** ferramenta de produtividade, console, store de extensões.
- **Screenshots:** `raycast-desktop.jpg`, `raycast-mobile.jpg`, `raycast-store-desktop.jpg`

#### Resend — https://resend.com/
- **Visual:** preto `#000`, texto `#f0f0f0`, muted `#a0a0a0`, verde `#22ff99`; ABC Favorit para display 96 px/400 + Commit Mono para interface + Inter; nav 58 px sticky; raios 16/6 px e pílulas; 120 transições, 10 animações.
- **Páginas vistas:** home e `/pricing`.
- **Estudar:** serifa display como assinatura; pricing com slider de volume, tabs (Transactional/Marketing), 4 colunas de planos com borda de 1 px e checks verdes; seções alternando texto e código; hero com objeto 3D monocromático.
- **Reutilizar:** pricing com toggle/slider; serifa apenas em títulos de marketing/recibo; mono para dados; CTAs brancos em fundo preto.
- **Contexto:** produto técnico premium; inspiração para uma landing/recibo do Patio, não para o dashboard.
- **Screenshots:** `resend-desktop.jpg`, `resend-mobile.jpg`, `resend-pricing-desktop.jpg`

---

## 4. Repertório por categoria

### 4.1 Design systems e tokens visuais

#### Tokens observados

| Site | Display | UI/texto | Mono | Raio típico | Nav | Largura |
|---|---|---|---|---|---|---|
| Linear | Inter Variable 64/510 | Inter Variable 16 | Berkeley Mono | 8–12 px + pill | 73 fixed | 1320/1344 |
| Stripe | Söhne 48/300 | Söhne 16 | Source Code Pro | 4/6 px | 76 | 1232 |
| Vercel | GeistSans 64/400 | GeistSans 16 | Geist Mono | 6 px + pill | 64 sticky | 1392 |
| Raycast | Inter/SF 64/600 | Inter/SF 16 | Geist/JetBrains Mono | 8–16 px | floating | 1204 |
| Resend | ABC Favorit 96/400 | Commit Mono/Inter 16 | Commit Mono | 4–16 px + pill | 58 sticky | 1280 |
| shadcn | Geist 48/600 | Geist 16 | Geist Mono | 8–10 px | 64 sticky | 1392 |
| 21st | General Sans 85/700 | Inter 16 | ui-monospace | 8/10 px + pill | 56 sticky | 1104 |
| Mobbin | saans 80/652 | saans 16 | — | 8–32 px | — | 1440 (16 cols) |
| SaaSpo | Geist 56/500 | Geist 16 | — | 16/48 px | 72 sticky | 1376 |

#### Estrutura de tokens recomendada para o Patio

O Patio já tem uma identidade própria. O objetivo é **formalizar** o que existe, não trocar por shadcn/Linear.

```
cor
  bg/asphalt        #121a1f
  bg/paper          #f3f4f1
  surface           #ffffff
  line              #dce0db
  ink               #182024
  muted             #687571
  accent/signal     #f5c518
  accent/deep       #dcae0a
  status/free       #17795e
  status/occupied   #c64733
  plate             #225ea8

tipografia
  sans   Barlow 400/500/600/700
  mono   IBM Plex Mono 500/600
  display 40–56 / 1.05 / -0.02em
  h2      24–32 / 1.2
  body    14–16 / 1.5–1.6
  meta    11–13 / 1.4
  data    mono, tabular-nums

espaço
  4 / 8 / 12 / 16 / 24 / 32 / 48 / 64
  page padding 16 (mobile) / 24 (tablet) / 32 (desktop)
  section gap 24
  table row 48–56
  control height 40–44

raio
  3–4 px (inputs, botões, cards)
  pill apenas em badges/status
  modal 4 px

borda/sombra
  1 px line em toda superfície
  sombra só em modal/dropdown/toast

movimento
  fast 100–160 ms  cor/borda
  base 160–200 ms  fundo/transform
  overlay 200–240 ms
  easing padrao cubic-bezier(0.4, 0, 0.2, 1)
  entrada cubic-bezier(0.25, 1, 0.5, 1)
  respeitar prefers-reduced-motion
```

#### O que evitar nos tokens

- Não introduzir uma terceira família tipográfica. Se precisar de display serif (recibo), usar **uma** ocorrência e documentar.
- Não trocar o raio de 3–4 px por 12–16 px; isso descaracteriza o Patio.
- Não criar 20 tons de cinza. A escala atual (ink, muted, line, paper, surface) cobre o produto.
- Não usar `background-image` gradiente em cards de dados.

---

### 4.2 Dashboards e sistemas administrativos

#### Padrões que se repetem nas boas referências

1. **Shell de 3 zonas:** sidebar fixa (252–290 px), header sticky (56–76 px), conteúdo com largura máxima (1232–1392 px) e padding de 24–32 px.
2. **Sidebar com seções:** label de seção em 11 px muted; item 13–14 px; item ativo com fundo sutil + barra de 3 px; ícones de 18 px; rodapé com usuário/perfil.
3. **Header com contexto:** breadcrumb/título, data/hora, busca e ação primária. No mobile, hambúrguer + título + CTA compacta.
4. **Faixa de estatísticas:** 4 células no desktop, 2×2 no mobile; label 11–12 px muted, número 24–32 px mono/tabular; divisórias de 1 px.
5. **Tabela densa:** header 11 px, linha 48–56 px, hover de fundo, números alinhados à direita, ações no fim, filtros acima, paginação abaixo, colunas opcionais.
6. **Cards de resumo:** usados para "o que precisa de atenção", não para todo dado. No máximo 3–4.
7. **Estado vazio:** ícone pequeno + título + uma linha + CTA; sem ilustração gigante.
8. **Feedback:** skeleton/loading no lugar de spinner de página inteira; toast para sucesso/erro; disabled claro.

#### Como o Patio já se posiciona

O shell atual (sidebar 252 px, header 64 px, página 1280 px, painéis com borda 1 px, tabela 11/14 px, Barlow + Plex Mono, 4 px) já está mais próximo de **Linear/Vercel** do que de um template genérico. O que falta é **refinamento de estados e densidade**, não uma troca de estilo.

#### Oportunidades específicas

| Tela | Referência | Padrão a aplicar |
|---|---|---|
| Dashboard | Linear + shadcn | faixa de 4 métricas; ocupação em grid; movimentos recentes com sticky header |
| Yard | shadcn data table + Raycast | busca com atalho; filtro; linha com ações; valores mono alinhados |
| Histórico | shadcn data table | filtro por placa/data; colunas visíveis; paginação; empty state |
| Usuários | shadcn + Linear | tabela com status, papel, último acesso; ações em menu |
| Pricing | Linear/Vercel/Resend | 3–4 colunas, separadores, plano recomendado, toggle |
| Spots | Land-book/Siteinspire | grid visual com status e legenda; não transformar em tabela |
| Configurações | shadcn docs | layout em 3 colunas com nav lateral e TOC (se crescer) |

---

### 4.3 Landing pages

#### Arquétipos observados

| Arquétipo | Referência | Estrutura | Quando usar |
|---|---|---|---|
| Dark precision | Linear | headline + subcopy + screenshot de produto; muito preto e um acento | produto técnico, console, developer tool |
| Monochrome editorial | Vercel | headline gigante, promessas curtas, logo strip, seções de produto | infraestrutura, posicionamento premium |
| Brand spectacle | Stripe | headline + gradiente de marca + card de produto + logos | fintech/infra com orçamento de marca |
| Technical premium | Resend | serifa display + mono + objeto 3D monocromático + seções de código | produto dev com personalidade |
| Centered product | Raycast/Mobbin | headline central + mockup grande + CTAs; nav flutuante | app/desktop tool |
| Split editorial | Dribbble | texto + bullets + card visual à direita | marketplace, comunidade |
| Gallery-first | Land-book/Siteinspire/SaaSpo | grid de screenshots + filtros | biblioteca/curadoria |

#### Regras de landing que valem copiar

- **Uma promessa por dobra.** Título de 2–3 linhas, subcopy de 1–2 linhas, um CTA primário e no máximo um secundário.
- **Prova em faixa separada.** Logos monocromáticos (Stripe, Vercel) ou números (SaaS UI) — não no meio do texto.
- **CTA primário preenchido, secundário outline/ghost.** Nunca dois botões igualmente fortes.
- **Screenshot real do produto** vale mais que ilustração abstrata. Linear, Raycast e Resend fazem isso.
- **Mobile:** CTAs em largura total, tipografia 32–44 px, uma coluna, sem imagens decorativas atrás do texto.

#### O que não copiar

- Gradiente de aurora em todas as seções; a Stripe usa **uma** faixa.
- Banner de anúncio no topo (Lapa) competindo com a proposta.
- Headline de 5+ linhas no mobile (SaaSpo/Dribbble).
- Prova social com logos coloridos e ruidosos; prefira monocromático.

---

### 4.4 Navegação e estruturas de layout

#### Padrões medidos

| Padrão | Onde | Detalhe |
|---|---|---|
| Top nav fixa | Linear | 73 px, blur/escura, links 13 px, CTA pill |
| Top nav sticky | Vercel/shadcn/Resend | 58–64 px, borda inferior 1 px, fundo quase opaco |
| Nav flutuante | Raycast | container com raio 12–16 px, margem superior 24 px, sombra sutil |
| Sidebar + header | Linear, shadcn docs, 21st | 252–290 px; seções com label 11 px; item ativo com barra |
| Docs 3 colunas | shadcn, Magic UI | sidebar 290 + conteúdo + TOC 220; h1 30 px |
| Mobile drawer | Maioria | overlay escuro, painel 256–320 px, fecha no backdrop/Esc |
| Mobile bottom CTA | Vercel | botões full-width empilhados; primário preto, secundário outline |
| Command palette | Raycast/shadcn/21st | busca com `⌘K`, lista de resultados, teclado |

#### Recomendação para o Patio

- Manter a sidebar de 252 px e o drawer mobile atual; adicionar **um** atalho global (`Ctrl/⌘ + K`) para "check-in, buscar placa, abrir yard".
- Header: manter 64 px; usar o espaço para data/hora em mono e a ação primária.
- Se o produto ganhar configurações, adotar o layout de docs em 3 colunas do shadcn, não uma página longa.

---

### 4.5 Componentes e interações

#### Botões

**Observado:**
- shadcn: default/outline/secondary/ghost/destructive/link, 32–36 px, raio 8–10 px, foco visível.
- Linear: pílula 32 px no nav, 6–12 px em ações; primário branco/preenchido.
- Vercel: primário preto 32–40 px, secundário outline; sem sombra.
- Stripe: primário roxo 40 px, raio 4 px; secundário outline.
- Resend: primário branco/preenchido 41 px, raio 4 px; secundário ghost.

**Para o Patio:** manter `btn` 38–40 px, raio 3 px, primário signal, secundário outline, perigo occupied. Adicionar `:focus-visible` com anel de 2 px e `aria-disabled` consistente.

#### Tabelas de dados

Padrão shadcn (docs de Data Table):
- Barra superior: filtro por texto + dropdown "Columns".
- Cabeçalho com checkbox, sort (seta), label 11–12 px.
- Linha com checkbox, conteúdo, ação "…" alinhada à direita.
- Rodapé: "0 of 5 row(s) selected." à esquerda; Previous/Next à direita.
- Paginação e visibilidade de colunas.

**Para o Patio:** aplicar em Histórico e Usuários. Manter a tabela com `overflow-x-auto` + `relative` (correção já feita) e adicionar:
- `position: sticky` no `thead` (fundo surface, borda).
- Coluna de valor sempre à direita e mono.
- Empty state dentro do painel, com CTA.
- Linha clicável com `focus-visible` e ação por teclado (não apenas hover).
- Contador de resultados e "limpar filtros".

#### Filtros

- Land-book/Landingfolio: chips + busca + sort; sempre há "clear".
- shadcn: input + select + date picker com popover.
- **Para o Patio:** filtros em uma linha no desktop, empilhados no mobile; labels visíveis (não placeholder-only); botão "Aplicar" só se houver custo de consulta; caso contrário, aplicar no `change` com debounce.

#### Formulários

- Labels 12 px semibold, inputs 40–44 px, helper 12 px, erro 12 px.
- Validação no blur/submit; erro junto ao campo e resumo no topo se houver muitos.
- Autofocus no primeiro campo (login já faz); `autocomplete` correto.
- Botão primário à direita no desktop, full-width no mobile.

#### Modais

- shadcn/Linear: overlay escuro, painel centrado, raio 8–12 px, header com título e X, footer com Cancelar/Confirmar.
- **Patio:** o `ModalComponent` atual já tem `dialog`, `aria-labelledby`, backdrop, Esc e scroll lock. **Falta**: focus trap, devolver o foco ao elemento que abriu e `aria-modal` explícito. Próximo passo de acessibilidade.

#### Toasts

- shadcn/Resend: canto inferior/topo direito, 1 linha, ícone, fechar, 4–6 s, `aria-live`.
- **Patio:** já existe `ToastService`; padronizar 3 tons (success/error/info) e não usar toast para erro de formulário (inline).

#### Pricing

- **Linear:** 4 colunas, sem cards; preço 24 px; features com check; CTA full-width no rodapé; toggle anual/mensal.
- **Vercel:** 3 colunas, separadores de 1 px; preço 64 px; "Popular" pill; CTA no rodapé.
- **Resend:** 4 cards com borda 1 px, raio 16 px; slider de volume + tabs; checks verdes; preço 48 px.
- **Para o Patio:** 3–4 colunas com separadores de 1 px (mais próximo da identidade), plano recomendado com filete signal de 2 px, toggle de cobrança quando houver, CTA no rodapé. Não usar cards com sombra.

#### Empty states

- Ícone 20–24 px, título 14–16 px, uma linha 12–13 px, CTA 32–36 px.
- Referências: shadcn "No results", Vercel, Linear.
- **Patio:** usar no histórico vazio, yard vazio, tabela de usuários; nunca um card gigante vazio.

#### Command palette / busca

- Raycast: barra com `⌘K`, lista de resultados, teclado.
- shadcn: `Command` com busca e grupos.
- **Patio:** "Check-in rápido" com busca de placa, ações "Abrir yard", "Novo check-in", "Histórico". Implementar só quando houver demanda; não é prioridade de MVP.

---

### 4.6 Animações e transições

#### Medições reais

| Site | Transições observadas | Tempo/easing | Animações em execução |
|---|---|---|---|
| Linear | cor, borda, fundo, sombra, opacidade, filtro, transform | 100 ms `ease`; 160 ms `cubic-bezier(0.25,0.46,0.45,0.94)` | 120 |
| Stripe | cor, transform, clip-path | 300 ms `cubic-bezier(0.25,1,0.5,1)`; 800 ms `cubic-bezier(0.165,0.84,0.44,1)` | 12 |
| Vercel | cor, borda, fundo | 100–150 ms `cubic-bezier(0.4,0,0.2,1)` | 1 |
| Raycast | cor, box-shadow, fundo | 300 ms `ease`; 200 ms `ease` | 38 |
| Resend | cor, fundo, transform, opacidade | 150–200 ms `cubic-bezier(0.4,0,0.2,1)` | 10 |
| shadcn | todas as cores, tamanho, sombra | 100–200 ms `cubic-bezier(0.4,0,0.2,1)` | 0 |
| Mobbin | opacidade, cores | 150–300 ms `cubic-bezier(0,0,0.2,1)` | 11 |

#### Regras para o produto

- **Feedback (hover/focus/press):** 100–160 ms.
- **Mudança de estado (acordeão, tab, drawer):** 160–240 ms.
- **Overlay (modal, dropdown):** 180–240 ms.
- **Entrada de página:** 200–260 ms, `translateY(4–8 px)` + opacidade; o Patio já usa 260 ms.
- **Números/contadores:** animar apenas se o valor mudar em tempo real e o usuário estiver olhando; caso contrário, estático.
- **Tabelas:** nunca animar linhas na ordenação; usar transição de cor de 100 ms no hover.
- **`prefers-reduced-motion`:** obrigatório; o Patio já tem a regra global.
- **Não usar:** parallax em dashboard, bounce/elastic, animações de 800 ms em navegação, autoplay de vídeo com som.

#### Catálogo de efeitos das bibliotecas (para marketing, não para o console)

| Biblioteca | Efeitos que valem estudar | Uso adequado |
|---|---|---|
| Magic UI | marquee, dock, animated list, number ticker, blur fade | faixa de logos, onboarding, empty state |
| Aceternity | bento grid, card hover, floating dock, background beams | landing, página de recursos |
| React Bits | text animations, backgrounds, holo mosaic | hero/portfólio |
| 21st | catálogo amplo de componentes/variações | referência de implementação |
| Rive | ilustração interativa | onboarding/empty state, não tabela |

---

### 4.7 Tipografia e combinações de cores

#### Combinações observadas

| Referência | Display | Corpo | Mono | Sensação |
|---|---|---|---|---|
| Linear | Inter Variable 64/510 | Inter Variable 16 | Berkeley Mono | precisa, técnica, noturna |
| Stripe | Söhne 48/300 | Söhne 16 | Source Code Pro | confiável, financeira, editorial |
| Vercel | GeistSans 64/400 | GeistSans 16 | Geist Mono | neutra, espacial, premium |
| Resend | ABC Favorit 96/400 | Commit Mono/Inter | Commit Mono | técnica + editorial |
| shadcn | Geist 48/600 | Geist 16 | Geist Mono | neutra, de sistema |
| 21st | General Sans 85/700 | Inter 14–16 | ui-monospace | builder, energética |
| Mobbin | saans 80/652 | saans 16 | — | amigável, arredondada |
| SaaSpo | Geist 56/500 | Geist 16 | — | limpa, minimal |
| Siteinspire | Scto Grotesk A 24–32 | Scto 14–16 | — | editorial, culta |
| Patio (atual) | Barlow 40–56/600 | Barlow 14–16 | IBM Plex Mono | industrial, funcional |

#### Paletas observadas (aproximações)

| Referência | Fundo | Texto | Muted | Acento |
|---|---|---|---|---|
| Linear | `#08090a` | `#f7f8f8` | `#8a8f98` | `#5e6ad2` (lavanda) |
| Stripe | `#ffffff` | `#061b31` | `#50617a` | `#533afd` (roxo) |
| Vercel | `#fafafa` | `#171717` | `#4d4d4d` | `#52aeff` (azul) |
| Raycast | `#07080a` | `#ffffff` | `#9c9c9d` | `#00b1ff` (azul) |
| Resend | `#000000` | `#f0f0f0` | `#a0a0a0` | `#22ff99` (verde) |
| shadcn | `#ffffff` | `#0a0a0a` | `#737373` | neutro |
| 21st | `#09090b` | `#f6f6f8` | `#98989d` | azul royal |
| Mobbin | `#ffffff` | `#141414` | `#707070` | preto |
| SaaSpo | `#fafafa` | `#1f1f1f` | — | preto |
| Patio | `#f3f4f1` / `#121a1f` | `#182024` | `#687571` | `#f5c518` (signal) |

#### Recomendação tipográfica para o Patio

- Manter **Barlow + IBM Plex Mono**. É uma combinação com personalidade industrial e já está implementada.
- Aumentar o contraste de escala: display 40–56 px (não 28–32) em páginas de destaque; seções 24–28 px; corpo 14–16 px.
- Usar IBM Plex Mono em: valores monetários, tempos, IDs de vaga, placas, atalhos e labels de sistema. Não usar mono em parágrafos.
- Tracking: `-0.02em` a `-0.03em` em display; `0` em corpo; `0.08–0.12em` em labels uppercase (com moderação).
- Evitar uma serifa no produto. Se o recibo imprimível existir, a serifa pode ser um detalhe **apenas** nele (referência Resend), nunca no dashboard.

---

### 4.8 Responsividade e acessibilidade

#### Observações de responsividade

- As 9 homepages medidas (Linear, Stripe, Vercel, Raycast, Resend, shadcn, 21st, Mobbin, SaaSpo) tiveram **0 px de overflow horizontal** em 390×844.
- Padrões mobile observados:
  - Nav vira hambúrguer + CTA compacto (Linear, Vercel, Raycast).
  - CTAs empilham e ocupam 100% (Vercel, Resend).
  - Título cai para 32–44 px e quebra em 2–3 linhas.
  - Screenshots de produto entram abaixo do texto, não atrás (exceto SaaSpo, que piora a leitura).
  - Grids de 2 colunas no mobile para cards e spots (shadcn mantém o bento em 2 colunas; Patio usa 2 colunas em Spots).
  - Tabelas usam scroll horizontal com min-width; o ideal é esconder colunas secundárias antes de exigir scroll (como fizemos no dashboard em 1024).
  - Espaçamento lateral de 16–24 px; nada de texto colado na borda.
- O Patio já passou por 320/768/1024/1280/1440 em Chromium. **Falta** aparelho físico e zoom de 200%.

#### Acessibilidade observada nas referências

| Site | Imagens sem alt | Botões sem nome | `focus-visible` | Landmarks |
|---|---|---|---|---|
| Linear | 0/38 | 1 | ✅ | main/nav/header/footer |
| Stripe | 0/42 | 0 | não detectado (pode estar em JS/shadow) | main/nav/header/footer |
| Vercel | 0/23 | 0 | ✅ | main/nav/header/footer |
| Raycast | 0/124 | 3 (provável ícone com aria-label) | ✅ | sem main/nav/header no DOM |
| Resend | 0/73 | 0 | ✅ | sem main/nav; header/footer |
| shadcn | 0/2 | 0 | ✅ | main/nav/header/footer |
| 21st | 0/107 | 0 | ✅ | main/nav/header/footer |
| Mobbin | 0/298 | 0 | ✅ | main/nav/header/footer |
| SaaSpo | 0/67 | 0 | ✅ | main/nav/header/footer |

> **Cuidado:** contagens automatizadas não são auditoria. Um botão "sem nome" pode ter `aria-label` no elemento pai ou texto visualmente oculto; um site sem `<main>` pode usar `role="main"`. O valor aqui é o padrão: nos **9 sites medidos**, nenhuma imagem extraída estava sem `alt` e a maioria declarava `focus-visible`.

#### Checklist para o Patio

- [x] Skip link para o conteúdo.
- [x] `aria-label` em botões de ícone.
- [x] `focus-visible` com anel signal.
- [x] `prefers-reduced-motion`.
- [x] `scope="col"` nas tabelas.
- [x] `aria-labelledby` no modal.
- [ ] Focus trap e retorno de foco no modal.
- [ ] Navegação por teclado nas linhas de tabela (ações).
- [ ] `aria-live` explícito nos toasts (verificar).
- [ ] Contraste de `muted` em 11–12 px (checar 4.5:1).
- [ ] Teste com leitor de tela (NVDA/VoiceOver).
- [ ] Zoom 200% e aparelho físico.

---

## 5. Componentes interessantes (fichas rápidas)

### 5.1 Pricing em colunas sem cards — Linear
- **Estrutura:** 4 colunas; nome do plano, preço, toggle, lista de features com check, CTA no rodapé.
- **Por que funciona:** a comparação é horizontal; não há borda competindo; o plano recomendado se destaca por contraste, não por sombra.
- **Aplicação:** tela de preços do Patio, planos de pátio (diária/mensalista) no futuro.
- **Cuidado:** no mobile, virar acordeão ou cards empilhados; manter o preço visível.

### 5.2 Data table com filtros e colunas — shadcn
- **Estrutura:** filtro + "Columns" + tabela + seleção + paginação.
- **Por que funciona:** o usuário controla densidade e colunas; ações ficam no fim da linha.
- **Aplicação:** Histórico, Usuários, futura lista de mensalistas.
- **Cuidado:** não esconder a ação principal atrás de "…" sem alternativa por teclado.

### 5.3 Barra flutuante + busca — Raycast
- **Estrutura:** nav em pílula, logo, links, busca `⌘K`, download.
- **Por que funciona:** separa navegação do conteúdo e reforça o produto "launcher".
- **Aplicação:** command palette do Patio, não a nav principal (o produto é uma aplicação web, não um launcher).

### 5.4 Bento de resumo — shadcn/Magic UI/Aceternity
- **Estrutura:** 1–2 cards grandes + 3–4 pequenos, raio consistente, títulos curtos.
- **Por que funciona:** cria hierarquia sem tabela; ótimo para "resumo do dia".
- **Aplicação:** dashboard do Patio (ocupação, receita, check-outs, alerta).
- **Cuidado:** bento não é lugar para 20 métricas; use no máximo 4–6 blocos.

### 5.5 Faixa de estatísticas — SaaS UI
- **Estrutura:** 4 números em um painel com divisórias de 1 px.
- **Por que funciona:** prova quantitativa sem poluição.
- **Aplicação:** topo do dashboard, página de histórico, landing.
- **Cuidado:** não repetir a mesma métrica em cards diferentes.

### 5.6 Empty state com ação — shadcn/Vercel
- **Estrutura:** ícone 20 px, título, uma linha, botão.
- **Por que funciona:** o usuário sabe o próximo passo.
- **Aplicação:** yard vazio, histórico sem resultados, usuários sem cadastro.

### 5.7 Documentação em 3 colunas — shadcn/Magic UI
- **Estrutura:** nav de componentes à esquerda, conteúdo, "On this page" à direita.
- **Por que funciona:** orienta sem esconder o conteúdo; a TOC é útil em páginas longas.
- **Aplicação:** central de ajuda/configurações do Patio, se crescer.

### 5.8 Serifa + mono — Resend
- **Estrutura:** display serif 96 px, corpo mono, botões brancos, objeto 3D.
- **Por que funciona:** contraste de personalidade sem cores.
- **Aplicação:** recibo imprimível ou página de "sobre"; **não** no dashboard.

---

## 6. Inspirações de layout (para reutilizar)

### 6.1 "Operator console" — Linear + Patio
- Sidebar escura 252 px, header 64 px, conteúdo claro.
- Faixa de 4 métricas; grid de ocupação; tabela de movimentos.
- Acento signal em uma ação por tela; status em verde/vermelho.
- **Quando:** dashboard, yard, histórico.
- **Evitar:** transformar tudo em dark; manter o papel claro para leitura de dados.

### 6.2 "Monochrome editorial" — Vercel
- Muito branco, tipografia grande, poucos elementos por seção.
- Números e labels em mono.
- **Quando:** landing, login, página de preços.
- **Evitar:** em telas densas; a ausência de cor de status prejudica leitura operacional.

### 6.3 "Technical premium" — Resend
- Preto + serifa display + mono; cards de 16 px; checks verdes.
- **Quando:** página de preços, recibo, comunicação de marca.
- **Evitar:** como tema padrão do app; a serifa cansa em telas de formulário.

### 6.4 "Floating command layer" — Raycast
- Nav flutuante, busca global, atalhos, grid de ícones.
- **Quando:** ações rápidas, check-in, busca de placa.
- **Evitar:** como navegação principal em mobile; o drawer atual funciona melhor.

### 6.5 "Gallery/editorial" — Siteinspire/Land-book
- Tipografia como navegação, grid de imagens, legendas discretas, filtros em chips.
- **Quando:** página de spots (grid visual), inspiração interna.
- **Evitar:** para dados tabulares.

### 6.6 "Bento summary" — shadcn/Magic UI
- 4–6 blocos com tamanhos diferentes, títulos curtos, números grandes.
- **Quando:** resumo no topo do dashboard.
- **Evitar:** repetir o mesmo dado em vários blocos.

---

## 7. Recomendações de aplicação no Patio

### 7.1 Manter

- Barlow + IBM Plex Mono; paleta asphalt/paper/signal; raio 3–4 px; sidebar 252 px; tabela 11/14 px; status verde/vermelho; `prefers-reduced-motion`.
- A identidade "industrial" é o diferencial. As referências devem informar **decisões**, não substituir a linguagem.

### 7.2 Adotar (alto impacto, baixo risco)

1. **Pricing em colunas** com separadores de 1 px e CTA no rodapé (Linear/Vercel), em vez de cards soltos.
2. **Tabela de dados** com filtro, colunas visíveis, paginação e ações alinhadas (shadcn).
3. **Faixa de métricas** 4 células com divisórias de 1 px; 2×2 no mobile (SaaS UI/Linear).
4. **Empty states** com ícone + uma linha + CTA (shadcn/Vercel).
5. **Motion tokens** 100/160/200 ms e easings documentados; remover animações longas de navegação.
6. **Focus visible** consistente e focus trap no modal.
7. **Atalho `⌘K`** para check-in/busca quando houver tempo; não bloqueia o MVP.

### 7.3 Não adotar

- Gradiente de aurora como fundo de seções do app.
- Glassmorphism em painéis de dados.
- Raios de 24–32 px em cards de operação.
- Bento grid como layout principal.
- Serifa no corpo do dashboard.
- Animações de entrada em cada linha de tabela.
- Pop-ups de marketing dentro do app.

### 7.4 Roadmap sugerido (futuro, não imediato)

| Prioridade | Entrega | Referência | Esforço | Impacto |
|---|---|---|---|---|
| P0 | Tabela de dados com filtros/colunas/paginação | shadcn Data Table | médio | alto |
| P0 | Pricing em colunas + plano destacado | Linear/Vercel | baixo | alto |
| P0 | Empty states e loading skeletons | shadcn/Vercel | baixo | médio |
| P1 | Faixa de métricas + timestamp "live" | SaaS UI/Linear | baixo | alto |
| P1 | Focus trap e navegação por teclado | shadcn | baixo | alto |
| P2 | Command palette de check-in/busca | Raycast | médio | médio |
| P2 | Refino da landing/login com um momento de marca | Stripe/Resend | médio | médio |
| P3 | Recibo imprimível com serifa | Resend | baixo | baixo |
| P3 | Microinterações de status (sem excesso) | Linear | baixo | baixo |

### 7.5 Matriz de decisão por tela

| Tela | Estilo-base | Acento | Referência principal | Evitar |
|---|---|---|---|---|
| Login | claro, minimal | signal | Vercel/Linear | gradiente/glass |
| Dashboard | claro, denso | signal + status | Linear + SaaS UI | bento gigante |
| Yard | claro, tabela | status | shadcn data table | cards por veículo |
| Check-in | claro, formulário | signal | Stripe form + shadcn | multi-step sem necessidade |
| Histórico | claro, tabela | status | shadcn data table | scroll horizontal sem colunas ocultas |
| Spots | claro, grid | status | Land-book/Siteinspire | tabela |
| Pricing | claro, colunas | signal | Linear/Vercel | cards com sombra |
| Usuários | claro, tabela | status | shadcn/Linear | modal dentro de modal |
| Landing (futuro) | escuro ou claro | um único | Vercel/Linear/Stripe | aurora em tudo |

---

## 8. Galeria visual

> Capturas em 18/11/2026. As imagens são referência de estudo; não são assets para copiar em produção.

### Produto e pricing

![Linear — home](docs/ui-references/screenshots/linear-desktop.jpg)
*Linear: near-black, tipografia apertada, nav fixa. `linear.app`*

![Linear — pricing](docs/ui-references/screenshots/linear-pricing-desktop.jpg)
*Linear pricing: 4 colunas, separadores, CTA no rodapé. `linear.app/pricing`*

![Stripe — payments](docs/ui-references/screenshots/stripe-payments-desktop.jpg)
*Stripe Payments: hero + card de produto + tab bar interna. `stripe.com/en-us/payments`*

![Vercel — pricing](docs/ui-references/screenshots/vercel-pricing-desktop.jpg)
*Vercel pricing: 3 colunas, preço grande, "Popular" em pílula. `vercel.com/pricing`*

![Resend — pricing](docs/ui-references/screenshots/resend-pricing-desktop.jpg)
*Resend pricing: slider + 4 colunas com borda 1 px. `resend.com/pricing`*

![Raycast — store](docs/ui-references/screenshots/raycast-store-desktop.jpg)
*Raycast Store: nav flutuante, busca ⌘K, grid de ícones. `raycast.com/store`*

### Componentes e dashboards

![shadcn — home](docs/ui-references/screenshots/shadcn-desktop.jpg)
*shadcn/ui: contenção, bordas 1 px, bento de componentes. `ui.shadcn.com`*

![shadcn — data table](docs/ui-references/screenshots/shadcn-data-table-desktop.jpg)
*shadcn Data Table: filtro, colunas, seleção, paginação. `ui.shadcn.com/docs/components/data-table`*

![21st — data visualization](docs/ui-references/screenshots/21st-data-viz-desktop.jpg)
*21st: catálogo de data-viz com sidebar e previews. `21st.dev/community/components/s/data-visualization`*

![SaaS UI — analytics](docs/ui-references/screenshots/saas-ui-analytics-desktop.jpg)
*SaaS UI: índice de dashboards reais. `saasui.design/analytics-dashboard-design-examples`*

![Mobbin — home](docs/ui-references/screenshots/mobbin-desktop.jpg)
*Mobbin: tipografia 80 px com ícones inline. `mobbin.com`*

### Landing e editorial

![Vercel — home](docs/ui-references/screenshots/vercel-desktop.jpg)
*Vercel: mono-espaço, triângulo, promessas curtas. `vercel.com`*

![Resend — home](docs/ui-references/screenshots/resend-desktop.jpg)
*Resend: serifa display + mono + objeto 3D. `resend.com`*

![Siteinspire — websites](docs/ui-references/screenshots/siteinspire-websites-desktop.jpg)
*Siteinspire: tipografia como navegação, grid editorial. `siteinspire.com/websites`*

![Land-book — home](docs/ui-references/screenshots/land-book-desktop.jpg)
*Land-book: filtros em pílula e tiles de categoria. `land-book.com`*

![Landingfolio — hero](docs/ui-references/screenshots/landingfolio-hero-desktop.jpg)
*Landingfolio: sidebar de filtros + galeria de heros. `landingfolio.com/components/hero`*

### Efeitos e identidade

![Aceternity — bento](docs/ui-references/screenshots/aceternity-bento-desktop.jpg)
*Aceternity Bento Grid: blocos de tamanhos diferentes. `ui.aceternity.com/components/bento-grid`*

![Magic UI — marquee](docs/ui-references/screenshots/magic-ui-marquee-desktop.jpg)
*Magic UI: preview + código + props; marquee infinito. `magicui.design/docs/components/marquee`*

![React Bits — home](docs/ui-references/screenshots/reactbits-desktop.jpg)
*React Bits: dark + glow roxo, foco em animação. `reactbits.dev`*

![Rive — home](docs/ui-references/screenshots/rive-desktop.jpg)
*Rive: preto absoluto, display em caixa alta. `rive.app`*

### Mobile

![Linear — mobile](docs/ui-references/screenshots/linear-mobile.jpg)
*Linear 390 px: título 40 px, nav compacta. `linear.app`*

![Vercel — mobile](docs/ui-references/screenshots/vercel-mobile.jpg)
*Vercel 390 px: CTAs empilhados, uma coluna. `vercel.com`*

![Resend — mobile](docs/ui-references/screenshots/resend-mobile.jpg)
*Resend 390 px: imagem antes do título, botões full-width. `resend.com`*

### Estado atual do Patio (para comparação)

![Patio — dashboard atual](docs/ui-references/screenshots/patio-current-dashboard.png)
*Patio em 1024 px após o ajuste da tabela. Barlow + Plex Mono, signal, 4 px.*

> Galeria navegável: `docs/ui-references/gallery.html`

---

## 9. Links para consulta posterior

### Prioridade alta
- Linear — https://linear.app/ · https://linear.app/pricing · https://linear.app/features
- Stripe — https://stripe.com/ · https://stripe.com/en-us/payments
- Vercel — https://vercel.com/ · https://vercel.com/pricing
- Raycast — https://www.raycast.com/ · https://www.raycast.com/store
- Resend — https://resend.com/ · https://resend.com/pricing
- shadcn/ui — https://ui.shadcn.com/ · data table: https://ui.shadcn.com/docs/components/data-table
- SaaS UI — https://saasui.design/ · dashboards: https://www.saasui.design/analytics-dashboard-design-examples · data tables: https://www.saasui.design/data-table-ui-design · pricing: https://www.saasui.design/saas-pricing-page-examples

### Componentes e animação
- 21st — https://21st.dev/ · https://21st.dev/community/components · data-viz: https://21st.dev/community/components/s/data-visualization
- Aceternity — https://ui.aceternity.com/ · bento: https://ui.aceternity.com/components/bento-grid
- Magic UI — https://magicui.design/ · marquee: https://magicui.design/docs/components/marquee
- React Bits — https://www.reactbits.dev/
- Rive — https://rive.app/

### Galerias e landing
- Awwwards — https://www.awwwards.com/
- Land-book — https://land-book.com/
- Siteinspire — https://www.siteinspire.com/websites
- Lapa Ninja — https://www.lapa.ninja/
- SaaSpo — https://www.saaspo.com/
- Landingfolio — https://www.landingfolio.com/ · hero: https://www.landingfolio.com/components/hero
- Mobbin — https://mobbin.com/
- Dribbble — https://dribbble.com/

### Não acessíveis nesta sessão
- Recent.design — https://www.recent.design/ (timeout/página vazia)
- One Page Love — https://www.onepagelove.com/ (SSL 525)
- Behance — https://www.behance.net/ (403)

---

## Apêndice A — Dados medidos (desktop 1440×900)

| Site | H1 | Fonte display | Nav | Cor de destaque | Contraste corpo | Transições |
|---|---|---|---|---|---|---|
| Linear | 64/510 | Inter Variable | 73 fixed | `#5e6ad2` | 18.7:1 | 346 |
| Stripe | 48/300 | Söhne | 76 | `#533afd` | n/d (fundo transparente) | 589 |
| Vercel | 64/400 | GeistSans | 64 sticky | monocromático + `#52aeff` | 17.2:1 | 98 |
| Raycast | 64/600 | Inter/SF | flutuante | `#00b1ff` | 20:1 | 381 |
| Resend | 96/400 | ABC Favorit | 58 sticky | `#22ff99` | 18.4:1 | 120 |
| shadcn | 48/600 | Geist | 64 sticky | neutro | n/d | 53 |
| 21st | 85/700 | General Sans | 56 sticky | azul royal | n/d | 299 |
| Mobbin | 80/652 | saans | — | preto | n/d | 43 |
| SaaSpo | 56/500 | Geist | 72 sticky | preto | 15.8:1 | 84 |

> `n/d` = fundo do body transparente ou composto; a medição automática não é confiável nesse caso. Ver screenshots.

## Apêndice B — O que foi e o que não foi verificado

**Verificado:**
- 23 URLs, 51 screenshots, 20 sites acessíveis.
- Tipografia/cores/raios/grids/nav via estilos computados.
- Overflow horizontal em 390 px nas 9 homepages principais.
- Contagem de transições, keyframes e animações em execução em 7 sites.
- 21 páginas internas (pricing, features, store, docs, galerias).

**Não verificado:**
- Telas autenticadas de produto (Stripe Dashboard, Linear app, Mobbin completo).
- Comportamento real de hover/focus em todos os elementos (apenas CSS/estilos computados).
- Leitor de tela, zoom 200%, aparelho físico.
- Auditoria WCAG completa; as contagens de a11y são indicativas.
- Recent.design, One Page Love e Behance (não acessíveis).
- Métricas de performance (LCP/INP) das referências.

**Próximo uso recomendado:** antes de implementar uma tela, escolher **uma** referência principal + **uma** secundária na seção 9, registrar a decisão em uma ADR curta e adaptar os tokens ao Patio. Não misturar três estilos na mesma tela.
