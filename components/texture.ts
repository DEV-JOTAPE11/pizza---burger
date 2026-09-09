/* Texturas orgânicas em SVG (feTurbulence) usadas como background-image */

const svg = (inner: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="340">${inner}</svg>`
  )}")`;

/** Granulado fino, para dar imperfeição de impressão às áreas chapadas */
export const GRAIN = svg(
  '<filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="340" height="340" filter="url(#g)"/>'
);

/** Grunge largo e irregular, para o fundo vermelho inferior */
export const GRUNGE = svg(
  '<filter id="r"><feTurbulence type="fractalNoise" baseFrequency="0.014 0.032" numOctaves="4" seed="7" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="gamma" exponent="2.2" amplitude="1.5"/></feComponentTransfer></filter><rect width="340" height="340" filter="url(#r)"/>'
);
