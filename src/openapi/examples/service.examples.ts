import {
    EXAMPLE_CATEGORY_GEL_ID,
    EXAMPLE_CATEGORY_MANICURE_ID,
    EXAMPLE_SERVICE_GEL_ID,
    EXAMPLE_SERVICE_MANICURE_ID,
    EXAMPLE_TIMESTAMP,
} from '@openapi/examples/ids';

export const serviceManicureExample = {
    id: EXAMPLE_SERVICE_MANICURE_ID,
    categoryId: EXAMPLE_CATEGORY_MANICURE_ID,
    name: 'Classic Manicure',
    description: 'Shape, cuticle care, and polish of choice.',
    price: 35,
    estimatedMinutes: 45,
    visible: true,
    createdAt: EXAMPLE_TIMESTAMP,
    updatedAt: EXAMPLE_TIMESTAMP,
};

export const serviceGelExample = {
    id: EXAMPLE_SERVICE_GEL_ID,
    categoryId: EXAMPLE_CATEGORY_GEL_ID,
    name: 'Gel Color',
    description: 'Long-wear gel polish application.',
    price: 45,
    estimatedMinutes: 50,
    visible: true,
    createdAt: EXAMPLE_TIMESTAMP,
    updatedAt: EXAMPLE_TIMESTAMP,
};

export const serviceCategoryManicureExample = {
    id: EXAMPLE_CATEGORY_MANICURE_ID,
    name: 'Manicure & Pedicure',
    sortOrder: 1,
    createdAt: EXAMPLE_TIMESTAMP,
    updatedAt: EXAMPLE_TIMESTAMP,
};

export const serviceCategoryGelExample = {
    id: EXAMPLE_CATEGORY_GEL_ID,
    name: 'Gel Polish',
    sortOrder: 2,
    createdAt: EXAMPLE_TIMESTAMP,
    updatedAt: EXAMPLE_TIMESTAMP,
};

export const serviceCategoryWithServicesExample = {
    ...serviceCategoryManicureExample,
    services: [serviceManicureExample],
};
