interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description: string;
  titleStyle?: React.CSSProperties;
  descriptionClassName?: string;
  containerClassName?: string;
}

export default function HeroSection({
  title,
  subtitle,
  description,
  titleStyle = {
    fontFamily: "var(--font-oswald)",
    fontSize: "64px",
    fontWeight: 700,
  },
  descriptionClassName = "text-[#F5F5F5] font-inter text-[32px] leading-[34px] text-left",
  containerClassName = "bg-black text-white py-16 px-4",
}: HeroSectionProps) {
  return (
    <div className={containerClassName}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Título */}
          <div>
            <h2 className="text-white mb-8 leading-tight" style={titleStyle}>
              {title}
              {subtitle && <span className="block">{subtitle}</span>}
            </h2>
          </div>

          {/* Texto descriptivo */}
          <div>
            <p className={descriptionClassName}>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
