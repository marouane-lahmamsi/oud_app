import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntensityBadgeProps {
  intensity: 'low' | 'medium' | 'high';
  showLabel?: boolean;
  className?: string;
}

const intensityConfig = {
  low: {
    label: 'Doux',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    flames: 1,
  },
  medium: {
    label: 'Moyen',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    flames: 2,
  },
  high: {
    label: 'Intense',
    className: 'bg-rose-50 text-rose-700 border-rose-200',
    flames: 3,
  },
};

export function IntensityBadge({ intensity, showLabel = true, className }: IntensityBadgeProps) {
  const config = intensityConfig[intensity];
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      <span className="flex">
        {Array.from({ length: config.flames }).map((_, i) => (
          <Flame
            key={i}
            className={cn(
              'w-3 h-3',
              intensity === 'low' && 'text-emerald-500',
              intensity === 'medium' && 'text-amber-500',
              intensity === 'high' && 'text-rose-500'
            )}
            fill="currentColor"
          />
        ))}
      </span>
      {showLabel && config.label}
    </span>
  );
}
