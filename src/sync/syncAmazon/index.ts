import AmazonLoginModal from '~/components/amazonLoginModal';
import { scrapeHighlightsForBook, scrapeBooks } from '~/scraper';
import { ee } from '~/eventEmitter';
import type { SyncManager } from '~/sync';
import type { Book, KindleFile } from '~/models';

export default class SyncAmazon {

  remoteBooks: Book[];

  constructor(private syncManager: SyncManager) {}

/**
 *
 * @returns Clon de startSync()
 */
  public async startKindtocs(): Promise<void> {
    ee.emit('syncSessionStart', 'amazon');

    const success = await this.login();

    if (!success) {
      return; // Do nothing...
    }

    try {
      ee.emit('fetchingBooks');

      const remoteBooks = await scrapeBooks();
      const booksToSync = await this.syncManager.filterBooksToSync(remoteBooks);

      ee.emit('fetchingBooksSuccess', booksToSync, remoteBooks);

      this.remoteBooks = remoteBooks;

      if (remoteBooks.length > 0) {

        const oneBook = this.getBookByAsin('B00UVRQDA8');

        if (oneBook.length > 0) {
          await this.createTocs(oneBook);
        }
      }

      ee.emit('syncSessionSuccess');
    } catch (error) {
      console.error('Error while trying fetch books and to sync', error);
      ee.emit('syncSessionFailure', String(error));
    }
  }

  public async startSync(): Promise<void> {
    ee.emit('syncSessionStart', 'amazon');

    const success = await this.login();

    if (!success) {
      return; // Do nothing...
    }

    try {
      ee.emit('fetchingBooks');

      const remoteBooks = await scrapeBooks();
      const booksToSync = await this.syncManager.filterBooksToSync(remoteBooks);

      ee.emit('fetchingBooksSuccess', booksToSync, remoteBooks);

      if (booksToSync.length > 0) {
        await this.syncBooks(booksToSync);
      }

      ee.emit('syncSessionSuccess');
    } catch (error) {
      console.error('Error while trying fetch books and to sync', error);
      ee.emit('syncSessionFailure', String(error));
    }
  }

  public async resync(file: KindleFile): Promise<void> {
    const success = await this.login();

    if (!success) {
      return; // Do nothing...
    }

    try {
      ee.emit('resyncBook', file);

      const remoteBooks = await scrapeBooks();
      const remoteBook = remoteBooks.find((r) => r.id === file.book.id);

      const highlights = await scrapeHighlightsForBook(file.book);

      const diffs = await this.syncManager.resyncBook(file, remoteBook, highlights);

      ee.emit('resyncComplete', file, diffs.length);
    } catch (error) {
      console.error('Error resyncing higlights for file', file, error);
      ee.emit('resyncFailure', file, String(error));
    }
  }

  private async login(): Promise<boolean> {
    ee.emit('startLogin');

    const modal = new AmazonLoginModal();
    const success = await modal.doLogin();

    ee.emit('loginComplete', success);

    return success;
  }

  private async syncBooks(books: Book[]): Promise<void> {
    for (const [index, book] of books.entries()) {
      try {
        ee.emit('syncBook', book, index);

        const highlights = await scrapeHighlightsForBook(book);
        await this.syncManager.syncBook(book, highlights);

        ee.emit('syncBookSuccess', book, highlights);
      } catch (error) {
        console.error('Error syncing book', book, error);
        ee.emit('syncBookFailure', book, String(error));
      }
    }
  }

  /**
   * Clon de syncBooks()
   * @param books
   */
  private async createTocs(books: Book[]): Promise<void> {
    for (const [index, book] of books.entries()) {
      try {
        ee.emit('syncBook', book, index);

        const highlights = await scrapeHighlightsForBook(book);
        await this.syncManager.createBookToc(book, highlights);

        ee.emit('syncBookSuccess', book, highlights);
      } catch (error) {
        console.error('Error syncing book', book, error);
        ee.emit('syncBookFailure', book, String(error));
      }
    }
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
    const book = this.remoteBooks.find( book => book.asin === asin );
    let mybooks = [];
    if(book){
      mybooks = [ book ];
    }
    return mybooks;
  }



}
