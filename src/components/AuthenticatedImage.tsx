import React, { useEffect, useState } from "react";
import { AlertCircle, HelpCircle, Loader2 } from "lucide-react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AuthenticatedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallbackClassName?: string;
}

export const AuthenticatedImage: React.FC<AuthenticatedImageProps> = ({
  src,
  alt,
  className,
  fallbackClassName,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!src) {
      setLoading(false);
      setError(true);
      return;
    }

    let isMounted = true;
    let objectUrl: string | null = null;

    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(false);

        const token = localStorage.getItem("access_token");
        const headers: HeadersInit = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(src, { headers });
        if (!response.ok) throw new Error("Failed to load image");

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);

        if (isMounted) {
          setImageSrc(objectUrl);
        }
      } catch {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  const baseFallbackClass =
    "w-full h-full min-w-0 min-h-0 flex items-center justify-center shrink-0 transition-all duration-200 rounded-inherit";

  if (loading) {
    return (
      <div
        className={cn(baseFallbackClass, "text-blue-400", fallbackClassName)}
      >
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(baseFallbackClass, "text-red-400", fallbackClassName)}>
        <AlertCircle className="w-4 h-4" />
      </div>
    );
  }

  if (!imageSrc) {
    return (
      <div
        className={cn(baseFallbackClass, "text-slate-400", fallbackClassName)}
      >
        <HelpCircle className="w-4 h-4" />
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      {...props}
      className={cn(
        "w-full h-full object-cover shrink-0 rounded-inherit",
        className,
      )}
    />
  );
};
