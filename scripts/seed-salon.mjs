/**
 * Seed salon domain data — admin user, settings, categories, sample services.
 *
 * Usage: pnpm db:seed
 */
import bcrypt from 'bcryptjs';
import mongoose, { Schema } from 'mongoose';
import { mongoClientOptions } from './mongo-client-options.mjs';

const uri = process.env.MONGODB_URI;
const DEFAULT_ADMIN_EMAIL = 'admin@averie.local';
const DEFAULT_ADMIN_PASSWORD = 'Admin123!';

const ServiceCategory = mongoose.models.ServiceCategorySeed
    ? mongoose.models.ServiceCategorySeed
    : mongoose.model(
          'ServiceCategorySeed',
          new Schema(
              {
                  name: { type: String, required: true, trim: true },
                  sortOrder: { type: Number, default: 0 },
              },
              { timestamps: true, collection: 'service_categories' },
          ),
      );

const Service = mongoose.models.ServiceSeed
    ? mongoose.models.ServiceSeed
    : mongoose.model(
          'ServiceSeed',
          new Schema(
              {
                  categoryId: { type: Schema.Types.ObjectId, required: true },
                  name: { type: String, required: true },
                  description: { type: String, default: '' },
                  price: { type: Number, required: true },
                  estimatedMinutes: { type: Number, required: true },
                  visible: { type: Boolean, default: true },
              },
              { timestamps: true, collection: 'services' },
          ),
      );

const User = mongoose.models.UserSeed
    ? mongoose.models.UserSeed
    : mongoose.model(
          'UserSeed',
          new Schema(
              {
                  email: { type: String, required: true, lowercase: true },
                  passwordHash: { type: String, required: true },
                  role: { type: String, enum: ['admin', 'staff'], required: true },
                  firstName: { type: String, required: true },
                  lastName: { type: String, required: true },
                  phone: { type: String, required: true },
                  specialties: { type: [String], default: [] },
                  visible: { type: Boolean, default: true },
                  isActive: { type: Boolean, default: true },
              },
              { timestamps: true, collection: 'users' },
          ),
      );

const SalonSettings = mongoose.models.SalonSettingsSeed
    ? mongoose.models.SalonSettingsSeed
    : mongoose.model(
          'SalonSettingsSeed',
          new Schema(
              {
                  allowStaffSelection: { type: Boolean, default: true },
                  workingWeekdays: { type: [Number], default: [1, 2, 3, 4, 5, 6] },
                  periodSlots: {
                      morning: { type: [String], default: [] },
                      afternoon: { type: [String], default: [] },
                      evening: { type: [String], default: [] },
                  },
                  dayOffs: [
                      {
                          date: String,
                          scope: {
                              type: String,
                              enum: ['full', 'morning', 'afternoon', 'evening'],
                          },
                      },
                  ],
              },
              { timestamps: { createdAt: false, updatedAt: true }, collection: 'salon_settings' },
          ),
      );

const CATEGORIES = [
    { name: 'Manicure & Pedicure', sortOrder: 0 },
    { name: 'Gel Polish', sortOrder: 1 },
    { name: 'Nail Enhancements', sortOrder: 2 },
    { name: 'Add-ons', sortOrder: 3 },
    { name: 'Waxing', sortOrder: 4 },
    { name: 'Facials', sortOrder: 5 },
];

const DEFAULT_PERIOD_SLOTS = {
    morning: [
        '07:30 AM',
        '07:45 AM',
        '08:00 AM',
        '08:30 AM',
        '09:00 AM',
        '09:30 AM',
        '10:00 AM',
        '10:30 AM',
        '11:00 AM',
        '11:30 AM',
    ],
    afternoon: [
        '12:00 PM',
        '12:30 PM',
        '01:00 PM',
        '01:30 PM',
        '02:00 PM',
        '02:30 PM',
        '03:00 PM',
        '03:30 PM',
        '04:00 PM',
        '04:30 PM',
    ],
    evening: ['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM'],
};

async function seed() {
    if (!uri) {
        console.error('Missing MONGODB_URI');
        process.exit(1);
    }

    await mongoose.connect(uri, mongoClientOptions);

    const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN_EMAIL });
    if (!existingAdmin) {
        const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
        await User.create({
            email: DEFAULT_ADMIN_EMAIL,
            passwordHash,
            role: 'admin',
            firstName: 'Salon',
            lastName: 'Admin',
            phone: '(000) 000-0000',
            specialties: [],
            visible: true,
            isActive: true,
        });
        console.log(`Created admin: ${DEFAULT_ADMIN_EMAIL} / ${DEFAULT_ADMIN_PASSWORD}`);
    } else {
        console.log(`Admin already exists: ${DEFAULT_ADMIN_EMAIL}`);
    }

    const settings = await SalonSettings.findOne();
    if (!settings) {
        await SalonSettings.create({
            allowStaffSelection: true,
            workingWeekdays: [1, 2, 3, 4, 5, 6],
            periodSlots: DEFAULT_PERIOD_SLOTS,
            dayOffs: [
                { date: '2026-12-25', scope: 'full' },
                { date: '2026-01-01', scope: 'full' },
            ],
        });
        console.log('Created salon settings singleton');
    }

    for (const category of CATEGORIES) {
        await ServiceCategory.updateOne(
            { name: category.name },
            { $setOnInsert: category },
            { upsert: true },
        );
    }

    const categories = await ServiceCategory.find().lean();
    const manicure = categories.find((c) => c.name === 'Manicure & Pedicure');
    const gel = categories.find((c) => c.name === 'Gel Polish');

    if (manicure) {
        await Service.updateOne(
            { name: 'Classic Manicure', categoryId: manicure._id },
            {
                $setOnInsert: {
                    categoryId: manicure._id,
                    name: 'Classic Manicure',
                    description: 'Shape, cuticle care, and polish of choice.',
                    price: 35,
                    estimatedMinutes: 45,
                    visible: true,
                },
            },
            { upsert: true },
        );
    }

    if (gel) {
        await Service.updateOne(
            { name: 'Gel Color', categoryId: gel._id },
            {
                $setOnInsert: {
                    categoryId: gel._id,
                    name: 'Gel Color',
                    description: 'Long-wear gel polish application.',
                    price: 45,
                    estimatedMinutes: 50,
                    visible: true,
                },
            },
            { upsert: true },
        );
    }

    console.log('Seed complete');
    await mongoose.disconnect();
}

seed().catch((error) => {
    console.error('[seed-salon]', error);
    process.exit(1);
});
