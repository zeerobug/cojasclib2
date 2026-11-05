declare const _default: {
    /** Returns the colors of a scheme. Throws if the scheme doesn't exist. */
    scheme: (name: string) => string[];
    /** Names of every bundled scheme (Tableau, ColorBrewer and Office). */
    list: () => string[];
    has: (name: string) => boolean;
    /** Converts `#rgb` / `#rrggbb` to `rgba(...)` with the given opacity. Other color formats are returned unchanged. */
    alpha: (color: string, opacity: number) => string;
};
export default _default;
