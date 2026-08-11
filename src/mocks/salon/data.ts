import type {
    AdminKpi,
    SalonBooking,
    SalonService,
    SalonStaff,
    ScheduleSettings,
    StaffShift,
    TimeSlot,
} from '@typings/salon.type';

export const SERVICE_CATEGORIES = [
    { id: 'manicure-pedicure', labelKey: 'categories.manicurePedicure' },
    { id: 'gel-polish', labelKey: 'categories.gelPolish' },
    { id: 'nail-enhancements', labelKey: 'categories.nailEnhancements' },
    { id: 'add-ons', labelKey: 'categories.addOns' },
    { id: 'waxing', labelKey: 'categories.waxing' },
    { id: 'facials', labelKey: 'categories.facials' },
] as const;

export const mockServices: SalonService[] = [
    {
        id: 'svc-classic-mani',
        categoryId: 'manicure-pedicure',
        name: 'Classic Manicure',
        description: 'Shape, cuticle care, and polish of choice.',
        price: 35,
        durationMin: 45,
        active: true,
    },
    {
        id: 'svc-spa-pedi',
        categoryId: 'manicure-pedicure',
        name: 'Spa Pedicure',
        description: 'Soak, exfoliation, massage, and polish.',
        price: 55,
        durationMin: 60,
        active: true,
    },
    {
        id: 'svc-gel-color',
        categoryId: 'gel-polish',
        name: 'Gel Color',
        description: 'Long-wear gel polish application.',
        price: 45,
        durationMin: 50,
        active: true,
    },
    {
        id: 'svc-gel-removal',
        categoryId: 'gel-polish',
        name: 'Gel Removal',
        description: 'Gentle soak-off and nail reset.',
        price: 20,
        durationMin: 25,
        active: true,
    },
    {
        id: 'svc-soft-gel',
        categoryId: 'nail-enhancements',
        name: 'Soft Gel Extensions',
        description: 'Natural-looking length with soft gel tips.',
        price: 95,
        durationMin: 90,
        active: true,
    },
    {
        id: 'svc-nail-art',
        categoryId: 'add-ons',
        name: 'Nail Art (per nail)',
        description: 'Hand-painted accent or chrome detail.',
        price: 8,
        durationMin: 10,
        active: true,
    },
    {
        id: 'svc-brow-wax',
        categoryId: 'waxing',
        name: 'Brow Wax',
        description: 'Clean shape with soothing finish.',
        price: 25,
        durationMin: 20,
        active: true,
    },
    {
        id: 'svc-microzone',
        categoryId: 'facials',
        name: 'MicroZone Treatment',
        description: 'Targeted dermal facial for glow and balance.',
        price: 75,
        durationMin: 20,
        active: true,
    },
    {
        id: 'svc-signature-facial',
        categoryId: 'facials',
        name: 'Signature Facial',
        description: 'Full facial protocol tailored to skin needs.',
        price: 120,
        durationMin: 60,
        active: true,
    },
];

export const mockStaff: SalonStaff[] = [
    { id: 'st-mia', name: 'Mia Tran', role: 'Lead Nail Artist', active: true, initials: 'MT' },
    {
        id: 'st-elena',
        name: 'Elena Brooks',
        role: 'Senior Esthetician',
        active: true,
        initials: 'EB',
    },
    { id: 'st-jordan', name: 'Jordan Lee', role: 'Nail Technician', active: true, initials: 'JL' },
    {
        id: 'st-sofia',
        name: 'Sofia Nguyen',
        role: 'Waxing Specialist',
        active: true,
        initials: 'SN',
    },
];

export const mockScheduleSettings: ScheduleSettings = {
    openTime: '09:00',
    closeTime: '19:00',
    intervalMin: 30,
    closedWeekdays: [0],
    daysOff: ['2026-12-25', '2026-01-01'],
};

export const mockSlots: TimeSlot[] = [
    { id: 't-0900', time: '09:00 AM', available: true },
    { id: 't-0930', time: '09:30 AM', available: true },
    { id: 't-1000', time: '10:00 AM', available: false },
    { id: 't-1030', time: '10:30 AM', available: true },
    { id: 't-1100', time: '11:00 AM', available: true },
    { id: 't-1130', time: '11:30 AM', available: true },
    { id: 't-1300', time: '01:00 PM', available: true },
    { id: 't-1330', time: '01:30 PM', available: false },
    { id: 't-1400', time: '02:00 PM', available: true },
    { id: 't-1430', time: '02:30 PM', available: true },
    { id: 't-1500', time: '03:00 PM', available: true },
    { id: 't-1530', time: '03:30 PM', available: true },
    { id: 't-1600', time: '04:00 PM', available: true },
    { id: 't-1630', time: '04:30 PM', available: false },
    { id: 't-1700', time: '05:00 PM', available: true },
];

export let mockBookings: SalonBooking[] = [
    {
        id: 'bk-001',
        reference: 'AVR-24001',
        serviceId: 'svc-signature-facial',
        staffId: 'st-elena',
        date: '2026-10-24',
        time: '09:00 AM',
        durationMin: 60,
        price: 120,
        customer: {
            firstName: 'Sarah',
            lastName: 'Jenkins',
            phone: '(781) 555-0142',
            email: 'sarah@example.com',
        },
        status: 'confirmed',
    },
    {
        id: 'bk-002',
        reference: 'AVR-24002',
        serviceId: 'svc-gel-color',
        staffId: 'st-mia',
        date: '2026-10-24',
        time: '10:30 AM',
        durationMin: 50,
        price: 45,
        customer: {
            firstName: 'Priya',
            lastName: 'Shah',
            phone: '(781) 555-0199',
        },
        status: 'in_progress',
    },
    {
        id: 'bk-003',
        reference: 'AVR-24003',
        serviceId: 'svc-spa-pedi',
        staffId: 'st-jordan',
        date: '2026-10-24',
        time: '01:00 PM',
        durationMin: 60,
        price: 55,
        customer: {
            firstName: 'Hannah',
            lastName: 'Cole',
            phone: '(617) 555-0110',
            note: 'Preferred soft pink polish',
        },
        status: 'pending',
    },
    {
        id: 'bk-004',
        reference: 'AVR-24004',
        serviceId: 'svc-classic-mani',
        staffId: 'st-sofia',
        date: '2026-10-25',
        time: '11:00 AM',
        durationMin: 45,
        price: 35,
        customer: {
            firstName: 'Amelia',
            lastName: 'Ross',
            phone: '(781) 555-0177',
        },
        status: 'confirmed',
    },
];

export const mockKpis: AdminKpi = {
    appointments: 24,
    appointmentsDelta: '+3 from yesterday',
    pending: 5,
    pendingHint: 'Requires confirmation',
    revenue: 4250,
    revenueHint: 'Projected for today',
    activeTechs: 8,
    activeTechsHint: '2 on break',
};

export const mockShifts: StaffShift[] = [
    { id: 'sh-1', staffId: 'st-mia', day: 'Mon', start: '09:00', end: '17:00' },
    { id: 'sh-2', staffId: 'st-elena', day: 'Mon', start: '10:00', end: '18:00' },
    { id: 'sh-3', staffId: 'st-jordan', day: 'Tue', start: '09:00', end: '17:00' },
    { id: 'sh-4', staffId: 'st-sofia', day: 'Wed', start: '11:00', end: '19:00' },
];

export function upsertMockBooking(booking: SalonBooking) {
    mockBookings = [booking, ...mockBookings.filter((b) => b.id !== booking.id)];
    return booking;
}

export function updateMockService(service: SalonService) {
    const idx = mockServices.findIndex((s) => s.id === service.id);
    if (idx >= 0) mockServices[idx] = service;
    else mockServices.push(service);
    return service;
}
