/**
 * Canonical salon service menu — aligned with Averie PDF / Astro price-list.ts
 */

/** @typedef {{ name: string; description?: string; price: number; estimatedMinutes: number }} SalonServiceSeed */
/** @typedef {{ slug: string; name: string; subtitle?: string; description?: string; note?: string; featured?: boolean; sortOrder: number; icon: string; services: SalonServiceSeed[] }} SalonCategorySeed */

/** @type {SalonCategorySeed[]} */
export const SALON_MENU = [
    {
        slug: 'signature',
        name: 'The Signature',
        subtitle: 'Refreshing · Revitalizing',
        description:
            "Sit back, relax and enjoy Averie's signature manicure and pedicure treatment that will result in strong healthy and resilient nails, followed by an ultra moisturizing foot massage.",
        featured: true,
        sortOrder: 0,
        icon: 'Sparkles',
        services: [
            {
                name: 'Manicure',
                description: 'Soak, cuticle & nail care, moisturize massage and polish.',
                price: 25,
                estimatedMinutes: 45,
            },
            {
                name: 'Pedicure',
                description:
                    'Enjoy a warm lavender soak, cuticle & nail care, sole softening, sweet lavender scrub with natural sugar crystal and mineral oil. Moisturizing lotion, hot stone massage, warm towels treatment and polish.',
                price: 45,
                estimatedMinutes: 60,
            },
        ],
    },
    {
        slug: 'dessert',
        name: 'The Dessert',
        subtitle: 'Blissful · Sinful · Delicious',
        description:
            'Enjoy sweets without the calories! The dessert begins with a nourishing milk soak great for extra dry skin. Encouraged and recommended for individuals with sensitive skin.',
        sortOrder: 1,
        icon: 'CupSoda',
        services: [
            {
                name: 'Manicure',
                description:
                    'Chocolate milk soak, cuticle & nail care, chocolate sugar soufflé scrub exfoliate, cappuccino mask, hot towel, massage and polish.',
                price: 35,
                estimatedMinutes: 50,
            },
            {
                name: 'Pedicure',
                description:
                    'Chocolate milk soak, cuticle & nail care, chocolate sugar soufflé scrub exfoliation, cappuccino hydrating foot mask with shea butter and caffeine wrap in warm towels treatment, hot stone massage and polish.',
                price: 60,
                estimatedMinutes: 75,
            },
        ],
    },
    {
        slug: 'me-time',
        name: "It's Me Time",
        subtitle: 'Detox · Purify · Rejuvenate',
        description:
            'We start you with green tea purifying soak with botanical extracts and tea essences. Green tea scrubs with natural sugar crystal and antioxidant, followed by hydrating clay mask and rejuvenation lotion.',
        sortOrder: 2,
        icon: 'Leaf',
        services: [
            {
                name: 'Manicure',
                description:
                    'Green tea purifying soak, cuticle & crystal care, green tea scrub with natural sugar crystal antioxidant, rejuvenating lotion, warm towels, massage and polyhydrating mask.',
                price: 40,
                estimatedMinutes: 50,
            },
            {
                name: 'Pedicure',
                description:
                    'Green tea purifying soak cuticle & nail care, sole softening with green tea sugar scrubs rejuvenating lotion, hydrating clay mask, warm towels treatment, hot stone massage and polish.',
                price: 75,
                estimatedMinutes: 75,
            },
        ],
    },
    {
        slug: 'gentlemen',
        name: 'The Gentlemen',
        subtitle: 'Masculine · Distinguished · Classic',
        description:
            'We remove the dirt, cut the edges and even soften the most calloused hands and feet. Leaving your skin clean, refreshed, and smooth.',
        sortOrder: 3,
        icon: 'UserRound',
        services: [
            {
                name: 'Manicure',
                description:
                    'Soak, cuticle & nail care, eucalyptus & mint moisturizing lotion massage, warm towels treatment.',
                price: 30,
                estimatedMinutes: 40,
            },
            {
                name: 'Manicure (Express)',
                description: 'Quick soak, nail trim, file, and clean finish.',
                price: 15,
                estimatedMinutes: 20,
            },
            {
                name: 'Pedicure (Express)',
                description: 'Quick foot soak, nail trim, file, and hydrating lotion.',
                price: 25,
                estimatedMinutes: 25,
            },
            {
                name: 'Pedicure',
                description:
                    'Enjoy a warm mint eucalyptus soak, cuticle & nail care, sole softening, eucalyptus mint sugar scrub with aloe vera and vitamin A&E, hot stone massage, warm towels, polish.',
                price: 50,
                estimatedMinutes: 60,
            },
        ],
    },
    {
        slug: 'little-diva',
        name: 'Little Diva (10 and under)',
        subtitle: 'Fun · Natural · Pretty',
        description:
            "Good things come in small packages. Averie's most gentle and basic care will make our little diva feel special as we greet, treat and sweet her hands and feet.",
        sortOrder: 4,
        icon: 'Baby',
        services: [
            {
                name: 'Manicure',
                description: 'Gentle soak, nail shaping, moisturize massage & polish.',
                price: 15,
                estimatedMinutes: 30,
            },
            {
                name: 'Pedicure',
                description: 'Gentle foot soak, nail shaping, moisturize massage & polish.',
                price: 25,
                estimatedMinutes: 35,
            },
        ],
    },
    {
        slug: 'gel-polish',
        name: 'Gel Polish',
        subtitle: 'Long-Lasting · High-Shine',
        description:
            'Durable, chip-resistant gel formula cured under LED light for weeks of flawless color and shine.',
        sortOrder: 5,
        icon: 'Palette',
        services: [
            {
                name: 'Gel Polish Manicure',
                description: 'Complete manicure with premium gel polish cured under LED light.',
                price: 40,
                estimatedMinutes: 50,
            },
            {
                name: 'Gel Polish Pedicure',
                description: 'Complete pedicure with long-lasting gel polish finish.',
                price: 60,
                estimatedMinutes: 60,
            },
            {
                name: 'Gel Polish Change - Nails',
                description: 'Removal of old polish and fresh application of gel polish on nails.',
                price: 35,
                estimatedMinutes: 40,
            },
            {
                name: 'Gel Polish Change - Toes',
                description: 'Removal of old polish and fresh gel application on toes.',
                price: 40,
                estimatedMinutes: 45,
            },
        ],
    },
    {
        slug: 'add-ons',
        name: 'Add Ons',
        subtitle: 'Custom Enhancements',
        sortOrder: 6,
        icon: 'Plus',
        services: [
            {
                name: 'Dazzle Dry (Nails or Toes)',
                description: 'Quick-drying, non-toxic, long-lasting natural polish system.',
                price: 5,
                estimatedMinutes: 10,
            },
            {
                name: 'French / American',
                description: 'Classic white or natural soft tip accent.',
                price: 10,
                estimatedMinutes: 15,
            },
            {
                name: 'Express Manicure',
                description: 'Buff, file, and polish for a fast refresh.',
                price: 20,
                estimatedMinutes: 25,
            },
            {
                name: 'Express Pedicure',
                description: 'Cut, file, and polish for on-the-go care.',
                price: 25,
                estimatedMinutes: 30,
            },
            {
                name: 'Take Off (with service)',
                description:
                    'Gentle removal of existing gel or acrylic when combined with service.',
                price: 10,
                estimatedMinutes: 15,
            },
            {
                name: 'Take Off (without service)',
                description: 'Standalone gentle removal of gel or acrylic extensions.',
                price: 15,
                estimatedMinutes: 20,
            },
            {
                name: 'Paraffin Wax - Hands or Feet',
                description:
                    'Warm therapeutic paraffin dip for deep hydration and soothing warmth.',
                price: 15,
                estimatedMinutes: 15,
            },
        ],
    },
    {
        slug: 'waxing',
        name: 'Waxing',
        subtitle: 'Smooth · Comfortable · Gentle',
        description:
            'Our experienced estheticians use very gentle strip wax and hard wax to ensure smooth, hair-free results. WE NEVER DOUBLE DIP.',
        sortOrder: 7,
        icon: 'Feather',
        services: [
            {
                name: 'Eyebrows',
                description: 'Precision brow shaping.',
                price: 20,
                estimatedMinutes: 15,
            },
            { name: 'Lips', description: 'Upper lip wax.', price: 10, estimatedMinutes: 10 },
            { name: 'Chin', description: 'Chin hair removal.', price: 20, estimatedMinutes: 15 },
            {
                name: 'Full Face',
                description: 'Complete facial waxing.',
                price: 50,
                estimatedMinutes: 30,
            },
            {
                name: 'Under Arms',
                description: 'Underarm waxing.',
                price: 25,
                estimatedMinutes: 20,
            },
            {
                name: 'Arms (Lower)',
                description: 'Lower arm waxing.',
                price: 35,
                estimatedMinutes: 25,
            },
            {
                name: 'Arms (Full)',
                description: 'Full arm waxing.',
                price: 45,
                estimatedMinutes: 35,
            },
            {
                name: 'Legs (Lower)',
                description: 'Lower leg waxing.',
                price: 40,
                estimatedMinutes: 30,
            },
            {
                name: 'Legs (Full)',
                description: 'Full leg waxing.',
                price: 85,
                estimatedMinutes: 45,
            },
            {
                name: 'Bikini Lines',
                description: 'Bikini line waxing.',
                price: 35,
                estimatedMinutes: 25,
            },
            {
                name: 'Brazilian',
                description: 'Brazilian wax — pricing may vary.',
                price: 65,
                estimatedMinutes: 45,
            },
            { name: 'Stomach', description: 'Stomach waxing.', price: 30, estimatedMinutes: 20 },
            { name: 'Back', description: 'Back waxing.', price: 60, estimatedMinutes: 35 },
            { name: 'Chest', description: 'Chest waxing.', price: 50, estimatedMinutes: 30 },
        ],
    },
    {
        slug: 'acrylic',
        name: 'Acrylic',
        subtitle: 'Durable · Custom Shape',
        sortOrder: 8,
        icon: 'PenLine',
        services: [
            {
                name: 'Traditional Acrylic - Fill',
                description: 'Acrylic fill maintenance.',
                price: 50,
                estimatedMinutes: 60,
            },
            {
                name: 'Traditional Acrylic - Full Set',
                description: 'Full traditional acrylic set.',
                price: 70,
                estimatedMinutes: 90,
            },
            {
                name: 'Pink & White Solar - Fill',
                description: 'Pink and white solar fill.',
                price: 60,
                estimatedMinutes: 75,
            },
            {
                name: 'Pink & White Solar - Full Set',
                description: 'Pink and white solar full set.',
                price: 70,
                estimatedMinutes: 105,
            },
            {
                name: 'Gel Lacquer - Fill',
                description: 'Gel lacquer fill.',
                price: 50,
                estimatedMinutes: 60,
            },
            {
                name: 'Gel Lacquer - Full Set',
                description: 'Gel lacquer full set.',
                price: 60,
                estimatedMinutes: 90,
            },
        ],
    },
    {
        slug: 'dip',
        name: 'Dip',
        subtitle: 'Lightweight · Strong',
        sortOrder: 9,
        icon: 'Layers',
        services: [
            {
                name: 'Dip Powder',
                description: 'Dip powder application.',
                price: 50,
                estimatedMinutes: 60,
            },
            {
                name: 'Dip Powder with Tips',
                description: 'Dip powder with tips.',
                price: 60,
                estimatedMinutes: 75,
            },
            {
                name: 'New Set',
                description: 'New dip powder set.',
                price: 70,
                estimatedMinutes: 90,
            },
            { name: 'Refill', description: 'Dip powder refill.', price: 60, estimatedMinutes: 60 },
        ],
    },
    {
        slug: 'builder',
        name: 'Builder - Gel X',
        subtitle: 'Apres product',
        sortOrder: 10,
        icon: 'Gem',
        note: 'Shape change to medium-long almond, square, or stiletto: additional $5 and up.',
        services: [
            {
                name: 'New Set',
                description: 'Gel X builder new set.',
                price: 65,
                estimatedMinutes: 90,
            },
            {
                name: 'Refill',
                description: 'Gel X builder refill.',
                price: 60,
                estimatedMinutes: 75,
            },
        ],
    },
    {
        slug: 'facials',
        name: 'Dermalogica Facials',
        subtitle: 'Professional Skincare',
        description:
            'Licensed Dermalogica skin therapists analyze and treat your skin zones with professional products for targeted results.',
        sortOrder: 11,
        icon: 'ScanFace',
        services: [
            {
                name: 'Face Mapping',
                description:
                    '10 mins | Professional analysis of 14 skin zones before selecting treatments.',
                price: 0,
                estimatedMinutes: 10,
            },
            {
                name: 'MicroZone Treatment',
                description:
                    '30 mins | Fast, targeted skin solutions focusing on specific skin concerns.',
                price: 75,
                estimatedMinutes: 30,
            },
            {
                name: 'The Core Treatment',
                description:
                    '60 mins | Full customized treatment including double cleansing, exfoliation, extraction, masque, and massage.',
                price: 115,
                estimatedMinutes: 60,
            },
        ],
    },
];

/** @returns {string[]} */
export function getMenuCategorySlugs() {
    return SALON_MENU.map((category) => category.slug);
}

/** @param {string} categorySlug @param {string} serviceName */
export function serviceSeedKey(categorySlug, serviceName) {
    return `${categorySlug}::${serviceName}`;
}
