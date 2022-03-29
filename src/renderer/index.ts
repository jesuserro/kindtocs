import nunjucks, { Environment } from 'nunjucks';
import { get } from 'svelte/store';
import moment  from 'moment';

import bookTemplate from './templates/bookTemplate.njk';
import notesTemplate from './templates/notesTemplate.njk';
import defaultHighlightTemplate from './templates/defaultHighlightTemplate.njk';
import bookTpl from './templates/book.njk';
import noteTpl from './templates/note.njk';
import chapterTpl from './templates/chapter.njk';
import chapterNotesTpl from './templates/chapterNotes.njk';
import notesSinHeaderTpl from './templates/notesSinHeaderTpl.njk';
import highlightTemplateWrapper from './templates/highlightTemplateWrapper.njk';
import { BlockReferenceExtension, TrimAllEmptyLinesExtension } from './nunjucks.extensions';
import { shortenTitle } from '~/utils';
import { settingsStore } from '~/store';
import { trimMultipleLines } from './helper';
import type { Book, BookHighlight, Highlight, HighlightToc, RenderTemplate } from '~/models';
import { getHeader, getTabHeader, getTabHeaderSimple, getTabHeaderChapter, getColorIcon, getColorIconSimple, getIsFavorite, getRef, getNoteText } from '~/kindtocs/global';

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

  // Last tab
  protected tab: string;

  constructor() {
    this.nunjucks = new nunjucks.Environment(null, { autoescape: false });
    this.nunjucks.addExtension('BlockRef', new BlockReferenceExtension());
    this.nunjucks.addExtension('Trim', new TrimAllEmptyLinesExtension());
    this.nunjucks.addFilter("date", function(date, format) {
      return moment(date).format(format);
    });

    // const dateFilter = require('nunjucks-date-filter');
    // this.nunjucks.addFilter('date', dateFilter);
  }

  public validate(template: string): boolean {
    try {
      this.nunjucks.renderString(template, { text: '' });
      return true;
    } catch (error) {
      return false;
    }
  }

  public bookTpl(): string {
    return bookTpl.trim();
  }
  public noteTpl(): string {
    return noteTpl.trim();
  }
  public chapterTpl(): string {
    return chapterTpl.trim();
  }
  public chapterNotesTpl(): string {
    return chapterNotesTpl.trim();
  }
  public notesSinHeaderTpl(): string {
    return notesSinHeaderTpl.trim();
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
   *
   * @param entry Clon de render()
   * @returns
   */
  public renderSpecial0(entry: BookHighlight): string {
    const { book, highlights } = entry;

    const params: RenderTemplate = {
      ...book,
      fullTitle: book.title,
      title: shortenTitle(book.title),
      appLink: appLink(book),
      ...entry.metadata,
      highlights: this.renderSpecial(book, highlights),
    };

    return this.nunjucks.renderString(notesTemplate, params);
  }


  /**
   *
   * @param entry Clon de render()
   * @returns
   */
  public renderTocChaptersNotes(entry: BookHighlight): string {
    const { book, highlights } = entry;

    const params: RenderTemplate = {
      ...book,
      fullTitle: book.title,
      title: shortenTitle(book.title),
      appLink: appLink(book),
      ...entry.metadata,
      highlights: this.renderChaptersNotes(book, highlights),
    };

    return this.nunjucks.renderString(notesTemplate, params);
  }


  /**
   *
   * @param entry Clon de render()
   * @returns
   */
  public renderTocChapters(entry: BookHighlight): string {
    const { book, highlights } = entry;

    const params: RenderTemplate = {
      ...book,
      fullTitle: book.title,
      title: shortenTitle(book.title),
      appLink: appLink(book),
      ...entry.metadata,
      highlights: this.renderChapters(book, highlights),
    };

    return this.nunjucks.renderString(notesTemplate, params);
  }


  /**
   * Clon de renderHighlight()
   * @param book
   * @param highlight
   * @returns
   */
  public renderMySpecialHighlights(book: Book, highlight: HighlightToc): string {

    const note = highlight.note;
    const header = getHeader(note);

    highlight.header = header;
    highlight.tab = getTabHeaderSimple(header);
    highlight.icon = getColorIcon(highlight.color);
    highlight.isFavorite = getIsFavorite(note);
    highlight.ref = getRef(note);
    highlight.noteText = getNoteText(note);

    const highlightParams = { ...highlight, appLink: appLink(book, highlight) };
    const userTemplate = this.chapterNotesTpl();
    const highlightTemplate = highlightTemplateWrapper.replace('{{ content }}', userTemplate);
    const renderedHighlight = this.nunjucks.renderString(highlightTemplate, highlightParams);
    return trimMultipleLines(renderedHighlight);

  }


  public renderChapterNotes(book: Book, highlight: HighlightToc): string {

    const note = highlight.note;
    const header = getHeader(note);

    // Este if para la biblia, no para Abandono
    if(header == "h1" || header == "h2" || header == "h3"){
      // return;
    }
    // Para poner subrayados? No. En el Abandono no influye, en Biblia sí.
    if( typeof note == 'undefined' || !note || note.trim() == "" ){
      // return;
    }else{
      // Nota existente
      // console.log("highlight", highlight);
    }

    highlight.header = header;
    highlight.tab = getTabHeaderSimple(header);
    highlight.icon = getColorIcon(highlight.color);
    highlight.isFavorite = getIsFavorite(note);
    highlight.ref = getRef(note);
    highlight.noteText = getNoteText(note);

    const highlightParams = { ...highlight, appLink: appLink(book, highlight) };
    const userTemplate = this.chapterNotesTpl();
    const highlightTemplate = highlightTemplateWrapper.replace('{{ content }}', userTemplate);
    const renderedHighlight = this.nunjucks.renderString(highlightTemplate, highlightParams);
    return trimMultipleLines(renderedHighlight);
  }


  /**
   * Clon de renderHighlight()
   * @param book
   * @param highlight
   * @returns
   */
  public renderChapter(book: Book, highlight: HighlightToc): string {

    const note = highlight.note;
    const header = getHeader(note);
    if(header == "h1" || header == "h2" || header == "h3"){
      return;
    }
    highlight.header = header;
    highlight.tab = getTabHeaderChapter(header);
    highlight.icon = getColorIcon(highlight.color);
    highlight.isFavorite = getIsFavorite(note);
    highlight.ref = getRef(note);

    const highlightParams = { ...highlight, appLink: appLink(book, highlight) };
    const userTemplate = this.chapterTpl();
    const highlightTemplate = highlightTemplateWrapper.replace('{{ content }}', userTemplate);
    const renderedHighlight = this.nunjucks.renderString(highlightTemplate, highlightParams);
    return trimMultipleLines(renderedHighlight);
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
    const userTemplate = this.noteTpl();
    const highlightTemplate = highlightTemplateWrapper.replace('{{ content }}', userTemplate);
    const renderedHighlight = this.nunjucks.renderString(highlightTemplate, highlightParams);
    return trimMultipleLines(renderedHighlight);
  }


  public renderNoteSimple(book: Book, highlight: HighlightToc): string {

    const note = highlight.note;
    const header = getHeader(note);
    highlight.header = header.trim();
    highlight.tab = getTabHeaderSimple(header);
    highlight.icon = getColorIconSimple(header);
    highlight.isFavorite = getIsFavorite(note);
    highlight.ref = getRef(note);

    const highlightParams = { ...highlight, appLink: appLink(book, highlight) };
    const userTemplate = this.bookTpl();
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

  private renderChapters(book: Book, highlights: Highlight[]): string {
    const h1Highlights = highlights.filter((highlight) => highlight.note.match(/\.h[0-9]{1}/gm) !== null );
    return h1Highlights.map((h) => this.renderChapter(book, h)).join('');
  }

  /**
   * IMPORTANTE: aquí capturamos encabezados y/o subrayados!
   *
   * Tener en cuenta subrayados como el siguiente (no sólo encabezados), el atributo "note" carece de headers (.h1, .h2, etc.):
   *
   * color: "yellow",
   * note: ".test .abandono
Pruebas, está es la nota para el subrayado de color amarillo",
   * page: "63",
   * text: "Esta breve obra se compone de cartas escritas por un eclesiástico a la superiora de una comunidad religiosa. En ella se ve claro que el autor fue un hombre espiritual, interior y gran amigo de Dios. Él descubre en sus cartas, aquí abreviadas a veces, el verdadero método, el más corto y realmente el único para llegar a Dios."
   *
   *
   * Notas con encabezados, tiene el atributo note así, con un .h1:
   * note: ".h1\nEl autor habla de aceptar cada evento presente, por muy pequeño que sea."
   *
   */
  private renderChaptersNotes(book: Book, highlights: Highlight[]): string {
    const h1Highlights = highlights.filter((highlight) => highlight.note.match(/\.h[0-9]{1}/gm) !== null );
    return h1Highlights.map((h) => this.renderChapterNotes(book, h)).join('');
  }

  private renderSpecial(book: Book, highlights: Highlight[]): string {
    const h1Highlights = highlights.filter((highlight) => highlight.note.match(/\.h[0-9]{1}/gm) !== null );
    return h1Highlights.map((h) => this.renderMySpecialHighlights(book, h)).join('');
  }

  private renderSpecialHighlights(book: Book, highlights: Highlight[]): string {
    return highlights.map((h) => this.renderMySpecialHighlights(book, h)).join('');
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
