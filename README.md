# Portfólio – Gilson Ravaiani

Este repositório contém o código-fonte do meu portfólio pessoal, desenvolvido para apresentar minha trajetória profissional, projetos, certificações e experiências na área de tecnologia.  
O objetivo principal deste projeto é ser mais do que um site estático: quero integrar uma **IA em formato de chatbot**, capaz de responder perguntas sobre mim e, futuramente, buscar informações adicionais de forma inteligente.

---

## 🎯 Objetivos do projeto

- **Portfólio profissional online**
  - Apresentar minha história, formação, certificações e experiências.
  - Mostrar projetos, laboratórios e experimentos que desenvolvi.
  - Centralizar links importantes (GitHub, LinkedIn, etc.).

- **Chatbot com IA**
  - Criar um chatbot que responda perguntas sobre:
    - Minha trajetória profissional.
    - Meus conhecimentos técnicos.
    - Meus projetos e laboratórios.
  - Utilizar um modelo de IA (como Azure OpenAI) para:
    - Responder em linguagem natural.
    - Buscar informações em uma base de dados/textos sobre mim.
    - Evoluir com o tempo, conforme eu atualizo o conteúdo.

- **Base para estudos de cloud e desenvolvimento**
  - Usar o projeto como laboratório para:
    - Azure Static Web Apps.
    - Azure Functions (para a API do chatbot).
    - Integração com serviços de IA.
    - Boas práticas de CI/CD com GitHub Actions.

---

## 🧱 Estrutura inicial do projeto

A estrutura pode evoluir, mas a ideia inicial é:

- **Raiz do projeto**
  - `index.html` – Página principal do portfólio.
  - `sobre.html` – Página com detalhes sobre mim.
  - `projetos.html` – Lista de projetos e laboratórios.
  - `linhadotempo.html` – Linha do tempo da minha trajetória.
  - `fotos.html` – Imagens pessoais/profissionais (opcional).
  - `cursos.html` – Cursos, certificações e formações.
  - `style.css` – Estilos principais do site.
  - `script.js` – Lógica de interação do site (incluindo o chatbot no front-end).
  - Outras páginas e estilos específicos conforme necessidade.

- **Futuro (API e IA)**
  - Pasta para funções serverless (ex.: `/api` com Azure Functions).
  - Endpoint para o chatbot (ex.: `/api/chat`).
  - Integração com serviço de IA (ex.: Azure OpenAI).

---

## 🤖 Visão da IA do chatbot

A ideia do chatbot é:

- **Função principal:**
  - Responder perguntas sobre mim, como:
    - “Quem é o Gilson?”
    - “Quais tecnologias ele conhece?”
    - “Que projetos ele já fez?”
    - “Qual a experiência dele com Azure / cloud / desenvolvimento?”

- **Fonte de conhecimento:**
  - Textos do próprio site (páginas HTML).
  - Arquivos específicos com informações estruturadas (ex.: JSON ou Markdown).
  - Futuramente, integração com:
    - Banco de dados.
    - Documentos externos.
    - APIs de busca.

- **Tecnologias planejadas:**
  - Front-end: HTML, CSS, JavaScript.
  - Back-end/API: Azure Functions.
  - IA: Azure OpenAI (ou serviço similar).

---

## 🚀 Deploy e hospedagem

O projeto será hospedado em:

- **Azure Static Web Apps**
  - Site estático (HTML, CSS, JS).
  - Integração com GitHub para CI/CD.
  - Deploy automático a cada push na branch principal.

- **Futuro:**
  - Azure Functions para a API do chatbot.
  - Integração com Azure OpenAI para respostas inteligentes.

---

## 🧪 Uso como laboratório de estudos

Além de ser meu portfólio, este repositório também será usado como:

- Ambiente de prática para:
  - Git e GitHub.
  - Workflows de CI/CD.
  - Azure Static Web Apps.
  - Azure Functions.
  - Integração com serviços de IA.
- Registro da minha evolução técnica ao longo do tempo.

---

## 📌 Próximos passos planejados

1. **Subir a primeira versão estática do site**  
   - Estrutura básica de páginas.
   - Layout inicial com HTML + CSS.

2. **Adicionar o componente visual do chatbot no front-end**  
   - Caixa de chat na interface.
   - Fluxo básico de envio de mensagens.

3. **Criar uma API simples para o chatbot**  
   - Endpoint em Azure Functions.
   - Respostas estáticas ou baseadas em um arquivo local.

4. **Integrar com um modelo de IA**  
   - Conectar a API a um serviço de IA.
   - Enviar contexto sobre mim (trajetória, projetos, etc.).
   - Refinar o comportamento do chatbot.

5. **Evoluir o conteúdo do portfólio**  
   - Adicionar novos projetos.
   - Atualizar certificações.
   - Melhorar a linha do tempo e a narrativa.

---

## 📞 Contato

- **Nome:** Gilson Ravaiani  
- **GitHub:** [GilsonRavaiani](https://github.com/GilsonRavaiani)  
- **(Adicionar LinkedIn, e-mail ou outros links aqui)**

---

> Este repositório é um projeto vivo: à medida que eu evoluir profissionalmente, o portfólio e a IA também vão evoluir.

.