
import type { Book } from '~/models';
import { ee } from '~/eventEmitter';
import { scrapeHighlightsForBook } from '~/scraper';
import type { String } from 'lodash';

export class Kindtoc {
	books: Book[];

	constructor(books: Book[]) {
		this.books = books;
		this.init();
	}

	init(): void {
    // stuff
	}


  public async myIterate(books: Book[]): Promise<void> {
    for (const [index, book] of books.entries()) {
      try {
        ee.emit('syncBook', book, index);

        const highlights = await scrapeHighlightsForBook(book);
        console.log("highligtsss", highlights);

        ee.emit('syncBookSuccess', book, highlights);
      } catch (error) {
        console.error('Error syncing book', book, error);
        ee.emit('syncBookFailure', book, String(error));
      }
    }
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
  public getBookByAsin(asin: string) {
    const biblia = this.books.find( book => book.asin === asin );
    let mybooks = [];
    if(biblia){
      mybooks = [ biblia ];
    }
    return mybooks;
  }
}
