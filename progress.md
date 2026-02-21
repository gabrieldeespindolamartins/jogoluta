# Progress

## Sessão 2026-02-21 [manual]

### Feito
- Leitura e análise completa do projeto Robot Fighter
- Mapeamento da estrutura atual do repositório
- Identificação do estado do projeto: planejamento concluído, implementação não iniciada
- Revisão do ROBOT-FIGHTER-PLAN.md (613 linhas de design completo)
- Confirmação da stack tecnológica: Three.js, Cannon-es, Vite, JavaScript ES Modules

### Decisões
- O projeto seguirá o roadmap de 6 sprints definido no ROBOT-FIGHTER-PLAN.md
- Próxima ação será iniciar o Sprint 1 (setup do projeto + cena 3D básica + primeiro robô)

### Problemas
- Nenhum

### Próximos passos
- Inicializar estrutura do projeto (package.json, index.html, vite.config.js)
- Sprint 1: Criar cena 3D com Three.js, arena básica e um robô se movendo
- Implementar sistema de input para o primeiro jogador
- Configurar física básica com Cannon-es

---

## Sessão 2026-02-21 — v0.1.0

### Feito
- Sprint 1 completo: implementação da cena 3D e movimento básico
- Scaffolding do projeto: package.json, vite.config.js, index.html
- Core engine: Constants.js, Clock.js (delta time), InputManager.js (keyboard tracking)
- Cena 3D: SceneManager.js (renderer, câmera, luzes), Arena.js (chão + linhas de borda)
- Fighter: FighterModel.js (7 cubos com hierarquia de pivôs), Fighter.js (movimento, gravidade, pulo, agachamento)
- Orquestração: Game.js (game loop), main.js (entry point)
- Build verificado com sucesso (vite build — 0 erros, 13 módulos)

### Decisões
- Gravidade manual (sem Cannon-es por enquanto) — velocityY += gravity * dt
- Sem air control: velocidade horizontal preservada no pulo, sem mudança no ar
- Agachamento via scale.y = 0.7 no modelo (simplificação para Sprint 1)
- Pivôs nos ombros e quadris para animações futuras
- Camera estática centrada (dinâmica no Sprint 2)

### Problemas
- Nenhum

### Próximos passos
- Sprint 2: Adicionar Player 2 e câmera dinâmica que segue ambos os lutadores
- Sprint 3: State machine e primeiro ataque (soco)
- Testar no browser: `npm run dev` → WASD para mover o robô azul

---

## Sessão 2026-02-21 [manual] — v0.1.0

### Feito
- Sprint 1 testado com sucesso no browser (`npm run dev`)
- Jogo funcional: robô azul visível na arena, WASD respondendo corretamente
- Adicionada regra de versionamento ao CLAUDE.md (Semantic Versioning)
- Commit e push do Sprint 1 para GitHub (622a8e3)
- Commit e push do initial commit (3305557)
- Repositório git inicializado e configurado com remote origin

### Decisões
- Versionamento segue Semantic Versioning (MAJOR.MINOR.PATCH)
- Versão registrada em 3 locais: CLAUDE.md, progress.md, package.json
- Changelog resumido mantido na tabela do CLAUDE.md
- .gitignore exclui node_modules, dist, arquivos temporários e binários (.rar, .zip)

### Problemas
- Nenhum

### Próximos passos
- Sprint 2: Adicionar Player 2 (robô vermelho) com controles de setas
- Sprint 2: Câmera dinâmica que segue ambos os lutadores (zoom in/out)
- Sprint 3: State machine (FighterStateMachine.js) e primeiro ataque (soco)

---

## Sessão 2026-02-21 — v0.2.0

### Feito
- Sprint 2 completo: Player 2 e câmera dinâmica
- Constants.js: adicionado SPAWN_POSITIONS (player1 x=-3, player2 x=3)
- Fighter.js: adicionado suporte a oponente, auto-rotação (fighters olham um para o outro), colisão/pushback entre fighters, posição inicial configurável
- SceneManager.js: câmera dinâmica com tracking de ponto médio, zoom baseado em distância, lerp smoothing
- Game.js: instanciação de Player 2 (vermelho, setas), game loop atualizado com oponente e câmera
- Build verificado com sucesso (vite build — 0 erros, 13 módulos)

### Decisões
- Colisão entre fighters: pushback simétrico quando distância < 0.8 unidades
- Auto-rotação com deadzone de 0.01 para evitar flickering quando na mesma posição
- Câmera lookAt usa a posição X interpolada (não o midpoint direto) para suavidade
- Controles são relativos à TELA, não à direção do lutador

### Problemas
- Nenhum

### Próximos passos
- Sprint 3: State machine (FighterStateMachine.js) e primeiro ataque (soco)
- Sprint 4: Sistema de hitbox/hurtbox e dano
- Testar: `npm run dev` → WASD (P1) + Setas (P2), câmera segue ambos

---
