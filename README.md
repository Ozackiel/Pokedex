# Pokédex — Fundamentos de Engenharia de Software com TypeScript

Projeto prático de autodesenvolvimento concebido para consolidar fundamentos essenciais da programação: arquitetura de código limpa, tipagem estática, programação assíncrona e integração com APIs REST.

Este projeto serve também como alicerce técnico e estratégico para desenvolvimento mobile futuro, preparando a base conceitual e sintática para **HarmonyOS / OpenHarmony** (através do **ArkTS**, que deriva diretamente do TypeScript) e **Android** (via **React Native** ou ecossistemas nativos).

---

## 🎯 Objetivos de Aprendizado

- **Tipagem Estática e Modelagem:** Definir contratos de dados rigorosos (interfaces e types) para mapear respostas de APIs externas com segurança em tempo de compilação.
- **Integração com APIs & Resiliência:** Consumir serviços RESTful (`fetch`, manipulação de erros HTTP, headers e serialização JSON).
- **Assincronismo:** Dominar o ciclo de vida de Promises, sintaxe `async/await` e fluxo de eventos.
- **Otimização e Boas Práticas:** Aplicar paginação, técnicas de otimização de requisições (como *debouncing* na barra de busca) e separação de responsabilidades.
- **Modularização de Código:** Separar de forma clara a camada de serviços (comunicação com a API), a lógica de estado/negócio e a camada de renderização visual.
- **Controle de Versão:** Uso consistente de Git e GitHub para documentação de progresso e versionamento atômico de código.

---

## 🚀 Funcionalidades Planejadas

- [ ] **Listagem de Pokémons:** Exibição com suporte a paginação ou carregamento sob demanda.
- [ ] **Busca em Tempo Real:** Busca por nome ou ID com otimização para evitar chamadas excessivas à API.
- [ ] **Detalhes do Pokémon:** Modal ou tela dedicada com estatísticas base, tipos, habilidades e visualizações.
- [ ] **Filtros e Ordenação:** Filtrar por tipo (Fogo, Água, Grama, etc.) e ordenar por número ou ordem alfabética.
- [ ] **Cache Local:** Armazenamento no navegador para evitar requisições repetidas ao mesmo recurso.
- [ ] **Dark Mode:** Alternância de tema claro/escuro utilizando variáveis CSS.

---

## 🛠️ Tech Stack

- **Linguagem Principal:** [TypeScript](https://www.typescriptlang.org/)
- **Marcação & Estilização:** HTML5 Semântico & CSS3 Moderno (Flexbox / Grid / CSS Variables)
- **Fonte de Dados:** [PokéAPI](https://pokeapi.co/) (API pública RESTful)
- **Ferramental:** Git & GitHub

---

## 🗺️ Visão de Futuro (Ponte para Mobile)

Os conceitos e a linguagem consolidados neste projeto servirão de ponte direta para:
1. **HarmonyOS / OpenHarmony (Huawei):** Transição natural para a linguagem oficial **ArkTS / ArkUI**, cujos fundamentos de sintaxe e tipagem são espelhados no TypeScript.
2. **Android & Multiplataforma:** Aplicação prática em frameworks mobile modernos como **React Native** ou na transição para linguagens fortemente tipadas como **Kotlin**.