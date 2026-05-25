# Guia de Deploy na Vercel

Este guia publica o CaloriaApp na Vercel usando Firebase Authentication e Firestore.

## 1. Conferir o projeto Firebase

1. Acesse o console do Firebase.
2. Abra o projeto usado pelo app.
3. Em Authentication, habilite o provedor Email/Senha.
4. Em Firestore Database, crie o banco se ainda nao existir.
5. Publique as regras do arquivo `firestore.rules`.
6. Em Project settings > General > Your apps, copie as credenciais do app web.

## 2. Configurar variaveis de ambiente

No painel da Vercel, crie as seguintes variaveis em Project Settings > Environment Variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

Use os mesmos valores do `.env.local`. Nao commite o `.env.local`.

## 3. Importar no Vercel

1. Suba o repositorio para o GitHub.
2. Acesse https://vercel.com/new.
3. Importe o repositorio do projeto.
4. Se o repositorio tiver a pasta `caloria-app` na raiz, selecione:

```text
Root Directory: caloria-app
Framework Preset: Next.js
Build Command: npm run build
Install Command: npm install
Output Directory: deixe vazio
```

5. Adicione as variaveis de ambiente.
6. Clique em Deploy.

## 4. Liberar dominio no Firebase

Depois do deploy, copie a URL gerada pela Vercel, por exemplo:

```text
https://caloria-app.vercel.app
```

No Firebase, va em Authentication > Settings > Authorized domains e adicione o dominio da Vercel sem `https://`.

## 5. Validacao final

Antes de entregar, teste em producao:

- Criar conta com e-mail e senha.
- Fazer login e logout.
- Recuperar senha.
- Criar, editar e excluir refeicao.
- Alterar meta diaria.
- Iniciar e encerrar jejum.
- Ver historico de jejuns.
- Ver dashboard e resumo semanal.
- Testar em celular e desktop.

## 6. Atualizar README

Depois do deploy, atualize o `README.md` com:

- Link publico da aplicacao.
- Screenshots das telas principais.
- Link do video demonstrativo.
