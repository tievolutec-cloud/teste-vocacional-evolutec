# Teste Vocacional Evolutec

Landing page interativa com 12 perguntas, resultado por perfil vocacional, recomendações de cursos, captura de nome e WhatsApp, envio ao Google Sheets e contato final pelo WhatsApp da Evolutec.

## Publicar na Vercel

1. Na Vercel, clique em **Add New > Project**.
2. Importe o repositório `tievolutec-cloud/teste-vocacional-evolutec`.
3. Mantenha o framework detectado como **Next.js**.
4. Configure `NEXT_PUBLIC_SHEETS_ENDPOINT` com o endereço do Web App criado pelo Google Apps Script.
5. Clique em **Deploy**.

O arquivo `integracao-google-sheets/Code.gs` contém o código pronto para receber os resultados na planilha **Teste Vocacional 2026**.

## Desenvolvimento local

```bash
npm install
npm run dev
```
