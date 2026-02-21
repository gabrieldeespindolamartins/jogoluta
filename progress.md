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
