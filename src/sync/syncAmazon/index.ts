import AmazonLoginModal from '~/components/amazonLoginModal';
import { scrapeHighlightsForBook, scrapeBooks } from '~/scraper';
import { ee } from '~/eventEmitter';
import type { SyncManager } from '~/sync';
import type { Book, KindleFile } from '~/models';

export default class SyncAmazon {
  constructor(private syncManager: SyncManager) {}

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
        // await this.syncBooks(booksToSync); // Acción del plugin original: resincronizar
        /**
         5: {
            asin: "B01LY1D0KZ"
            author: "Universidad de Navarra y Facultad de Teología"
            id: "42843"
            imageUrl: "https://m.media-amazon.com/images/I/81ICDdLVq2L._SY160.jpg"
            lastAnnotatedDate: Invalid Date {}
            title: "Sagrada Biblia"
            url: "https://www.amazon.com/dp/B01LY1D0KZ"
         }
         */
        console.log("booksToSync", booksToSync);
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
}
