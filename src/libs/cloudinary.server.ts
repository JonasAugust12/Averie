import { v2 as cloudinary } from 'cloudinary';

const PROMOTION_FOLDER = 'Averie/promotion';

export interface CloudinaryUploadResult {
    url: string;
    publicId: string;
    width?: number;
    height?: number;
}

function ensureConfigured() {
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
    const api_key = process.env.CLOUDINARY_API_KEY;
    const api_secret = process.env.CLOUDINARY_API_SECRET;

    if (!cloud_name || !api_key || !api_secret) {
        throw new Error('Cloudinary is not configured');
    }

    cloudinary.config({ cloud_name, api_key, api_secret });
}

export async function uploadPromotionImage(buffer: Buffer): Promise<CloudinaryUploadResult> {
    ensureConfigured();

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: PROMOTION_FOLDER,
                resource_type: 'image',
                transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
            },
            (error, result) => {
                if (error || !result) {
                    reject(error ?? new Error('Cloudinary upload failed'));
                    return;
                }

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
