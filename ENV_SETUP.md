# Configuración de Variables de Entorno

Este proyecto utiliza variables de entorno para gestionar configuraciones sensibles y específicas del entorno.

## Archivos de Variables de Entorno

### `.env.local` (Local - NO versionado)

Archivo con tus configuraciones locales. **NO se sube a Git**.

### `.env.example` (Plantilla - Versionado)

Plantilla que muestra qué variables necesitas configurar.

## Configuración Inicial

1. Copia el archivo de ejemplo:

   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` con tus valores reales:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_WOMPI_PUBLIC_KEY=tu_clave_publica_aqui
   ```

## Variables Disponibles

| Variable                          | Descripción                  | Ejemplo                                |
| --------------------------------- | ---------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_API_URL`             | URL del backend API          | `http://localhost:8000/api`            |
| `NEXT_PUBLIC_SITE_URL`            | URL del sitio frontend       | `http://localhost:3000`                |
| `NEXT_PUBLIC_WOMPI_PUBLIC_KEY`    | Clave pública de Wompi       | `pub_test_xxx` o `pub_prod_xxx`        |
| `NEXT_PUBLIC_WOMPI_PRIVATE_KEY`   | Clave privada de Wompi       | `prv_test_xxx` o `prv_prod_xxx`        |
| `NEXT_PUBLIC_WOMPI_EVENTS_SECRET` | Secret para eventos de Wompi | `your_secret_here`                     |
| `NEXT_PUBLIC_ENV`                 | Entorno de ejecución         | `development`, `staging`, `production` |

## Importante

⚠️ **Después de modificar `.env.local`, debes reiniciar el servidor de desarrollo:**

```bash
npm run dev
# o
yarn dev
```

## Producción

Para producción, crea un archivo `.env.production` o configura las variables en tu plataforma de hosting (Vercel, etc.).

### Ejemplo para Vercel:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega cada variable con su valor de producción

## Notas de Seguridad

- ❌ **NUNCA** subas `.env.local` a Git
- ❌ **NUNCA** compartas tus claves privadas
- ✅ Solo las variables con prefijo `NEXT_PUBLIC_` son accesibles en el cliente
- ✅ Usa claves de prueba (`pub_test_`, `prv_test_`) en desarrollo
- ✅ Usa claves de producción (`pub_prod_`, `prv_prod_`) solo en producción

## Verificar Configuración

Para verificar que tus variables están cargadas correctamente:

```bash
# En desarrollo
npm run dev

# Verifica en la consola del navegador:
console.log(process.env.NEXT_PUBLIC_API_URL)
```
