export default function LegalWarning() {
  return (
    <div
      className="flex items-center justify-center w-full"
      style={{
        height: "52px",
        backgroundColor: "#000000",
      }}
    >
      <p
        className="text-center text-white px-4"
        style={{
          fontFamily: "var(--font-inter)",
          fontWeight: 400,
          fontSize: "16px",
          lineHeight: "100%",
          letterSpacing: "0%",
        }}
      >
        El exceso de alcohol es perjudicial para la salud. Ley 30 de 1986.
        Prohíbase el expendio de bebidas embriagantes a menores de edad y
        mujeres embarazadas. <strong>Ley 124 de 1994.</strong>
      </p>
    </div>
  );
}
