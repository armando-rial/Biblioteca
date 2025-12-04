# 📚 Sistema de Registro de Leituras Literárias

## 🧭 Introdução  
A leitura é uma atividade essencial para o desenvolvimento intelectual, emocional e cultural das pessoas.  
No entanto, com a correria do dia a dia, muitos leitores têm dificuldade em acompanhar os livros que já leram, que estão lendo ou que desejam ler.  

Este projeto propõe o desenvolvimento de uma aplicação web **SPA (Single Page Application)**, simples e funcional, para o **registro de leituras literárias**, permitindo que o usuário organize seus livros e acompanhe seu progresso de forma prática e personalizada.

---

## 🧩 Descrição do Problema  
Leitores frequentemente perdem o controle sobre suas leituras, esquecendo em que ponto pararam, quais obras já concluíram ou quais desejam iniciar.  
A ausência de uma ferramenta específica para esse fim dificulta o planejamento da leitura e o registro de impressões pessoais sobre os livros.  

Além disso, não há uma forma integrada de relacionar livros (físicos e/ou e-books) com o histórico de leitura, o que compromete a experiência de acompanhamento e avaliação das obras lidas.

---

## 🎯 Objetivo  
Desenvolver uma aplicação web que permita ao usuário cadastrar livros e registrar suas leituras, com informações como datas, status e notas pessoais.  

A aplicação visa **facilitar o controle do hábito de leitura**, promovendo **organização, motivação e uma experiência mais rica** para o leitor.

---

## 💡 Solução Proposta  

A aplicação contará com os seguintes **requisitos e funcionalidades**:

### Funcionalidades principais
- 📖 **Cadastro de livros** com título, autor, gênero e número de páginas  
- 🕮 **Registro de leituras** com:
  - Data de início e término  
  - Status (em andamento ou concluído)  
  - Nota pessoal  
  - Vínculo com o livro correspondente  
- 🔍 **Listagem de livros e leituras** com filtros por status e gênero  
- ✏️ **Edição e exclusão** de registros de livros e leituras  
- 📱 **Interface simples e responsiva**, adequada para desktop e dispositivos móveis  

---

## 🧱 Arquitetura e Tecnologias  

| Camada | Tecnologias / Ferramentas |
|--------|----------------------------|
| Frontend | Next.js + TypeScript |
| Estilização | Tailwind CSS / CSS Modules |
| Backend | Supabase (Auth + Database + API) |
| Banco de Dados | PostgreSQL (via Supabase) |
| Controle de Versão | Git e GitHub |
| Gerenciador de Pacotes | npm |
