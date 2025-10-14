"use client";

export default function GiftInfoSection() {
  return (
    <section className="relative py-8 bg-black overflow-hidden">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Lado izquierdo - Texto descriptivo */}
          <div className="lg:pr-8">
            <p
              className="text-white"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "20px",
                lineHeight: "26px",
                letterSpacing: "0px",
                verticalAlign: "middle",
              }}
            >
              En{" "}
              <span
                style={{
                  fontWeight: 700,
                }}
              >
                Market Club
              </span>{" "}
              te ofrecemos una
              <br />
              variedad de cervezas importadas
              <br />
              que podrás disfrutar desde la
              <br />
              comodidad de tu casa.
            </p>
          </div>

          {/* Lado derecho - Pregunta principal */}
          <div className="lg:pl-8">
            <h2
              className="text-white text-right"
              style={{
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
                fontStyle: "Bold",
                fontSize: "42px",
                lineHeight: "56px",
                letterSpacing: "0px",
                verticalAlign: "middle",
              }}
            >
              ¿Cómo comenzar a
              <br />
              armar tu regalo?
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
