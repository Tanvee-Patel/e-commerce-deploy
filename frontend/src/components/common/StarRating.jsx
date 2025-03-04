import React from 'react'
import { Button } from '../ui/button'
import { Star } from 'lucide-react'

const StarRating = ({ rating, handleRatingChange }) => {
   return (
      <div className="flex gap-1">
         {[1, 2, 3, 4, 5].map((star) => (
            <Button
               key={star}
               className={`p-2 transition-colors ${star <= rating ? 'text-yellow-400 ' : 'text-black hover:bg-primary hover:text-primary-foreground'}`}
               variant="outline"
               size="icon"
               onClick={() => handleRatingChange(star)}>
               <Star
                  className={`w-6 h-6 ${star <= rating ? 'fill-yellow-400' : 'fill-gray-400 stroke-gray-400'
                     }`} />
            </Button>
         ))}
      </div>
   )
}

export default StarRating