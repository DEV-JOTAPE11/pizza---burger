import Image from "next/image";
import TornEdge from "./TornEdge";
import s from "./Hero.module.css";

/**
 * A entrada do herói é feita em CSS puro, e não pelo GSAP: ela precisa
 * começar na primeira pintura, antes da hidratação do React, senão a
 * primeira tela ficaria em branco esperando o JavaScript. Cada elemento
 * carrega o seu atraso em `--d`, e a classe `.motion` no <html> é quem
 * autoriza tudo isso a rodar.
 */
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
          <p
            className={`enter ${s.eyebrow}`}
            style={{ "--d": "0.15s" } as React.CSSProperties}
          >
            Feito para dar fome
          </p>
          <h1
            className={`enter enter--blur ${s.title}`}
            id="hero-title"
            style={{ "--d": "0.25s" } as React.CSSProperties}
          >
            <em>Pizza &amp;</em>
            Burger
          </h1>
          <p
            className={`enter ${s.lead}`}
            style={{ "--d": "0.62s" } as React.CSSProperties}
          >
            Ingredientes frescos, sabores marcantes e aquele pedido que você vai
            querer repetir.
          </p>
          <a
            className={`btn enter ${s.cta}`}
            href="#pedir"
            style={{ "--d": "0.76s" } as React.CSSProperties}
          >
            Pedir Agora
          </a>
        </div>

        {/* A animação vai na imagem, não no wrapper: é o wrapper que carrega
            o `scaleY` da composição, e um `transform` animado o apagaria. */}
        <div className={s.pizza}>
          <Image
            className="enter enter--rise"
            style={{ "--d": "0.3s" } as React.CSSProperties}
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
            className="enter enter--rise"
            style={{ "--d": "0.45s" } as React.CSSProperties}
            src="/assets/burger-hero.png"
            alt="Hambúrguer artesanal com dois hambúrgueres, queijo cheddar, alface e tomate"
            width={1300}
            height={1413}
            priority
            sizes="(max-width: 700px) 66vw, 580px"
          />
        </div>

        <Image
          className={`floater drift enter--pop ${s.tomato}`}
          style={{ "--d": "1s" } as React.CSSProperties}
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
