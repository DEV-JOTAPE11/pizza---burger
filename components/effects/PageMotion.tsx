"use client";

import { useEffect } from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Controlador único das animações de entrada.
 *
 * As seções continuam sendo Server Components: elas só marcam o que deve
 * entrar animado com atributos `data-anim` no HTML, e é aqui — já no
 * cliente — que o GSAP lê essas marcas e monta as animações. Nenhum wrapper
 * novo entra no DOM, então o layout em CSS Modules fica intocado.
 *
 * Vocabulário:
 *   data-anim="up|down|left|right|fade|pop|rise|chars"  preset de entrada
 *   data-anim-group[="stagger"]  agrupa os filhos num gatilho só, em cascata
 *   data-anim-mode="load"        entra no carregamento, não na rolagem
 *   data-anim-delay="0.2"        atraso extra, em segundos — dentro de um
 *                                grupo, o do primeiro membro de cada preset
 *                                vale para a família inteira
 *   data-anim-start="top 70%"    ponto de disparo do ScrollTrigger
 */

/** Estado inicial de cada preset. O alvo sempre termina em `opacity: 1`. */
const PRESETS: Record<string, gsap.TweenVars> = {
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
const REST: gsap.TweenVars = { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 };

const DURATIONS: Record<string, number> = { pop: 0.75, rise: 1, chars: 0.55 };
const EASES: Record<string, string> = {
  pop: "back.out(2)",
  rise: "power3.out",
  chars: "power3.out",
};

/**
 * Quebra o texto do elemento em `<span>` inline, um por caractere.
 *
 * Os spans são inline puros, sem caixa própria: não mexem na quebra de
 * linha nem no kerning, então o título ocupa exatamente o mesmo espaço com
 * a animação ligada ou desligada. Só `opacity` e `filter` mudam, e nenhum
 * dos dois move o layout. A recursão preserva a marcação interna — o
 * `<em>` do título do herói continua sendo um bloco à parte.
 */
function splitChars(root: HTMLElement): HTMLElement[] {
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

type Job = {
  /** O que de fato é animado — o elemento, ou seus caracteres. */
  targets: HTMLElement[];
  preset: string;
  delay: number;
};

function buildJob(el: HTMLElement): Job {
  const preset = el.dataset.anim || "fade";
  const delay = Number(el.dataset.animDelay ?? 0) || 0;
  const targets = preset === "chars" ? splitChars(el) : [el];

  // Até aqui o CSS escondia o elemento inteiro; a partir de agora quem
  // controla a opacidade são os caracteres, um a um.
  if (preset === "chars") gsap.set(el, { opacity: 1 });
  return { targets: targets.length ? targets : [el], preset, delay };
}

function initial(job: Job) {
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
function target(job: Job) {
  const clearProps = "transform,willChange,filter";
  if (job.preset === "chars") {
    return { opacity: 1, filter: "blur(0px)", clearProps };
  }
  return { ...REST, clearProps };
}

export default function PageMotion() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const claimed = new Set<HTMLElement>();

      /* Grupos primeiro: um gatilho só para a família inteira, para que os
         cards e os recortes entrem em cascata e não cada um por si. */
      const groups = Array.from(
        document.querySelectorAll<HTMLElement>("[data-anim-group]"),
      );

      for (const group of groups) {
        const members = Array.from(
          group.querySelectorAll<HTMLElement>("[data-anim]"),
        );
        if (!members.length) continue;

        const stagger = Number(group.dataset.animGroup) || 0.11;
        const onLoad = group.dataset.animMode === "load";
        const jobs = members.map((el) => {
          claimed.add(el);
          return buildJob(el);
        });

        /* Membros do mesmo preset viram um tween só — é o que dá a cascata
           regular. Presets diferentes dentro do grupo mantêm o seu tempo. */
        const byPreset = new Map<string, Job[]>();
        for (const job of jobs) {
          const list = byPreset.get(job.preset);
          if (list) list.push(job);
          else byPreset.set(job.preset, [job]);
        }

        for (const [preset, list] of byPreset) {
          const flat = list.flatMap((j) => j.targets);
          const sample = list[0];
          gsap.fromTo(flat, initial(sample), {
            ...target(sample),
            duration: DURATIONS[preset] ?? 0.85,
            ease: EASES[preset] ?? "power3.out",
            stagger: preset === "chars" ? 0.03 : stagger,
            delay: (Number(group.dataset.animDelay) || 0) + sample.delay,
            ...(onLoad
              ? {}
              : {
                  scrollTrigger: {
                    trigger: group,
                    start: group.dataset.animStart || "top 82%",
                    once: true,
                  },
                }),
          });
        }
      }

      /* Elementos avulsos: cada um dispara no próprio ponto de entrada. */
      const singles = Array.from(
        document.querySelectorAll<HTMLElement>("[data-anim]"),
      ).filter((el) => !claimed.has(el));

      for (const el of singles) {
        const job = buildJob(el);
        const onLoad = el.dataset.animMode === "load";

        gsap.fromTo(job.targets, initial(job), {
          ...target(job),
          duration: DURATIONS[job.preset] ?? 0.85,
          ease: EASES[job.preset] ?? "power3.out",
          stagger: job.preset === "chars" ? 0.03 : 0.08,
          delay: job.delay,
          ...(onLoad
            ? {}
            : {
                scrollTrigger: {
                  trigger: el,
                  start: el.dataset.animStart || "top 86%",
                  once: true,
                },
              }),
        });
      }
    });

    /* As fotos abaixo da dobra são `lazy`: quando elas chegam, a altura da
       página muda e os pontos de disparo calculados antes saem do lugar. */
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, []);

  return null;
}
