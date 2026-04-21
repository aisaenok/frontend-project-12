# Hexlet Chat

[![Actions Status](https://github.com/aisaenok/frontend-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/aisaenok/frontend-project-12/actions)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=aisaenok_frontend-project-12&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=aisaenok_frontend-project-12)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=aisaenok_frontend-project-12&metric=bugs)](https://sonarcloud.io/summary/new_code?id=aisaenok_frontend-project-12)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=aisaenok_frontend-project-12&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=aisaenok_frontend-project-12)

## Description

Hexlet Chat — учебное чат-приложение со серверной частью и React-фронтендом.

## Demo

[Open website](https://frontend-project-12-61rx.onrender.com)

## Requirements

- Node.js >= 18
- npm >= 9

## Installation

```bash
git clone https://github.com/aisaenok/frontend-project-12.git
cd frontend-project-12
make install
```

## Development

### Start backend server

```bash
npx start-server
```

### Start frontend dev server

```bash
cd frontend
npm run dev
```

## Build

```bash
make build
```

## Start production server

```bash
make start
```

## API check

```bash
curl http://localhost:5001/api/v1/channels
```

## Technologies

- JavaScript
- React
- Vite
- @hexlet/chat-server
- GitHub Actions
- SonarQube / SonarCloud
- Render