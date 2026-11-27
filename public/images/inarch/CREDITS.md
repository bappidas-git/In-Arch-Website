# IN-ARCH — image, icon, illustration and font credits

The human-readable copy of `src/data/credits.js`. Every file under `public/images/inarch/` and `public/images/brand/` is listed here with its source, licence, fetch date and what was changed. Licences were read when the assets were fetched, on 27 November 2026.

## Client material

| Asset | Source | Licence | Fetched | Changes |
|---|---|---|---|---|
| Interior photographs (13 unique; `<key>-<width>.{avif,webp,jpg}`) | Supplied by IN-ARCH (`in-arch images/.jpg1`–`.jpg16`; `.jpg13`, `.jpg15`, `.jpg16` repeat `.jpg2`, `.jpg6`, `.jpg3` and are not used) | The client's own material | 2026-11-27 | Cropped per `scripts/image-specs.js` to keep out a person, a photographer's reflection, loose cables, clutter, a branded carton (where the frame allows) and air-conditioners; resized (Lanczos 3); saturation × 0.94; sharpen σ 0.5; metadata stripped; sRGB; AVIF q50, WebP q74, JPEG q78. |
| Logo, wordmark and "IA" monogram (`public/images/brand/`) | Supplied by IN-ARCH (`logos/`) | The client's own mark | 2026-11-27 | Trimmed to the artwork; lockups and wordmarks resized with the alpha resampled and the ink kept exact (#231B15 / #F4EFE7). Not recoloured or redrawn. |

## Icons

| Asset | Source | Licence | Fetched | Changes |
|---|---|---|---|---|
| 15 static line icons (`icons/*.svg`) and 8 animated icons (`lottie/*.json`) | Drawn for this site by `scripts/build-icons.js` | Original work for IN-ARCH | 2026-11-27 | — |

The brief asked for one Icons8 family. icons8.com answered this build session with a Cloudflare 403, and its CDN refuses SVG downloads (403; SVG is a paid format), so the Icons8 licence could not be read and no Icons8 asset is used. Following the brief's fallback, the icons were drawn in-house in the same duotone line style. No Icons8 credit link is required while no Icons8 asset ships; if Icons8 icons replace these without a paid licence (owner decision D-13), the footer must link to https://icons8.com ("Icons by Icons8"), as `ICONS8_CREDIT` in `src/data/credits.js` prepares.

## Illustrations

From [unDraw](https://undraw.co) by Katerina Limpitsouni. Licence (read 2026-11-27): free for commercial and personal use, modification allowed, no permission or attribution required; not for compiling a competing service, redistributing in packs, or training AI models. Credited here anyway.

| File | unDraw illustration | Changes |
|---|---|---|
| `illustrations/not-found.svg` | Page not found (`page-not-found_6wni`) | Recoloured (below); a 20 %-black grid made opaque stone #DAD3C6. |
| `illustrations/enquiry-sent.svg` | Message Sent (`message-sent_iyz6`) | Recoloured. |
| `illustrations/nothing-here.svg` | No data (`no-data_ig65`) | Recoloured. |
| `illustrations/something-broke.svg` | Connection lost (`connection-lost_am29`) | Recoloured; a 10 %-black strip made opaque stone #DAD3C6. |

Recolouring (`scripts/recolour-illustrations.js`): unDraw's primary #6C63FF → terracotta-500 #B5653F; darks #3F3D56 / #2F2E41 / #090814 → espresso #231B15; #F2F2F2 / #F0F0F0 → sand #E9E3D8; #E6E6E6 / #E4E4E4 / #CCC / #CACACA / #D6D6E3 → stone #DAD3C6; white → paper #FAF7F2. None of the four contains a gradient, filter or drop shadow. Each file is under 30 KB.

## Fonts

| Font | Source | Licence | Changes |
|---|---|---|---|
| Fraunces (variable; roman and italic) | Fontsource `@fontsource-variable/fraunces` 5.3.0 — The Fraunces Project Authors (Undercase Type) | SIL Open Font License 1.1 (`/fonts/fraunces-OFL.txt`) | Latin WOFF2 self-hosted (prompt 01). |
| Manrope (variable) | Fontsource `@fontsource-variable/manrope` 5.3.0 — The Manrope Project Authors (Mikhail Sharanda) | SIL Open Font License 1.1 (`/fonts/manrope-OFL.txt`) | Latin WOFF2 self-hosted (prompt 01). |

## Pending third-party assets

| Wanted | Why it is missing | Fallback |
|---|---|---|
| Icons8 icons (14 static, 8 animated) | icons8.com: Cloudflare 403; SVG refused | In-house icons (above) |
| Open-licence photograph `os-light` (key `expertise-atmosphere`) | unsplash.com: bot challenge; pexels.com: Cloudflare 403 | Skipped; the Expertise page is typographic there |
| Open-licence photograph `os-drawing` (key `expertise-drawing`) | as above | Skipped |

Nothing from the pictures embedded in `details of in-arch.pdf` (third-party web images) or from the dummy site's screenshots is used anywhere.
