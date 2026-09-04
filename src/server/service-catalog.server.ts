import { connectToDatabase } from '@libs/mongodb';
import { serializeServiceCategory, serializeService } from '@mappers';
import { ServiceCategory } from '@models/service-category.model';
import { Service } from '@models/service.model';
import type { ServiceCategoryWithServicesDto } from '@services/service-catalog.service';

export async function getPublicServiceCatalog(): Promise<ServiceCategoryWithServicesDto[]> {
    await connectToDatabase();

    const categories = await ServiceCategory.find().sort({ sortOrder: 1, name: 1 }).lean();
    const services = await Service.find({ visible: true }).lean();

    return categories.map((category) => ({
        ...serializeServiceCategory(category),
        services: services
            .filter((service) => String(service.categoryId) === String(category._id))
            .map(serializeService),
    }));
}
