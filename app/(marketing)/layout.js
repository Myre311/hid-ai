import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";

export default function MarketingLayout({ children }) {
  return (
    <div className="bg-background">
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
