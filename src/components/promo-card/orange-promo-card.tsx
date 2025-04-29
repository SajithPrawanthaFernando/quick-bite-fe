import type React from "react"
import { PromoCard } from "./promo-card"


interface OrangePromoCardProps {
  title?: string
  description?: string
  buttonText?: string
  buttonAction?: () => void
  logoUrl?: string
}

export const OrangePromoCard: React.FC<OrangePromoCardProps> = ({
  title = "Save on Selected Items*",
  description = "Enjoy exclusive offers from Full'r Burger",
  buttonText = "Order Now",
  buttonAction = () => {},
  logoUrl = "/placeholder.svg?height=120&width=120",
}) => {
  return (
    <PromoCard
      title={title}
      description={description}
      buttonText={buttonText}
      backgroundColor="#FFA500"
      textColor="text-black"
      buttonAction={buttonAction}
      logoUrl={logoUrl}
    />
  )
}
