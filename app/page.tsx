import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FreshSection from "@/components/FreshSection";
import BurgerShowcase from "@/components/BurgerShowcase";
import ProductSection from "@/components/ProductSection";

export default function Home() {
  return (
    <main className="canvas">
      <Hero>
        <Header />
      </Hero>
      <FreshSection />
      <BurgerShowcase />
      <ProductSection />
    </main>
  );
}
