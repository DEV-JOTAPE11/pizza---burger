# Forno & Brasa — Pizza & Burger

Landing page de hamburgueria/pizzaria reconstruída a partir da referência visual em `referencia/image.png`.

## Como rodar

```bash
npm install
npm run dev     # http://localhost:3210
```

> Os scripts chamam o binário do Next diretamente (`node node_modules/next/dist/bin/next ...`)
> porque o `&` no nome da pasta quebra o atalho `.bin` do npm no Windows.

Outros comandos:

```bash
npm run build   # build de produção
npm start       # sobe o build em http://localhost:3210
```

## Estrutura

```
app/
  layout.tsx        fontes (Archivo Black / Inter / Yellowtail) e metadata
  globals.css       tokens de design, palco central, botões, floaters
  page.tsx          composição da página
components/
  Header.tsx        navegação sobreposta ao Hero
  Hero.tsx          fundo vinho, madeira, pizza e hambúrguer gigante
  FreshSection.tsx  faixa creme "Fresco, Quente &"
  BurgerShowcase.tsx faixa laranja com os três hambúrgueres
  ProductSection.tsx parágrafo, título, cards e fundo vermelho grunge
  ProductCard.tsx   card de produto
  Footer.tsx        rodapé sobre o fundo vermelho
  TornEdge.tsx      bordas rasgadas em SVG entre as seções
  tornPaths.ts      paths gerados proceduralmente
  texture.ts        texturas feTurbulence (granulado e grunge)
public/assets/      fotografias e recortes PNG usados na página
```

## Notas de implementação

- **Palco central (`.stage` / `.container`)**: os fundos são full-bleed, mas a composição
  fotográfica e o texto vivem numa faixa central de até `1360px`, preservando as
  proporções da referência em qualquer largura.
- **Bordas rasgadas**: SVG com `preserveAspectRatio="none"`, path irregular gerado
  proceduralmente mais respingos soltos.
- **Imagens**: `next/image` com `priority` no Hero e `loading="lazy"` abaixo da dobra.
