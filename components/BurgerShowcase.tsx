import Image from "next/image";
import TornEdge from "./TornEdge";
import s from "./BurgerShowcase.module.css";
import { GRAIN } from "./texture";

const BURGERS = [
  { cls: "b1", src: "/assets/burger-1.png", w: 900, h: 689, alt: "Hambúrguer com alface, tomate e picles" },
  { cls: "b2", src: "/assets/burger-2.png", w: 1000, h: 778, alt: "Hambúrguer duplo com cheddar e alface" },
  { cls: "b3", src: "/assets/burger-3.png", w: 900, h: 782, alt: "Hambúrguer com bacon e queijo cheddar" },
] as const;

const DECOR = [
  { cls: "tomatoL", src: "/assets/tomato-2.png", w: 360, h: 423, drift: "" },
  { cls: "tomatoR", src: "/assets/tomato.png", w: 360, h: 377, drift: "drift--b" },
  { cls: "orangeL", src: "/assets/orange-slice-2.png", w: 413, h: 302, drift: "drift--c" },
  { cls: "orangeR", src: "/assets/orange-slice.png", w: 420, h: 277, drift: "" },
  { cls: "chiliR", src: "/assets/chili.png", w: 360, h: 379, drift: "drift--b" },
  { cls: "leafL", src: "/assets/leaf-2.png", w: 360, h: 300, drift: "drift--c" },
] as const;

export default function BurgerShowcase() {
  return (
    <section className={s.show} aria-label="Nossos hambúrgueres">
      <div className={s.grain} style={{ "--grain": GRAIN } as React.CSSProperties} aria-hidden="true" />

      <TornEdge className={s.tearTop} variant="B" color="var(--cream)" height={52} flip />

      {/* Um gatilho só para a faixa inteira: os hambúrgueres sobem em
          cascata e os recortes brotam logo depois. */}
      <div className="stage" data-anim-group="0.13">
      {DECOR.map((d, i) => (
        <Image
          key={d.cls}
          className={`floater drift ${d.drift} ${s[d.cls]}`}
          src={d.src}
          alt=""
          width={d.w}
          height={d.h}
          aria-hidden="true"
          loading="lazy"
          data-anim="pop"
          /* O atraso do primeiro da família vale para a família toda. */
          data-anim-delay={i === 0 ? "0.35" : undefined}
        />
      ))}

      {BURGERS.map((b) => (
        <div key={b.cls} className={`${s.burger} ${s[b.cls]}`} data-anim="rise">
          <Image src={b.src} alt={b.alt} width={b.w} height={b.h} loading="lazy" sizes="40vw" />
        </div>
      ))}
      </div>

      <TornEdge className={s.tearBottom} variant="C" color="var(--cream)" height={50} />
    </section>
  );
}
