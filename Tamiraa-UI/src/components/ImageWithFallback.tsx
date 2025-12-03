import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
}

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" font-size="20" fill="%236b7280" text-anchor="middle" dominant-baseline="middle"%3EProduct Image%3C/text%3E%3C/svg%3E';

export default function ImageWithFallback({ src, alt, className, onError }: ImageWithFallbackProps) {
  const [imageSrc, setImageSrc] = useState(src);

  const handleError = () => {
    console.warn(`Failed to load image: ${src}`);
    setImageSrc(PLACEHOLDER_IMAGE);
    onError?.();
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}
