# CaloriaApp

Sistema web academico para registro de calorias, meta diaria e ciclos de jejum intermitente.

## Stack

- Next.js 14 com App Router
- TypeScript
- Firebase Authentication
- Firestore
- Tailwind CSS
- Recharts
- Zod

## Funcionalidades

- Cadastro, login, logout e recuperacao de senha por e-mail.
- Rotas protegidas para usuarios autenticados.
- CRUD completo de refeicoes com data, hora, descricao, calorias e tipo de refeicao.
- Filtro de refeicoes por data.
- Meta calorica diaria editavel.
- Dashboard com consumo atual versus meta.
- Inicio e encerramento de jejum com apenas um ciclo ativo por vez.
- Tipos planejados de jejum: 16:8, 18:6, 20:4, 24h e personalizado.
- Historico de jejuns concluidos.
- Resumo semanal com grafico de calorias, linha da meta, horas de jejum e indicadores agregados.
- Aviso etico informando que o app nao substitui orientacao medica ou nutricional.

## Setup Local

1. Instale as dependencias:

```bash
npm install
```

2. Copie o arquivo de exemplo:

```bash
cp .env.example .env.local
```

3. Preencha o `.env.local` com as credenciais do Firebase.

4. Rode o projeto:

```bash
npm run dev
```

5. Acesse:

```bash
http://localhost:3000
```

## Variaveis de Ambiente

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

## Banco e Seguranca

O projeto usa Firestore com tres colecoes principais:

- `profiles`: meta calorica diaria por usuario.
- `meals`: refeicoes registradas por usuario.
- `fasts`: ciclos de jejum por usuario.

As regras em `firestore.rules` restringem leitura e escrita ao proprio usuario autenticado e validam campos principais.

## Deploy

Link da aplicacao em producao:

```text
https://youtu.be/FKGy2wOyX2k
https://caloria-o2pl77bef-pedrohenriqueandradesantanas-projects.vercel.app/login
```



## Aviso

Este aplicativo e um exercicio academico e nao substitui orientacao medica ou nutricional profissional.
