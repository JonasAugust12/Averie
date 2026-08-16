/**
 * Seed salon domain data — admin, staff (with calendar colors), settings,
 * categories, services, and sample bookings.
 *
 * Usage: pnpm db:seed
 */
import bcrypt from 'bcryptjs';
import mongoose, { Schema } from 'mongoose';
import { mongoClientOptions } from './mongo-client-options.mjs';

const uri = process.env.MONGODB_URI;
const DEFAULT_ADMIN_EMAIL = 'admin@averie.local';
const DEFAULT_ADMIN_PASSWORD = 'Admin123!';
const DEFAULT_STAFF_PASSWORD = 'Staff123!';

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
                  staffProfile: {
                      color: { type: String, trim: true },
                      initials: { type: String, trim: true, maxlength: 4 },
                  },
              },
              { timestamps: true, collection: 'users' },
          ),
      );

const BookingCustomerSchema = new Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        email: { type: String, trim: true, lowercase: true },
        note: { type: String, trim: true },
    },
    { _id: false },
);

const Booking = mongoose.models.BookingSeed
    ? mongoose.models.BookingSeed
    : mongoose.model(
          'BookingSeed',
          new Schema(
              {
                  reference: { type: String, required: true, trim: true },
                  serviceIds: { type: [{ type: Schema.Types.ObjectId }], required: true },
                  staffPreference: {
                      type: String,
                      enum: ['any', 'specific'],
                      required: true,
                  },
                  staffId: { type: Schema.Types.ObjectId },
                  date: { type: String, required: true, trim: true },
                  time: { type: String, required: true, trim: true },
                  totalEstimatedMinutes: { type: Number, required: true, min: 1 },
                  totalPrice: { type: Number, required: true, min: 0 },
                  customer: { type: BookingCustomerSchema, required: true },
                  status: {
                      type: String,
                      enum: ['upcoming', 'cancelled'],
                      default: 'upcoming',
                  },
              },
              { timestamps: true, collection: 'bookings' },
          ),
      );

const PeriodSlotsSchema = new Schema(
    {
        morning: { type: [String], default: [] },
        afternoon: { type: [String], default: [] },
        evening: { type: [String], default: [] },
    },
    { _id: false },
);

const WeekdayScheduleSchema = new Schema(
    {
        weekday: { type: Number, required: true, min: 0, max: 6 },
        isOpen: { type: Boolean, default: true },
        periodSlots: { type: PeriodSlotsSchema, default: () => ({}) },
    },
    { _id: false },
);

const SalonSettings = mongoose.models.SalonSettingsSeed
    ? mongoose.models.SalonSettingsSeed
    : mongoose.model(
          'SalonSettingsSeed',
          new Schema(
              {
                  allowStaffSelection: { type: Boolean, default: true },
                  weekdaySchedules: { type: [WeekdayScheduleSchema], default: [] },
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

const MORNING_WEEKDAY = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
const AFTERNOON_STANDARD = [
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
];
const EVENING_WEEKDAY = ['05:00 PM', '05:30 PM', '06:00 PM'];
const EVENING_SATURDAY = ['05:00 PM', '05:30 PM'];
const MORNING_SUNDAY = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];

function buildWeekdaySchedules() {
    return [0, 1, 2, 3, 4, 5, 6].map((weekday) => {
        if (weekday === 0) {
            return {
                weekday,
                isOpen: true,
                periodSlots: {
                    morning: MORNING_SUNDAY,
                    afternoon: AFTERNOON_STANDARD,
                    evening: [],
                },
            };
        }
        if (weekday === 6) {
            return {
                weekday,
                isOpen: true,
                periodSlots: {
                    morning: MORNING_WEEKDAY,
                    afternoon: AFTERNOON_STANDARD,
                    evening: EVENING_SATURDAY,
                },
            };
        }
        return {
            weekday,
            isOpen: true,
            periodSlots: {
                morning: MORNING_WEEKDAY,
                afternoon: AFTERNOON_STANDARD,
                evening: EVENING_WEEKDAY,
            },
        };
    });
}

const DEFAULT_WEEKDAY_SCHEDULES = buildWeekdaySchedules();

const DEFAULT_DAY_OFFS = [
    { date: '2026-12-25', scope: 'full' },
    { date: '2026-01-01', scope: 'full' },
];

const STAFF = [
    {
        email: 'mia@averie.local',
        firstName: 'Mia',
        lastName: 'Tran',
        phone: '(781) 555-0101',
        specialties: ['Gel Polish', 'Nail Art'],
        staffProfile: { color: '#0ea5e9', initials: 'MT' },
    },
    {
        email: 'elena@averie.local',
        firstName: 'Elena',
        lastName: 'Brooks',
        phone: '(781) 555-0102',
        specialties: ['Facials', 'MicroZone'],
        staffProfile: { color: '#10b981', initials: 'EB' },
    },
    {
        email: 'jordan@averie.local',
        firstName: 'Jordan',
        lastName: 'Lee',
        phone: '(781) 555-0103',
        specialties: ['Manicure', 'Pedicure'],
        staffProfile: { color: '#f59e0b', initials: 'JL' },
    },
    {
        email: 'sofia@averie.local',
        firstName: 'Sofia',
        lastName: 'Nguyen',
        phone: '(781) 555-0104',
        specialties: ['Brow Wax', 'Lip Wax'],
        staffProfile: { color: '#8b5cf6', initials: 'SN' },
    },
];

const SAMPLE_SERVICES = [
    {
        categoryName: 'Manicure & Pedicure',
        name: 'Classic Manicure',
        description: 'Shape, cuticle care, and polish of choice.',
        price: 35,
        estimatedMinutes: 45,
    },
    {
        categoryName: 'Manicure & Pedicure',
        name: 'Spa Pedicure',
        description: 'Soak, exfoliation, massage, and polish.',
        price: 55,
        estimatedMinutes: 60,
    },
    {
        categoryName: 'Gel Polish',
        name: 'Gel Color',
        description: 'Long-wear gel polish application.',
        price: 45,
        estimatedMinutes: 50,
    },
    {
        categoryName: 'Facials',
        name: 'Signature Facial',
        description: 'Full facial protocol tailored to skin needs.',
        price: 120,
        estimatedMinutes: 60,
    },
];

function dateOffsetDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
}

async function upsertService(categoryByName, service) {
    const category = categoryByName.get(service.categoryName);
    if (!category) return null;

    await Service.updateOne(
        { name: service.name, categoryId: category._id },
        {
            $setOnInsert: {
                categoryId: category._id,
                name: service.name,
                description: service.description,
                price: service.price,
                estimatedMinutes: service.estimatedMinutes,
                visible: true,
            },
        },
        { upsert: true },
    );

    return Service.findOne({ name: service.name, categoryId: category._id }).lean();
}

async function seedStaff(passwordHash) {
    let created = 0;
    let updated = 0;

    for (const member of STAFF) {
        const result = await User.updateOne(
            { email: member.email },
            {
                $set: {
                    firstName: member.firstName,
                    lastName: member.lastName,
                    phone: member.phone,
                    specialties: member.specialties,
                    visible: true,
                    isActive: true,
                    staffProfile: member.staffProfile,
                },
                $setOnInsert: {
                    email: member.email,
                    passwordHash,
                    role: 'staff',
                },
            },
            { upsert: true },
        );

        if (result.upsertedCount > 0) created += 1;
        else if (result.modifiedCount > 0) updated += 1;
    }

    console.log(
        `Staff seeded (${STAFF.length} total) — created: ${created}, updated: ${updated}, password: ${DEFAULT_STAFF_PASSWORD}`,
    );
}

async function seedBookings(serviceByName, staffByEmail) {
    const dayOne = dateOffsetDays(1);
    const dayTwo = dateOffsetDays(2);

    const bookings = [
        {
            reference: 'AVR-24001',
            serviceName: 'Signature Facial',
            staffEmail: 'elena@averie.local',
            date: dayOne,
            time: '09:00 AM',
            customer: {
                firstName: 'Sarah',
                lastName: 'Jenkins',
                phone: '(781) 555-0142',
                email: 'sarah@example.com',
            },
        },
        {
            reference: 'AVR-24002',
            serviceName: 'Gel Color',
            staffEmail: 'mia@averie.local',
            date: dayOne,
            time: '10:30 AM',
            customer: {
                firstName: 'Priya',
                lastName: 'Shah',
                phone: '(781) 555-0199',
            },
        },
        {
            reference: 'AVR-24003',
            serviceName: 'Spa Pedicure',
            staffEmail: 'jordan@averie.local',
            date: dayOne,
            time: '01:00 PM',
            customer: {
                firstName: 'Hannah',
                lastName: 'Cole',
                phone: '(617) 555-0110',
                note: 'Preferred soft pink polish',
            },
        },
        {
            reference: 'AVR-24004',
            serviceName: 'Classic Manicure',
            staffEmail: 'sofia@averie.local',
            date: dayTwo,
            time: '11:00 AM',
            customer: {
                firstName: 'Amelia',
                lastName: 'Ross',
                phone: '(781) 555-0177',
            },
        },
    ];

    let inserted = 0;
    let skipped = 0;

    for (const booking of bookings) {
        const service = serviceByName.get(booking.serviceName);
        const staff = staffByEmail.get(booking.staffEmail);

        if (!service || !staff) {
            console.warn(
                `Skipped booking ${booking.reference}: missing ${!service ? 'service' : 'staff'}`,
            );
            skipped += 1;
            continue;
        }

        const result = await Booking.updateOne(
            { reference: booking.reference },
            {
                $setOnInsert: {
                    reference: booking.reference,
                    serviceIds: [service._id],
                    staffPreference: 'specific',
                    staffId: staff._id,
                    date: booking.date,
                    time: booking.time,
                    totalEstimatedMinutes: service.estimatedMinutes,
                    totalPrice: service.price,
                    customer: booking.customer,
                    status: 'upcoming',
                },
            },
            { upsert: true },
        );

        if (result.upsertedCount > 0) inserted += 1;
        else skipped += 1;
    }

    console.log(
        `Bookings seeded — inserted: ${inserted}, already existed: ${skipped}, dates: ${dayOne}, ${dayTwo}`,
    );
}

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

    const settingsResult = await SalonSettings.collection.updateOne(
        {},
        {
            $set: {
                allowStaffSelection: true,
                weekdaySchedules: DEFAULT_WEEKDAY_SCHEDULES,
                dayOffs: DEFAULT_DAY_OFFS,
                updatedAt: new Date(),
            },
            $unset: {
                workingWeekdays: '',
                periodSlots: '',
            },
        },
        { upsert: true },
    );
    console.log(
        `Upserted salon settings (weekdaySchedules Mon–Sun) — matched: ${settingsResult.matchedCount}, modified: ${settingsResult.modifiedCount}`,
    );

    for (const category of CATEGORIES) {
        await ServiceCategory.updateOne(
            { name: category.name },
            { $setOnInsert: category },
            { upsert: true },
        );
    }

    const categories = await ServiceCategory.find().lean();
    const categoryByName = new Map(categories.map((category) => [category.name, category]));

    for (const service of SAMPLE_SERVICES) {
        await upsertService(categoryByName, service);
    }

    const services = await Service.find().lean();
    const serviceByName = new Map(services.map((service) => [service.name, service]));

    const staffPasswordHash = await bcrypt.hash(DEFAULT_STAFF_PASSWORD, 10);
    await seedStaff(staffPasswordHash);

    const staffUsers = await User.find({ role: 'staff' }).lean();
    const staffByEmail = new Map(staffUsers.map((user) => [user.email, user]));

    await seedBookings(serviceByName, staffByEmail);

    console.log('Seed complete');
    await mongoose.disconnect();
}

seed().catch((error) => {
    console.error('[seed-salon]', error);
    process.exit(1);
});
