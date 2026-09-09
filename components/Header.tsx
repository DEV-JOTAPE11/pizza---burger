import s from "./Header.module.css";

const LINKS = ["Início", "Cardápio", "Pizzas", "Burgers", "Sobre"];

export default function Header() {
  return (
    <header className={s.header}>
      <div className={`container ${s.bar}`}>
      <div className={s.logo}>
        <span>Forno</span>
        <span>&amp; Brasa</span>
      </div>

      <nav className={s.nav} aria-label="Navegação principal">
        {LINKS.map((label) => (
          <a key={label} className={s.link} href="#">
            {label}
          </a>
        ))}
      </nav>

      <button className={s.burgerMenu} type="button" aria-label="Abrir menu">
        <i /><i /><i />
      </button>

      <a className={`btn btn--pill ${s.cta}`} href="#pedir">
        Pedir Agora
      </a>
      </div>
    </header>
  );
}
