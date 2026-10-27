# Sorteador de Números

Aplicação web para sortear números aleatórios dentro de um intervalo definido por quem usa. É possível escolher quantos números sortear, os valores mínimo e máximo e se os números podem se repetir.

Projeto de estudo feito com HTML, CSS e JavaScript puros, sem frameworks, a partir de um layout da comunidade do Figma.

## Funcionalidades

- Sorteio de **um ou vários números** em um intervalo, por exemplo, de 1 até 100
- Opção **"Não repetir número"**, para que cada número apareça no máximo uma vez
- **Validação dos campos**, com mensagens de erro explicando o que corrigir:
  - campos vazios
  - quantidade menor que 1 ou não inteira
  - valor máximo menor ou igual ao mínimo
  - quantidade maior do que os números disponíveis no intervalo, quando a repetição está desligada
- **Tela de resultado** que substitui o formulário, com contador de sorteios ("1º RESULTADO", "2º RESULTADO"...) e botão **"Sortear novamente"**
- **Animação** de cada número sorteado, que aparece em sequência
- **Layout responsivo** para computador e celular

## Tecnologias

- **HTML5**: estrutura semântica (`header`, `main`, `section`, `form`)
- **CSS3**: Grid, Flexbox, media queries, `@keyframes`, `@property` e contorno em gradiente
- **JavaScript**: manipulação do DOM, validação do formulário e lógica do sorteio
- **Google Fonts**: Sora, Roboto Flex e Roboto Mono

## Como executar

Não é preciso instalar nada.

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   ```
2. Abra o arquivo `index.html` no navegador.

Também é possível usar a extensão **Live Server** do VS Code: clique com o botão direito no `index.html` e escolha **Open with Live Server**. Assim, a página recarrega sozinha a cada alteração.

## Estrutura do projeto

```
sorteado-de-numeros/
├── index.html    # Estrutura da página
├── style.css     # Estilos, animações e layout responsivo
├── script.js     # Validação e lógica do sorteio
└── image/        # Fundo, logo e ícones (SVG e PNG)
```

## Como o sorteio funciona

- **Com repetição:** cada número é sorteado de forma independente com `Math.random()`, como tirar uma bolinha de um saco e devolvê-la antes da próxima.
- **Sem repetição:** o código usa uma versão do embaralhamento de **Fisher-Yates** que anota apenas as trocas em um `Map`. Assim, não precisa criar uma lista com todos os números do intervalo, e o sorteio continua rápido mesmo em intervalos muito grandes, como de 1 até 1 bilhão.

## Acessibilidade

- Campos com `label` associado a cada `input`
- Erros marcados com `aria-invalid` e anunciados por leitores de tela (`role="alert"`)
- Resultado anunciado automaticamente com `aria-live`
- O foco do teclado acompanha a troca entre formulário e resultado
- Animações reduzidas para quem ativa a opção **reduzir movimento** no sistema (`prefers-reduced-motion`)

## Autora

Feito por **Gabriela Vasconcelos** durante os estudos de JavaScript.
