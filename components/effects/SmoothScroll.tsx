"use client";

import { useEffect } from "react";

import { prefersReducedMotion } from "@/lib/motion";

/**
 * Rolagem suave da página inteira (Lenis).
 *
 * Quem bate o relógio é o ticker do GSAP, não um `requestAnimationFrame`
 * solto: as revelações com `scrub` leem a posição de rolagem a cada quadro
 * e, se o Lenis atualizasse essa posição num rAF próprio — ora antes, ora
 * depois do ScrollTrigger — o texto tremeria. `lagSmoothing(0)` desliga a
 * compensação de quadros perdidos, que daria saltos na posição interpolada.
 *
 * Sob `prefers-reduced-motion` nada disso monta: fica a rolagem nativa.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      // Fora do bundle inicial; o GSAP já vem do chunk das outras animações.
      const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("@/lib/gsap"),
      ]);
      if (cancelled) return;

      const lenis = new Lenis({ duration: 1.15 });

      // O ScrollTrigger recalcula no mesmo instante em que a posição muda,
      // sem esperar o evento `scroll` nativo do próximo quadro.
      lenis.on("scroll", ScrollTrigger.update);

      const tick = (time: number) => lenis.raf(time * 1000); // GSAP em s, Lenis em ms
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33); // valores padrão do GSAP
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}
