import * as brewer from './colorschemes.brewer';
import * as office from './colorschemes.office';
import * as tableau from './colorschemes.tableau';

const schemes: { [name: string]: string[] } = { ...brewer, ...office, ...tableau };

export default {
  /** Returns the colors of a scheme. Throws if the scheme doesn't exist. */
  scheme: (name: string): string[] => {
    const colors = schemes[name];
    if (!colors) {
      throw new Error(`Unknown color scheme "${name}"`);
    }
    return colors;
  },

  /** Names of every bundled scheme (Tableau, ColorBrewer and Office). */
  list: (): string[] => Object.keys(schemes),

  has: (name: string): boolean => Object.prototype.hasOwnProperty.call(schemes, name),

  /** Converts `#rgb` / `#rrggbb` to `rgba(...)` with the given opacity. Other color formats are returned unchanged. */
  alpha: (color: string, opacity: number): string => {
    const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color);
    if (!match) {
      return color;
    }
    let hex = match[1];
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },
};
