# Landing Promotion Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an admin-configurable singleton promotion section on the landing page (after Hero) with Cloudinary image upload, optional date bounds (Option B), and delete-on-replace to avoid Cloudinary storage bloat.

**Architecture:** Extend `SalonSettings.promotion` embedded document; public `GET /api/settings/promotion`; admin mutations via Server Actions; `src/libs/cloudinary.server.ts` for upload/destroy; `LandingPromotion` Editorial Spotlight component; admin tab at `/admin/settings/promotion`.

**Tech Stack:** Next.js 15 App Router, MongoDB/Mongoose, Cloudinary SDK, Zod, TanStack Query, next-intl, Tailwind 4, Lucide React.

## Global Constraints

- GET reads → Route Handlers in `src/app/api/**`; POST/PUT/PATCH/DELETE mutations → Server Actions in `src/actions/**`
- Response envelope: `{ status: number, message: string, data: T | null }`
- Path aliases: `@actions`, `@services`, `@validations`, `@typings`, `@utils`, `@libs`, `@models`, `@mappers`, `@components`, `@i18n`, `@messages`
- Date bounds Option B: empty `startDate` / `endDate` = unbounded on that side
- Cloudinary: persist `imageUrl` + `imagePublicId`; delete old `publicId` on replace/remove
- Folder: `Averie/promotion`; max upload 5MB; jpeg/png/webp only
- Landing: section only if `isPromotionVisible()` AND `imageUrl` present

---

## Task 1: Cloudinary dependency and env

**Files:**

- Modify: `package.json` (via pnpm)
- Modify: `F:\Averie\.env.example`

**Interfaces:**

- Produces: `cloudinary` npm package installed

- [ ] **Step 1: Install cloudinary**

```bash
cd F:\Averie && pnpm add cloudinary
```

- [ ] **Step 2: Uncomment env vars in `.env.example`**

Ensure these lines are active with a short comment:

```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

- [ ] **Step 3: Add values to `.env.local` for local dev** (do not commit)

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml .env.example
git commit -m "chore: add cloudinary dependency for promotion uploads"
```

---

## Task 2: Mongoose schema + types + Zod + visibility util

**Files:**

- Modify: `src/models/salon-settings.model.ts`
- Create: `src/types/promotion-settings.type.ts`
- Create: `src/validations/promotion-settings.schema.ts`
- Create: `src/utils/promotion.util.ts`
- Create: `src/mappers/promotion.mapper.ts`

**Interfaces:**

- Produces: `PromotionSettingsDto`, `updatePromotionSettingsSchema`, `isPromotionVisible(promotion, now?)`, `serializePromotionSettings(doc)`

- [ ] **Step 1: Add promotion subdocument to SalonSettings**

```typescript
const PromotionSettingsSchema = new Schema(
    {
        enabled: { type: Boolean, default: false },
        title: { type: String, default: '', trim: true },
        description: { type: String, default: '', trim: true },
        startDate: { type: String, default: null, trim: true },
        endDate: { type: String, default: null, trim: true },
        imageUrl: { type: String, default: null },
        imagePublicId: { type: String, default: null },
        imageWidth: { type: Number, default: null },
        imageHeight: { type: Number, default: null },
    },
    { _id: false },
);

// In SalonSettingsSchema fields:
promotion: { type: PromotionSettingsSchema, default: () => ({}) },
```

- [ ] **Step 2: Create DTO type**

```typescript
export interface PromotionSettingsDto {
    enabled: boolean;
    title: string;
    description: string;
    startDate: string | null;
    endDate: string | null;
    imageUrl: string | null;
    imagePublicId: string | null;
    imageWidth: number | null;
    imageHeight: number | null;
    visible: boolean;
}
```

- [ ] **Step 3: Zod schema for update action**

```typescript
export const updatePromotionSettingsSchema = z.object({
    enabled: z.boolean(),
    title: z.string().max(120),
    description: z.string().max(500),
    startDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .nullable()
        .optional(),
    endDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .nullable()
        .optional(),
});
```

- [ ] **Step 4: Implement `isPromotionVisible` in `src/utils/promotion.util.ts`**

Use salon timezone date string from existing booking schedule helpers (e.g. format today as `YYYY-MM-DD` in salon TZ). Logic:

```typescript
export function isPromotionVisible(
    promotion: Pick<PromotionSettingsDto, 'enabled' | 'startDate' | 'endDate'>,
    todaySalon: string,
): boolean {
    if (!promotion.enabled) return false;
    if (promotion.startDate && todaySalon < promotion.startDate) return false;
    if (promotion.endDate && todaySalon > promotion.endDate) return false;
    return true;
}
```

- [ ] **Step 5: Mapper sets `visible` via helper**

- [ ] **Step 6: Run type-check**

```bash
pnpm type-check
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git commit -m "feat: add promotion settings schema types and visibility util"
```

---

## Task 3: Cloudinary server library

**Files:**

- Create: `src/libs/cloudinary.server.ts`

**Interfaces:**

- Produces: `uploadPromotionImage(file: Buffer, mimeType: string): Promise<UploadResult>`, `deleteCloudinaryImage(publicId: string): Promise<void>`

- [ ] **Step 1: Create cloudinary.server.ts** (adapt from BRIX-Server)

```typescript
import { v2 as cloudinary } from 'cloudinary';

const FOLDER = 'Averie/promotion';

function ensureConfigured() {
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
    const api_key = process.env.CLOUDINARY_API_KEY;
    const api_secret = process.env.CLOUDINARY_API_SECRET;
    if (!cloud_name || !api_key || !api_secret) {
        throw new Error('Cloudinary is not configured');
    }
    cloudinary.config({ cloud_name, api_key, api_secret });
}

export async function uploadPromotionImage(buffer: Buffer): Promise<{
    url: string;
    publicId: string;
    width?: number;
    height?: number;
}> {
    ensureConfigured();
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: FOLDER,
                resource_type: 'image',
                transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
            },
            (err, result) => {
                if (err || !result) return reject(err);
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                    width: result.width,
                    height: result.height,
                });
            },
        );
        stream.end(buffer);
    });
}

export async function deleteCloudinaryImage(publicId: string): Promise<void> {
    ensureConfigured();
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
}
```

- [ ] **Step 2: Commit**

```bash
git commit -m "feat: add cloudinary server helpers for promotion images"
```

---

## Task 4: Server read + GET API

**Files:**

- Create or extend: `src/server/promotion.server.ts`
- Create: `src/app/api/settings/promotion/route.ts`

**Interfaces:**

- Produces: `getPromotionSettingsDto(): Promise<PromotionSettingsDto>`

- [ ] **Step 1: Server helper loads singleton and maps DTO**

```typescript
export async function getPromotionSettingsDto(): Promise<PromotionSettingsDto> {
    const doc = await getSalonSettingsDocument();
    return serializePromotionSettings(doc);
}
```

- [ ] **Step 2: GET route**

```typescript
export async function GET() {
    try {
        const data = await getPromotionSettingsDto();
        return apiSuccess(data, 'OK');
    } catch (error) {
        console.error('[GET /api/settings/promotion]', error);
        return apiError('Failed to fetch promotion settings', 500);
    }
}
```

- [ ] **Step 3: Verify**

```bash
pnpm dev
curl http://localhost:3000/api/settings/promotion
```

Expected: `{ status: 200, data: { enabled: false, ... } }`

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: add GET /api/settings/promotion"
```

---

## Task 5: Server Actions (update, upload, remove)

**Files:**

- Create: `src/actions/promotion-settings.action.ts`

**Interfaces:**

- Produces: `updatePromotionSettingsAction`, `uploadPromotionImageAction`, `removePromotionImageAction`

- [ ] **Step 1: updatePromotionSettingsAction**

Use `requireAdmin`, `parseActionInput`, `$set: { 'promotion.enabled': ..., 'promotion.title': ... }` on singleton id. Do not touch image fields.

- [ ] **Step 2: uploadPromotionImageAction**

```typescript
'use server';
// Parse FormData file; validate size <= 5MB and mime
// const buffer = Buffer.from(await file.arrayBuffer());
// const uploaded = await uploadPromotionImage(buffer);
// const existing = await getSalonSettingsDocument();
// const oldPublicId = existing.promotion?.imagePublicId;
// await SalonSettings.findByIdAndUpdate(existing._id, {
//   promotion: { ...existing.promotion, imageUrl: uploaded.url, imagePublicId: uploaded.publicId, ... }
// });
// if (oldPublicId && oldPublicId !== uploaded.publicId) {
//   try { await deleteCloudinaryImage(oldPublicId); } catch (e) { console.error(e); }
// }
```

- [ ] **Step 3: removePromotionImageAction**

Delete publicId if set; `$set` image fields to null.

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: add promotion settings server actions with cloudinary lifecycle"
```

---

## Task 6: Client service hooks

**Files:**

- Create: `src/services/promotion.service.ts`

**Interfaces:**

- Consumes: GET `/api/settings/promotion`, promotion actions
- Produces: `usePromotionSettings()`, `useUpdatePromotionSettings()`, `useUploadPromotionImage()`, `useRemovePromotionImage()`

- [ ] **Step 1: Query hook**

```typescript
export function usePromotionSettings(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ['settings', 'promotion'],
        queryFn: async () => {
            const res =
                await apiClient.get<ApiResponse<PromotionSettingsDto>>('/api/settings/promotion');
            return unwrapApiResponse(res.data);
        },
        enabled: options?.enabled,
    });
}
```

- [ ] **Step 2: Mutations via useAppMutation invalidating `['settings', 'promotion']`

- [ ] **Step 3: Commit**

---

## Task 7: LandingPromotion component

**Files:**

- Create: `src/components/landing/LandingPromotion.tsx`
- Modify: `src/components/landing/LandingPageView.tsx`
- Modify: `src/components/landing/index.ts`
- Modify: `messages/en/salon.json`, `messages/vi/salon.json`

**Interfaces:**

- Consumes: `usePromotionSettings()` or props from parent

- [ ] **Step 1: Add i18n keys**

```json
"landing": {
  "promotion": {
    "eyebrow": "Special Offer",
    "visitUs": "Visit our salon to experience this offer firsthand.",
    "bookExperience": "Book your appointment and enjoy the Averie ritual.",
    "cta": "Book now"
  }
}
```

(Vietnamese equivalents in `vi/salon.json`)

- [ ] **Step 2: LandingPromotion layout**

- Section `id="promotion"` with checker/grid background (CSS linear-gradient grid, low opacity)
- `FadeIn` wrapper
- Two columns md+: text + Lucide lines; image frame with `relative min-h-[280px]`, `Image fill className="object-contain"`
- `PillLink href="/book"`
- Return `null` if `!data?.visible || !data.imageUrl`

- [ ] **Step 3: Insert in LandingPageView after `<LandingHero />`**

- [ ] **Step 4: Manual visual check at 375px and 1280px**

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: add LandingPromotion section after hero"
```

---

## Task 8: Admin settings tab and page

**Files:**

- Modify: `src/components/admin/settings/AdminSettingsNav.tsx`
- Create: `src/app/admin/settings/promotion/page.tsx`
- Modify: `messages/en/admin.json`, `messages/vi/admin.json`

**Interfaces:**

- Consumes: promotion hooks and actions

- [ ] **Step 1: Add tab**

```typescript
{ href: '/admin/settings/promotion', icon: Megaphone, key: 'promotion' as const, exact: false },
```

Add `settingsNav.promotion` and `promotionSettings.*` message keys.

- [ ] **Step 2: Build settings page**

- Toggle enabled
- Inputs: title, description, startDate, endDate (type date, allow empty)
- Image: file input, preview via `imageUrl`, Upload button → `uploadPromotionImageAction`, Remove → `removePromotionImageAction`
- Save button → `updatePromotionSettingsAction`
- Help text explaining Option B date semantics
- Toast on success (`admin.toasts.promotionSaved` — add key)

- [ ] **Step 3: Commit**

```bash
git commit -m "feat: add admin promotion settings tab and form"
```

---

## Task 9: Final verification

- [ ] **Step 1:** `pnpm type-check` — PASS
- [ ] **Step 2:** `pnpm lint` — PASS
- [ ] **Step 3:** Manual: upload image A → landing shows; upload image B → A deleted from Cloudinary dashboard; clear dates + enabled → always visible; set endDate in past → hidden
- [ ] **Step 4:** Final commit if any fixes

```bash
git commit -m "fix: promotion section polish and edge cases"
```

---

## Self-Review Checklist

| Spec requirement                        | Task                           |
| --------------------------------------- | ------------------------------ |
| Singleton promotion on SalonSettings    | Task 2                         |
| Option B optional dates                 | Task 2, 7, 8                   |
| isPromotionVisible                      | Task 2                         |
| GET /api/settings/promotion             | Task 4                         |
| Server Actions only for mutations       | Task 5                         |
| Cloudinary upload folder                | Task 3                         |
| Delete old publicId on replace          | Task 5                         |
| Remove image action                     | Task 5                         |
| 5MB / mime validation                   | Task 5                         |
| Landing after Hero                      | Task 7                         |
| object-contain flexible image           | Task 7                         |
| i18n contextual lines                   | Task 7                         |
| Admin promotion tab                     | Task 8                         |
| Schedule update must not wipe promotion | Task 5 (use dotted $set paths) |

No TBD placeholders remain.
