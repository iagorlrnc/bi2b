import { FaWhatsapp } from "react-icons/fa"

const WHATSAPP_URL = "https://wa.me/556392812239"

export default function WhatsAppFloatingButton() {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-16 w-16 items-center justify-center rounded-full border border-[#7ee7ff]/15 bg-gradient-to-br from-[#0d6084] to-[#0a4a62] text-white shadow-[0_14px_40px_rgba(13,96,132,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(13,96,132,0.34)]"
        aria-label="Falar no WhatsApp"
      >
        <FaWhatsapp size={30} />
      </a>
    </div>
  )
}
