"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import PropertyImage from "./property-image";

const PropertyGallery = ({ images, title }: { images: string[]; title: string }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-3">
      <div className="relative aspect-video overflow-hidden rounded-2xl border bg-muted">
        <PropertyImage key={images[activeIndex]} src={images[activeIndex]} alt={`${title} photo ${activeIndex + 1}`} sizes="(max-width: 1024px) 100vw, 66vw" preload />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              aria-label={`Show photo ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative aspect-4/3 cursor-pointer overflow-hidden rounded-lg border-2 transition",
                index === activeIndex ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <PropertyImage src={image} alt="" sizes="160px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;
