import type React from "react"
import { PromoCard } from "./promo-card"


interface GreyPromoCardProps {
  title?: string
  description?: string
  promoCode?: string
  validityText?: string
  logoUrl?: string
}

export const GreyPromoCard: React.FC<GreyPromoCardProps> = ({
  title = "65% Off for New Users",
  description = "with Commercial Bank Cards",
  promoCode = "CB650",
  validityText = "Valid on the first 2 orders until 30 April*",
  logoUrl = "/placeholder.svg?height=80&width=120",
}) => {
  return (
    <PromoCard
      title={title}
      description={description}
      promoCode={promoCode}
      backgroundColor="#F0F0F0"
      textColor="text-black"
      validityText={validityText}
      logoUrl={logoUrl}
      buttonText=""
    />
  )
}
