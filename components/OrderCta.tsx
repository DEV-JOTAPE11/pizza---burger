import Image from "next/image";
import { GRUNGE } from "./texture";
import s from "./OrderCta.module.css";

const PERKS = [
  "Entrega grátis acima de R$ 60",
  "Retirada no balcão em 15 min",
  "Pagamento na entrega ou pelo Pix",
  "De terça a domingo, das 18h às 23h",
];

/**
 * Faixa vermelha de chamada, entre os cards e o rodapé. Texto e botões à
 * esquerda, o hambúrguer 3D à direita. O fundo é o mesmo campo vermelho
 * com grunge do rodapé da seção de produtos, e o degradê termina em
 * `--wine-800` — a mesma cor que a borda rasgada do rodapé usa para
 * rasgar por cima do amarelo.
 */
export default function OrderCta() {
  return (
    <section className={s.cta} id="pedir-agora" aria-labelledby="cta-title">
      <div
        className={s.grain}
        style={{ "--grunge": GRUNGE } as React.CSSProperties}
        aria-hidden="true"
      />

      <div className={`container ${s.inner}`}>
        <div>
          <p className={s.eyebrow} data-anim="up">
            Entrega quentinha em até 40 minutos
          </p>

          <h2 className={s.title} id="cta-title" data-anim="chars">
            <em>Bateu a fome?</em>
            A gente resolve
          </h2>

          <p className={s.text} data-anim="up" data-anim-delay="0.12">
            Do forno direto para a sua porta. Blend artesanal de 180g, pão
            brioche assado no dia e o molho da casa que ninguém consegue copiar.
            Você escolhe, a gente cuida do resto até a campainha tocar.
          </p>

          <ul className={s.perks} data-anim-group="0.08" data-anim-start="top 88%">
            {PERKS.map((perk) => (
              <li key={perk} data-anim="up">
                <span className={s.check} aria-hidden="true">
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6.4 4.6 9 10 3.2" />
                  </svg>
                </span>
                {perk}
              </li>
            ))}
          </ul>

          <div className={s.actions} data-anim-group="0.1" data-anim-start="top 90%">
            <a className={`btn ${s.primary}`} href="#pedir" data-anim="up">
              Pedir pelo WhatsApp
            </a>
            <a className={s.ghost} href="#pedir" data-anim="up">
              Ver cardápio completo
            </a>
          </div>
        </div>

        <div className={s.art} data-anim="rise" data-anim-start="top 84%">
          <Image
            src="/assets/image.png"
            alt="Hambúrguer artesanal com cheddar, tomate e alface servido sobre tábua de madeira"
            width={1448}
            height={1086}
            loading="lazy"
            sizes="(max-width: 860px) 88vw, 560px"
          />

          <div className={s.badge} aria-hidden="true">
            <span className={s.badgeTop}>A partir de</span>
            <span className={s.badgePrice}>R$ 34</span>
            <span className={s.badgeFoot}>combo completo</span>
          </div>
        </div>
      </div>
    </section>
  );
}
