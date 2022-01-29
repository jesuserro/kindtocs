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
  return headers[1];
}

