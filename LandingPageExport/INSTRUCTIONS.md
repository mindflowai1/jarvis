# Guia de Exportação: Robo Labs Landing Page 3D

Este diretório contém a cópia exata do componente construído na nossa sessão. Você pode facilmente arrastar esses arquivos para qualquer projeto React (incluindo Next.js ou Vite) e rodá-los imediatamente.

## Tecnologias e Bibliotecas Utilizadas
Nenhum CSS externo ou framework CSS (como Tailwind) é estritamente necessário para que esta página rode, pois tudo foi isolado via **CSS-in-JS** para evitar conflitos de estilo. 

No entanto, para o elemento 3D funcionar perfeitamente, o outro projeto deve ter as bibliotecas que descrevem o motor gráfico React-Three e suas dependências.

Aqui está o que é necessário instalar no novo projeto:

```bash
npm install three @react-three/fiber @react-three/drei
```

### O que as bibliotecas fazem?
* **`three`**: É a biblioteca base do Motor WebGL (Three.js). Contém toda a matemática bruta 3D de GPU.
* **`@react-three/fiber`**: É o renderizador que traduz sintaxe declarativa do *React* para injeções dentro do motor *Three.js* em tempo real. Essencial para lidar com o ciclo de vida.
* **`@react-three/drei`**: Fornece componentes utilitários incríveis, totalmente otimizados, poupando centenas de linhas de código (como `<Sparkles>`, `<OrbitControls>`, e as fórmulas de `<Float>`).

---

## Como Replicar no Novo Projeto

**1. Mova os Arquivos:**
Pegue os componentes `.jsx` que estão nesta pasta (`LandingPage.jsx` e `LiquidSphere3D.jsx`) e jogue dentro do diretório `components` ou `pages` do seu novo projeto. Eles precisam estar **na mesma pasta** pois o LandingPage exige importar o Sphere3D relativo à ele (`./LiquidSphere3D`).

**2. Faça a Importação no seu Roteamento:**
Vá no seu `App.js` ou equivalente e importe normalmente e use a página onde quiser. Ex:
```jsx
import LandingPage from './components/LandingPage';

function App() {
  return (
    <div>
      <LandingPage />
    </div>
  )
}
```

**3. Substitua as Fontes da Logo / Customização (Se Necessário):**
Se notar que as fontes ficaram levemente diferentes é porque o projeto base atual possuía um carregamento global da fonte tipográfica `"Inter"` e `"Space Grotesk"`. 
Para garantir idêntico resultado, vá no `index.html` do seu novo projeto e adicione a fonte do google:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;500;700&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
```

## Arquitetura Interna & Customização
- **Não há links com estilos globais quebrados:** Todo o CSS está inserido no topo do arquivo `LandingPage.jsx` dentro da variável `styles` + da Tag injetora `<style>` chamada `scopedCSS`. O seu novo app independe do framework dele estar usando Styled-Components ou Modules; o código é "Drop-in".
- **Mudando Cores de Neon:** Se quiser mudar do padrão Verde/Neon, basta abrir o arquivo `LiquidSphere3D.jsx` e editar as *props* chamadas `color="#..."`, elas reagem dinamicamente e criam reflexos instantâneos.
- **Responsividade Cuidada:** A altura de `100svh` e os truques de compactação `@media(max-width)` do portão já virão junto de brinde e vão consertar a view no celular de forma nativa.
