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
    name: 'Manicure',
    description: 'Soak, cuticle & nail care, moisturize massage and polish.',
    price: 25,
    estimatedMinutes: 45,
    visible: true,
    createdAt: EXAMPLE_TIMESTAMP,
    updatedAt: EXAMPLE_TIMESTAMP,
};

export const serviceGelExample = {
    id: EXAMPLE_SERVICE_GEL_ID,
    categoryId: EXAMPLE_CATEGORY_GEL_ID,
    name: 'Gel Polish Manicure',
    description: 'Complete manicure with premium gel polish cured under LED light.',
    price: 40,
    estimatedMinutes: 50,
    visible: true,
    createdAt: EXAMPLE_TIMESTAMP,
    updatedAt: EXAMPLE_TIMESTAMP,
};

export const serviceCategoryManicureExample = {
    id: EXAMPLE_CATEGORY_MANICURE_ID,
    name: 'The Signature',
    slug: 'signature',
    sortOrder: 0,
    icon: 'Sparkles',
    subtitle: 'Refreshing · Revitalizing',
    description:
        "Sit back, relax and enjoy Averie's signature manicure and pedicure treatment that will result in strong healthy and resilient nails.",
    note: '',
    featured: true,
    createdAt: EXAMPLE_TIMESTAMP,
    updatedAt: EXAMPLE_TIMESTAMP,
};

export const serviceCategoryGelExample = {
    id: EXAMPLE_CATEGORY_GEL_ID,
    name: 'Gel Polish',
    slug: 'gel-polish',
    sortOrder: 5,
    icon: 'Palette',
    subtitle: 'Long-Lasting · High-Shine',
    description: 'Durable, chip-resistant gel formula cured under LED light.',
    note: '',
    featured: false,
    createdAt: EXAMPLE_TIMESTAMP,
    updatedAt: EXAMPLE_TIMESTAMP,
};

export const serviceCategoryWithServicesExample = {
    ...serviceCategoryManicureExample,
    services: [serviceManicureExample],
};
