
export function getHeaderMarkdown (header: string): string {
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

  export function getColorIcon (color: string): string {
    const colors = {
      pink:    "🟥",
      orange:  "🟧",
      blue:    "🟦",
      default: "🟨"
    };
    return colors[color] || colors['default'];
  }

  export function getIsFavorite (note: string): string {
    const isFavorite = note.match(/\.[favoritos|favoritosBiblia]/);
    if(isFavorite){
      return "❤️";
    }
    return "";
  }

  export function getHeader (note: string): string {
    const headers = note.match(/\.(h[0-9]{1})/);
    return headers[1];
  }

