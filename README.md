# Luciano Pinilla — personal portfolio

A personal desktop with Fomo Campus work, real GitHub contributions, and contact through [@foezart](https://x.com/foezart).

## Development

Requires Node 22.13+.

- `npm ci`
- `npm run dev`
- `npm run build`
- `node --experimental-strip-types --test tests/*.test.mjs`

The Mac-style windows close, minimize, expand, and reopen from the dock or menu. On phones they form a readable vertical layout. The original 21st.dev dock is adapted for keyboard access, reduced motion, and bounded animation; see THIRD_PARTY.md.

## GitHub data

`/api/github` reads the public contribution calendar for `ouchip`. It exposes only dates, contribution counts, levels, and a fetch timestamp. Successful responses cache for 15 minutes. No access token is shipped or required. If GitHub is unavailable or changes its markup, the UI shows an honest error and retry instead of fabricated activity. GitHub may take time to count new commits.

## Publishing

This project has its own Sites publication and is separate from the Fomo Campus website. The hosting manifest contains only non-secret project configuration. Keep credentials out of source. Make meaningful commits with an email associated with your GitHub account; activity attribution is controlled by GitHub.

## Visual direction

Only Plus Jakarta Sans and Geist. A painted coastal wallpaper, compact Mac-style menu, and translucent dock. Keep the lower-left name area clear of all windows. There is no About window or “Building in public” label.
