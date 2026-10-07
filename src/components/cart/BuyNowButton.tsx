import { Button } from "@/components/ui/Button";
import { buildProductWhatsAppUrl } from "@/lib/whatsapp";

type WhatsAppProduct = {
  name: string;
  slug: string;
  priceCents: number;
};

export function BuyNowButton({ item, sold }: { item: WhatsAppProduct; sold?: boolean }) {
  if (sold) return null;

  return (
    <Button
      href={buildProductWhatsAppUrl(item)}
      variant="ghost"
      className="w-full"
      target="_blank"
      rel="noopener noreferrer"
    >
      Comprar pelo WhatsApp
    </Button>
  );
}
