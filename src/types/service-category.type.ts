export interface ServiceCategoryDto {
    id: string;
    name: string;
    slug: string;
    sortOrder: number;
    /** PascalCase Lucide React icon name, e.g. "Scissors". */
    icon: string | null;
    subtitle: string;
    description: string;
    note: string;
    featured: boolean;
    createdAt: string;
    updatedAt: string;
}
