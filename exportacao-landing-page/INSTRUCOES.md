# 🚀 Guia de Exportação e Instalação - Landing Page Controle-C

Este diretório contém todos os arquivos e orientações necessários para recriar a landing page do **Controle-C** em um projeto React isolado, com seu próprio domínio e servidor.

---

## 📂 Arquivos Copiados para este Diretório

1. **`LandingPage.jsx`**: O componente React autônomo contendo a estrutura visual, o ciclo interativo de depoimentos (segunda-feira, café, etc.), timeline de features, tabela de preços dinâmica (Mensal vs Anual) e formulários de checkout integrados.
2. **`index.css`**: O arquivo CSS completo que contém todas as fontes do Google, variáveis do sistema de cores, animações premium (nébula rotativa, glows líquidos, efeitos 3D) e estilos globais.
3. **`index.html`**: O arquivo de cabeçalho HTML com tags de responsividade mobile, pixels de rastreamento (Facebook Pixel, TikTok Pixel e Microsoft Clarity), preconnect de fontes e configurações gerais.

---

## 🛠️ Passo a Passo para Instalação no Novo Projeto

### Passo 1: Criar o Projeto React no Novo Servidor/Pasta
No terminal do seu computador, vá para a pasta onde deseja criar a landing page isolada e execute os seguintes comandos:

```bash
# 1. Cria um projeto limpo com Vite, React e JavaScript
npm create vite@latest controle-c-landing -- --template react

# 2. Entra no diretório do projeto criado
cd controle-c-landing

# 3. Instala as dependências iniciais do projeto
npm install
```

### Passo 2: Instalar as Dependências das Animações e Ícones
A landing page utiliza animações fluidas e iconografia premium. Instale-as executando:

```bash
npm install framer-motion lucide-react
```

### Passo 3: Configurar o Tailwind CSS v4
Como o projeto original utiliza a versão mais recente do Tailwind (v4), instale as ferramentas necessárias para integrá-lo ao Vite:

```bash
# 1. Instala o Tailwind CSS e o plugin do Vite
npm install tailwindcss @tailwindcss/vite
```

Agora, abra o arquivo `vite.config.js` do seu novo projeto e configure o plugin do Tailwind CSS:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

---

## 📋 Como Substituir os Arquivos Copiados

Agora que o projeto base está pronto, faça as seguintes substituições usando os arquivos contidos nesta pasta:

1. **`src/App.jsx`**:
   * Substitua todo o conteúdo do `src/App.jsx` do novo projeto pelo conteúdo do arquivo `LandingPage.jsx` desta pasta.
   * **Importante**: No final do arquivo `src/App.jsx`, certifique-se de exportá-lo como padrão:
     ```javascript
     export default App; // (caso renomeie a constante principal de LandingPage para App)
     ```
     Ou mantenha a exportação como:
     ```javascript
     export default LandingPage;
     ```
     E configure o seu `src/main.jsx` para importar corretamente:
     ```javascript
     import LandingPage from './App.jsx'
     ```

2. **`src/index.css`**:
   * Substitua todo o conteúdo do seu `src/index.css` pelo arquivo `index.css` desta pasta. Ele já contém a importação do Tailwind e todas as animações complexas que fazem a página ter uma estética impecável.

3. **`index.html`**:
   * Substitua o arquivo `index.html` da raiz do novo projeto pelo arquivo `index.html` desta pasta para garantir que os Pixels de Rastreamento (Facebook, TikTok, Clarity) e fontes fiquem ativos.

---

## 🔗 Dicas para Conectar a Landing Page com o Seu Aplicativo Principal

### 1. Botão de Login / Acesso à Plataforma
Como a Landing Page estará no domínio principal (ex: `controle-c.com.br`) e o aplicativo principal em um subdomínio (ex: `app.controle-c.com.br`), você pode alterar ou adicionar um botão no topo ou no Hero apontando para a URL de login do app:
```jsx
<a href="https://app.controle-c.com.br/login" className="btn-secondary">
    Entrar na Minha Conta
</a>
```

### 2. URL de Retorno do Pagamento (Zouti / Stripe)
Dentro da sua plataforma de pagamentos (Zouti, no caso atual), certifique-se de configurar a **URL de Obrigado / Retorno** para redirecionar o usuário diretamente para o dashboard do seu aplicativo:
* **URL de Retorno:** `https://app.controle-c.com.br/dashboard`

---

## 🚀 Como Colocar no Ar (Deploy)

Por ser uma landing page estática e extremamente otimizada, a hospedagem é gratuita, segura e global. Recomendamos a **Vercel** ou **Netlify**:

1. Suba o código do seu novo projeto `controle-c-landing` para um repositório privado no GitHub.
2. Crie uma conta gratuita na [Vercel](https://vercel.com).
3. Conecte o repositório e clique em **Deploy**.
4. Nas configurações do projeto na Vercel, adicione o seu domínio oficial (ex: `controle-c.com.br`).
5. Configure os registros DNS da sua hospedagem para apontar `controle-c.com.br` para a Vercel, e `app.controle-c.com.br` para o servidor onde o seu aplicativo real está rodando.

Pronto! Sua estrutura comercial de alta performance está 100% apartada e operando de forma independente e ultra-rápida! 🚀
