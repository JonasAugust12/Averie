import type {
    AdminKpi,
    SalonBooking,
    SalonService,
    SalonStaff,
    ScheduleSettings,
} from '@typings/salon.type';
import { defaultPeriodSlots } from '@utils/schedule.util';

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
    {
        id: 'svc-paraffin',
        categoryId: 'add-ons',
        name: 'Paraffin Treatment',
        description: 'Warm wax soak for ultra-soft skin finish.',
        price: 15,
        durationMin: 15,
        active: false,
    },
    {
        id: 'svc-lip-wax',
        categoryId: 'waxing',
        name: 'Lip Wax',
        description: 'Quick and gentle upper lip wax.',
        price: 12,
        durationMin: 10,
        active: false,
    },
];

export const mockStaff: SalonStaff[] = [
    {
        id: 'st-mia',
        name: 'Mia Tran',
        role: 'Lead Nail Artist',
        active: true,
        initials: 'MT',
        phone: '(781) 555-0101',
        email: 'mia@averie.local',
        specialties: ['Gel Polish', 'Nail Art'],
        joinDate: '2024-03-15',
        color: '#0ea5e9',
    },
    {
        id: 'st-elena',
        name: 'Elena Brooks',
        role: 'Senior Esthetician',
        active: true,
        initials: 'EB',
        phone: '(781) 555-0102',
        email: 'elena@averie.local',
        specialties: ['Facials', 'MicroZone'],
        joinDate: '2023-08-01',
        color: '#10b981',
    },
    {
        id: 'st-jordan',
        name: 'Jordan Lee',
        role: 'Nail Technician',
        active: true,
        initials: 'JL',
        phone: '(781) 555-0103',
        email: 'jordan@averie.local',
        specialties: ['Manicure', 'Pedicure'],
        joinDate: '2025-01-10',
        color: '#f59e0b',
    },
    {
        id: 'st-sofia',
        name: 'Sofia Nguyen',
        role: 'Waxing Specialist',
        active: true,
        initials: 'SN',
        phone: '(781) 555-0104',
        email: 'sofia@averie.local',
        specialties: ['Brow Wax', 'Lip Wax'],
        joinDate: '2024-11-20',
        color: '#8b5cf6',
    },
];

export const mockScheduleSettings: ScheduleSettings = {
    workingWeekdays: [1, 2, 3, 4, 5, 6],
    periodSlots: defaultPeriodSlots(),
    dayOffs: [
        { id: 'do-1', date: '2026-12-25', scope: 'full' },
        { id: 'do-2', date: '2026-01-01', scope: 'full' },
    ],
    allowStaffSelection: true,
};

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
        status: 'upcoming',
        createdAt: '2026-08-10T09:15:00Z',
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
        status: 'upcoming',
        createdAt: '2026-08-11T14:30:00Z',
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
        status: 'upcoming',
        createdAt: '2026-08-12T08:00:00Z',
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
        status: 'upcoming',
        createdAt: '2026-08-12T10:45:00Z',
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

export function deleteMockService(id: string) {
    const idx = mockServices.findIndex((s) => s.id === id);
    if (idx >= 0) mockServices.splice(idx, 1);
}

export function updateMockStaff(staff: SalonStaff) {
    const idx = mockStaff.findIndex((s) => s.id === staff.id);
    if (idx >= 0) mockStaff[idx] = staff;
    else mockStaff.push(staff);
    return staff;
}

export function deleteMockStaff(id: string) {
    const idx = mockStaff.findIndex((s) => s.id === id);
    if (idx >= 0) mockStaff.splice(idx, 1);
}

export function updateMockScheduleSettings(settings: ScheduleSettings) {
    Object.assign(mockScheduleSettings, settings);
    return mockScheduleSettings;
}
