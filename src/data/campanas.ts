import type { ImageMetadata } from 'astro';
import suspiro from '../assets/img/suspiro.jpg';
import espresso from '../assets/img/espresso.jpg';

export interface Campana {
  id: string;
  kicker: string;
  titulo: string;
  texto: string;
  fechas: string;
  /** Rango de visibilidad (inclusive, hora de Lima). Fuera de él, la campaña se oculta sola. */
  desde: string;
  hasta: string;
  img: ImageMetadata;
  cta: string;
  mensaje: string;
}

// Campañas publicadas en IG. Para agregar una nueva, copia un bloque y cambia fechas, texto y foto.
export const CAMPANAS: Campana[] = [
  {
    id: 'suspiro',
    kicker: 'Día de la Canción Criolla',
    titulo: 'Suspiro a la limeña',
    texto: 'Celebramos nuestra música y tradición como se debe: suspiro a la limeña tradicional, con su respectivo toque de vino en el merengue.',
    fechas: 'Solo este 30 y 31 de octubre',
    desde: '2026-10-20',
    hasta: '2026-10-31',
    img: suspiro,
    cta: 'Separar el mío',
    mensaje: 'Hola La Pannacotta 👋 Quiero separar Suspiro a la limeña 🇵🇪',
  },
  {
    id: 'coffee-party',
    kicker: 'Viernes 30 de octubre · 6:00 a 10:00 p. m.',
    titulo: 'Coffee Party',
    texto: 'Música en vivo con Tefa Juárez y degustación de café. Ven a disfrutar de los mejores aromas y acompáñalos con nuestros postres.',
    fechas: 'En nuestro local de Comas',
    desde: '2026-10-14',
    hasta: '2026-10-30',
    img: espresso,
    cta: 'Quiero ir',
    mensaje: 'Hola La Pannacotta 👋 Quiero información sobre el Coffee Party ☕',
  },
];
