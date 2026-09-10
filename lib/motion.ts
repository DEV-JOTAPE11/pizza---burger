/** Utilitários de movimento compartilhados pelas animações do site. */

/** `true` quando o sistema pede menos animação. Seguro no servidor. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Marca aplicada ao <html> pelo script inline do layout enquanto o JS está
 * ligado. É ela que autoriza o CSS a esconder o que vai ser animado — sem
 * JS a classe nunca entra e a página aparece inteira, sem buraco.
 */
export const MOTION_CLASS = "motion";

/**
 * Script inline (roda antes da primeira pintura) que liga o estado inicial
 * das animações. Fica aqui para o layout e o CSS falarem do mesmo nome.
 */
export const MOTION_BOOT_SCRIPT = `try{var d=document.documentElement;if(!window.matchMedia||!window.matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("${MOTION_CLASS}")}}catch(e){}`;
