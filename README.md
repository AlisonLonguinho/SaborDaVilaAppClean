# Sabor da Vila App

Aplicativo mobile para gerenciamento de vendas e controle de estoque da lanchonete "Sabor da Vila". O projeto foi criado com Expo + React Native e foca em uma experiência simples e rápida para registrar vendas e gerenciar produtos.

## � Principais pontos
- Navegação por plataforma: Drawer (menu hambúrguer) no Android e abas inferiores no iOS
- Header customizado com botão de menu (Android)
- Banco local com SQLite para vendas e estoque

---

## 📸 Screenshots Android


![Menu](./assets/screenshots/Screenshot_1762491989.png)
![Dashboard](./assets/screenshots/Screenshot_1762491996.png)
![Vendas](./assets/screenshots/Screenshot_1762492004.png)
![Estoque](./assets/screenshots/Screenshot_1762492068.png)

---

## 📸 Screenshots IOS

![Dashboard](./assets/screenshots/Dashboard.jpg)
![Vendas](./assets/screenshots/Vendas.jpg)
![Estoque](./assets/screenshots/Estoque.jpg)

---

## 🚀 Tecnologias

- Expo (SDK)
- React Native + TypeScript
- Expo Router (navegação baseada em arquivos)
- react-native-reanimated & react-native-worklets (animações e worklets)
- Expo SQLite (armazenamento local)
- NativeWind / Tailwind (estilização)
- Lucide React Native / @expo/vector-icons

---

## 🛠️ Requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI (opcional globalmente)

---

## ⚡ Quick Start

1. Instale dependências:

```bash
npm install
# ou
yarn
```

2. Inicie o Metro (com cache limpo se necessário):

```bash
npx expo start -c
```

3. Abra no dispositivo/emulador:

```bash
# Android
npx expo start --android

# iOS
npx expo start --ios

# Web
npx expo start --web
```

---

## 📁 Estrutura principal

```
src/
├─ app/                 # Rotas e telas (Expo Router)
│  ├─ _layout.tsx       # Layout root: Drawer (Android) / Slot (iOS)
│  ├─ index.tsx         # Dashboard
│  ├─ tabs/             # Layouts e telas das abas
│  │  ├─ _layout.tsx    # Tabs bottom (iOS)
│  │  ├─ index.tsx      # Tela principal (Dashboard)
│  │  ├─ sales.tsx      # Vendas
│  │  └─ inventory.tsx  # Estoque
├─ components/          # Componentes reutilizáveis (Header, Button, Card...)
├─ database/            # Repositórios e inicialização do SQLite
├─ assets/              # Imagens, screenshots, fontes
└─ styles/              # Config global do styling
```

---

## ✅ Funcionalidades implementadas

- Dashboard com resumo de vendas e ações rápidas
- Registro e listagem de vendas
- Gerenciamento de estoque (adicionar produto / controlar quantidade)
- Navegação por plataforma (Drawer Android / Tabs iOS)
- Header custom e Drawer com itens e ícones

---

## � Notas de desenvolvimento

- Header: existe um `Header` custom (em `src/components/Header.tsx`) que mantém o título centralizado e mostra o ícone de menu no Android (abre o Drawer).
- Navegação: para ir a uma screen de tab a partir do Drawer usamos `navigation.navigate('tabs', { screen: 'sales' })` (navegação aninhada).
- Worklets / Reanimated: versões alinhadas para evitar mismatch entre parte JS e nativa; se houver erro de versão, rode `npx expo install react-native-worklets react-native-reanimated` e faça rebuild.

---

## ✔️ Scripts úteis

No `package.json` existem scripts padrão do Expo:

```bash
npm run start   # inicia o bundler
npm run android # compila/emula no Android
npm run ios     # compila/emula no iOS
npm run web     # roda no navegador
```

---

## Contribuições

Contribuições são bem-vindas. Abra uma issue ou envie um PR com descrições claras do que mudou. Para mudanças maiores, prefira criar uma branch por feature.




