import Image from "next/image";
import s from "./ProductCard.module.css";

export type Product = {
  name: string;
  desc: string;
  price: string;
  src: string;
  w: number;
  h: number;
};

export default function ProductCard({ name, desc, price, src, w, h }: Product) {
  return (
    <article className={s.card} data-anim="up">
      <div className={s.thumb}>
        <Image
          src={src}
          alt={name}
          width={w}
          height={h}
          loading="lazy"
          sizes="(max-width: 700px) 50vw, 200px"
        />
      </div>
      <h3 className={s.name}>{name}</h3>
      <p className={s.desc}>{desc}</p>
      <div className={s.foot}>
        <span className={s.price}>{price}</span>
        <button className={s.action} type="button" aria-label={`Adicionar ${name} ao pedido`}>
          <svg viewBox="0 0 12 12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 1.5v9M1.5 6h9" />
          </svg>
        </button>
      </div>
    </article>
  );
}
