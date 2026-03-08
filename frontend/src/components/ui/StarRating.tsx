import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

const sizeConfig = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  reviewCount,
  className,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {Array.from({ length: maxRating }).map((_, i) => {
          const isFilled = i < fullStars;
          const isHalf = i === fullStars && hasHalfStar;

          return (
            <div key={i} className="relative">
              <Star
                className={cn(
                  sizeConfig[size],
                  'text-stone-300',
                  isFilled && 'text-amber-400 fill-amber-400',
                  isHalf && 'text-stone-300'
                )}
              />
              {isHalf && (
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star className={cn(sizeConfig[size], 'text-amber-400 fill-amber-400')} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm text-stone-600 ml-1">
          {rating.toFixed(1)}
          {reviewCount !== undefined && (
            <span className="text-stone-400"> ({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
}
