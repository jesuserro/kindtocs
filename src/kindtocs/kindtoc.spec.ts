
import { Kindtoc } from '~/kindtocs/kindtoc';

const books = [
    {
        id: "35587",
        asin: "B00UVRQDA8",
        title: "El Abandono en la Divina Providencia: Clasicos Catolicos",
        author: "Jean-pierre de caussade",
        url: "https://www.amazon.com/dp/B00UVRQDA8",
        imageUrl: "https://m.media-amazon.com/images/I/81eaSIv3D8L._SY160.jpg",
        lastAnnotatedDate: null
    },
    {
        id: "63761",
        asin: "B00G8ELSM6",
        title: "The Return of the Prodigal Son: A Story of Homecoming (English Edition)",
        author: "Henri J. M. Nouwen",
        url: "https://www.amazon.com/dp/B00G8ELSM6",
        imageUrl: "https://m.media-amazon.com/images/I/81GfL3m+SdL._SY160.jpg",
        lastAnnotatedDate: new Date("2021-11-26T23:00:00.000Z")
    },
    {
        id: "25371",
        asin: "B08W8XZH5L",
        title: "Liberado: Una Guía Práctica para la Liberación",
        author: "Neal Lozano",
        url: "https://www.amazon.com/dp/B08W8XZH5L",
        imageUrl: "https://m.media-amazon.com/images/I/71wZlRwrp2L._SY160.jpg",
        lastAnnotatedDate: new Date("2021-11-24T23:00:00.000Z")
    },
    {
        id: "19076",
        asin: "B00UZGG14I",
        title: "Introduccion a la vida devota: Clasicos Catolicos",
        author: "San Francisco de Sales",
        url: "https://www.amazon.com/dp/B00UZGG14I",
        imageUrl: "https://m.media-amazon.com/images/I/81rVlBGQwmL._SY160.jpg",
        lastAnnotatedDate: new Date("2021-11-17T23:00:00.000Z")
    },
    {
        id: "3023",
        asin: "B07KRF88HP",
        title: "La libertad interior (Patmos)",
        author: "Jacques Philippe",
        url: "https://www.amazon.com/dp/B07KRF88HP",
        imageUrl: "https://m.media-amazon.com/images/I/81-xrmpzX1L._SY160.jpg",
        lastAnnotatedDate: null
    },
    {
        id: "42843",
        asin: "B01LY1D0KZ",
        title: "Sagrada Biblia",
        author: "Universidad de Navarra y Facultad de Teología",
        url: "https://www.amazon.com/dp/B01LY1D0KZ",
        imageUrl: "https://m.media-amazon.com/images/I/81ICDdLVq2L._SY160.jpg",
        lastAnnotatedDate: null
    },
    {
        id: "39151",
        asin: "B01NBFDM7Q",
        title: "Jesús de Nazaret: Desde la Entrada en Jerusalén hasta la Resurrección (Obras de Benedicto XVI nº 2)",
        author: "Joseph Ratzinger y Juan Fernando del Río",
        url: "https://www.amazon.com/dp/B01NBFDM7Q",
        imageUrl: "https://m.media-amazon.com/images/I/71K75E7ltaL._SY160.jpg",
        lastAnnotatedDate: new Date("2021-11-23T23:00:00.000Z")
    },
    {
        id: "2539",
        asin: "B07PJL6DDD",
        title: "El arte de recomenzar (Patmos)",
        author: "Fabio Rosini",
        url: "https://www.amazon.com/dp/B07PJL6DDD",
        imageUrl: "https://m.media-amazon.com/images/I/810GP5qPlmL._SY160.jpg",
        lastAnnotatedDate: new Date("2021-11-21T23:00:00.000Z")
    },
    {
        id: "50500",
        asin: "B00I8QDDC0",
        title: "Biblia de Jerusalén",
        author: "Escuela Bíblica y Arqueológica de Jerusalén",
        url: "https://www.amazon.com/dp/B00I8QDDC0",
        imageUrl: "https://m.media-amazon.com/images/I/71cg6GDnVcL._SY160.jpg",
        lastAnnotatedDate: null
    },
    {
        id: "922",
        asin: "B078J2SX7V",
        title: "Veinte poemas de amor y una canción desesperada",
        author: "Pablo Neruda",
        url: "https://www.amazon.com/dp/B078J2SX7V",
        imageUrl: "https://m.media-amazon.com/images/I/91X63fGh28L._SY160.jpg",
        lastAnnotatedDate: null
    },
    {
        id: "38557",
        asin: "B07C25MVWW",
        title: "Gaudete et exsultate. Exhortación apostólica sobre la llamada a la santidad en el mundo actual (Documentos MC)",
        author: "Papa Francisco",
        url: "https://www.amazon.com/dp/B07C25MVWW",
        imageUrl: "https://m.media-amazon.com/images/I/81roOOO+AqL._SY160.jpg",
        lastAnnotatedDate: null
    },
    {
        id: "58744",
        asin: "B06Y157ZD1",
        title: "La fuerza del silencio: Frente a la dictadura del ruido (Mundo y Cristianismo)",
        author: "Cardenal Robert Sarah, Nicolas Diat, Benedicto XVI y Gloria Esteban Villar",
        url: "https://www.amazon.com/dp/B06Y157ZD1",
        imageUrl: "https://m.media-amazon.com/images/I/91tYFhjufAL._SY160.jpg",
        lastAnnotatedDate: null
    },
    {
        id: "48684",
        asin: "B00TPZMP7C",
        title: "El chico que hablaba con Jesús. Segatashya de Kibeho: La increíble historia de un joven pastor ruandés que conoció a Jesús debajo de una acacia",
        author: "Immaculée Ilibagiza, Ricardo Regidor y Marta Moreno Candel",
        url: "https://www.amazon.com/dp/B00TPZMP7C",
        imageUrl: "https://m.media-amazon.com/images/I/81ZmMcS5JAL._SY160.jpg",
        lastAnnotatedDate: null
    },
    {
        id: "57715",
        asin: "B01NCNPV3M",
        title: "PHP Objects, Patterns, and Practice (English Edition)",
        author: "MATT ZANDSTRA",
        url: "https://www.amazon.com/dp/B01NCNPV3M",
        imageUrl: "https://m.media-amazon.com/images/I/719DIeh+HIL._SY160.jpg",
        lastAnnotatedDate: null
    },
    {
        id: "58091",
        asin: "B079BZZXT9",
        title: "Santos Evangelios",
        author: "Universidad de Navarra",
        url: "https://www.amazon.com/dp/B079BZZXT9",
        imageUrl: "https://m.media-amazon.com/images/I/811S2ZVVEfL._SY160.jpg",
        lastAnnotatedDate: null
    },
    {
        id: "2841",
        asin: "B00I9DQ0VS",
        title: "¡¡Sáquennos de aquí!!: María Simma responde a esta petición de las benditas ánimas del purgatorio",
        author: "Nicky Eltz, María Vallejo-Nágera y Ricardo Regidor",
        url: "https://www.amazon.com/dp/B00I9DQ0VS",
        imageUrl: "https://m.media-amazon.com/images/I/81DZRSQtqIL._SY160.jpg",
        lastAnnotatedDate: null
    },
    {
        id: "55104",
        asin: "B01HL9JGES",
        title: "Creo aunque sea absurdo, o quizá por eso (Crecimiento personal)",
        author: "Antonio Fornés",
        url: "https://www.amazon.com/dp/B01HL9JGES",
        imageUrl: "https://m.media-amazon.com/images/I/81-3dS3hKLL._SY160.jpg",
        lastAnnotatedDate: null
    },
    {
        id: "20809",
        asin: "B016DVHGK6",
        title: "Healing You and Your Family Tree: A Contemplative Approach to Personal and Generational Healing (English Edition)",
        author: "Christopher Ngozi Onuoha",
        url: "https://www.amazon.com/dp/B016DVHGK6",
        imageUrl: "https://m.media-amazon.com/images/I/81iFzsLTD3L._SY160.jpg",
        lastAnnotatedDate: null
    },
    {
        id: "47045",
        asin: "B00CX0KE8S",
        title: "Medjugorje: El libro definitivo para comprender por qué más de 30 millones de personas han acudido a un pequeño pueblo de Bosnia-Herzegovina",
        author: "Jesús García",
        url: "https://www.amazon.com/dp/B00CX0KE8S",
        imageUrl: "https://m.media-amazon.com/images/I/51eciB6l+7L._SY160.jpg",
        lastAnnotatedDate: null
    }
];

/**
 *
 * const highlights = [{
  id: "39534",
  text: "Indice",
  color: "yellow",
  location: "6",
  page: "6",
  note: ".h1"
}, {
  id: "64275",
  text: "La acción divina revela sus deseos al corazón no por ideas, sino por mociones. Ella se los descubre o por hallazgos, haciéndole obrar a la aventura, o por necesidad, no permitiéndole otra opción que aquélla que se le presenta, o por la aplicación eventual de medios necesarios, como, por ejemplo, cuando es preciso decir o hacer algo en un primer movimiento, o en un impulso sobrenatural o extraordinario; o bien, en fin, por una aplicación activa de inclinación o alejamiento, según la cual se acerque o aleje de cierto objeto.",
  color: "pink",
  location: "761",
  page: "761",
  note: ".mociones .ignaciodeloyola .ejerciciosespirituales .almasdedios .corazón .perspectivas .presente .cotidiano .almasdedios \nEl flujo interior es como sigue: buena voluntad, corazón puro, mociones, llave conocimientos. Nieves decía que esperaba un acontecimiento que la eligiera. Mi ex ponía toda su energía en un hombre que la sacara de su pozo."
}];
 *
 */





const K = new Kindtoc(books);

describe('Kindtocs class', () => {
  it('ASIN returns book', () => {
    const actual = K.getBookByAsin('B01LY1D0KZ');
    expect(actual).toEqual([{
      asin: "B01LY1D0KZ",
      author: "Universidad de Navarra y Facultad de Teología",
      id: "42843",
      imageUrl: "https://m.media-amazon.com/images/I/81ICDdLVq2L._SY160.jpg",
      lastAnnotatedDate: null,
      title: "Sagrada Biblia",
      url: "https://www.amazon.com/dp/B01LY1D0KZ"
    }]);
  });

  it('handles empty', () => {
    const actual = K.getBookByAsin('');
    expect(actual).toEqual([]);
  });

  it('handles strange values', () => {
    const actual = K.getBookByAsin('1234567');
    expect(actual).toEqual([]);
  });

  it('handles null', () => {
    const actual = K.getBookByAsin(null);
    expect(actual).toEqual([]);
  });
  it('handles undefined', () => {
    const actual = K.getBookByAsin(undefined);
    expect(actual).toEqual([]);
  });

});
