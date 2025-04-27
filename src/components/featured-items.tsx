"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface FeaturedItem {
  _id: string
  name: string
  price: number
  image?: string
  isAvailable: boolean
  category: string
  rating: number
  reviews: number
  rank: number
}

interface FeaturedItemsProps {
  items: FeaturedItem[]
  onAddItem: (item: FeaturedItem) => void
}

export default function FeaturedItems({ items, onAddItem }: FeaturedItemsProps) {
  const [scrollPosition, setScrollPosition] = useState(0)

  const scrollLeft = () => {
    const container = document.getElementById("featured-items-container")
    if (container) {
      const newPosition = Math.max(scrollPosition - 300, 0)
      container.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    }
  }

  const scrollRight = () => {
    const container = document.getElementById("featured-items-container")
    if (container) {
      const newPosition = Math.min(scrollPosition + 300, container.scrollWidth - container.clientWidth)
      container.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    }
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Featured items</h2>
        <div className="flex space-x-2">
          <button
            onClick={scrollLeft}
            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollRight}
            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        id="featured-items-container"
        className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => (
          <div key={item._id} className="flex-shrink-0 w-[220px]">
            <div className="relative rounded-lg overflow-hidden">
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-[180px] object-cover" />
              <div className="absolute top-2 left-2">
                <span
                  className={`px-2 py-1 text-xs font-medium text-white rounded-md ${
                    item.rank === 1 ? "bg-green-600" : item.rank === 2 ? "bg-green-500" : "bg-green-400"
                  }`}
                >
                  #{item.rank} most liked
                </span>
              </div>
              <button
                className="absolute bottom-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
                onClick={() => onAddItem(item)}
                aria-label={`Add ${item.name} to cart`}
              >
                <span className="text-xl font-bold">+</span>
              </button>
            </div>
            <div className="mt-2">
              <h3 className="font-medium text-sm">{item.name}</h3>
              <div className="flex justify-between items-center mt-1">
                <span className="font-bold">LKR {item.price.toFixed(2)}</span>
                <div className="flex items-center">
                  <span className="text-xs text-gray-600">
                    {item.rating}% ({item.reviews})
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
