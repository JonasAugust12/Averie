export interface PromotionSettingsDto {
    enabled: boolean;
    title: string;
    description: string;
    startDate: string | null;
    endDate: string | null;
    /** When true (default), landing hides the section after endDate passes. */
    hideAfterExpiry: boolean;
    imageUrl: string | null;
    imagePublicId: string | null;
    imageWidth: number | null;
    imageHeight: number | null;
    visible: boolean;
}
