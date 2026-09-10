"use client";

import { gsap } from "@/lib/gsap";

/**
 * O vocabulário das entradas do site, num lugar só.
 *
 * Quem lê os atributos `data-anim` do HTML e dispara na rolagem é o
 * `PageMotion`. O herói precisa das mesmas entradas, mas repetidas toda vez
 * que a rolagem volta para uma camada — e isso ele mesmo comanda. Os dois
 * chamam as funções daqui, então "o texto do herói entra igual ao da seção
 * de baixo" é um fato do código, e não uma coincidência de dois arquivos
 * ajustados na mão.
 */

/** Estado inicial de cada preset. O alvo sempre termina em `opacity: 1`. */
export const PRESETS: Record<string, gsap.TweenVars> = {
  fade: { opacity: 0 },
  up: { opacity: 0, y: 30 },
  down: { opacity: 0, y: -24 },
  left: { opacity: 0, x: -36 },
  right: { opacity: 0, x: 36 },
  /* Recortes soltos (tomate, pimenta, folha): brotam girando um pouco. */
  pop: { opacity: 0, scale: 0.55, rotate: -14 },
  /* Fotografia grande: sobe da mesa e assenta. */
  rise: { opacity: 0, y: 64, scale: 0.93 },
};

/** Estado final por preset — só o que precisa voltar ao repouso. */
export const REST: gsap.TweenVars = { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 };

export const DURATIONS: Record<string, number> = { pop: 0.75, rise: 1, chars: 0.55 };
export const EASES: Record<string, string> = {
  pop: "back.out(2)",
  rise: "power3.out",
  chars: "power3.out",
};

/** Cascata entre caracteres de um título e entre elementos avulsos. */
export const CHAR_STAGGER = 0.03;
export const ITEM_STAGGER = 0.08;

/**
 * Quebra o texto do elemento em `<span>` inline, um por caractere.
 *
 * Os spans são inline puros, sem caixa própria: não mexem na quebra de
 * linha nem no kerning, então o título ocupa exatamente o mesmo espaço com
 * a animação ligada ou desligada. Só `opacity` e `filter` mudam, e nenhum
 * dos dois move o layout. A recursão preserva a marcação interna — o
 * `<em>` do título do herói continua sendo um bloco à parte.
 */
export function splitChars(root: HTMLElement): HTMLElement[] {
  const chars: HTMLElement[] = [];

  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
        continue;
      }
      if (child.nodeType !== Node.TEXT_NODE) continue;

      const text = child.textContent ?? "";
      if (!text.trim()) continue;

      const frag = document.createDocumentFragment();
      for (const ch of Array.from(text)) {
        // Espaços ficam como texto puro: a quebra de linha continua sendo
        // decidida pelo navegador, palavra a palavra.
        if (ch === " ") {
          frag.appendChild(document.createTextNode(ch));
          continue;
        }
        const span = document.createElement("span");
        span.className = "mchar";
        span.textContent = ch;
        frag.appendChild(span);
        chars.push(span);
      }
      child.parentNode?.replaceChild(frag, child);
    }
  };

  walk(root);
  return chars;
}

export type Job = {
  /** O que de fato é animado — o elemento, ou seus caracteres. */
  targets: HTMLElement[];
  preset: string;
  delay: number;
};

/**
 * Lê os atributos de um elemento e prepara o que será animado.
 *
 * Chame uma vez por elemento: no preset `chars` isto reescreve o conteúdo
 * do título em spans, e repetir a leitura quebraria o texto duas vezes.
 */
export function buildJob(el: HTMLElement): Job {
  const preset = el.dataset.anim || "fade";
  const delay = Number(el.dataset.animDelay ?? 0) || 0;
  const targets = preset === "chars" ? splitChars(el) : [el];

  // Até aqui o CSS escondia o elemento inteiro; a partir de agora quem
  // controla a opacidade são os caracteres, um a um.
  if (preset === "chars") gsap.set(el, { opacity: 1 });
  return { targets: targets.length ? targets : [el], preset, delay };
}

export function initial(job: Job): gsap.TweenVars {
  if (job.preset === "chars") {
    return { opacity: 0, filter: "blur(10px)", willChange: "opacity, filter" };
  }
  return { ...PRESETS[job.preset] ?? PRESETS.fade, willChange: "opacity, transform" };
}

/*
 * O `clearProps` é o ponto: ao terminar, o GSAP apaga o `transform` inline
 * que ele mesmo escreveu. Sem isso o estilo inline venceria o `:hover` dos
 * cards e dos botões, e o site ficaria bonito na entrada e morto no mouse.
 * A opacidade fica: é ela que anula o `opacity: 0` do estado inicial.
 */
export function target(job: Job): gsap.TweenVars {
  const clearProps = "transform,willChange,filter";
  if (job.preset === "chars") {
    return { opacity: 1, filter: "blur(0px)", clearProps };
  }
  return { ...REST, clearProps };
}

/** Duração, curva e cascata de um preset — iguais em qualquer seção. */
export function timing(preset: string): gsap.TweenVars {
  return {
    duration: DURATIONS[preset] ?? 0.85,
    ease: EASES[preset] ?? "power3.out",
    stagger: preset === "chars" ? CHAR_STAGGER : ITEM_STAGGER,
  };
}

/** Deixa o alvo no estado de partida, antes de qualquer entrada. */
export function prime(job: Job): void {
  gsap.set(job.targets, initial(job));
}

/** Toca a entrada de um elemento já preparado. Pode ser chamada de novo. */
export function play(job: Job, delay = 0): gsap.core.Tween {
  return gsap.fromTo(job.targets, initial(job), {
    ...target(job),
    ...timing(job.preset),
    delay: delay + job.delay,
  });
}
