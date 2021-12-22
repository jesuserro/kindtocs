
import { suma } from './suma';

describe('Sumar', () => {
  it('sumar 1 + 2 es igual a 3', () => {
    expect(suma(1, 2)).toEqual(3);
  });
});

