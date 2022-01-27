import nunjucks, { Environment } from 'nunjucks';
import { get } from 'svelte/store';

import bookTemplate from './templates/bookTemplate.njk';
import notesTemplate from './templates/notesTemplate.njk';
import defaultHighlightTemplate from './templates/defaultHighlightTemplate.njk';
import tocHighlightTemplate from './templates/tocHighlightTemplate.njk';
import highlightTemplateWrapper from './templates/highlightTemplateWrapper.njk';
import { BlockReferenceExtension, TrimAllEmptyLinesExtension } from './nunjucks.extensions';
import { shortenTitle } from '~/utils';
import { settingsStore } from '~/store';
import { trimMultipleLines } from './helper';
import type { Book, BookHighlight, Highlight, HighlightToc, RenderTemplate } from '~/models';
import { getHeader, getTabHeader, getColorIcon, getIsFavorite, getRef } from '~/kindtocs/global';

export const HighlightIdBlockRefPrefix = '^ref-';

const appLink = (book: Book, highlight?: Highlight): string => {
  if (book.asin == null) {
    return null;
  }
  if (highlight != null) {
    return `kindle://book?action=open&asin=${book.asin}&location=${highlight.location}`;
  }
  return `kindle://book?action=open&asin=${book.asin}`;
};

export class Renderer {
  private nunjucks: Environment;

  constructor() {
    this.nunjucks = new nunjucks.Environment(null, { autoescape: false });
    this.nunjucks.addExtension('BlockRef', new BlockReferenceExtension());
    this.nunjucks.addExtension('Trim', new TrimAllEmptyLinesExtension());
  }

  public validate(template: string): boolean {
    try {
      this.nunjucks.renderString(template, { text: '' });
      return true;
    } catch (error) {
      return false;
    }
  }

  public tocHighlightTemplate(): string {
    return tocHighlightTemplate.trim();
  }

  public defaultHighlightTemplate(): string {
    return defaultHighlightTemplate.trim();
  }

  /**
   *
   * @param entry Clon de render()
   * @returns
   */
  public renderTocNotes(entry: BookHighlight): string {
    const { book, highlights } = entry;

    const params: RenderTemplate = {
      ...book,
      fullTitle: book.title,
      title: shortenTitle(book.title),
      appLink: appLink(book),
      ...entry.metadata,
      highlights: this.renderNotesSimple(book, highlights),
    };

    return this.nunjucks.renderString(bookTemplate, params);
  }


  /**
   *
   * @param entry Clon de render()
   * @returns
   */
  public renderTocNotes2(entry: BookHighlight): string {
    const { book, highlights } = entry;

    const params: RenderTemplate = {
      ...book,
      fullTitle: book.title,
      title: shortenTitle(book.title),
      appLink: appLink(book),
      ...entry.metadata,
      highlights: this.renderNotes(book, highlights),
    };

    return this.nunjucks.renderString(notesTemplate, params);
  }


  /**
   * Clon de renderHighlight()
   * @param book
   * @param highlight
   * @returns
   */
  public renderNote(book: Book, highlight: HighlightToc): string {

    const note = highlight.note;
    const header = getHeader(note);
    highlight.header = header;
    highlight.tab = getTabHeader(header);
    highlight.icon = getColorIcon(highlight.color);
    highlight.isFavorite = getIsFavorite(note);
    highlight.ref = getRef(note);

    const highlightParams = { ...highlight, appLink: appLink(book, highlight) };
    const userTemplate = this.tocHighlightTemplate();
    const highlightTemplate = highlightTemplateWrapper.replace('{{ content }}', userTemplate);
    const renderedHighlight = this.nunjucks.renderString(highlightTemplate, highlightParams);
    return trimMultipleLines(renderedHighlight);
  }


  public renderNoteSimple(book: Book, highlight: HighlightToc): string {

    const note = highlight.note;
    const header = getHeader(note);
    highlight.header = header;
    highlight.tab = getTabHeader(header);
    // highlight.icon = getColorIcon(highlight.color);
    highlight.icon = "";
    highlight.isFavorite = getIsFavorite(note);
    highlight.ref = getRef(note);

    const highlightParams = { ...highlight, appLink: appLink(book, highlight) };
    const userTemplate = this.tocHighlightTemplate();
    const highlightTemplate = highlightTemplateWrapper.replace('{{ content }}', userTemplate);
    const renderedHighlight = this.nunjucks.renderString(highlightTemplate, highlightParams);
    return trimMultipleLines(renderedHighlight);
  }

  private renderNotesSimple(book: Book, highlights: Highlight[]): string {
    const h1Highlights = highlights.filter((highlight) => highlight.note.match(/\.h[0-9]{1}/gm) !== null );
    return h1Highlights.map((h) => this.renderNoteSimple(book, h)).join('');
  }

  private renderNotes(book: Book, highlights: Highlight[]): string {
    const h1Highlights = highlights.filter((highlight) => highlight.note.match(/\.h[0-9]{1}/gm) !== null );
    return h1Highlights.map((h) => this.renderNote(book, h)).join('');
  }

  public render(entry: BookHighlight): string {
    const { book, highlights } = entry;

    const params: RenderTemplate = {
      ...book,
      fullTitle: book.title,
      title: shortenTitle(book.title),
      appLink: appLink(book),
      ...entry.metadata,
      highlights: this.renderHighlights(book, highlights),
    };

    return this.nunjucks.renderString(bookTemplate, params);
  }

  public renderHighlight(book: Book, highlight: Highlight): string {
    const highlightParams = { ...highlight, appLink: appLink(book, highlight) };

    const userTemplate =
      get(settingsStore).highlightTemplate || this.defaultHighlightTemplate();

    const highlightTemplate = highlightTemplateWrapper.replace('{{ content }}', userTemplate);

    const renderedHighlight = this.nunjucks.renderString(highlightTemplate, highlightParams);

    return trimMultipleLines(renderedHighlight);
  }

  private renderHighlights(book: Book, highlights: Highlight[]): string {
    return highlights.map((h) => this.renderHighlight(book, h)).join('\n');
  }
}
