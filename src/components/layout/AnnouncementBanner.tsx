"use client";

import { useEffect, useState } from "react";

export default function AnnouncementBanner() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div
      className="w-full flex items-center justify-center"
      style={{
        height: "60px",
        backgroundColor: "#B48C2B",
      }}
    >
      <p
        className="text-black text-center"
        style={{
          fontFamily: "var(--font-oswald)",
          fontWeight: 700,
          fontSize: "14px",
          lineHeight: "100%",
          letterSpacing: "9px",
          textTransform: "capitalize",
        }}
      >
        ENVÍOS A NIVEL NACIONAL
      </p>
    </div>
  );
}
