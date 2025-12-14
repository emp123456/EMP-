# EMP // ARQUITETURA DIGITAL

Este projeto é um site estático otimizado para a estética "Void" e segurança. Ele usa `localStorage` para persistência de dados (simulando um backend) e a Web Audio API para áudio procedural.

## Como Hospedar na Vercel

Este projeto está pronto para ser hospedado na Vercel.

### Opção 1: Via GitHub (Recomendado)
1. Crie um repositório no GitHub e suba todos os arquivos desta pasta.
2. Acesse [vercel.com](https://vercel.com) e conecte sua conta do GitHub.
3. Clique em "Add New..." -> "Project".
4. Selecione o repositório que você criou.
5. Clique em **Deploy**. A Vercel detectará automaticamente que é um site HTML estático.

### Opção 2: Vercel CLI
1. Instale a CLI: `npm i -g vercel`
2. No terminal, dentro desta pasta, rode: `vercel`
3. Siga as instruções na tela.

### Notas Importantes
- **Persistência de Dados**: Como este é um site estático sem banco de dados real, todas as contas criadas, mensagens de chat e projetos enviados são salvos no **Navegador do Usuário** (`localStorage`). Se você abrir o site em outro computador, os dados não estarão lá.
- **Segurança**: As configurações de segurança (Headers) já estão definidas no arquivo `vercel.json` para proteger contra XSS e Clickjacking.
