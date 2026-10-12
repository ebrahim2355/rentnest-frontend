"use client";

import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PropertyImageProps {
  src: string | undefined;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
}

const PropertyImage = ({ src, alt, sizes, preload = false, className }: PropertyImageProps) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={cn("flex size-full flex-col items-center justify-center gap-2 bg-muted text-muted-foreground", className)}>
        <ImageOff className="size-6" />
        <span className="text-xs">No photo</span>
      </div>
    );
  }

  return <Image src={src} alt={alt} fill sizes={sizes} preload={preload} onError={() => setFailed(true)} className={cn("object-cover", className)} />;
};

export default PropertyImage;
