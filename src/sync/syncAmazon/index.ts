import AmazonLoginModal from '~/components/amazonLoginModal';
import { scrapeHighlightsForBook, scrapeBooks } from '~/scraper';
import { ee } from '~/eventEmitter';
import type { SyncManager } from '~/sync';
import type { Book, KindleFile } from '~/models';
import { Kindtoc } from './../../kindtocs/kindtoc';

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
        // 1. Acción del plugin original: resincronizar
        // await this.syncBooks(booksToSync);

        // 2. Mis libros
        const MyPlugin = new Kindtoc(booksToSync);
        // console.log( MyPlugin.getBooks() );

        // 3. Highlights
        const aBook = MyPlugin.getBookByAsin('B00UVRQDA8');
        MyPlugin.myIterate(aBook);
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
