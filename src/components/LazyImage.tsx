"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  rootMargin = "250px",
  priority = false,
  ...props
}: LazyImageProps) {
  const [isVisible, setIsVisible] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const prevSrcRef = useRef(src);

  // If priority changes or is true, become visible immediately
  useEffect(() => {
    if (priority) {
      setIsVisible(true);
    }
  }, [priority]);

  // Observer for lazy loading
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
        // threshold: 0 ensures any intersecting boundary triggers visibility, even on 0px elements
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(current);
        }
      },
      {
        rootMargin,
        threshold: 0,
      }
    );

    observer.observe(current);

    return () => {
      observer.disconnect();
    };
  }, [priority, isVisible, rootMargin]);

  // Check if image is already completed in browser cache
  const checkImgComplete = useCallback((img: HTMLImageElement | null) => {
    if (!img) return;
    if (img.complete) {
      if (img.naturalWidth > 0) {
        setIsLoaded(true);
        setHasError(false);
      } else if (img.naturalWidth === 0 && img.src) {
        setIsLoaded(true);
        setHasError(true);
      }
    }
  }, []);

  // Callback ref when the img DOM node mounts or updates
  const handleImgRef = useCallback(
    (node: HTMLImageElement | null) => {
      imgRef.current = node;
      checkImgComplete(node);
    },
    [checkImgComplete]
  );

  // When src changes, only reset if src is actually different
  useEffect(() => {
    if (prevSrcRef.current !== src) {
      prevSrcRef.current = src;
      setIsLoaded(false);
      setHasError(false);
    }
    checkImgComplete(imgRef.current);
  }, [src, isVisible, checkImgComplete]);

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
          ref={handleImgRef}
          src={src}
          alt={alt}
          onLoad={() => {
            setIsLoaded(true);
            setHasError(false);
          }}
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
