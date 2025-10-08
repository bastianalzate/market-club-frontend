import { MarketClubPageConfig } from '@/types/market-club';

export const useMarketClubConfig = (): MarketClubPageConfig => {
  return {
    banner: {
      src: "/images/market-club/banner.png",
      alt: "Market Club Banner",
      width: 1920,
      height: 600,
      priority: true
    },
    heroSection: {
      title: "¿Qué hace único a",
      subtitle: "Market Club ?",
      description: "Somos tu espacio perfecto para compartir y descubrir los sabores del mundo. Te ofrecemos el mayor catálogo de cervezas globales para vivir experiencias únicas, lejos de lo convencional. Elige uno de nuestros planes e inicia tu viaje. "
    },
    subscriptionSection: {
      plans: [
        {
          id: "curioso-cervecero",
          name: "Curioso Cervecero",
          price: "$150.000 / mes.",
          description: "Para quienes quieren iniciarse en el mundo cervecero sin complicaciones. Incluye tres cervezas seleccionadas de distintos estilos y países, con propuestas equilibradas y fáciles de disfrutar. Ocasionalmente, la caja puede incluir un licor especial para ampliar la experiencia.",
          features: [
            "3 cervezas artesanales o importadas de distintos estilos",
            "Ocasionalmente, un licor del mundo en lugar de una cerveza",
            "Suscripción mensual por un año",
            "Cancela cuando quieras"
          ],
          image: "/images/market-club/corona-beer.png",
          buttonText: "Suscríbete",
          buttonColor: "#B58E31"
        },
        {
          id: "coleccionista-cervecero",
          name: "Coleccionista Cervecero",
          price: "$200.000 / mes.",
          description: "Para quienes ya tienen afinidad con la cerveza y buscan etiquetas con mayor fuerza y personalidad. Una selección que explora estilos más complejos y distintivos según tu carácter. Según la coyuntura del mes, la caja puede incluir un espirituoso premium para empezar a la experiencia.",
          features: [
            "5 cervezas artesanales o importadas de distintos estilos",
            "Ocasionalmente, un licor del mundo en lugar de una cerveza",
            "Suscripción mensual por un año",
            "Cancela cuando quieras"
          ],
          image: "/images/market-club/corona-beer.png",
          buttonText: "Suscríbete",
          buttonColor: "#B58E31",
          imagePosition: 'right'
        },
        {
          id: "maestro-cervecero",
          name: "Maestro Cervecero",
          price: "$200.000 / mes.",
          description: "Selección de Élite. La máxima expresión de lo premium y lo inalcanzable. Recibe tres cervezas de la cúspide del mundo cervecero y los destilados. Cada caja es un manifiesto de exclusividad que incluye etiquetas de culto, ediciones especiales y, ocasionalmente, una botella de licor excepcional seleccionada para llevar la experiencia al nivel de lo sublime.",
          features: [
            "3 cervezas de alta gama o ediciones limitadas",
            "Algunos meses, un espirituoso excepcional en lugar de una cerveza",
            "Suscripción mensual por un año",
            "Cancela cuando quieras"
          ],
          image: "/images/market-club/corona-beer.png",
          buttonText: "Suscríbete",
          buttonColor: "#B58E31",
          imagePosition: 'left'
        }
      ]
    },
    pricingSection: {
      backgroundColor: "#B58E31",
      plans: [
        {
          id: "descuentos-envios",
          name: "Descuentos y envíos",
          price: "$0",
          period: "/ Month",
          description: "Ideal for individuals who need quick access to basic features.",
          features: [
            "20,000+ of PNG & SVG graphics",
            "Access to 100 million stock images",
            "Upload custom icons and fonts",
            "Unlimited Sharing",
            "Upload graphics & video in up to 4k",
            "Unlimited Projects",
            "Instant Access to our design system",
            "Create teams to collaborate on designs"
          ],
          buttonText: "Empieza ahora",
          buttonColor: "#B58E31",
          isHighlighted: false
        },
        {
          id: "vip",
          name: "VIP",
          price: "$25",
          period: "/ Month",
          description: "Ideal for individuals who need advanced features and tools for client work.",
          features: [
            "Invitaciones a catas privadas, degustaciones y eventos exclusivos",
            "Acceso anticipado con precios preferenciales a nuevas colecciones y lanzamientos",
            "Prioridad en reservas para cenas, experiencias gastronómicas y eventos especiales",
            "Eventos exclusivos para regular experiencias gastronómicas por temporadas",
            "Cupones descuentos para regular experiencia en fechas especiales (cumpleaños, aniversarios)"
          ],
          buttonText: "Empieza ahora",
          buttonColor: "#FFFFFF",
          isHighlighted: true
        },
        {
          id: "personalizacion",
          name: "Personalización",
          price: "$100",
          period: "/ Month",
          description: "Ideal for businesses who need personalized services and security for large teams.",
          features: [
            "Atención personalizada por WhatsApp para recibir recomendaciones y ofertas",
            "Personaliza tu caja mensual siguiendo tus gustos y preferencias",
            "Armar un catálogo personal con precio preferencial",
            "Recomendaciones inmediatas y alertas sobre lanzamientos y novedades"
          ],
          buttonText: "Empieza ahora",
          buttonColor: "#B58E31",
          isHighlighted: false
        }
      ]
    }
  };
};
