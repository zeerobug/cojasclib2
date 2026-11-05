"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const brewer = require("./colorschemes.brewer");
const office = require("./colorschemes.office");
const tableau = require("./colorschemes.tableau");
const schemes = Object.assign(Object.assign(Object.assign({}, brewer), office), tableau);
exports.default = {
    /** Returns the colors of a scheme. Throws if the scheme doesn't exist. */
    scheme: (name) => {
        const colors = schemes[name];
        if (!colors) {
            throw new Error(`Unknown color scheme "${name}"`);
        }
        return colors;
    },
    /** Names of every bundled scheme (Tableau, ColorBrewer and Office). */
    list: () => Object.keys(schemes),
    has: (name) => Object.prototype.hasOwnProperty.call(schemes, name),
    /** Converts `#rgb` / `#rrggbb` to `rgba(...)` with the given opacity. Other color formats are returned unchanged. */
    alpha: (color, opacity) => {
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
