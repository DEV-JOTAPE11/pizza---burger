/**
 * A sequência do herói: 8 segundos de vídeo virados em quadros JPEG, para
 * que a rolagem possa passear pela montagem do hambúrguer para frente e
 * para trás. Um <video> com `currentTime` gagueja ao ser arrastado — cada
 * salto obriga o decodificador a procurar o quadro-chave anterior. Imagens
 * já decodificadas na memória trocam no mesmo quadro da tela.
 *
 * São dois conjuntos porque o enquadramento muda com a tela:
 *   - `wide`  16:9, o quadro original, hambúrguer à direita e o texto
 *             cabendo na área escura à esquerda;
 *   - `tall`  3:4 recortado em cima do hambúrguer, metade dos quadros,
 *             para não gastar 19 MB de dados de quem está no celular.
 */

export type Sequence = {
  dir: string;
  count: number;
};

export const SEQUENCES: Record<"wide" | "tall", Sequence> = {
  wide: { dir: "/frames/burger", count: 192 },
  tall: { dir: "/frames/burger-mobile", count: 96 },
};

/** Acima desta largura vale o quadro 16:9 completo. */
export const WIDE_QUERY = "(min-width: 760px)";

export const framePath = (seq: Sequence, n: number) =>
  `${seq.dir}/frame_${String(n).padStart(4, "0")}.jpg`;

/** Quantos quadros precisam estar prontos antes de revelar o herói. */
export const READY_AT = 14;

/** Até onde o título de abertura continua visível. */
export const INTRO_FADE_END = 0.085;

export type Scene = {
  id: string;
  step: string;
  kicker: string;
  title: string;
  text: string;
  /** Faixa de progresso (0–1) em que o cartão fica na tela. */
  show: number;
  hide: number;
  cta?: string;
};

/**
 * Cada cartão é escrito para a camada que está pousando na tela naquele
 * trecho da rolagem: o pão embaixo, as carnes, o bacon, o frescor e o
 * fechamento. Os tempos vêm da própria animação, não de uma régua fixa.
 */
export const SCENES: Scene[] = [
  {
    id: "pao",
    step: "01",
    kicker: "A base",
    title: "Pão brioche na chapa",
    text: "Assado toda manhã e tostado na manteiga até o gergelim dourar.",
    show: 0.1,
    hide: 0.26,
  },
  {
    id: "carne",
    step: "02",
    kicker: "O peso",
    title: "Duas carnes de 160 g",
    text: "Blend de acém e peito moído na hora, selado a 250 °C com o cheddar derretendo entre elas.",
    show: 0.3,
    hide: 0.46,
  },
  {
    id: "bacon",
    step: "03",
    kicker: "A crocância",
    title: "Bacon no melado",
    text: "Fatia grossa, defumada por doze horas e caramelizada até estalar na mordida.",
    show: 0.5,
    hide: 0.64,
  },
  {
    id: "frescor",
    step: "04",
    kicker: "O frescor",
    title: "Tomate e alface crespa",
    text: "Cortados na hora do pedido — é o contraste frio que segura toda a gordura.",
    show: 0.68,
    hide: 0.82,
  },
  {
    id: "fechou",
    step: "05",
    kicker: "Fechou",
    title: "Na sua mesa em 18 minutos",
    text: "Montado na ordem certa, embalado quente e entregue antes de o pão perder a crocância.",
    show: 0.87,
    hide: 1.01,
    cta: "Pedir agora",
  },
];
