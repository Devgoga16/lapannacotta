# La Pannacotta — web

Sitio en [Astro](https://astro.build): vitrina de postres, carta con "Arma tu pedido" por WhatsApp, cotizador de tortas por encargo y campañas que se ocultan solas al vencer.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera /dist listo para subir (Netlify, Vercel, Hostinger…)
```

## Publicar en Vercel

1. Sube el proyecto a GitHub (las carpetas `node_modules/`, `dist/` y `.astro/` ya están ignoradas).
2. En Vercel: **Add New → Project → Import** el repositorio. Vercel detecta Astro solo (build `npm run build`, salida `dist`). No hace falta configurar nada más.
3. Cuando tengan dominio propio, agrégalo en **Settings → Domains** y crea la variable de entorno `SITE_URL` (ej.: `https://lapannacotta.pe`). Así el SEO y la imagen al compartir usan ese dominio. Mientras tanto se usa el dominio `.vercel.app`.

Sin GitHub también se puede: `npx vercel` desde esta carpeta.

## Dónde editar

| Qué | Archivo |
| --- | --- |
| WhatsApp, dirección, horario, redes, Rappi | `src/data/negocio.ts` → `NEGOCIO` |
| Mostrar u ocultar precios | `src/data/negocio.ts` → `mostrarPrecios` |
| Productos, descripciones, precios, favoritos | `src/data/productos.ts` |
| Campañas y novedades (con fecha de inicio y fin) | `src/data/campanas.ts` |
| Textos de cada sección | `src/components/*.astro` |
| Colores y estilos | `src/styles/global.css` (variables en `:root`) |
| Fotos | `src/assets/img/` (Astro las optimiza a WebP). Los recortes del hero están en `src/assets/img/cut/` |
| Logo, monograma y favicon | `public/img/`, `public/favicon.png` |
| Dominio final (SEO, imagen al compartir) | `astro.config.mjs` → `site` |

## Precios

Los precios cargados son los de **Rappi** (referenciales). Mientras `mostrarPrecios` sea `false`, la web muestra "Consultar" y el pedido llega por WhatsApp sin montos. Cuando el cliente confirme los precios de tienda, actualízalos en `productos.ts` y cambia `mostrarPrecios` a `true`. Si todos los productos de un pedido tienen precio, el total aparece solo.

## Campañas

Cada campaña tiene `desde` y `hasta` (formato `AAAA-MM-DD`, hora de Lima). Fuera de ese rango se oculta sola. Si no hay ninguna vigente, aparece un bloque que invita a seguir el Instagram.

## Fotos

Todas salen del Instagram del negocio (@lapannacotta.pe) y son provisionales. Los postres "flotantes" se recortaron de su foto del reloj de postres. Para la versión final conviene una sesión de producto con fondo neutro.

## Pendiente de confirmar con el cliente

Revisa la sección 5 de `PROPUESTA.md`.
