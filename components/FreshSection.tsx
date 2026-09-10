import Image from "next/image";
import s from "./FreshSection.module.css";

const DECOR = [
  { cls: "orange1", src: "/assets/orange-slice.png", w: 420, h: 277, drift: "" },
  { cls: "chili1", src: "/assets/chili.png", w: 360, h: 379, drift: "drift--b" },
  { cls: "leaf1", src: "/assets/leaf.png", w: 360, h: 234, drift: "drift--c" },
  { cls: "orange2", src: "/assets/orange-slice-2.png", w: 413, h: 302, drift: "drift--b" },
  { cls: "chili2", src: "/assets/chili-2.png", w: 245, h: 592, drift: "" },
  { cls: "leaf2", src: "/assets/leaf-2.png", w: 360, h: 300, drift: "drift--c" },
] as const;

export default function FreshSection() {
  return (
    <section className={s.fresh} aria-labelledby="fresh-title">
      {/* Os recortes brotam em cascata quando a faixa entra na tela. */}
      <div className="stage" data-anim-group="0.09">
      {DECOR.map((d) => (
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
        />
      ))}
      </div>

      <div className={`container ${s.inner}`}>
        <h2 className={s.title} id="fresh-title" data-anim="chars">
          Fresco, Quente &amp;
        </h2>
        <p className={s.lead} data-anim="up" data-anim-delay="0.15">
          Massa de fermentação lenta, carne moída na hora e queijo derretendo no
          ponto certo. Simples assim, todos os dias.
        </p>
        <a className={`btn ${s.cta}`} href="#pedir" data-anim="up" data-anim-delay="0.28">
          Pedir Agora
        </a>
      </div>
    </section>
  );
}
