# Plano de Commits em Portugues

Use mensagens curtas, no imperativo, explicando uma unidade de mudanca por commit.

Formato recomendado:

```text
tipo: descricao curta em portugues
```

Tipos sugeridos:

- `estrutura`: organizacao inicial do projeto.
- `auth`: autenticacao e rotas protegidas.
- `refeicoes`: funcionalidades de refeicoes.
- `metas`: meta calorica e dashboard.
- `jejum`: funcionalidades de jejum.
- `resumo`: graficos e indicadores semanais.
- `seguranca`: regras do Firestore e variaveis.
- `ui`: ajustes visuais e responsividade.
- `docs`: documentacao.
- `fix`: correcao de bug.

## Sugestao de 20 commits

Primeira conta:

1. `estrutura: iniciar projeto next com typescript`
2. `auth: configurar firebase e contexto de usuario`
3. `auth: adicionar telas de login e cadastro`
4. `auth: implementar recuperacao de senha`
5. `refeicoes: criar cadastro e listagem por data`
6. `refeicoes: adicionar edicao de registros`
7. `refeicoes: adicionar exclusao com confirmacao`
8. `metas: implementar configuracao da meta diaria`
9. `metas: exibir progresso calorico no dashboard`
10. `ui: proteger layout autenticado e navegacao`

Segunda conta:

1. `jejum: implementar inicio de ciclo planejado`
2. `jejum: implementar encerramento e historico`
3. `jejum: corrigir contador de tempo ativo`
4. `resumo: adicionar grafico semanal de calorias`
5. `resumo: adicionar horas de jejum por dia`
6. `resumo: calcular indicadores agregados`
7. `seguranca: adicionar regras do firestore`
8. `seguranca: documentar variaveis de ambiente`
9. `docs: adicionar checklist dos requisitos`
10. `docs: adicionar guia de deploy na vercel`

## Como alternar autor do commit

Substitua nome e e-mail pelos dados das duas contas do GitHub:

```bash
git commit --author="Nome Um <email1@exemplo.com>" -m "mensagem"
git commit --author="Nome Dois <email2@exemplo.com>" -m "mensagem"
```

Para o GitHub atribuir corretamente, o e-mail usado no `--author` precisa estar cadastrado na conta correspondente.
