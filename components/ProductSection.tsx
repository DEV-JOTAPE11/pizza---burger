import TornEdge from "./TornEdge";
import ProductCard, { type Product } from "./ProductCard";
import Footer from "./Footer";
import { GRUNGE } from "./texture";
import s from "./ProductSection.module.css";

const PRODUCTS: Product[] = [
  {
    name: "Batata Crocante",
    desc: "Dourada por fora, macia por dentro.",
    price: "R$ 18,90",
    src: "/assets/card-fries.jpg",
    w: 700,
    h: 560,
  },
  {
    name: "Burger Clássico",
    desc: "Blend 180g, cheddar e molho da casa.",
    price: "R$ 34,90",
    src: "/assets/card-burger.jpg",
    w: 700,
    h: 498,
  },
  {
    name: "Batata Especial",
    desc: "Com cheddar cremoso e bacon.",
    price: "R$ 26,90",
    src: "/assets/card-fries2.jpg",
    w: 700,
    h: 467,
  },
  {
    name: "Pizza Artesanal",
    desc: "Molho de tomate, muçarela e manjericão.",
    price: "R$ 49,90",
    src: "/assets/card-pizza.jpg",
    w: 700,
    h: 467,
  },
];

const DOTS = ["#F6C453", "#F0A118", "#E8761B", "#DF3727", "#8E1A11", "#2B0808"];

export default function ProductSection() {
  return (
    <section className={s.products} id="pedir" aria-labelledby="products-title">
      <div className="container">
        <p className={s.intro}>
        Combinações preparadas com ingredientes selecionados para entregar muito
        sabor em cada pedido, do primeiro ao último bocado.
      </p>
      </div>

      <div className={`container ${s.head}`}>
        <h2 className={s.title} id="products-title">
          Mais Pedidos
        </h2>
        <div className={s.dots} aria-hidden="true">
          {DOTS.map((c) => (
            <i key={c} style={{ "--c": c } as React.CSSProperties} />
          ))}
        </div>
      </div>

      <div className={s.redzone} aria-hidden="true">
        <div className={s.redInk} style={{ "--grunge": GRUNGE } as React.CSSProperties} />
        <TornEdge className={s.redTear} variant="D" color="var(--red-600)" height={62} flip />
      </div>

      <div className={`container ${s.grid}`}>
        {PRODUCTS.map((p) => (
          <ProductCard key={p.name} {...p} />
        ))}
      </div>

      <Footer />
    </section>
  );
}
