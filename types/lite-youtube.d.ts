/**
 * TypeScript JSX + module support for the `<lite-youtube>` custom element.
 *
 * Upstream package: https://github.com/paulirish/lite-youtube-embed
 * The package registers a Web Component via side-effect; React needs an
 * intrinsic element declaration for it to type-check in JSX.
 *
 * We also declare the bare module + its CSS side-effect import so that
 * `import 'lite-youtube-embed'` and
 * `import 'lite-youtube-embed/src/lite-yt-embed.css'` type-check.
 *
 * This file is an ambient script (no top-level import/export) so the
 * `declare module` forms resolve as global module-name declarations rather
 * than as augmentations scoped to this file.
 */

declare module 'lite-youtube-embed';
declare module 'lite-youtube-embed/src/lite-yt-embed.css';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace JSX {
  interface IntrinsicElements {
    'lite-youtube': import('react').DetailedHTMLProps<
      import('react').HTMLAttributes<HTMLElement> & {
        videoid?: string;
        playlabel?: string;
        params?: string;
        poster?: string;
        autoload?: string;
        posterquality?: string;
      },
      HTMLElement
    >;
  }
}
