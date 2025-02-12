import { get } from 'svelte/store';

import { settingsStore } from '~/store';
import { scrapeBookMetadata } from '~/scraper';
import { DiffManager } from '../diffManager';
import { Renderer } from '~/renderer';
import { diffBooks } from './diffBooks';
import type FileManager from '~/fileManager';

import type { Book, BookMetadata, Highlight, HighlightToc, KindleFile } from '~/models';
// import type { Book, BookMetadata, Highlight, KindleFile } from '~/models';

import type { DiffResult } from '../diffManager';

export default class SyncManager {
  private renderer: Renderer;

  constructor(private fileManager: FileManager) {
    this.fileManager = fileManager;
    this.renderer = new Renderer();
  }

  public async filterBooksToSync(remoteBooks: Book[]): Promise<Book[]> {
    const lastSyncDate = get(settingsStore).lastSyncDate;
    const vaultBooks = await this.fileManager.getKindleFiles();

    return diffBooks(
      remoteBooks,
      vaultBooks.map((v) => v.book),
      lastSyncDate
    );
  }

  public async syncBook(book: Book, highlights: Highlight[]): Promise<void> {
    if (highlights.length === 0) {
      return; // No highlights for book. Skip sync
    }

    const file = await this.fileManager.getKindleFile(book);

    if (file == null) {
      await this.createBook(book, highlights);
    } else {
      await this.resyncBook(file, book, highlights);
    }
  }

  /**
   *
   * @param book Clon de syncBook()
   * @param highlights
   * @returns
   */
  public async createBookToc(book: Book, highlights: any[]): Promise<void> {
    if (highlights.length === 0) {
      return; // No highlights for book. Skip sync
    }

    await this.createLibro(book, highlights);
  }

  /**
   *
   * @param book Clon de syncBook()
   * @param highlights
   * @returns
   */
  public async createNoteToc(book: Book, highlights: any[]): Promise<void> {
    if (highlights.length === 0) {
      return; // No highlights for book. Skip sync
    }

    await this.createNotes(book, highlights);
  }

  /**
   *
   * @param book Clon de syncBook()
   * @param highlights
   * @returns
   */
  public async createChapterNotes(book: Book, highlights: any[]): Promise<void> {
    if (highlights.length === 0) {
      return; // No highlights for book. Skip sync
    }

    await this.createChaptersNotes(book, highlights);
  }


  public async createSpecialNotes(book: Book, highlights: any[]): Promise<void> {
    if (highlights.length === 0) {
      return; // No highlights for book. Skip sync
    }

    await this.createSpecialsNotes(book, highlights);
  }


  /**
   *
   * @param book Clon de syncBook()
   * @param highlights
   * @returns
   */
  public async createChapterToc(book: Book, highlights: any[]): Promise<void> {
    if (highlights.length === 0) {
      return; // No highlights for book. Skip sync
    }

    await this.createChapters(book, highlights);
  }

  public async resyncBook(
    file: KindleFile,
    remoteBook: Book,
    remoteHighlights: Highlight[]
  ): Promise<DiffResult[]> {
    const diffManager = await DiffManager.create(this.fileManager, file);

    const diffs = await diffManager.diff(remoteHighlights);

    if (diffs.length > 0) {
      await diffManager.applyDiffs(remoteBook, remoteHighlights, diffs);
    }

    return diffs;
  }

  private async createBook(book: Book, highlights: Highlight[]): Promise<void> {
    const metadata = await this.syncMetadata(book);

    const content = this.renderer.render({ book, highlights, metadata });

    await this.fileManager.createFile(book, content, highlights.length);
  }

  /**
   * Clon de createBook()
   * @param book
   * @param highlights
   */
  private async createLibro(book: Book, highlights: HighlightToc[]): Promise<void> {
    const metadata = await this.syncMetadata(book);

    const content = this.renderer.renderTocNotes({ book, highlights, metadata });

    await this.fileManager.createFile(book, content, highlights.length);
  }

  /**
   * Clon de createBook()
   * @param book
   * @param highlights
   */
  private async createNotes(book: Book, highlights: HighlightToc[]): Promise<void> {
    const metadata = await this.syncMetadata(book);

    const content = this.renderer.renderTocNotes2({ book, highlights, metadata });

    await this.fileManager.createFile(book, content, highlights.length);
  }

  /**
   * Clon de createBook()
   * @param book
   * @param highlights
   */
  private async createSpecialsNotes(book: Book, highlights: HighlightToc[]): Promise<void> {
    const metadata = await this.syncMetadata(book);

    const content = this.renderer.renderSpecial0({ book, highlights, metadata });

    await this.fileManager.createFile(book, content, highlights.length);
  }


  /**
   * Clon de createBook()
   * @param book
   * @param highlights
   */
  private async createChaptersNotes(book: Book, highlights: HighlightToc[]): Promise<void> {
    const metadata = await this.syncMetadata(book);

    const content = this.renderer.renderTocChaptersNotes({ book, highlights, metadata });

    await this.fileManager.createFile(book, content, highlights.length);
  }


  /**
   * Clon de createBook()
   * @param book
   * @param highlights
   */
  private async createChapters(book: Book, highlights: HighlightToc[]): Promise<void> {
    const metadata = await this.syncMetadata(book);

    const content = this.renderer.renderTocChapters({ book, highlights, metadata });

    await this.fileManager.createFile(book, content, highlights.length);
  }

  private async syncMetadata(book: Book): Promise<BookMetadata> {
    let metadata: BookMetadata;

    try {
      if (get(settingsStore).downloadBookMetadata && book.asin) {
        metadata = await scrapeBookMetadata(book);
      }
    } catch (error) {
      console.error(`Couldn't download metadata for ${book.title}`, error);
    }

    return metadata;
  }
}
