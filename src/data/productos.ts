import type { ImageMetadata } from 'astro';
import tortaChocolate from '../assets/img/cut/torta-chocolate.png';
import cheesecakeFresa from '../assets/img/cut/cheesecake-fresa.png';
import cheesecakeArandanos from '../assets/img/cut/cheesecake-arandanos.png';
import kekeZanahoria from '../assets/img/cut/keke-zanahoria.png';
import pieLimon from '../assets/img/cut/pie-limon.png';
import banoffee from '../assets/img/cut/banoffee.png';
import mangoPasion from '../assets/img/mango-pasion.jpg';

export type Categoria = 'porciones' | 'salados' | 'bebidas';

export interface Producto {
  id: string;
  cat: Categoria;
  nombre: string;
  /** Solo descripciones confirmadas. Vacío = se muestra únicamente el nombre. */
  desc?: string;
  /** Foto recortada (PNG con plato) o foto normal */
  img?: ImageMetadata;
  recorte?: boolean;
  /** Aparece en "Favoritos de la vitrina" */
  destacado?: boolean;
  badge?: string;
  /** Precio en soles. Los actuales son de Rappi (referenciales) y no se muestran mientras NEGOCIO.mostrarPrecios = false */
  precio?: number;
}

export const CATEGORIAS: { id: Categoria; label: string }[] = [
  { id: 'porciones', label: 'Postres en porción' },
  { id: 'salados', label: 'Salados' },
  { id: 'bebidas', label: 'Café y bebidas' },
];

// Productos de la carta de Rappi + los que aparecen en Instagram (Banoffee, Mango pasión, Suspiro).
// En Rappi algunas descripciones están cruzadas: solo se usan las que coinciden con el nombre.
export const PRODUCTOS: Producto[] = [
  { id: 'torta-chocolate', cat: 'porciones', nombre: 'Torta de chocolate', precio: 12,
    desc: 'Keke húmedo de chocolate relleno de manjar blanco casero y bañado en fudge a la olla.',
    img: tortaChocolate, recorte: true, destacado: true, badge: 'Clásico' },
  { id: 'cheesecake-fresa', cat: 'porciones', nombre: 'Cheesecake de fresa', precio: 15,
    desc: 'Base de galleta, cheesecake cremoso y cobertura de fresa.',
    img: cheesecakeFresa, recorte: true, destacado: true, badge: 'Favorito' },
  { id: 'cheesecake-arandanos', cat: 'porciones', nombre: 'Cheesecake de arándanos', precio: 15,
    desc: 'Tarta de queso con cobertura de arándanos.',
    img: cheesecakeArandanos, recorte: true, destacado: true },
  { id: 'banoffee', cat: 'porciones', nombre: 'Banoffee',
    desc: 'Uno de los favoritos de nuestro team.',
    img: banoffee, recorte: true, destacado: true, badge: 'Elegido del team' },
  { id: 'mango-pasion', cat: 'porciones', nombre: 'Mango pasión',
    desc: 'Nuestro postre con forma de mango. Otro favorito del team.',
    img: mangoPasion, destacado: true, badge: 'Elegido del team' },
  { id: 'keke-zanahoria', cat: 'porciones', nombre: 'Keke de zanahoria', precio: 12,
    desc: 'Con pasas rubias y bañado en frosting de queso crema.',
    img: kekeZanahoria, recorte: true, destacado: true },
  { id: 'pie-limon', cat: 'porciones', nombre: 'Pie de limón', precio: 12,
    img: pieLimon, recorte: true, destacado: true },
  { id: 'panna-cotta', cat: 'porciones', nombre: 'Panna cotta', precio: 13,
    desc: 'Crema de leche con salsa de frutos rojos o salsa inglesa.', badge: 'La de la casa' },
  { id: 'cheesecake-pecanas', cat: 'porciones', nombre: 'Cheesecake de pecanas y caramelo', precio: 15,
    desc: 'Con pecanas y caramelo sobre una base crujiente.' },
  { id: 'cheesecake-japones', cat: 'porciones', nombre: 'Cheesecake japonés', precio: 12 },
  { id: 'red-velvet', cat: 'porciones', nombre: 'Torta red velvet', precio: 12 },
  { id: 'pie-pecanas', cat: 'porciones', nombre: 'Pie de pecanas', precio: 12 },
  { id: 'keke-naranja', cat: 'porciones', nombre: 'Keke de naranja', precio: 12,
    desc: 'Con naranja acaramelada.' },

  { id: 'empanada-carne', cat: 'salados', nombre: 'Empanada de carne', precio: 7 },
  { id: 'empanada-pollo', cat: 'salados', nombre: 'Empanada de pollo', precio: 7,
    desc: 'Rellena de pollo, en masa dorada al horno.' },
  { id: 'empanada-mixta', cat: 'salados', nombre: 'Empanada mixta', precio: 7 },
  { id: 'empanada-parrillera', cat: 'salados', nombre: 'Empanada parrillera', precio: 9.5 },

  { id: 'cafe', cat: 'bebidas', nombre: 'Café de especialidad',
    desc: 'Pregunta por las preparaciones del día.' },
  { id: 'matcha-bubble-tea', cat: 'bebidas', nombre: 'Matcha bubble tea', precio: 18,
    desc: 'Con leche, perlas de tapioca de matcha y hielo.' },
  { id: 'infusiones', cat: 'bebidas', nombre: 'Infusiones', precio: 4,
    desc: 'Manzanilla, anís o té (12 oz).' },
  { id: 'gaseosas', cat: 'bebidas', nombre: 'Gaseosas y agua',
    desc: 'Inca Kola, Coca-Cola o agua San Mateo.' },
];

export const fmtPrecio = (n: number) => `S/ ${n.toFixed(2)}`;
