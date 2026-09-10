import s from "./Header.module.css";

const LINKS = ["Início", "Cardápio", "Pizzas", "Burgers", "Sobre"];

/**
 * A barra desce em cascata junto com o herói. Como ela está na primeira
 * tela, a entrada é a mesma de lá: CSS puro com o atraso em `--d`.
 */
export default function Header() {
  return (
    <header className={s.header}>
      <div className={`container ${s.bar}`}>
      <div
        className={`enter enter--down ${s.logo}`}
        style={{ "--d": "0.08s" } as React.CSSProperties}
      >
        <span>Forno</span>
        <span>&amp; Brasa</span>
      </div>

      <nav className={s.nav} aria-label="Navegação principal">
        {LINKS.map((label, i) => (
          <a
            key={label}
            className={`enter enter--down ${s.link}`}
            style={{ "--d": `${0.2 + i * 0.07}s` } as React.CSSProperties}
            href="#"
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        className={`enter enter--down ${s.burgerMenu}`}
        style={{ "--d": "0.55s" } as React.CSSProperties}
        type="button"
        aria-label="Abrir menu"
      >
        <i /><i /><i />
      </button>

      <a
        className={`btn btn--pill enter enter--down ${s.cta}`}
        style={{ "--d": "0.55s" } as React.CSSProperties}
        href="#pedir"
      >
        Pedir Agora
      </a>
      </div>
    </header>
  );
}
