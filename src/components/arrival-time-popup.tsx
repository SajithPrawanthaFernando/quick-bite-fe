"use client"

import { useState } from "react"
import { Clock } from "lucide-react"

export default function ArrivalTimePopup() {
  const [isOpen, setIsOpen] = useState(false)

  const openPopup = () => setIsOpen(true)
  const closePopup = () => setIsOpen(false)

  return (
    <div className="relative">
      {/* Clickable element */}
      <button
  onClick={openPopup}
  className="flex items-center text-sm text-gray-600 hover:text-gray-600 cursor-pointer"
>
  <span className="flex items-center gap-0">
    <span>
      <strong>Earliest arrival :</strong> 30  - 40mins
    </span>
    <Clock className="h-4 w-4 ml-auto" /> {/* This pushes the clock to the right */}
  </span>
</button>


      {/* Popup overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center" onClick={closePopup}>
          {/* Popup card */}
          <div
            className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 overflow-hidden z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with illustration */}
            <div className="bg-amber-100 p-4 relative">
              <button
                onClick={closePopup}
                className="absolute right-4 top-4 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white"
              >
                <span className="text-xl">&times;</span>
              </button>

              <div className="flex justify-center py-4">
                <div className="relative">
                  {/* Clock illustration */}
                  <div className="w-20 h-20 rounded-full border-4 border-black bg-white flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-2 border-black relative">
                      {/* Clock hands */}
                      <div className="absolute top-1/2 left-1/2 w-1 h-6 bg-black -translate-x-1/2 -translate-y-1/2 origin-bottom rotate-45"></div>
                      <div className="absolute top-1/2 left-1/2 w-1 h-4 bg-green-500 -translate-x-1/2 -translate-y-1/2 origin-bottom rotate-[120deg]"></div>
                      {/* Clock markers */}
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-black"
                          style={{
                            top: `${8 + Math.sin((i * 30 * Math.PI) / 180) * 6}px`,
                            left: `${8 + Math.cos((i * 30 * Math.PI) / 180) * 6}px`,
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Food bowl illustration */}
                  <div className="absolute -right-12 bottom-0 w-16 h-12 bg-amber-200 rounded-t-full overflow-hidden">
                    <div className="absolute bottom-0 w-full h-8 bg-amber-300 rounded-t-full">
                      <div className="absolute top-1 left-2 w-2 h-6 bg-white rounded-full rotate-12"></div>
                      <div className="absolute top-1 left-5 w-2 h-6 bg-orange-400 rounded-full -rotate-6"></div>
                      <div className="absolute top-0 left-8 w-2 h-8 bg-green-500 rounded-full rotate-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Earliest arrival</h3>
              <p className="text-gray-700 mb-6">
                Build your cart to get a more precise estimate based on the items you've chosen, real-time conditions,
                and delivery options at checkout. Before you choose items, this number reflects the earliest possible
                arrival time.
              </p>
              <button
                onClick={closePopup}
                className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
