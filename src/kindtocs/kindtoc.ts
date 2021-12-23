
import type { Book } from '~/models';

export class Kindtoc {
	books: Book[];

	constructor(books: Book[]) {
		this.books = books;
		this.init();
	}

	init(): void {
    // stuff
	}


  public getBooks(): Book[] {
    return this.books;
  }

  /**
   *
   * @param asin string
   * @returns Book[]
   *
   * B00UVRQDA8 Abandono
   * B01LY1D0KZ Biblia
   */
  public getBookByAsin(asin: string):Book[] {
    const book = this.books.find( book => book.asin === asin );
    let mybooks = [];
    if(book){
      mybooks = [ book ];
    }
    return mybooks;
  }
}
