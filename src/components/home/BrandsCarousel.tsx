"use client";

// Mock data para logos de marcas de cerveza
const brandLogos = [
  {
    id: 1,
    name: "Logo 1",
    logo: "https://cdn.rareblocks.xyz/collection/celebration/images/logos/1/logo-1.png",
    alt: "Logo 1",
  },
  {
    id: 2,
    name: "Logo 2",
    logo: "https://cdn.rareblocks.xyz/collection/celebration/images/logos/1/logo-2.png",
    alt: "Logo 2",
  },
  {
    id: 3,
    name: "Logo 3",
    logo: "https://cdn.rareblocks.xyz/collection/celebration/images/logos/1/logo-3.png",
    alt: "Logo 3",
  },
  {
    id: 4,
    name: "Logo 4",
    logo: "https://cdn.rareblocks.xyz/collection/celebration/images/logos/1/logo-4.png",
    alt: "Logo 4",
  },
  {
    id: 5,
    name: "Logo 5",
    logo: "https://cdn.rareblocks.xyz/collection/celebration/images/logos/1/logo-5.png",
    alt: "Logo 5",
  },
  {
    id: 6,
    name: "Logo 6",
    logo: "https://cdn.rareblocks.xyz/collection/celebration/images/logos/1/logo-6.png",
    alt: "Logo 6",
  },
];

export default function BrandsCarousel() {
  return (
    <section className="py-10 bg-gray-50 sm:py-16 lg:py-24">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid items-center grid-cols-2 gap-10 sm:gap-y-16 sm:grid-cols-3 xl:grid-cols-6">
          {brandLogos.map((brand) => (
            <div key={brand.id}>
              <img
                className="object-contain w-auto mx-auto h-14"
                src={brand.logo}
                alt={brand.alt}
                loading="lazy"
                onError={(e) => {
                  // Replace with a placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='80' viewBox='0 0 200 80'%3E%3Crect width='200' height='80' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='12' fill='%236b7280'%3E${brand.name}%3C/text%3E%3C/svg%3E`;
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
