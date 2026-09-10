import TornEdge from "./TornEdge";
import { GRAIN } from "./texture";
import s from "./Footer.module.css";

const MENU = ["Pizzas de forno", "Burgers artesanais", "Acompanhamentos", "Sobremesas", "Bebidas geladas"];

const HOUSE = ["Sobre a casa", "Nossas lojas", "Trabalhe conosco", "Festas e eventos"];

const HOURS = [
  { day: "Ter — Qui", time: "18h às 23h" },
  { day: "Sex — Sáb", time: "18h às 00h" },
  { day: "Domingo", time: "18h às 22h" },
  { day: "Segunda", time: "fechado", closed: true },
];

/**
 * Rodapé amarelo com o restante da informação da casa: marca, cardápio,
 * institucional, horários e contato, mais a barra legal no fim.
 */
export default function Footer() {
  return (
    <footer className={s.footer}>
      <TornEdge className={s.tear} variant="D" color="var(--wine-800)" height={54} flip />

      <div
        className={s.grain}
        style={{ "--grain": GRAIN } as React.CSSProperties}
        aria-hidden="true"
      />

      <div className={`container ${s.inner}`} data-anim-group="0.1" data-anim-start="top 92%">
        <div data-anim="up">
          <div className={s.brand}>
            <span>Forno</span>
            <span>&amp; Brasa</span>
          </div>
          <p className={s.tagline}>
            Massa de fermentação lenta, carne moída na hora e forno sempre
            aceso. Desde 2019 alimentando o bairro com fogo alto e pouca
            paciência para pedido frio.
          </p>

          <div className={s.social}>
            <a className={s.socialLink} href="#" aria-label="Instagram do Forno &amp; Brasa">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5.5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a className={s.socialLink} href="#" aria-label="WhatsApp do Forno &amp; Brasa">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5v-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2A5.2 5.2 0 0 0 8.3 15a11.8 11.8 0 0 0 4.5 3.1c1.7.6 2 .5 2.4.5a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z" />
              </svg>
            </a>
            <a className={s.socialLink} href="#" aria-label="Facebook do Forno &amp; Brasa">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6a22 22 0 0 0-2.4-.12c-2.38 0-4 1.45-4 4.12v2.3H7.6V13h2.7v8Z" />
              </svg>
            </a>
          </div>
        </div>

        <div data-anim="up">
          <h3 className={s.colTitle}>Cardápio</h3>
          <ul className={s.list}>
            {MENU.map((item) => (
              <li key={item}>
                <a href="#pedir">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div data-anim="up">
          <h3 className={s.colTitle}>A casa</h3>
          <ul className={s.list}>
            {HOUSE.map((item) => (
              <li key={item}>
                <a href="#">{item}</a>
              </li>
            ))}
          </ul>

          <h3 className={s.colTitle} style={{ marginTop: 22 }}>
            Horário
          </h3>
          <ul className={s.list}>
            {HOURS.map((h) => (
              <li key={h.day} className={s.hours}>
                <b>{h.day}</b>
                <span className={h.closed ? s.closed : undefined}>{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div data-anim="up">
          <h3 className={s.colTitle}>Fale com a gente</h3>
          <span className={`${s.contactLine} ${s.phone}`}>(11) 4002-8922</span>
          <span className={s.contactLine} style={{ marginTop: 10 }}>
            Rua das Brasas, 218 — Vila Guaraná
            <br />
            São Paulo, SP — 05432-010
          </span>
          <span className={s.contactLine} style={{ marginTop: 10 }}>
            alo@fornoebrasa.com.br
          </span>
          <span className={s.contactLine} style={{ marginTop: 10 }}>
            Entregamos num raio de 7 km. Fora dessa área, retirada no balcão.
          </span>
        </div>
      </div>

      <div className={`container ${s.bar}`}>
        <span>© 2026 Forno &amp; Brasa — Todos os direitos reservados</span>
        <span className={s.legal}>
          <a href="#">Política de privacidade</a>
          <a href="#">Termos de uso</a>
          <a href="#">Trocas e devoluções</a>
        </span>
      </div>
    </footer>
  );
}
