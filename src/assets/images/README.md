# 📁 Organización de Imágenes

## 🏗️ Estructura de Carpetas

```
src/assets/images/
├── common/           # Imágenes compartidas globalmente
│   ├── logo.png
│   ├── favicon.ico
│   └── placeholder.jpg
├── home/             # Imágenes de la página principal
│   ├── hero-bg.jpg
│   ├── beer-club-section.jpg
│   └── brands-bg.jpg
├── products/         # Imágenes de productos
│   ├── placeholder.jpg
│   ├── categories/
│   └── thumbnails/
├── brands/           # Logos y banners de marcas
│   ├── logos/
│   └── banners/
└── ui/               # Elementos de interfaz
    ├── icons/
    ├── buttons/
    └── backgrounds/
```

## 🎯 Cuándo usar cada ubicación

### **`/public/images/`** (Recomendado para la mayoría)

- ✅ **Imágenes estáticas** que no cambian
- ✅ **Assets del servidor** (favicon, robots.txt)
- ✅ **Imágenes grandes** (banners, hero images)
- ✅ **Fácil acceso** desde cualquier componente
- ✅ **Optimización automática** de Next.js

### **`/src/assets/images/`**

- ✅ **Imágenes que se importan** en componentes
- ✅ **Assets que se procesan** por webpack
- ✅ **Imágenes pequeñas** (iconos, thumbnails)
- ✅ **Mejor tree-shaking** y optimización

## 🚀 Uso en componentes

### **1. Imágenes desde `/public/`:**

```tsx
import { IMAGE_PATHS } from "@/config/images";

<img src={IMAGE_PATHS.HOME.BEER_CLUB} alt="Beer Club Section" />;
```

### **2. Imágenes desde `/src/assets/`:**

```tsx
import beerClubImage from "@/assets/images/home/beer-club-section.jpg";

<img src={beerClubImage.src} alt="Beer Club Section" />;
```

### **3. Imágenes dinámicas:**

```tsx
import { getImagePath } from "@/config/images";

const productImage = getImagePath("PRODUCTS", "categories", "ipa.jpg");
// Resultado: /images/products/categories/ipa.jpg
```

## 📏 Especificaciones recomendadas

### **Hero Images:**

- **Formato**: JPG/WebP
- **Resolución**: 1920×1080px (16:9)
- **Tamaño**: < 500KB

### **Product Images:**

- **Formato**: WebP con fallback JPG
- **Resolución**: 800×800px (1:1)
- **Tamaño**: < 200KB

### **Brand Logos:**

- **Formato**: SVG (preferido) o PNG
- **Resolución**: 200×100px
- **Tamaño**: < 50KB

### **UI Elements:**

- **Formato**: SVG para iconos, PNG para botones
- **Resolución**: Según necesidad
- **Tamaño**: < 100KB

## 🔧 Optimización

### **Next.js Image Component:**

```tsx
import Image from "next/image";

<Image
  src={IMAGE_PATHS.HOME.BEER_CLUB}
  alt="Beer Club"
  width={800}
  height={810}
  priority={true}
  placeholder="blur"
/>;
```

### **Lazy Loading:**

```tsx
<img src={IMAGE_PATHS.PRODUCTS.PLACEHOLDER} alt="Product" loading="lazy" />
```

## 📝 Convenciones de nomenclatura

### **Archivos:**

- **kebab-case**: `beer-club-section.jpg`
- **Descriptivo**: `hero-background-beer.jpg`
- **Versiones**: `logo-dark.svg`, `logo-light.svg`

### **Carpetas:**

- **Plural**: `products/`, `brands/`, `categories/`
- **Descriptivo**: `product-thumbnails/`, `brand-logos/`

## 🚨 Consideraciones importantes

1. **Siempre incluir `alt`** para accesibilidad
2. **Optimizar formatos** (WebP > JPG > PNG)
3. **Usar dimensiones apropiadas** para cada contexto
4. **Implementar lazy loading** para imágenes no críticas
5. **Mantener consistencia** en la organización
6. **Documentar cambios** en la estructura de carpetas
