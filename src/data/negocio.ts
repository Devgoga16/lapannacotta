// La Pannacotta — datos del negocio (fuente: IG @lapannacotta.pe, FB y Rappi, oct. 2026)

export const NEGOCIO = {
  nombre: 'La Pannacotta',
  lema: 'Pastelería boutique',
  // Número del bio de FB y de la bolsa de delivery ("Haz tu pedido al 947 279 235")
  whatsapp: '51947279235',
  whatsappVisible: '947 279 235',
  correo: 'holapannacotta@gmail.com',
  // IG y posts recientes dicen 728. FB y Rappi aún muestran 860 → confirmar con el cliente
  direccion: 'Av. Micaela Bastidas 728, Comas',
  zona: 'Lima Norte',
  // Horario del bio de Instagram (FB muestra otro, desactualizado)
  horario: [
    { dias: 'Lunes a sábado', horas: '9:00 a. m. – 10:00 p. m.' },
    { dias: 'Domingos', horas: '10:00 a. m. – 10:00 p. m.' },
  ],
  mapa: 'https://www.google.com/maps/search/?api=1&query=Av.%20Micaela%20Bastidas%20728%2C%20Comas%2C%20Lima',
  mapaEmbed: 'https://www.google.com/maps?q=Av.%20Micaela%20Bastidas%20728%2C%20Comas%2C%20Lima&output=embed',
  redes: {
    instagram: 'https://www.instagram.com/lapannacotta.pe/',
    facebook: 'https://www.facebook.com/lapannacotta.pe/',
    comoLlegar: 'https://www.instagram.com/lapannacotta.pe/reel/DbCEDpLx74c/',
  },
  rappi: 'https://www.rappi.com.pe/restaurantes/25058-la-pannacotta',
  /** Precios de Rappi cargados pero ocultos hasta que el cliente confirme los de tienda. */
  mostrarPrecios: false,
};

export const waLink = (text: string) =>
  `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(text)}`;

export const MSG_HOLA = 'Hola La Pannacotta 👋 Quiero hacer un pedido 🍰';
