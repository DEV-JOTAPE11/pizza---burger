"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Ponto único de registro do GSAP.
 * Importe daqui em vez de importar "gsap" direto, para garantir que o
 * ScrollTrigger esteja registrado antes do primeiro uso.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
