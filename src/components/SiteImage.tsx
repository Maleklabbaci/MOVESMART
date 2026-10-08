import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { ImageOff } from "lucide-react";
export function SiteImage({
  src,
  alt,
  className = "",
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (!src || failed)
    return (
      <div
        className={`flex items-center justify-center bg-neutral-500/10 ${className}`}
        role="img"
        aria-label={alt || "Image unavailable"}
      >
        <ImageOff className="h-8 w-8 opacity-30" aria-hidden="true" />
      </div>
    );
  return (
    <img
      {...props}
      src={src}
      alt={alt || ""}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
