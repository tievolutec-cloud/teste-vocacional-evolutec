# Ativar o recebimento na planilha Teste Vocacional 2026

1. Abra a planilha **Teste Vocacional 2026**.
2. Acesse **Extensões > Apps Script**.
3. Apague o conteúdo existente do arquivo `Código.gs`.
4. Cole todo o conteúdo do arquivo `Code.gs` desta pasta.
5. Clique em **Implantar > Nova implantação**.
6. Selecione **Aplicativo da Web**.
7. Em **Executar como**, escolha **Eu**.
8. Em **Quem pode acessar**, escolha **Qualquer pessoa**.
9. Clique em **Implantar**, autorize e copie o endereço terminado em `/exec`.
10. Na Vercel, crie a variável `NEXT_PUBLIC_SHEETS_ENDPOINT` com esse endereço e faça um novo deploy.

Os dados serão gravados a partir da linha 3 nas colunas Nome, Telefone, Perfil / Curso e Já é Aluno.
