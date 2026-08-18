export interface ServiceCategoryDto {
    id: string;
    name: string;
    sortOrder: number;
    /** PascalCase Lucide React icon name, e.g. "Scissors". */
    icon: string | null;
    createdAt: string;
    updatedAt: string;
}
