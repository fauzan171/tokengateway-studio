# CONTENT_GENERATION_RULES — patokan generator konten TokenGateway

Kontrak untuk generator konten: apa yang boleh diisi, seberapa panjang, referensi
aset/fakta mana yang wajib, dan bagaimana kegagalan ditangani. Generator
menghasilkan **data terstruktur**; HTML/layout dimiliki registry di
`src/blueprints/`. Tidak ada layanan AI generasi di milestone ini.

Sumber kebenaran (jangan duplikasi nilai):

- Schema: `src/contracts/campaign.schema.ts`
- Registry layout/slot: `src/blueprints/catalog.ts`, `src/blueprints/descriptors.ts`
- Renderer: `src/blueprints/content/renderers.tsx` via `getRenderer`/`RENDERERS`
- Fakta: `src/facts/product-facts.json` (+ `src/facts/registry.ts`)
- Aset: `src/assets/registry.ts`
- Token: `src/design/tokens.json` (+ `tokens.generated.css`)
- Format/safe: `src/contracts/formats.ts`

## 1. Envelope manifest

| Field | Aturan |
|---|---|
| `schemaVersion` | wajib `"1.0.0"` |
| `campaignId` | slug `[a-z0-9-]`, maks 64 |
| `name` | teks biasa, maks 100 |
| `locale` | wajib `"id-ID"` |
| `designRevision` | wajib `"swiss-tech-v1"` |
| `factsRevision` | wajib `"product-facts-v1"` |
| `formats` | minimal 1 dari `IG_CAROUSEL`, `VERTICAL`; tanpa duplikat |
| `verticalProfiles` | dari `IG_STORY`, `TIKTOK`; wajib bila ada `VERTICAL` |
| `slides` | 1–30 slide, `id` unik |

Semua objek **strict**: kunci tak dikenal ditolak. Teks biasa menolak karakter
kontrol dan markup HTML/SVG (`<tag`). Payload menyerupai kredensial
(`sk-…`, `tk-gw-…`, `BEGIN … PRIVATE KEY`) ditolak.

## 2. Layout, slot, batas teks

Lima layout. `*` = required. Slot `longtext` boleh multi-baris.

### HERO_HOOK
| Slot | Kind | Maks |
|---|---|---|
| `title` * | longtext | 110 |
| `highlight` * | text | 30 |
| `categoryTag` * | text | 36 |
| `subline` * | longtext | 180 |

### PROBLEM_COMPARISON
| Slot | Kind | Maks |
|---|---|---|
| `title` * | longtext | 80 |
| `comparatorFactId` * | factRef | — |
| `offerFactId` * | factRef | — |
| `leftLabel` * | text | 32 |
| `rightLabel` * | text | 32 |
| `rows` * | list 2–3 | `left`/`right` 70 |
| `note` | longtext | 140 |

### MODEL_CATALOG
| Slot | Kind | Maks |
|---|---|---|
| `title` * | longtext | 80 |
| `subline` | longtext | 140 |
| `models` * | list tepat 3 | provider unik GLM/DEEPSEEK/GEMINI |
| `models[].provider` * | text | — |
| `models[].availabilityFactId` * | factRef | — |
| `models[].label` * | text | 32 |
| `models[].description` * | longtext | 90 |
| `models[].capabilityFactIds` | factRef[] | — |

### CODE_MOCKUP
| Slot | Kind | Maks |
|---|---|---|
| `title` * | longtext | 80 |
| `integrationFactId` * | factRef | — |
| `windowTitle` | text | 40 |
| `steps` * | list 2–4 | per item 90 |
| `caption` | longtext | 140 |

### PRICING_OFFER
| Slot | Kind | Maks |
|---|---|---|
| `title` * | longtext | 80 |
| `offerFactId` * | factRef | — |
| `quotaLabel` * | text | 32 |
| `supportingText` * | longtext | 140 |
| `ctaLabel` * | text | 40 |
| `ctaTargetFactId` * | factRef | — |
| `termsNote` | longtext | 180 |

## 3. Aturan highlight

- `highlight` harus berupa **substring `title` yang muncul tepat sekali**.
- Muncul 0 kali atau >1 kali → `TEXT_OVERFLOW` pada `props.highlight`, export diblokir.
- Hanya satu frasa ditandai cyan; bukan seluruh judul.

## 4. Referensi fakta dan aset

- Semua `*FactId` harus menunjuk fact di snapshot. Tidak ada → `FACT_MISSING`.
- Fact `PENDING` → `FACT_UNVERIFIED`, slide tetap **draft**.
- Aset dari allowlist `assets/registry.ts`. `RASTER_REFERENCE` →
  `ASSET_NOT_VECTOR`; `MISSING`/`UNAPPROVED` → `ASSET_MISSING`.
- Nilai komersial (harga, kuota, validity) **hanya** dari fact reference; tidak
  pernah literal di payload atau komponen.

## 5. Format dan safe profile (CSS px)

| Profile | Canvas | Inset L/T/R/B | Safe | Export DPR 2 |
|---|---|---|---|---|
| IG_CAROUSEL | 1080×1350 | 80/80/80/80 | 920×1190 | 2160×2700 |
| IG_STORY | 1080×1920 | 80/140/80/160 | 920×1620 | 2160×3840 |
| TIKTOK | 1080×1920 | 80/140/180/420 | 820×1360 | 2160×3840 |

Vertical di-**re-layout**, bukan stretch dari feed. Guides hanya preview.

## 6. Harga, validity, fee

- Harga integer IDR via `formatIdr` (tanpa aritmetika float).
- Kuota via `formatQuota` (nilai + unit bersama), validity terpisah.
- Tampilan pricing minimum: nama/model paket, grant token, harga paket, masa
  berlaku, akses model, QRIS, CTA, **catatan biaya layanan** (f08). Fee tidak
  boleh diletakkan jauh dari nominal.
- Satu package ID per specimen, bukan gabungan nilai termurah beberapa paket.

## 7. Contoh payload

Valid:
```json
{ "id": "hook", "layout": "HERO_HOOK",
  "props": { "title": "Mulai dari Rp10.000.", "highlight": "Rp10.000",
             "categoryTag": "PAKET GLM", "subline": "50 juta token. 7 hari." } }
```

Invalid:
```json
{ "title": "Mulai dari Rp10.000.", "highlight": "tidak-ada" }
```
→ `TEXT_OVERFLOW` pada `props.highlight`; final export diblokir.

## 8. Penanganan overflow

1. Muat font/aset → layout pada native size.
2. Ukur slot → wrap → kurangi gap → kurangi ukuran font bertahap hingga minimum.
3. Gagal → `TEXT_OVERFLOW`, bukan ellipsis/crop/hidden overflow/scroll kode
   horizontal/font di bawah minimum.
4. Error mengidentifikasi slide, profile, JSON path/slot, penyebab dan tindakan.

## 9. Readiness dan export

- `finalExportAvailable` **false** selama ada aset belum approved, fact PENDING,
  font belum siap, atau geometry keluar safe rect.
- Screenshot bukan bukti artifact approved; capture adalah draft proof.
- Logo draft dan empat mark pihak ketiga tetap belum approved. Jangan ubah
  status tanpa approval eksplisit pemilik.
