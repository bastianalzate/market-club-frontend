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
    fontSize: "42px",
    fontWeight: 700,
  },
  descriptionClassName = "text-[#F5F5F5] text-[20px] leading-[26px] text-center",
  containerClassName = "bg-black text-white py-8 px-4",
}: HeroSectionProps) {
  return (
    <div className={containerClassName}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center gap-8 lg:gap-12">
          {/* Título */}
          <div className="text-center">
            <h2
              className="text-white leading-tight text-[30px] sm:text-[42px]"
              style={{
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
              }}
            >
              {title}
              {subtitle && <span className="block">{subtitle}</span>}
            </h2>
          </div>

          {/* Texto descriptivo */}
          <div className="max-w-2xl lg:max-w-3xl w-full">
            <p
              className={`${descriptionClassName} text-center`}
              style={{ fontFamily: "var(--font-lato)", whiteSpace: "pre-line" }}
            >
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
