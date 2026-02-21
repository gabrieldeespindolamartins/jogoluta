# 🤖 Robot Fighter — Planejamento do Projeto

## Visão Geral

Jogo de luta 3D local (2 jogadores no mesmo teclado) com robôs, estilo Mortal Kombat. Foco total em mecânica de combate — sem modelos elaborados, usando formas geométricas simples (cubos) como personagens.

**Objetivo:** Protótipo jogável com mecânica sólida e divertida.

---

## Stack Tecnológica

| Tecnologia | Função |
|---|---|
| **Three.js** | Renderização 3D (cena, câmera, objetos, iluminação) |
| **Cannon-es** | Motor de física (gravidade, colisões com o chão) |
| **Vite** | Dev server + bundler |
| **JavaScript (ES Modules)** | Linguagem principal |
| **HTML/CSS** | HUD (barras de vida, timer, mensagens) |

### Instalação Inicial

```bash
mkdir robot-fighter && cd robot-fighter
npm init -y
npm install three cannon-es
npm install -D vite
```

### Scripts do package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## Arquitetura do Projeto

```
robot-fighter/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js                  ← Ponto de entrada, game loop
│   │
│   ├── core/
│   │   ├── Game.js              ← Classe principal, orquestra tudo
│   │   ├── Clock.js             ← Controle de tempo e delta time
│   │   └── Constants.js         ← Constantes do jogo (gravidade, dano, velocidades)
│   │
│   ├── scene/
│   │   ├── SceneManager.js      ← Cria cena Three.js, câmera, luzes
│   │   └── Arena.js             ← Chão, paredes invisíveis, cenário
│   │
│   ├── fighters/
│   │   ├── Fighter.js           ← Classe base do lutador (mesh + física + estado)
│   │   ├── FighterModel.js      ← Construção visual com cubos (cabeça, tronco, braços, pernas)
│   │   ├── FighterStateMachine.js ← Máquina de estados (idle, walk, jump, attack, hit, ko)
│   │   └── FighterAnimator.js   ← Animações procedurais dos golpes (mover braço, perna)
│   │
│   ├── combat/
│   │   ├── CombatManager.js     ← Gerencia a luta: rounds, vitória, empate
│   │   ├── HitboxSystem.js      ← Criação e detecção de hitbox/hurtbox
│   │   ├── AttackRegistry.js    ← Registro de todos os golpes e seus dados
│   │   └── DamageCalculator.js  ← Calcula dano, knockback, stun
│   │
│   ├── input/
│   │   └── InputManager.js      ← Captura teclado, mapeia controles dos 2 jogadores
│   │
│   ├── ui/
│   │   ├── HUD.js               ← Barras de vida, timer, indicador de round
│   │   └── Announcer.js         ← Mensagens na tela ("FIGHT!", "K.O.", "PLAYER 1 WINS")
│   │
│   └── utils/
│       ├── MathUtils.js         ← Funções auxiliares (clamp, lerp, distância)
│       └── DebugHelper.js       ← Visualização de hitboxes, info de estado (toggle com tecla)
```

---

## Configuração da Cena 3D

### Câmera
- Tipo: PerspectiveCamera
- Posição: lateral, acompanhando os dois lutadores
- Comportamento: faz zoom out conforme os lutadores se afastam, zoom in quando se aproximam
- Altura fixa com leve ângulo para baixo

### Iluminação
- 1 luz direcional principal (simula sol, cria sombras)
- 1 luz ambiente suave (para não ter áreas totalmente escuras)

### Arena
- Plano retangular como chão (cor escura, levemente reflexivo)
- Paredes invisíveis nas laterais (os lutadores não podem sair da arena)
- Dimensões: 20 unidades de largura x 10 unidades de profundidade
- Sem cenário elaborado — apenas o chão e um fundo com cor gradiente

---

## Design dos Robôs (Formas Geométricas)

Cada robô é composto por cubos/caixas de cores diferentes:

```
        ┌─────┐
        │CABEÇA│  ← Cubo pequeno (0.5 x 0.5 x 0.5)
        └──┬──┘
      ┌────┴────┐
 ┌──┐ │ TRONCO  │ ┌──┐
 │BR│ │         │ │BR│  ← Braços: cubos finos (0.2 x 0.6 x 0.2)
 │AÇ│ │         │ │AÇ│
 │O │ └────┬────┘ │O │
 └──┘   ┌──┴──┐   └──┘
        │QUADR.│  ← Quadril: cubo achatado
        ├──┬──┤
     ┌──┤  │  ├──┐
     │PE│  │  │PE│  ← Pernas: cubos finos (0.2 x 0.7 x 0.2)
     │RN│  │  │RN│
     │A │  │  │A │
     └──┘  │  └──┘
```

### Cores
- **Jogador 1:** tons de azul (tronco azul escuro, detalhes azul claro)
- **Jogador 2:** tons de vermelho (tronco vermelho escuro, detalhes laranja)
- **Cabeça:** "visor" brilhante (emissive material) — azul/vermelho conforme jogador
- As partes do corpo são agrupadas em um Three.js `Group` para mover tudo junto

### Hierarquia do Modelo

```
FighterGroup (posição/rotação global)
├── body (tronco) — ponto de referência central
│   ├── head (cabeça) — posição relativa ao tronco
│   ├── armLeft (braço esquerdo) — com pivot no ombro
│   ├── armRight (braço direito) — com pivot no ombro
│   └── hips (quadril)
│       ├── legLeft (perna esquerda) — com pivot no quadril
│       └── legRight (perna direita) — com pivot no quadril
```

---

## Sistema de Input

### Mapeamento de Teclas

```javascript
const PLAYER1_KEYS = {
  left:       'KeyA',
  right:      'KeyD',
  jump:       'KeyW',
  crouch:     'KeyS',
  punch:      'KeyF',      // Soco
  strongPunch:'KeyG',      // Soco Forte
  kick:       'KeyH'       // Chute
};

const PLAYER2_KEYS = {
  left:       'ArrowLeft',
  right:      'ArrowRight',
  jump:       'ArrowUp',
  crouch:     'ArrowDown',
  punch:      'Numpad1',    // Soco
  strongPunch:'Numpad2',    // Soco Forte
  kick:       'Numpad3'     // Chute
};
```

### Teclas Globais

```javascript
const GLOBAL_KEYS = {
  pause:      'Escape',
  debug:      'Backquote',  // Tecla ` — toggle visualização de hitboxes
  restart:    'KeyR'        // Reiniciar round
};
```

### Regras de Input
- Capturar `keydown` e `keyup` para saber quais teclas estão PRESSIONADAS em cada frame
- Um jogador NÃO pode andar e atacar ao mesmo tempo (ataque trava movimento)
- Pulo cancela agachamento e vice-versa
- Não aceitar novo ataque enquanto o ataque atual não terminou (previne spam)

---

## Máquina de Estados do Lutador

Cada lutador tem um estado atual que determina o que ele pode fazer:

```
                    ┌──────────┐
           ┌───────│   IDLE   │───────┐
           │       └────┬─────┘       │
           ▼            │             ▼
      ┌─────────┐       │      ┌──────────┐
      │ WALKING │       │      │ CROUCHING│
      └────┬────┘       │      └─────┬────┘
           │            ▼            │
           │     ┌──────────┐        │
           ├────►│ JUMPING  │◄───────┘
           │     └────┬─────┘
           │          │
           ▼          ▼
      ┌──────────────────┐
      │    ATTACKING     │──────► (volta ao IDLE quando animação termina)
      └────────┬─────────┘
               │ (se atingido durante qualquer estado)
               ▼
         ┌──────────┐
         │   HIT    │──────► (volta ao IDLE após stun)
         └────┬─────┘
              │ (se vida chegar a 0)
              ▼
         ┌──────────┐
         │    KO    │──────► FIM DO ROUND
         └──────────┘
```

### Regras de Transição
- De IDLE: pode ir para WALKING, CROUCHING, JUMPING ou ATTACKING
- De WALKING: pode ir para IDLE, JUMPING ou ATTACKING
- De CROUCHING: pode ir para IDLE ou ATTACKING (ataque agachado futuro)
- De JUMPING: pode ir para ATTACKING (ataque aéreo futuro) ou IDLE (ao pousar)
- De ATTACKING: só volta para IDLE quando a animação do golpe termina completamente
- HIT: entra nesse estado quando recebe dano — o lutador fica brevemente atordoado (stun)
- KO: estado final — lutador cai, round acaba

---

## Sistema de Combate

### Dados dos Golpes

```javascript
const ATTACKS = {
  punch: {
    name: 'Soco',
    damage: 5,
    startup: 4,        // frames antes do golpe ficar ativo
    active: 3,         // frames que o golpe pode acertar
    recovery: 6,       // frames até poder agir novamente
    knockback: 0.5,    // distância que empurra o oponente
    stunFrames: 8,     // frames que o oponente fica atordoado
    hitboxOffset: { x: 0.8, y: 1.2, z: 0 },   // posição relativa ao lutador
    hitboxSize: { x: 0.4, y: 0.3, z: 0.4 },    // tamanho da hitbox
    animationPart: 'armRight'                     // parte do corpo que anima
  },

  strongPunch: {
    name: 'Soco Forte',
    damage: 15,
    startup: 12,
    active: 4,
    recovery: 14,
    knockback: 1.5,
    stunFrames: 16,
    hitboxOffset: { x: 1.0, y: 1.3, z: 0 },
    hitboxSize: { x: 0.5, y: 0.4, z: 0.5 },
    animationPart: 'armRight'
  },

  kick: {
    name: 'Chute',
    damage: 10,
    startup: 7,
    active: 4,
    recovery: 10,
    knockback: 1.0,
    stunFrames: 12,
    hitboxOffset: { x: 1.2, y: 0.5, z: 0 },
    hitboxSize: { x: 0.5, y: 0.3, z: 0.4 },
    animationPart: 'legRight'
  }
};
```

### Hitbox / Hurtbox

- **Hurtbox**: caixa invisível sempre ativa ao redor do tronco do lutador. Representa a área que pode receber dano.
  - Tamanho aproximado do tronco + cabeça
  - Se move junto com o lutador

- **Hitbox**: caixa invisível que aparece SOMENTE durante os frames `active` de um ataque.
  - Posição definida pelo `hitboxOffset` do golpe
  - Se ajusta automaticamente baseado na direção que o lutador está olhando (espelha no eixo X)

- **Detecção de colisão**: a cada frame, verificar se alguma hitbox ativa intersecta com a hurtbox do oponente usando `Box3.intersectsBox()` do Three.js

- **Regra de hit único**: cada ataque só pode acertar o oponente UMA vez (flag `hasHit` por ataque)

### Knockback e Stun
- Ao ser atingido, o lutador é empurrado para trás (knockback) e entra no estado HIT
- Durante o stun, o lutador não pode fazer NADA (não anda, não ataca, não defende)
- Ao acabar o stun, volta para IDLE

---

## Sistema de Vida e Rounds

### Configuração

```javascript
const MATCH_CONFIG = {
  maxHealth: 100,       // vida máxima de cada lutador
  roundsToWin: 2,       // melhor de 3 (precisa vencer 2 rounds)
  roundTime: 60,        // segundos por round
  timeBetweenRounds: 3  // segundos de pausa entre rounds
};
```

### Fluxo do Round
1. **Pré-round**: lutadores nas posições iniciais, mensagem "ROUND 1" → "FIGHT!"
2. **Luta**: timer contando, jogadores lutam
3. **Fim do round** quando:
   - Vida de um lutador chega a 0 → K.O.
   - Timer chega a 0 → quem tem mais vida vence o round
4. **Pós-round**: mensagem "K.O." ou "TIME'S UP", pausa breve
5. **Próximo round** ou **Fim da partida** ("PLAYER 1 WINS!")

---

## Movimentação do Lutador

### Constantes de Movimento

```javascript
const MOVEMENT = {
  walkSpeed: 5,          // unidades por segundo
  jumpForce: 8,          // força do pulo (eixo Y)
  gravity: -20,          // gravidade aplicada por segundo
  groundY: 0,            // posição Y do chão
  arenaMinX: -9,         // limite esquerdo da arena
  arenaMaxX: 9,          // limite direito da arena
  pushbackOnOverlap: 0.1 // empurrão quando lutadores se sobrepõem
};
```

### Regras de Movimentação
- Lutadores sempre olham um para o outro (rotação automática no eixo Y)
- "Esquerda" e "Direita" dos controles são relativos à TELA, não ao lutador
- Lutadores NÃO podem atravessar um pelo outro (colisão corpo a corpo)
- Lutadores NÃO podem sair da arena (colisão com paredes invisíveis)
- No ar: sem controle de direção (sem air control) — simplifica a mecânica
- Pulo tem altura fixa (não depende de quanto tempo segura o botão)

---

## Câmera

### Comportamento
- Posição: lateral (eixo Z positivo), olhando para o centro da arena
- Acompanha o ponto médio entre os dois lutadores no eixo X
- Zoom dinâmico: `distância da câmera = distância entre lutadores * fator + offset mínimo`
- Movimento suave (lerp) para evitar câmera brusca
- Limites: não pode fazer zoom demais nem de menos

```javascript
const CAMERA = {
  height: 3,             // altura fixa
  baseDistance: 8,        // distância base no eixo Z
  distanceMultiplier: 0.8,// fator de zoom baseado na distância dos lutadores
  minDistance: 6,         // zoom máximo (mais perto)
  maxDistance: 14,        // zoom mínimo (mais longe)
  smoothing: 0.05,       // fator de suavização (lerp)
  lookAtHeight: 1.2      // olha para a altura do tronco, não do chão
};
```

---

## HUD (Interface na Tela)

Construído com HTML/CSS sobreposto ao canvas 3D (overlay via CSS `position: absolute`).

```
┌──────────────────────────────────────────────────────┐
│  ██████████████░░░░  ⏱ 60  ░░░░██████████████        │
│  PLAYER 1            2-0           PLAYER 2           │
│                                                       │
│                                                       │
│              (área do jogo 3D)                         │
│                                                       │
│                                                       │
│                    「FIGHT!」                           │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### Elementos
- Barra de vida Jogador 1 (alinhada à esquerda, diminui para a esquerda)
- Barra de vida Jogador 2 (alinhada à direita, diminui para a direita)
- Timer central (contagem regressiva)
- Placar de rounds (bolinhas ou números)
- Anúncios centrais: "ROUND 1", "FIGHT!", "K.O.", "PLAYER 1 WINS!"
- Os anúncios aparecem com animação simples (scale up, fade out)

---

## Animações Procedurais

Como não usamos modelos animados, as animações são feitas por código, rotacionando as partes do corpo:

### Soco (armRight)
```
Startup:  braço direito rotaciona para trás (preparação)
Active:   braço direito rotaciona rapidamente para frente (soco)
Recovery: braço volta à posição neutra
```

### Soco Forte (armRight)
```
Startup:  corpo inteiro inclina levemente para trás, braço vai para trás
Active:   corpo inclina para frente, braço estende com força
Recovery: corpo e braço voltam ao neutro (mais lento que soco normal)
```

### Chute (legRight)
```
Startup:  perna direita levanta levemente
Active:   perna rotaciona para frente com extensão
Recovery: perna volta à posição neutra
```

### Idle (todos)
```
Loop contínuo: leve movimento de "respiração" — tronco sobe e desce suavemente
```

### Walking (pernas)
```
Loop: pernas alternam frente/trás (rotação no pivot do quadril)
```

### Hit (todo o corpo)
```
Corpo inclina para trás brevemente, volta ao neutro
Efeito visual: flash branco rápido no material do lutador
```

### KO
```
Corpo inclina para trás e cai (rotação no eixo X)
Permanece no chão
```

---

## Debug Helper

Ativado com a tecla ` (backtick):

Quando ativo, mostra:
- Hitboxes como wireframes verdes (ataque)
- Hurtboxes como wireframes amarelos (corpo)
- Estado atual de cada lutador (texto sobre a cabeça)
- Frame counter do ataque atual
- FPS counter

Útil para ajustar balanceamento e debugar colisões.

---

## Sprints de Desenvolvimento

### Sprint 1 — Cena e Movimento Básico
**Objetivo:** Um robô de cubos se movendo na arena com WASD.

Tarefas:
- [ ] Criar estrutura do projeto com Vite
- [ ] Configurar cena Three.js (renderer, câmera, luzes)
- [ ] Criar arena (plano de chão + fundo)
- [ ] Construir modelo do robô com cubos (FighterModel.js)
- [ ] Implementar InputManager (captura de teclas)
- [ ] Movimentação horizontal (A/D)
- [ ] Sistema de gravidade e pulo (W)
- [ ] Agachamento (S) — apenas diminui a hurtbox/abaixa o modelo
- [ ] Limites da arena (paredes invisíveis)

**Resultado esperado:** Robô azul andando, pulando e agachando na arena.

---

### Sprint 2 — Segundo Jogador e Câmera
**Objetivo:** Dois robôs na arena com câmera dinâmica.

Tarefas:
- [ ] Adicionar segundo lutador (cores vermelhas)
- [ ] Mapear controles do jogador 2 (setas)
- [ ] Lutadores sempre olham um para o outro (auto-rotate)
- [ ] Colisão entre lutadores (não podem se sobrepor)
- [ ] Câmera dinâmica: segue ponto médio, zoom conforme distância
- [ ] Suavização de câmera (lerp)

**Resultado esperado:** Dois robôs se movimentando, câmera acompanhando.

---

### Sprint 3 — Máquina de Estados e Primeiro Golpe
**Objetivo:** Sistema de estados funcionando com o soco básico.

Tarefas:
- [ ] Implementar FighterStateMachine com estados: IDLE, WALKING, JUMPING, CROUCHING, ATTACKING
- [ ] Regras de transição entre estados
- [ ] Implementar o soco (tecla F / Numpad1)
- [ ] Animação procedural do soco (rotação do braço)
- [ ] Fases do ataque: startup → active → recovery
- [ ] Lutador não pode se mover durante ataque
- [ ] Não aceitar novo input de ataque até recovery terminar

**Resultado esperado:** Robôs podem andar e dar socos com animação visível.

---

### Sprint 4 — Sistema de Hitbox e Dano
**Objetivo:** Golpes acertam e causam dano.

Tarefas:
- [ ] Criar hurtbox para cada lutador (caixa ao redor do corpo)
- [ ] Criar hitbox que aparece durante frames active do soco
- [ ] Detecção de colisão hitbox vs hurtbox
- [ ] Regra de hit único por ataque
- [ ] Estado HIT: stun ao receber dano
- [ ] Knockback ao ser atingido
- [ ] Flash visual ao receber dano (material fica branco por 1 frame)
- [ ] Debug helper: visualizar hitboxes/hurtboxes (tecla `)

**Resultado esperado:** Soco acerta, oponente reage, é empurrado para trás.

---

### Sprint 5 — Todos os Golpes
**Objetivo:** Soco forte e chute funcionando.

Tarefas:
- [ ] Implementar AttackRegistry com dados dos 3 golpes
- [ ] Soco forte (tecla G / Numpad2): mais dano, mais lento, mais knockback
- [ ] Chute (tecla H / Numpad3): médio, mais alcance (hitbox mais distante)
- [ ] Animações procedurais para cada golpe
- [ ] Hitbox com tamanho e posição específica por golpe
- [ ] Ajustar balanceamento (dano, velocidade, alcance)

**Resultado esperado:** Os 3 golpes funcionam com sensações distintas.

---

### Sprint 6 — HUD e Sistema de Rounds
**Objetivo:** Partida completa com rounds.

Tarefas:
- [ ] Criar overlay HTML para HUD
- [ ] Barras de vida (diminuem com animação suave)
- [ ] Timer com contagem regressiva
- [ ] Sistema de rounds (melhor de 3)
- [ ] CombatManager: gerencia fluxo de round
- [ ] Estado KO: animação de queda
- [ ] Tela de anúncios: "ROUND 1", "FIGHT!", "K.O.", "PLAYER 1 WINS!"
- [ ] Reset de posição e vida entre rounds
- [ ] Restart com tecla R

**Resultado esperado:** Jogo jogável com início, meio e fim.

---

## Critérios de Qualidade

### O jogo DEVE:
- Rodar a 60 FPS estáveis
- Ter input responsivo (sem delay perceptível entre apertar botão e ação)
- Hitboxes precisas (sem golpes fantasma ou golpes que atravessam)
- Ser divertido de jogar mesmo com gráficos simples

### O código DEVE:
- Usar ES Modules (import/export)
- Ter separação clara de responsabilidades (cada arquivo faz uma coisa)
- Usar constantes configuráveis (nada hardcoded dentro da lógica)
- Ter comentários explicando a lógica de sistemas complexos (hitbox, estados)
- Usar nomes descritivos em inglês para variáveis e funções

---

## Referências Técnicas

- [Three.js Docs](https://threejs.org/docs/)
- [Cannon-es Docs](https://pmndrs.github.io/cannon-es/docs/)
- [Vite Docs](https://vitejs.dev/guide/)
- [Box3.intersectsBox](https://threejs.org/docs/#api/en/math/Box3.intersectsBox) — método para detecção de colisão
- [Game Programming Patterns — State](https://gameprogrammingpatterns.com/state.html) — referência para máquina de estados

---

## Notas para o Claude Code

- Desenvolva sprint por sprint, na ordem descrita
- Teste cada sprint antes de avançar para o próximo
- Priorize mecânica funcional sobre aparência visual
- Use `requestAnimationFrame` para o game loop
- Calcule `deltaTime` para que a física seja independente de framerate
- Hitboxes devem usar Three.js `Box3` para detecção de colisão (não Cannon-es)
- O motor de física Cannon-es é usado apenas para gravidade e colisão com o chão
- Mantenha todos os valores numéricos (dano, velocidade, tamanho) no Constants.js para fácil ajuste
- Quando em dúvida entre complexidade e simplicidade, escolha simplicidade
