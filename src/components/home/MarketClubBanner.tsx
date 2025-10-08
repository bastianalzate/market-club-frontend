"use client";

interface MarketClubBannerProps {
  backgroundColor?: string;
  textColor?: string;
}

export default function MarketClubBanner({
  backgroundColor = "#B58E31",
  textColor = "#FFFFFF",
}: MarketClubBannerProps) {
  return (
    <section
      className="overflow-hidden"
      style={{ backgroundColor, height: "54px" }}
    >
      <div className="relative h-full flex items-center">
        {/* Tira horizontal con MARKET CLUB repetido */}
        <div className="whitespace-nowrap overflow-hidden w-full">
          <div className="inline-block animate-scroll">
            {/* Primera secuencia */}
            <span
              className="uppercase mx-12 inline-block"
              style={{
                color: textColor,
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
                fontStyle: "bold",
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "9px",
                verticalAlign: "middle",
                textTransform: "capitalize",
              }}
            >
              MARKET CLUB
            </span>
            <span
              className="uppercase mx-12 inline-block"
              style={{
                color: textColor,
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
                fontStyle: "bold",
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "9px",
                verticalAlign: "middle",
                textTransform: "capitalize",
              }}
            >
              MARKET CLUB
            </span>
            <span
              className="uppercase mx-12 inline-block"
              style={{
                color: textColor,
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
                fontStyle: "bold",
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "9px",
                verticalAlign: "middle",
                textTransform: "capitalize",
              }}
            >
              MARKET CLUB
            </span>
            <span
              className="uppercase mx-12 inline-block"
              style={{
                color: textColor,
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
                fontStyle: "bold",
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "9px",
                verticalAlign: "middle",
                textTransform: "capitalize",
              }}
            >
              MARKET CLUB
            </span>
            <span
              className="uppercase mx-12 inline-block"
              style={{
                color: textColor,
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
                fontStyle: "bold",
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "9px",
                verticalAlign: "middle",
                textTransform: "capitalize",
              }}
            >
              MARKET CLUB
            </span>
            <span
              className="uppercase mx-12 inline-block"
              style={{
                color: textColor,
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
                fontStyle: "bold",
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "9px",
                verticalAlign: "middle",
                textTransform: "capitalize",
              }}
            >
              MARKET CLUB
            </span>
            {/* Segunda secuencia (duplicada para scroll infinito) */}
            <span
              className="uppercase mx-12 inline-block"
              style={{
                color: textColor,
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
                fontStyle: "bold",
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "9px",
                verticalAlign: "middle",
                textTransform: "capitalize",
              }}
            >
              MARKET CLUB
            </span>
            <span
              className="uppercase mx-12 inline-block"
              style={{
                color: textColor,
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
                fontStyle: "bold",
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "9px",
                verticalAlign: "middle",
                textTransform: "capitalize",
              }}
            >
              MARKET CLUB
            </span>
            <span
              className="uppercase mx-12 inline-block"
              style={{
                color: textColor,
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
                fontStyle: "bold",
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "9px",
                verticalAlign: "middle",
                textTransform: "capitalize",
              }}
            >
              MARKET CLUB
            </span>
            <span
              className="uppercase mx-12 inline-block"
              style={{
                color: textColor,
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
                fontStyle: "bold",
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "9px",
                verticalAlign: "middle",
                textTransform: "capitalize",
              }}
            >
              MARKET CLUB
            </span>
            <span
              className="uppercase mx-12 inline-block"
              style={{
                color: textColor,
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
                fontStyle: "bold",
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "9px",
                verticalAlign: "middle",
                textTransform: "capitalize",
              }}
            >
              MARKET CLUB
            </span>
            <span
              className="uppercase mx-12 inline-block"
              style={{
                color: textColor,
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
                fontStyle: "bold",
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "9px",
                verticalAlign: "middle",
                textTransform: "capitalize",
              }}
            >
              MARKET CLUB
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
