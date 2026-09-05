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