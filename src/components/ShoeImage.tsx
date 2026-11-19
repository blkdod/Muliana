import { useState } from 'react';
import { Footprints } from 'lucide-react';

interface ShoeImageProps {
  src: string;
  alt: string;
  brand?: string;
  className?: string;
}

export function ShoeImage({ src, alt, brand, className = '' }: ShoeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-zinc-100 text-zinc-400 select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <Footprints className="w-8 h-8 mb-2 stroke-[1.5]" />
        <span className="text-xs font-medium text-zinc-500 px-3 text-center">
          {brand ? `${brand} · ` : ''}
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
}
