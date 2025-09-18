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
      description: "Botellas que inspiran: cada entrega es una invitación a descubrir cervezas únicas que sorprenden y encantan, lejos de lo convencional. Elige uno de nuestros planes y comienza tu viaje por los sabores del mundo."
    },
    subscriptionSection: {
      plans: [
        {
          id: "curioso-cervecero",
          name: "Curioso Cervecero",
          price: "$150.000 / mes.",
          description: "Para quienes quieren iniciar en el mundo cervecero sin complicaciones. Tres cervezas seleccionadas de distintos estilos y países, siempre con propuestas equilibradas y fáciles de disfrutar. Algunas veces, la caja puede incluir un licor especial para ampliar la experiencia.",
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
          description: "Selección sin límites. Tres cervezas con lo mejor del mundo cervecero y los destilados, ediciones especiales, etiquetas de culto y, a veces, un licor experimental de encontrar.",
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
    }
  };
};
