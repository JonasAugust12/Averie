export interface PromotionSettingsDto {
    enabled: boolean;
    title: string;
    description: string;
    startDate: string | null;
    endDate: string | null;
    /** When true (default), landing hides the section after endDate passes. */
    hideAfterExpiry: boolean;
    /** When true (default), landing shows the section before startDate (announce early). When false, only within start–end dates. */
    showBeforeStartDate: boolean;
    imageUrl: string | null;
    imagePublicId: string | null;
    imageWidth: number | null;
    imageHeight: number | null;
}
