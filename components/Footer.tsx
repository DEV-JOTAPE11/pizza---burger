import s from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={`container ${s.footer}`} data-anim="fade">
      <span className={s.brand}>Forno &amp; Brasa</span>
      <span>© 2026 — Todos os direitos reservados</span>
    </footer>
  );
}
