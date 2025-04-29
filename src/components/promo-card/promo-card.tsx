"use client"

import type React from "react"

interface PromoCardProps {
  title: string
  description: string
  promoCode?: string
  buttonText?: string
  backgroundColor: string
  textColor?: string
  buttonAction?: () => void
  validityText?: string
  logoUrl?: string
}

export const PromoCard: React.FC<PromoCardProps> = ({
  title,
  description,
  promoCode,
  buttonText = "Order Now",
  backgroundColor,
  textColor = "text-black",
  buttonAction = () => {},
  validityText,
  logoUrl,
}) => {
  return (
    <div className="rounded-lg overflow-hidden flex relative h-[150px]" style={{ backgroundColor }}>
      <div className="p-4 flex flex-col justify-between w-3/4">
        <div>
          <h3 className={`font-bold text-lg ${textColor}`}>{title}</h3>
          <p className={`text-sm mt-1 ${textColor} opacity-90`}>{description}</p>
          {validityText && <p className={`text-xs mt-2 ${textColor} opacity-80`}>{validityText}</p>}
          {promoCode && (
            <div className="mt-2">
              <p className={`text-sm ${textColor}`}>
                Use Promo Code: <span className="font-bold">{promoCode}</span>
              </p>
            </div>
          )}
        </div>
        {buttonText && (
          <button
            onClick={buttonAction}
            
            className="mt-2 w-fit px-4 py-1 h-8 bg-white hover:bg-gray-100 text-black rounded-full "
          >
            {buttonText}
          </button>
        )}
      </div>
      {logoUrl && (
        <div className="absolute right-0 bottom-0 w-1/3 h-full flex items-end justify-end">
          <img src={logoUrl || "/placeholder.svg"} alt="Promo" className="object-contain max-h-full" />
        </div>
      )}
    </div>
  )
}
