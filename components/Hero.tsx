"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  INTRO_FADE_END,
  SCENES,
  SEQUENCES,
  WIDE_QUERY,
  framePath,
} from "@/lib/burgerFrames";
import { prefersReducedMotion } from "@/lib/motion";
import { buildJob, play, prime, type Job } from "@/lib/reveal";
import TornEdge from "./TornEdge";
import s from "./Hero.module.css";

/**
 * Herói de rolagem: a seção tem várias telas de altura e o que fica preso
 * na viewport é um <canvas>. A posição da rolagem dentro da seção vira um
 * número de 0 a 1, e esse número escolhe o quadro do hambúrguer — a
 * montagem anda para frente e para trás no ritmo de quem lê.
 *
 * Três decisões que sustentam o resto do arquivo:
 *
 * 1. O laço é um `requestAnimationFrame` contínuo, e não um ouvinte de
 *    `scroll`. O Lenis interpola a rolagem no ticker do GSAP; ler a
 *    posição a cada quadro pega essa interpolação, e não os saltos do
 *    evento nativo. O laço só roda com a seção na tela.
 *
 * 2. O que muda a cada quadro — opacidade do título, barra de progresso —
 *    é escrito direto no DOM por refs. Só o cartão de texto visível é
 *    estado do React, porque ele troca cinco vezes na rolagem inteira.
 *
 * 3. Os quadros chegam num carrossel de oito por vez, em ordem. Enquanto o
 *    índice pedido não chegou, desenha-se o vizinho mais próximo que já
 *    veio: dá para rolar desde o começo, só menos fluido.
 */
export default function Hero({ children }: { children?: React.ReactNode }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);

  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const jobsRef = useRef<Job[][]>([]);

  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const frameRef = useRef(-1);
  const progressRef = useRef(-1);

  const [mode, setMode] = useState<"wide" | "tall" | null>(null);
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(-1);

  const seq = mode ? SEQUENCES[mode] : null;

  /* ---------- Enquadramento ---------- */

  /**
   * Desenha um quadro na área presa à tela sem nunca cortar o hambúrguer.
   *
   * A regra é uma só: encaixa pela largura e apoia na base — o hambúrguer
   * fica de pé no chão da viewport — e, se assim ele não couber na altura,
   * encolhe até caber e centraliza. Um `cover` seria mais simples, mas
   * comeria o pão de cima justamente nas telas largas e baixas.
   *
   * A sobra é preenchida esticando a própria fileira (ou coluna) de borda
   * do JPEG. Como o fundo do quadro é um degradê vermelho liso, dois
   * pixels esticados continuam exatamente a mesma cor: a emenda não
   * aparece, e não há cor chumbada no código para sair do lugar se o
   * vídeo um dia for trocado.
   */
  const paint = useCallback((img: HTMLImageElement) => {
    const cvs = canvasRef.current;
    const ctx = cvs?.getContext("2d");
    if (!cvs || !ctx || !img.naturalWidth) return;

    const cw = cvs.width;
    const ch = cvs.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    let dw = cw;
    let dh = (cw * ih) / iw;
    let dx = 0;
    let dy = ch - dh;

    if (dh > ch) {
      dh = ch;
      dw = (ch * iw) / ih;
      dx = (cw - dw) / 2;
      dy = 0;
    }

    ctx.clearRect(0, 0, cw, ch);

    /* Margens primeiro; o quadro entra por cima e cobre a emenda. A
       amostra é tirada dois pixels para dentro: a última fileira de um
       JPEG costuma carregar sujeira da compressão, e esticá-la deixaria
       uma faixa escura na lateral. */
    if (dy > 0) {
      ctx.drawImage(img, 0, 2, iw, 2, dx, 0, dw, Math.ceil(dy) + 1);
    }
    if (dx > 0) {
      const edge = Math.ceil(dx) + 1;
      ctx.drawImage(img, 2, 0, 2, ih, 0, dy, edge, dh);
      ctx.drawImage(img, iw - 4, 0, 2, ih, cw - edge, dy, edge, dh);
    }

    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  /** Desenha o índice pedido — ou o vizinho mais próximo que já chegou. */
  const drawIndex = useCallback(
    (index: number) => {
      const imgs = imagesRef.current;
      let img = imgs[index] ?? null;
      for (let i = index - 1; i >= 0 && !img; i--) img = imgs[i] ?? null;
      for (let i = index + 1; i < imgs.length && !img; i++) img = imgs[i] ?? null;
      if (img) paint(img);
    },
    [paint],
  );

  const resize = useCallback(() => {
    const cvs = canvasRef.current;
    const host = stickyRef.current;
    if (!cvs || !host) return;

    // Acima de 2× o ganho visual some e o custo de pintura dobra.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;

    cvs.width = Math.round(w * dpr);
    cvs.height = Math.round(h * dpr);
    cvs.style.width = `${w}px`;
    cvs.style.height = `${h}px`;

    drawIndex(frameRef.current >= 0 ? frameRef.current : 0);
  }, [drawIndex]);

  /* ---------- Qual conjunto de quadros ---------- */

  useEffect(() => {
    setReduced(prefersReducedMotion());

    const mq = window.matchMedia(WIDE_QUERY);
    const apply = () => {
      setMode(mq.matches ? "wide" : "tall");
    };
    apply();

    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /* ---------- Carregamento ---------- */

  useEffect(() => {
    if (!seq) return;

    let cancelled = false;
    const imgs: (HTMLImageElement | null)[] = new Array(seq.count).fill(null);
    imagesRef.current = imgs;
    frameRef.current = -1;
    progressRef.current = -1;

    const load = (i: number, onSettle: () => void) => {
      const img = new Image();
      img.decoding = "async";
      const settle = () => {
        if (cancelled) return;
        if (img.naturalWidth) imgs[i] = img;
        onSettle();
      };
      img.onload = settle;
      img.onerror = settle;
      img.src = framePath(seq, i + 1);
    };

    // Sem animação pedida, o herói é uma tela só: basta o quadro final.
    if (reduced) {
      const last = seq.count - 1;
      load(last, () => {
        frameRef.current = last;
        drawIndex(last);
      });
      return () => {
        cancelled = true;
      };
    }

    let next = 0;

    /* Oito por vez, em ordem: os primeiros quadros ficam prontos em
       segundos e a rolagem já responde, em vez de esperar a sequência
       inteira descer. */
    const pump = () => {
      if (cancelled) return;
      const i = next++;
      if (i >= seq.count) return;

      load(i, () => {
        // O quadro que estava sendo aproximado por um vizinho agora existe.
        if (i === frameRef.current || frameRef.current < 0) drawIndex(i);
        pump();
      });
    };

    for (let k = 0; k < 8; k++) pump();

    return () => {
      cancelled = true;
    };
  }, [seq, reduced, drawIndex]);

  /* ---------- Medidas ---------- */

  useEffect(() => {
    resize();
    const host = stickyRef.current;
    // No celular a barra do navegador entra e sai e a altura muda sem que
    // exista um evento `resize` — daí o observador, e não o ouvinte.
    const ro = new ResizeObserver(resize);
    if (host) ro.observe(host);
    return () => ro.disconnect();
  }, [resize]);

  /* ---------- Entrada do texto de cada camada ----------
     O mesmo repertório da seção de baixo: título revelado caractere a
     caractere e o resto subindo. A diferença é que aqui a entrada se
     repete — a rolagem passa pela camada quantas vezes quiser. */

  /* Preparo, uma vez só: `buildJob` reescreve o título em spans, e ler o
     mesmo elemento de novo quebraria o texto duas vezes. */
  useEffect(() => {
    if (reduced) return;
    jobsRef.current = sceneRefs.current.map((el) => {
      if (!el) return [];
      const jobs = Array.from(
        el.querySelectorAll<HTMLElement>("[data-anim]"),
      ).map(buildJob);
      // Já no ponto de partida: quando a camada acender, não existe um
      // quadro com o texto inteiro na tela antes de a entrada começar.
      jobs.forEach(prime);
      return jobs;
    });
  }, [reduced]);

  useEffect(() => {
    if (reduced || active < 0) return;
    const jobs = jobsRef.current[active];
    if (!jobs?.length) return;

    const tweens = jobs.map((job) => play(job));
    // Trocou de camada no meio da entrada: a anterior para onde está e
    // some com o bloco, em vez de continuar escrevendo por baixo.
    return () => tweens.forEach((tween) => tween.kill());
  }, [active, reduced]);

  /* ---------- Laço da rolagem ---------- */

  useEffect(() => {
    if (!seq || reduced) return;

    let raf = 0;
    let running = false;

    const tick = () => {
      raf = requestAnimationFrame(tick);

      const section = sectionRef.current;
      const host = stickyRef.current;
      if (!section || !host) return;

      const span = section.offsetHeight - host.offsetHeight;
      const top = section.getBoundingClientRect().top;
      const p = span <= 0 ? 0 : Math.min(1, Math.max(0, -top / span));

      // Parado, não há nada a repintar.
      if (Math.abs(p - progressRef.current) < 0.0001) return;
      progressRef.current = p;

      const index = Math.min(seq.count - 1, Math.round(p * (seq.count - 1)));
      if (index !== frameRef.current) {
        frameRef.current = index;
        drawIndex(index);
      }

      if (introRef.current) {
        const o = Math.max(0, 1 - p / INTRO_FADE_END);
        introRef.current.style.opacity = String(o);
        introRef.current.style.transform = `translate3d(0, ${(1 - o) * -18}px, 0)`;
      }

      let current = -1;
      for (let i = 0; i < SCENES.length; i++) {
        if (p >= SCENES[i].show && p <= SCENES[i].hide) {
          current = i;
          break;
        }
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    /* O laço só existe com o herói na tela: passada a primeira dobra, ele
       para de disputar quadros com as animações do resto da página. */
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "10% 0px" },
    );
    if (sectionRef.current) io.observe(sectionRef.current);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [seq, reduced, drawIndex]);

  return (
    <section
      ref={sectionRef}
      className={`${s.hero} ${reduced ? s.still : ""}`}
      aria-labelledby="hero-title"
    >
      <div ref={stickyRef} className={s.sticky}>
        <canvas
          ref={canvasRef}
          className={s.canvas}
          role="img"
          aria-label="Hambúrguer artesanal sendo montado camada por camada: pão brioche, duas carnes com cheddar, bacon, tomate e alface"
        />

        <div className={s.vignette} aria-hidden="true" />

        {children}

        <div className="stage">
          {/* Acima da dobra não há rolagem para disparar nada: o grupo
              inteiro entra assim que o controlador assume. */}
          <div
            ref={introRef}
            className={s.intro}
            data-anim-group="0.14"
            data-anim-mode="load"
            data-anim-delay="0.12"
          >
            <p className={s.eyebrow} data-anim="up">
              Feito para dar fome
            </p>
            <h1 className={s.title} id="hero-title" data-anim="chars">
              <em>Pizza &amp;</em>
              Burger
            </h1>
            <p className={s.lead} data-anim="up">
              Role a página e monte, camada por camada, o hambúrguer que sai
              da nossa chapa.
            </p>
            <a className={`btn ${s.cta}`} href="#pedir" data-anim="up">
              Pedir Agora
            </a>
          </div>

          {!reduced &&
            SCENES.map((item, i) => (
              <div
                key={item.id}
                ref={(el) => {
                  sceneRefs.current[i] = el;
                }}
                className={s.scene}
                data-anim-replay=""
                data-on={i === active ? "" : undefined}
                aria-hidden={i === active ? undefined : "true"}
              >
                <p className={s.eyebrow} data-anim="up">
                  {item.kicker}
                </p>
                <h2 className={s.sceneTitle} data-anim="chars">
                  {item.accent && <em>{item.accent}</em>}
                  {item.title}
                </h2>
                <p className={s.lead} data-anim="up" data-anim-delay="0.15">
                  {item.text}
                </p>
                {item.cta && (
                  <a
                    className={`btn ${s.cta}`}
                    href="#pedir"
                    data-anim="up"
                    data-anim-delay="0.28"
                  >
                    {item.cta}
                  </a>
                )}
              </div>
            ))}
        </div>
      </div>

      <TornEdge className={s.tear} variant="A" color="var(--cream)" height={58} />
    </section>
  );
}
