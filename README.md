# 💰 Luton Money

**Luton Money** é um aplicativo de gestão financeira pessoal que ajuda você a controlar suas receitas, despesas e metas financeiras de forma simples, intuitiva e eficiente.

---

# ✨ Funcionalidades

- ✅ Cadastro e login de usuários  
- 💸 Adicionar receitas e despesas (transações)
- 💰 Definir orçamentos por categoria  
- 🔔 Sistema de notificações diário  
- 🖼️ Upload de imagem de perfil
- 📋 Histórico completo de transações  
- 🏠 Tela inicial com atalhos rápidos e resumos

---

# 🚀 Tecnologias Utilizadas

## **Frontend (Mobile)**
- Expo (React Native)  
- TypeScript    

## **Backend**
- Node.js + Express  
- Prisma ORM  
- PostgreSQL  
- Multer (upload de imagens)  
- JWT (autenticação)  

---

## 🧩 Diagrama de Casos de Uso UML

<p align="center">
  <img src="./DiagramaUML.png" alt="Diagrama UML" width="800" />
</p>

---

# 🛠️ Como Instalar e Rodar o Projeto Completo

Este guia mostra como instalar **backend + frontend + banco + variáveis de ambiente**, começando do zero.

---

```bash
# 📥 1. Clonar o Repositório

git clone https://github.com/blurryluwk/financeiro.git
cd financeiro

# 🗄️ 2. Configurar o Banco de Dados (PostgreSQL)
- Instalar o PostgreSQL

CREATE DATABASE luton_money;

# ⚙️ 3. Backend (API)

cd backend
npm install

- Criar o arquivo .env:
touch .env

- Editá-lo adicionando:

DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/luton_money?schema=public"
JWT_SECRET="uma_chave_secreta_segura"
PORT=3000

- Substituir "SEU_USUARIO" e "SUA_SENHA"

npx prisma migrate dev
npx prisma studio
npm start

# 📱 4. Frontend (Expo)

cd ../meu-app
npm install
npm install -g expo-cli

- Criar o arquivo .env:
touch .env

- Editá-lo adicionando:

API_URL=http://localhost:3000

# ✅ 5. Iniciar a aplicação

npx expo start
