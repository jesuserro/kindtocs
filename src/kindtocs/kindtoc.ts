
import type { Book } from '~/models';

export class Kindtoc {
	books: Book[];

	constructor(books: Book[]) {
		this.books = books;
		this.init();
	}

	init(): void {
    this.filterBooks();
	}

	filterBooks(): void {
    this.books = this.getBible(this.books);
	}

  public getBooks(): Book[] {
    return this.books;
  }

  /**
   *
   * @param books Nos quedamos con la biblia
   * @returns
   */
  private getBible(books: Book[]): Book[] {
    const biblia = books.find( book => book.asin === 'B01LY1D0KZ' );
    let mybooks = [];
    if(biblia){
      mybooks = [ biblia ];
    }
    return mybooks;
  }
}
