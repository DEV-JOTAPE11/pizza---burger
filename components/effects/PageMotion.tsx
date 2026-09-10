"use client";

import { useEffect } from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { DURATIONS, EASES, buildJob, initial, target } from "@/lib/reveal";

/**
 * Controlador único das animações de entrada.
 *
 * As seções continuam sendo Server Components: elas só marcam o que deve
 * entrar animado com atributos `data-anim` no HTML, e é aqui — já no
 * cliente — que o GSAP lê essas marcas e monta as animações. Nenhum wrapper
 * novo entra no DOM, então o layout em CSS Modules fica intocado.
 *
 * O repertório de entradas mora em `lib/reveal.ts`, porque o herói repete
 * as mesmas entradas por conta própria (ver `Hero.tsx`).
 *
 * Vocabulário:
 *   data-anim="up|down|left|right|fade|pop|rise|chars"  preset de entrada
 *   data-anim-group[="stagger"]  agrupa os filhos num gatilho só, em cascata
 *   data-anim-mode="load"        entra no carregamento, não na rolagem
 *   data-anim-delay="0.2"        atraso extra, em segundos — dentro de um
 *                                grupo, o do primeiro membro de cada preset
 *                                vale para a família inteira
 *   data-anim-start="top 70%"    ponto de disparo do ScrollTrigger
 *   data-anim-replay             subárvore que o próprio componente comanda:
 *                                daqui para dentro, nada é tocado
 */

/** Deixa para o dono da subárvore o que ele repete sozinho. */
const isReplayed = (el: HTMLElement) => el.closest("[data-anim-replay]") !== null;

export default function PageMotion() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const claimed = new Set<HTMLElement>();

      /* Grupos primeiro: um gatilho só para a família inteira, para que os
         cards e os recortes entrem em cascata e não cada um por si. */
      const groups = Array.from(
        document.querySelectorAll<HTMLElement>("[data-anim-group]"),
      ).filter((el) => !isReplayed(el));

      for (const group of groups) {
        const members = Array.from(
          group.querySelectorAll<HTMLElement>("[data-anim]"),
        ).filter((el) => !isReplayed(el));
        if (!members.length) continue;

        const stagger = Number(group.dataset.animGroup) || 0.11;
        const onLoad = group.dataset.animMode === "load";
        const jobs = members.map((el) => {
          claimed.add(el);
          return buildJob(el);
        });

        /* Membros do mesmo preset viram um tween só — é o que dá a cascata
           regular. Presets diferentes dentro do grupo mantêm o seu tempo. */
        const byPreset = new Map<string, typeof jobs>();
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
      ).filter((el) => !claimed.has(el) && !isReplayed(el));

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
