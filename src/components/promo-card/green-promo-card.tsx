import type React from "react"
import { PromoCard } from "./promo-card"


interface GreenPromoCardProps {
  title?: string
  description?: string
  promoCode?: string
  validityText?: string
  logoUrl?: string
}

export const GreenPromoCard: React.FC<GreenPromoCardProps> = ({
  title = "40% Off for New Users*",
  description = "Valid on your first 2 orders above Rs. 1,000 from selected merchants...",
  promoCode = "123SL",
  validityText = "",
  logoUrl = "/placeholder.svg?height=120&width=120",
}) => {
  return (
    <PromoCard
      title={title}
      description={description}
      promoCode={promoCode}
      backgroundColor="#4CAF50"
      textColor="text-white"
      validityText={validityText}
      logoUrl={logoUrl}
      buttonText=""
    />
  )
}
