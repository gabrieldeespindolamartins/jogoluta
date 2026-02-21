<!-- auto-context-rules -->
## Regras de Contexto (plugin auto-context)

### Início de sessão
Ao iniciar qualquer sessão, SEMPRE use o subagente context-loader
PRIMEIRO, antes de qualquer tarefa. Confirme o briefing com o usuário.

### Encerramento
Se o usuário disser "encerrando" ou "parando por hoje", atualize
o progress.md manualmente com o estado final e próximos passos.
<!-- /auto-context-rules -->

## Controle de Versão do Projeto

**Versão atual: 0.2.0** (Sprint 2 — Player 2 + câmera dinâmica)

### Formato
Semantic Versioning: `MAJOR.MINOR.PATCH`

### Regras de incremento
- **PATCH** (0.0.X): correções de bugs, ajustes menores, refatorações pequenas
- **MINOR** (0.X.0): nova funcionalidade adicionada, sprint concluído
- **MAJOR** (X.0.0): mudança estrutural grande, versão jogável, breaking changes

### Quando atualizar
- A cada commit ou mudança importante, SEMPRE verificar e atualizar a versão
- Catalogar o que mudou junto com o número da versão

### Onde registrar
1. **Neste arquivo** (CLAUDE.md): atualizar o campo "Versão atual" acima
2. **progress.md**: incluir a versão no cabeçalho de cada sessão (ex: `## Sessão [data] — v0.1.0`)
3. **package.json**: manter o campo `version` sincronizado (quando o arquivo existir)

### Changelog resumido
| Versão | Data | Descrição |
|--------|------|-----------|
| 0.0.0  | 2026-02-21 | Projeto criado — fase de planejamento |
| 0.1.0  | 2026-02-21 | Sprint 1: cena 3D, arena, robô azul com movimento (WASD), pulo e agachamento |
| 0.2.0  | 2026-02-21 | Sprint 2: Player 2 (vermelho), auto-rotação, colisão entre fighters, câmera dinâmica |
