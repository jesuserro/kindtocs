import nunjucks, { Environment } from 'nunjucks';
import { get } from 'svelte/store';

import bookTemplate from './templates/bookTemplate.njk';
import bookTemplateToc from './templates/bookTemplateToc.njk';
import defaultHighlightTemplate from './templates/defaultHighlightTemplate.njk';
import tocHighlightTemplate from './templates/tocHighlightTemplate.njk';
import highlightTemplateWrapper from './templates/highlightTemplateWrapper.njk';
import { BlockReferenceExtension, TrimAllEmptyLinesExtension } from './nunjucks.extensions';
import { shortenTitle } from '~/utils';
import { settingsStore } from '~/store';
import { trimMultipleLines } from './helper';
import type { Book, BookHighlight, Highlight, HighlightToc, RenderTemplate } from '~/models';

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
  public renderToc(entry: BookHighlight): string {
    const { book, highlights } = entry;

    const params: RenderTemplate = {
      ...book,
      fullTitle: book.title,
      title: shortenTitle(book.title),
      appLink: appLink(book),
      ...entry.metadata,
      highlights: this.renderTocHighlights(book, highlights),
    };

    return this.nunjucks.renderString(bookTemplateToc, params);
  }

  public getHeader (header: string): string {
    const headers = {
      h1: '##',
      h2: '###',
      h3: '####',
      h4: '#####',
      h5: '######',
      h6: '*',
      h7: "  *",
      h8: "    -"
    };
    return "\n"+headers[header];
  }

  public getColorIcon (color: string): string {
    const colors = {
      pink: "🟥",
      orange: "🟧",
      blue: "🟦",
      default: "🟨"
    };
    return colors[color] || colors['default'];
  }


  /**
   * Clon de renderHighlight()
   * @param book
   * @param highlight
   * @returns
   */
  public renderTocHighlight(book: Book, highlight: HighlightToc): string {

    const headers = highlight.note.match(/\.(h[0-9]{1})/);
    const header = headers[1];
    highlight.header = this.getHeader(header);
    highlight.icon = this.getColorIcon(highlight.color);
    // highlight.text += " ("+header+")";

    const highlightParams = { ...highlight, appLink: appLink(book, highlight) };
    const userTemplate = this.tocHighlightTemplate();
    const highlightTemplate = highlightTemplateWrapper.replace('{{ content }}', userTemplate);
    const renderedHighlight = this.nunjucks.renderString(highlightTemplate, highlightParams);
    return trimMultipleLines(renderedHighlight);
  }

  private renderTocHighlights(book: Book, highlights: Highlight[]): string {
    const h1Highlights = highlights.filter((highlight) => highlight.note.match(/\.h[0-9]{1}/gm) !== null );
    return h1Highlights.map((h) => this.renderTocHighlight(book, h)).join('');
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
