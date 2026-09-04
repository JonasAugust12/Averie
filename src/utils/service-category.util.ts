export function slugifyCategoryId(name: string): string {
    const slug = name
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return slug || `cat-${Date.now()}`;
}

/** Kebab-case slug for ServiceCategory.slug (same rules as legacy slugifyCategoryId). */
export const slugifyCategoryName = slugifyCategoryId;
