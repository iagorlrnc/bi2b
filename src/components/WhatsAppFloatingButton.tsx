import { FaWhatsapp } from "react-icons/fa"

const WHATSAPP_URL = "https://wa.me/556392812239"

interface WhatsAppFloatingButtonProps {
  higherOnMobile?: boolean
}

export default function WhatsAppFloatingButton({ higherOnMobile = false }: WhatsAppFloatingButtonProps) {
  return (
    <div className={`fixed ${higherOnMobile ? "bottom-24 lg:bottom-6" : "bottom-6"} right-6 z-[9999] flex items-center gap-3`}>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-gradient-to-r from-[#0d6084] to-[#0a4a62] text-white shadow-[0_12px_40px_rgba(13,96,132,0.32)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(13,96,132,0.42)]"
        aria-label="Falar no WhatsApp"
      >
        <FaWhatsapp size={24} />
      </a>
    </div>
  )
}
