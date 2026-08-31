# Hemanth Kumar R — portfolio (React)

Vite + React port of the portfolio. Single component, inline styles, no CSS framework.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
npm run preview
```

Deploy `dist/` to Netlify, Vercel, GitHub Pages or any static host.

## Where things are

| File | What |
| --- | --- |
| `src/Portfolio.jsx` | the whole page: layout, styles, both live demos |
| `src/data.js` | all copy — stack, experience, projects, run log |
| `index.html` | fonts, meta/OG tags, JSON-LD, keyframes |
| `public/` | hero mesh image, résumé PDF |

Edit copy in `src/data.js`. The two interactive demos (10k-row virtualised
table, flow composer) live in `Portfolio.jsx` — `buildRows`/`sortRows` and
`runFlow`/`moveNode` respectively.

## Before deploying

- Add an `og:image` to `index.html` (1200×630) so shared links render a card.
- Update the résumé PDF in `public/` when you revise it — the filename is
  referenced in `Portfolio.jsx`.
