# AGENTS

## Visão Geral
- `pokearena` é um jogo de batalha em Phaser 3 + TypeScript entregue via Vite; a `PreloadScene` carrega tilesets, sprites e sons, passa por uma seleção de personagem e entra no combate com HUD e câmera centralizada.
- A cena de batalha controla um `Player` dirigido pelo teclado/ponteiro e um `Bot` (hoje `Squirtle`), onde colisões e overlaps disparam eventos globais de dano que o HUD usa para atualizar barras de vida.

## Arquitetura principal
- **Scenes:** `PreloadScene` prepara animações e assets; `SelectionScene` exige WSAD + SPACE para navegar/confirmar e seta o `GlobalPlugin.selectCharacter`; `BattleScene` instancia o jogador, bot, camera e background antes de lançar o `HudScene`.
- **GlobalPlugin:** plugin global instanciado por Phaser que guarda o Pokémon selecionado, expõe `soundManager` e eventos, e mapeia as chaves de `PokemonKeysEnums` para as classes concretas em `src/pokemons`.
- **Core:** `Pokemon`, `Attack`, `Background`, `Controller`, `HealthBar`, `SoundManager`, `Utils` e auxiliares embalam movimento, dash, cooldowns e gestão de vida compartilhada pelo evento global de dano.
- **Assets & dados:** `public/assets/` (spritesheets, sons, tilesets) e `public/data/` (JSONs de animação) são referenciados pelos enums em `src/types/keys` para centralizar paths.

## Fluxo de execução
1. `PreloadScene` instala animações e inicia `SelectionScene`, deixando a seleção do personagem por conta do jogador.
2. `SelectionScene` constrói um grid da matriz `selectionOptions`, usando o `Controller` para mover o cursor, tocar sons e, ao confirmar, atualizar `GlobalPlugin` e iniciar `BattleScene`.
3. `BattleScene` cria o jogador com `GlobalPlugin.getSelectedPokemonClass()`, posiciona o bot, ativa colisões/overlaps e lança `HudScene`, que escuta a registry compartilhada para desenhar barras de vida.
4. `HudScene` lê `player`/`bot` da registry e recalcula barras via `GameMechanicUtils.getLifePercentage`, enquanto `GlobalPlugin.events` transmite qualquer dano detectado por overlaps.

## Como executar
1. Execute `pnpm install` (ou `npm install`/`yarn` desde que o `pnpm-lock.yaml` seja atualizado em seguida).
2. `pnpm run dev` sobe o Vite dev server e monta o jogo dentro de `<div id="main-container">` respeitando o `scale` definido em `src/main.ts`.
3. `pnpm run build` roda `tsc` e empacota via Vite para produção.

## Diretrizes para contribuições
- Mantenha as animações em `PreloadScene` sincronizadas com os JSONs em `public/data` e os spritesheets em `public/assets`; novos assets devem ser referenciados via enums (ex.: `AttacksKeysEnums`).
- Comece com os métodos públicos de `Background`, `Camera` e `Controller` ao adicionar novas mecânicas para manter a compatibilidade com a câmera escalonada.
- Para adicionar novos Pokémon, crie a classe em `src/pokemons/`, registre-a em `GlobalPlugin` e inclua a chave em `selectionOptions` para a tela de seleção.
- Eventos de dano circulam por `GlobalPlugin.events`; use `events.emit`/`events.on` quando precisar reagir a ataques em outras cenas.
