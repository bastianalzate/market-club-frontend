import Image from "next/image";

interface BannerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export default function Banner({ 
  src, 
  alt, 
  width = 1920, 
  height = 600, 
  priority = false,
  className = "w-full h-auto object-cover"
}: BannerProps) {
  return (
    <div className="w-full">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
      />
    </div>
  );
}
