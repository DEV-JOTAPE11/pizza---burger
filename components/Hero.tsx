import Image from "next/image";
import TornEdge from "./TornEdge";
import s from "./Hero.module.css";

export default function Hero({ children }: { children?: React.ReactNode }) {
  return (
    <section className={s.hero} aria-labelledby="hero-title">
      <div className={s.bokeh} aria-hidden="true" />

      <div className={s.wood} aria-hidden="true">
        <Image
          src="/assets/wood.jpg"
          alt=""
          width={1800}
          height={1200}
          priority
          sizes="100vw"
        />
      </div>

      <div className={s.vignette} aria-hidden="true" />

      {children}

      <div className="stage">
        <div className={s.copy}>
          <p className={s.eyebrow}>Feito para dar fome</p>
          <h1 className={s.title} id="hero-title">
            <em>Pizza &amp;</em>
            Burger
          </h1>
          <p className={s.lead}>
            Ingredientes frescos, sabores marcantes e aquele pedido que você vai
            querer repetir.
          </p>
          <a className={`btn ${s.cta}`} href="#pedir">
            Pedir Agora
          </a>
        </div>

        <div className={s.pizza}>
          <Image
            src="/assets/pizza-hero.png"
            alt="Pizza artesanal recém-saída do forno sobre a mesa de madeira"
            width={1143}
            height={630}
            priority
            sizes="(max-width: 700px) 105vw, 1000px"
          />
        </div>

        <div className={s.burger}>
          <Image
            src="/assets/burger-hero.png"
            alt="Hambúrguer artesanal com dois hambúrgueres, queijo cheddar, alface e tomate"
            width={1300}
            height={1413}
            priority
            sizes="(max-width: 700px) 66vw, 580px"
          />
        </div>

        <Image
          className={`floater drift ${s.tomato}`}
          src="/assets/tomato.png"
          alt=""
          width={360}
          height={377}
          aria-hidden="true"
        />
      </div>

      <TornEdge className={s.tear} variant="A" color="var(--cream)" height={58} />
    </section>
  );
}
