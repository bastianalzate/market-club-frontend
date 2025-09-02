# 🍺 Market Club - Ecommerce de Cervezas

Market Club es una plataforma de ecommerce especializada en la venta de cervezas artesanales e importadas, construida con Next.js 15, React 19 y TypeScript.

## 🏗️ Arquitectura del Proyecto

### **Estructura Basada en Features**

El proyecto está organizado por dominios de negocio, siguiendo el patrón de arquitectura por features:

```
src/
├── features/           # Lógica de negocio organizada por dominio
│   ├── auth/          # Autenticación y gestión de usuarios
│   ├── products/      # Catálogo de productos (cervezas)
│   ├── cart/          # Carrito de compras
│   ├── checkout/      # Proceso de pago
│   ├── orders/        # Historial de pedidos
│   └── user-profile/  # Perfil del usuario
├── components/         # Componentes compartidos
│   ├── layout/        # Header, Footer, MainLayout
│   ├── shared/        # Componentes UI reutilizables
│   └── home/          # Componentes específicos de la página principal
├── lib/               # Utilidades y helpers
├── types/             # Tipos TypeScript globales
└── app/               # Páginas y rutas (App Router de Next.js)
```

### **Características Principales**

- **Header Persistente**: Navegación principal con logo, menú y acciones del usuario
- **Footer Completo**: Información de la empresa, enlaces útiles y contacto
- **Layout Principal**: Wrapper que envuelve todas las páginas con Header y Footer
- **Responsive Design**: Diseño adaptativo para móviles y desktop
- **Componentes Modulares**: Arquitectura de componentes reutilizables

## 🚀 Tecnologías Utilizadas

- **Framework**: Next.js 15 con App Router
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **State Management**: React Hooks (preparado para implementar Context/Redux)
- **Build Tool**: Turbopack

## 📦 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone [url-del-repositorio]
cd market-club-frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar en producción
npm start
```

## 🔧 Configuración del Entorno

### Variables de Entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```env
# WordPress Headless API
NEXT_PUBLIC_WORDPRESS_API_URL=https://tu-wordpress.com/wp-json/wp/v2
NEXT_PUBLIC_WORDPRESS_SITE_URL=https://tu-wordpress.com

# Configuración de la aplicación
NEXT_PUBLIC_APP_NAME=Market Club
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🎯 Próximos Pasos

### **Fase 1: Estructura Base** ✅

- [x] Arquitectura por features
- [x] Layout principal con Header y Footer
- [x] Componentes base (Button, LoadingSpinner)
- [x] Página principal con HeroSection
- [x] Tipos TypeScript para productos y carrito

### **Fase 2: Funcionalidades Core**

- [ ] Integración con WordPress Headless API
- [ ] Sistema de autenticación
- [ ] Gestión de estado global (Context/Redux)
- [ ] Páginas de productos y categorías
- [ ] Sistema de carrito funcional

### **Fase 3: Ecommerce Completo**

- [ ] Proceso de checkout
- [ ] Gestión de pedidos
- [ ] Sistema de pagos
- [ ] Panel de usuario
- [ ] Sistema de reseñas

### **Fase 4: Optimizaciones**

- [ ] SEO y meta tags
- [ ] Performance y lazy loading
- [ ] Testing (Jest, React Testing Library)
- [ ] PWA capabilities
- [ ] Analytics y tracking

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 📱 Responsive Design

El proyecto está diseñado para funcionar perfectamente en:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🎨 Sistema de Diseño

### **Colores**

- **Primary**: Amber (600, 700, 800, 900)
- **Secondary**: Gray (50, 100, 200, 300, 400, 500, 600, 700, 800, 900)
- **Accent**: Red (500, 600, 700)

### **Tipografía**

- **Font Family**: Geist Sans (principal), Geist Mono (monospace)
- **Sizes**: text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl, text-6xl

### **Espaciado**

- **Container**: max-w-7xl
- **Padding**: p-4, p-6, p-8, p-12, p-16, p-24, p-32
- **Margin**: m-4, m-6, m-8, m-12, m-16, m-24, m-32

## 🔌 Integración con WordPress

El proyecto está preparado para integrarse con WordPress como CMS headless:

- **API Endpoints**: `/wp-json/wp/v2/`
- **Custom Post Types**: Productos, Categorías, Usuarios
- **Custom Fields**: Precios, stock, características de cerveza
- **Media Management**: Imágenes de productos optimizadas

## 📚 Recursos y Referencias

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Proyecto**: Market Club
- **Desarrollador**: [Tu Nombre]
- **Email**: [tu-email@ejemplo.com]
- **Website**: [https://marketclub.com]

---

**¡Salud! 🍻** - Que las mejores cervezas estén siempre a tu alcance.
