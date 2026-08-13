# Figma landing reference

- File: [Averie](https://www.figma.com/design/jSdpkpektLCG50Gr4xe2vU/Averie?node-id=13-576)
- File key: `jSdpkpektLCG50Gr4xe2vU`
- Frame: **Landing page** `13:576` (1920 × 7311)
- Implementation constraint: AppShell max-width **1280px**
- Dominant typeface: **Montserrat** (SemiBold titles, Regular body)

## Tokens (from Figma variables)

| Token     | Value                      |
| --------- | -------------------------- |
| Nude      | `#C0957F`                  |
| Third     | `#3A3027`                  |
| Second    | `#8D7766`                  |
| Base      | `#F8F7F3`                  |
| White     | `#FFFFFF`                  |
| TITLE-mon | Montserrat SemiBold 40     |
| TEXT-mon  | Montserrat Regular 16 / 25 |

## Section → node → component

| Section             | Primary node ids                      | Component                 |
| ------------------- | ------------------------------------- | ------------------------- |
| Header              | `13:900` logo, `13:835` nav, `13:890` | `LandingHeader.tsx`       |
| Hero                | `13:837`–`13:839`, `13:902`, `13:907` | `LandingHero.tsx`         |
| Philosophy          | `13:840`, `13:913`, `13:940`          | `LandingPhilosophy.tsx`   |
| Curated services    | `13:845`–`13:847`, `13:919`/`70`/`72` | `LandingServices.tsx`     |
| Treatments & prices | `13:891`, `13:850`                    | `LandingPricing.tsx`      |
| Nail products       | `13:855`, `13:857`, `13:866`–`13:881` | `LandingProducts.tsx`     |
| Testimonials        | `13:856`, `13:943`/`90`/`89`          | `LandingTestimonials.tsx` |
| Hours + CTA         | `13:1000`–`13:996`                    | `LandingHoursCta.tsx`     |
| Footer              | `13:816`–`13:834`, `13:901`           | `LandingFooter.tsx`       |

## Asset manifest (`public/salon/figma/`)

| File                    | Figma node                                         | Used in        |
| ----------------------- | -------------------------------------------------- | -------------- |
| `logo.png`              | `13:900`                                           | Header, Footer |
| `hero.png`              | `13:906`                                           | Hero           |
| `philosophy-main.png`   | `13:913`                                           | Philosophy     |
| `philosophy-inset.png`  | `13:940`                                           | Philosophy     |
| `svc-mani.png`          | `13:924`                                           | Services       |
| `svc-facial.png`        | `13:931`                                           | Services       |
| `svc-wax.png`           | `13:938`                                           | Services       |
| `product-featured.png`  | `13:857`                                           | Products       |
| `product-limited.png`   | `13:866`                                           | Products       |
| `product-nail-care.png` | `13:871`                                           | Products       |
| `product-colors.png`    | `13:876`                                           | Products       |
| `product-tools.png`     | fallback (rate-limit; cloned from `13:876` export) | Products       |
| `pricing-art.png`       | `13:850`                                           | Pricing, Hours |
| `icon-facebook.svg`     | `13:831`                                           | Footer         |

Instagram glyph was not exported (MCP rate limit). Footer uses Lucide `Instagram` for that control only.
