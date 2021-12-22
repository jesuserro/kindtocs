
import { Kindtoc } from '~/kindtocs/kindtoc';

const books = [{
  asin: "B01LY1D0KZ",
  author: "Universidad de Navarra y Facultad de Teología",
  id: "42843",
  imageUrl: "https://m.media-amazon.com/images/I/81ICDdLVq2L._SY160.jpg",
  lastAnnotatedDate: null,
  title: "Sagrada Biblia",
  url: "https://www.amazon.com/dp/B01LY1D0KZ"
}];

/*
const highlights = [{
  "id": "39534",
  "text": "Indice",
  "color": "yellow",
  "location": "6",
  "page": "6",
  "note": ".h1"
}, {
  "id": "64275",
  "text": "La acción divina revela sus deseos al corazón no por ideas, sino por mociones. Ella se los descubre o por hallazgos, haciéndole obrar a la aventura, o por necesidad, no permitiéndole otra opción que aquélla que se le presenta, o por la aplicación eventual de medios necesarios, como, por ejemplo, cuando es preciso decir o hacer algo en un primer movimiento, o en un impulso sobrenatural o extraordinario; o bien, en fin, por una aplicación activa de inclinación o alejamiento, según la cual se acerque o aleje de cierto objeto.",
  "color": "pink",
  "location": "761",
  "page": "761",
  "note": ".mociones .ignaciodeloyola .ejerciciosespirituales .almasdedios .corazón .perspectivas .presente .cotidiano .almasdedios \nEl flujo interior es como sigue: buena voluntad, corazón puro, mociones, llave conocimientos. Nieves decía que esperaba un acontecimiento que la eligiera. Mi ex ponía toda su energía en un hombre que la sacara de su pozo."
}];
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
