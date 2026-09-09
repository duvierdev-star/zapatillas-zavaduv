"use client";

import { useEffect, useRef, useState } from "react";

export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  rootMargin?: string;
  priority?: boolean;
}

export function LazyImage({
  src,
  alt,
  className = "",
  wrapperClassName = "h-full w-full",
  rootMargin = "150px",
  priority = false,
  ...props
}: LazyImageProps) {
  const [isVisible, setIsVisible] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (priority || isVisible) return;

    const current = containerRef.current;
    if (!current) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(current);
        }
      },
      {
        rootMargin,
        threshold: 0.01,
      }
    );

    observer.observe(current);

    return () => {
      observer.disconnect();
    };
  }, [priority, isVisible, rootMargin]);

  // Reset loading state if src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${wrapperClassName}`}
    >
      {/* Skeleton mientras no se haya cargado completamente la imagen */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-[#e6e2d6] animate-pulse pointer-events-none" />
      )}

      {isVisible ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setIsLoaded(true);
            setHasError(true);
          }}
          className={`${className} ${
            isLoaded ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          {...props}
        />
      ) : null}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#eeeae0] text-xs font-semibold text-[#8c887d]">
          Sin foto
        </div>
      )}
    </div>
  );
}
