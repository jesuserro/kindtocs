/**
 * "note": ".h4 .patata\nLínea 1.\nLínea número 2.\nLínea número 3.",
 * Descartar primera línea de tags con puntos.
 * @param note: string
 * @returns
 */
export function getNoteText (note: string): string {
  const refs = note.match(/(.*?)\n|(.*\s)/);
  let text = "";
  let lines = [];
  if(refs && refs.input){
    // console.log("refs", refs);
    text = refs.input;
    lines = text.split("\n");

    const regex = /\.([a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜçÇ]+)\s?/gm;
    const subst = `[[$1]] `;
    let newLine = lines.shift();
    newLine = newLine.replace(regex, subst);
    lines.unshift(newLine);

    text = lines.join("\n  ");
    return text.trim() + "<span></span>  ";
  }
  return "";
}

/**
 * "note": ".h7 [[Gn-01#v1]] [[Gn-02#v4a]]\nAquí se explica la creación del universo.",
 * @param note: string
 * @returns
 */
export function getRef (note: string): string {
  const refs = note.match(/\.h[0-9]{1} (\[\[.*\]\] \[\[.*\]\])/);
  if(refs){
    return refs[1];
  }
  return "";
}

export function getTabHeader (header: string): string {
  const headers = {
    h1: '##',
    h2: '###',
    h3: '####',
    h4: '#####',
    h5: '######',
    h6: '*',
    h7: "  *",
    h8: "    *"
  };
  return "\n"+headers[header];
}

// Para la Biblia
export function getTabHeaderChapter (header: string): string {
  const headers = {
    h4: '#',
    h5: '##',
    h6: '###',
    h7: "####",
    h8: "#####"
  };
  return "\n"+headers[header];
}

export function getTabHeaderSimple (header: string): string {
  const headers = {
    h1: '#',
    h2: '##',
    h3: '###',
    h4: '####',
    h5: '#####',
    h6: '######',
    h7: "*",
    h8: "  *"
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

export function getColorIconSimple (header: string): string {
  const colors = {
    h7:      "&nbsp;",
    h8:      "&nbsp;",
    default: ""
  };
  return colors[header] || colors['default'];
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
  if(note && headers && headers.length > 0){
    return headers[1];
  }
  return "";
}

