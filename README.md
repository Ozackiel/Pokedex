# ⚡ Pokédex — Engenharia de Software Moderna com TypeScript

> **Projeto Prático de Autodesenvolvimento & Maestria em Engenharia de Software**  
> Uma aplicação web robusta, modular e resiliente construída do zero em **TypeScript puro**, sem frameworks mágicos, focada em fundamentos sólidos: arquitetura em camadas, tipagem estática rigorosa, concorrência assíncrona, delegação de eventos no DOM e design responsivo.

---

## 🧭 Sobre o Projeto & Metodologia

Este projeto não é apenas uma Pokédex visual; ele é o **laboratório prático** de uma jornada de formação para desenvolvimento autônomo. Cada linha de código foi escrita com propósito pedagógico, estabelecendo uma fundação profunda que prepara o desenvolvedor tanto para o ecossistema Web quanto para o desenvolvimento mobile moderno em **HarmonyOS / OpenHarmony (via ArkTS)** e **Android (via React Native)**.

### 💡 Pilares de Engenharia Aplicados:
1. **Tipagem Estática Estrita (`strict: true`):** Contratos de dados imutáveis que eliminam erros de `null` e `undefined` antes da execução.
2. **Arquitetura Limpa & SRP (Single Responsibility Principle):** Separação estrita entre contratos de tipos, utilitários matemáticos puros, camada de rede/API e controle de eventos da interface.
3. **Alta Concorrência Assíncrona:** Download paralelo de múltiplos recursos através de `Promise.all` com processamento não-bloqueante na *Call Stack*.
4. **Resiliência e Programação Defensiva:** Tratamento gracioso de erros com `try / catch`, impedindo falhas na interface mesmo quando a API remota retorna `404 Not Found`.
5. **Alta Performance no DOM:** Delegação de Eventos (*Event Delegation*) com captura via `.closest()`, evitando vazamentos de memória por acúmulo de ouvintes individuais.

---

## 🚀 Status das Funcionalidades

- [x] **Listagem Concorrente de Pokémons:** Carregamento em lote de 20 em 20 Pokémons via chamadas paralelas com `Promise.all`.
- [x] **Busca Híbrida Inteligente:**
  - **Filtro em RAM em tempo real (`input`):** Varredura instantânea (0ms) no cache em memória por nome ou número enquanto o usuário digita.
  - **Busca Global na Nuvem (`Enter`):** Consulta direta à PokéAPI remota ao teclar Enter, registrando o novo Pokémon na lista sem recarregar a tela.
- [x] **Modal de Detalhes Completo:**
  - Exibição de arte oficial em alta resolução, ID formatado em 4 dígitos e badges de tipos.
  - Métricas físicas (altura em metros e peso em quilogramas) com conversão automática.
  - Lista de habilidades passivas do Pokémon.
  - 6 Barras de progresso proporcionais para atributos de batalha (HP, Ataque, Defesa, Sp. Atq, Sp. Def, Velocidade) com coloração visual customizada.
- [x] **Acessibilidade & Atalhos de Teclado:** Fechamento intuitivo do modal através da tecla `Escape`, do botão de fechar ou clicando fora no overlay.
- [x] **Dark Mode com Variáveis CSS:** Alternância instantânea de paleta claro/escuro via classe no `body` sem recalcular estilos inline.
- [x] **Paginação Contínua ("Carregar Mais"):** Controle de estado com desativação do botão durante o carregamento para prevenir cliques duplicados.
- [ ] **Filtro Interativo por Tipos:** Filtragem de Pokémons por badges clicáveis na tela inicial (Água, Fogo, Grama, etc.).
- [ ] **Persistência Local (`localStorage`):** Memorização da preferência do tema e Pokémons carregados entre visitas.

---

## 🏗️ Arquitetura do Software & Estrutura de Pastas

O projeto adota uma arquitetura em camadas concêntricas onde as dependências fluem de dentro para fora:

```text
Pokedex/
├── index.html              # Estrutura semântica HTML5 e contêineres da UI
├── style.css               # Design System, variáveis CSS, Grid responsivo e animações
├── package.json            # Manifesto do projeto ("type": "module")
├── tsconfig.json           # Configurações estritas do compilador TypeScript
├── .gitignore              # Higiene de repositório (bloqueio de node_modules e dist)
├── dist/                   # JavaScript nativo puro transpilado pelo tsc (gerado)
└── src/                    # Código-fonte TypeScript puro
    ├── types.ts            # Camada 1: Contratos formais e modelos de dados puros
    ├── utils.ts            # Camada 2: Funções puras e utilitários matemáticos
    ├── api.ts              # Camada 3: Infraestrutura de rede e mapeamento de dados (Adapter)
    └── index.ts            # Camada 4: Maestro orquestrador de eventos e manipulação do DOM
```

---

## 📖 Tour Didático pelo Código: O Que Cada Arquivo Faz

### 1. `src/types.ts` — O Contrato de Dados
Define a forma que um objeto `Pokemon` deve ter em toda a aplicação. No TypeScript com `verbatimModuleSyntax: true`, este arquivo serve exclusivamente para validação estática em tempo de compilação, sendo completamente apagado (*Type Erasure*) na versão final em JavaScript.

```typescript
// Contrato rigoroso: qualquer objeto do tipo Pokemon DEVE possuir estes 13 atributos tipados
export interface Pokemon {
    id: number;            // Identificador numérico oficial (ex: 25)
    name: string;          // Nome em minúsculo retornado da API (ex: "pikachu")
    types: string[];       // Coleção de tipos elementais (ex: ["Electric"])
    hp: number;            // Pontos de vida base para cálculo da barra
    attack: number;        // Poder de ataque físico
    defense: number;       // Resistência física
    specialAttack: number; // Ataque especial
    specialDefense: number;// Defesa especial
    speed: number;         // Iniciativa e velocidade de ação
    height: number;        // Altura já convertida para metros (ex: 0.4 m)
    weight: number;        // Peso já convertido para quilogramas (ex: 6.0 kg)
    abilities: string[];   // Nomes das habilidades passivas formatadas
    spriteUrl: string;     // Link direto da arte oficial 2D
}
```

---

### 2. `src/utils.ts` — Utilitários Puros & Determinísticos
Funções que recebem uma entrada e produzem uma saída previsível, sem efeitos colaterais na tela ou na rede.

```typescript
// Transforma números brutos em identificadores elegantes de 4 dígitos (#0025, #0130)
export function formatPokemonId(id: number): string {
    // padStart(4, "0") preenche com zeros à esquerda até atingir 4 caracteres
    return `#${id.toString().padStart(4, "0")}`;
}

// Converte a primeira letra para maiúscula ("charizard" -> "Charizard")
export function captalize(text: string): string {
    // Cláusula de guarda: previne falhas se a string for nula ou vazia
    if (!text) return "";
    // charAt(0) pega a primeira letra, toUpperCase() torna maiúscula, slice(1) pega o restante
    return text.charAt(0).toUpperCase() + text.slice(1);
}
```

---

### 3. `src/api.ts` — A Camada de Infraestrutura e o Padrão Adapter
A PokéAPI devolve objetos enormes com mais de 100 campos que não precisamos. O arquivo `api.ts` atua como um **Data Mapper (Adaptador)**, limpando a resposta bruta e entregando dados prontos para a interface.

```typescript
export async function fetchPokemon(id: number | string): Promise<Pokemon> {
    // Normalização: se for string (busca por nome), garante que fique em minúsculas
    const search = typeof id === "string" ? id.toLowerCase() : id;
    const response = await fetch(`${API_URL}/pokemon/${search}`);
    const data = await response.json();

    // Mapeamento limpo de dados e conversão de unidades decimais da PokeAPI:
    return {
        id: data.id,
        name: data.name,
        // .map() extrai e capitaliza os tipos: [{ type: { name: "fire" } }] -> ["Fire"]
        types: data.types.map((type: any) => captalize(type.type.name)),
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        specialAttack: data.stats[3].base_stat,
        specialDefense: data.stats[4].base_stat,
        speed: data.stats[5].base_stat,
        height: data.height / 10, // A PokéAPI fornece decímetros; dividimos por 10 para metros
        weight: data.weight / 10, // A PokéAPI fornece hectogramas; dividimos por 10 para kg
        abilities: data.abilities.map((a: any) => captalize(a.ability.name)),
        spriteUrl: data.sprites.front_default,
    };
}

// Alta concorrência: busca 20 Pokémons em paralelo sem travar a thread
export async function fetchPokemonList(page: number, limit: number): Promise<Pokemon[]> {
    const startId = (page - 1) * limit + 1;
    const promises: Promise<Pokemon>[] = [];

    for (let i = 0; i < limit; i++) {
        const pokemonId = startId + i;
        if (pokemonId > MAX_POKEMON_ID) break;
        // Adiciona a Promise pendente na lista sem esperar com 'await' agora
        promises.push(fetchPokemon(pokemonId));
    }

    // Promise.all dispara todas as requisições em paralelo e aguarda a conclusão do lote todo
    return await Promise.all(promises);
}
```

---

### 4. `src/index.ts` — O Orquestrador e o DOM Moderno
Gerencia o ciclo de vida dos dados, escuta eventos do usuário e renderiza o HTML dinamicamente.

```typescript
// 1. Delegação de Eventos com .closest():
// Em vez de 100 ouvintes nos cards, colocamos 1 único ouvinte no container pai!
pokedexGrid.addEventListener("click", (event) => {
    // Procura o card pai mais próximo do ponto onde o usuário clicou
    const card = (event.target as HTMLElement).closest(".pokemon-card") as HTMLElement;
    if (!card) return; // Clique ocorreu fora de um card

    const clickedId = Number(card.dataset.id);
    const clickedPokemon = allPokemons.find((p) => p.id === clickedId);

    if (clickedPokemon) {
        openPokemonModal(clickedPokemon); // Abre o modal com os dados do Pokémon correto
    }
});

// 2. Busca Híbrida Inteligente:
// Se digitar no campo: filtra a memória RAM em 0ms
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    if (query === "") {
        renderPokemonCards(allPokemons);
        loadMoreBtn.style.display = "inline-block";
        return;
    }
    loadMoreBtn.style.display = "none";
    const filtered = allPokemons.filter((p) =>
        p.name.toLowerCase().includes(query) || p.id.toString().includes(query)
    );
    renderPokemonCards(filtered);
});

// Se teclar Enter: faz busca remota na PokéAPI para Pokémons de qualquer geração!
searchInput.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) return;

        try {
            const pokemon = await fetchPokemon(query);
            // Evita duplicatas na memória
            if (!allPokemons.some(p => p.id === pokemon.id)) {
                allPokemons.push(pokemon);
            }
            renderPokemonCards([pokemon]);
        } catch (error) {
            pokedexGrid.innerHTML = `<p class="search-error">Pokémon "${query}" não encontrado!</p>`;
        }
    }
});
```

---

## 🛠️ Instalação e Execução Passo a Passo

Para rodar este projeto em sua máquina local sem intermediários:

### 1. Clonar o Repositório
```bash
git clone https://github.com/SEU_USUARIO/Pokedex.git
cd Pokedex
```

### 2. Instalar Ferramentas de Desenvolvimento
```bash
npm install
```

### 3. Compilar o TypeScript para JavaScript
```bash
# Compilação única:
npx tsc

# Ou compilação contínua (recompila automaticamente a cada alteração):
npx tsc --watch
```

### 4. Executar no Navegador
Como o projeto utiliza ES Modules nativos (`import`/`export`), abra o `index.html` através de um servidor HTTP local:
* No **VS Code**: Clique no botão inferior **Go Live** (Extensão Live Server).
* Ou via terminal:
  ```bash
  npx serve .
  ```

---

## 📱 A Ponte Estratégica para o Mundo Mobile

A lógica e os padrões aprendidos neste projeto foram intencionalmente desenhados para facilitar a transição para sistemas operacionais modernos:

1. **ArkTS & HarmonyOS NEXT (Huawei):**
   * O **ArkTS** é a linguagem oficial do HarmonyOS NEXT e possui como base direta a sintaxe e a semântica do TypeScript.
   * Os contratos criados em `src/types.ts` e as funções utilitárias de `src/utils.ts` migram diretamente para os componentes declarativos da engine **ArkUI** (`@Component`, `@State`, `@Prop`).
2. **React Native & Android:**
   * A divisão de estado (`allPokemons`), o fluxo assíncrono com `async/await` e a listagem de componentes funcionam de forma equivalente no ecossistema mobile com `<FlatList>` e hooks (`useState`, `useEffect`).

---

## 👨‍💻 Autor & Licença

Desenvolvido por **Murilo** como parte do projeto contínuo de autodesenvolvimento e domínio da Engenharia de Software.  
Distribuído sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.