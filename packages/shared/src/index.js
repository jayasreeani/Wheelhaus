"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS_LABELS = exports.FLOW = exports.SERVICE_MODE_INFO = exports.PACKAGES = exports.VEHICLE_TYPES = exports.PLATFORM_FEE = void 0;
exports.PLATFORM_FEE = 19;
exports.VEHICLE_TYPES = ['Hatchback', 'Sedan', 'SUV', 'Bike'];
exports.PACKAGES = [
    { id: 'ext', name: 'Exterior foam wash', mins: 30, desc: 'Snow foam, pressure rinse, tyre shine' },
    { id: 'int', name: 'Interior deep clean', mins: 45, desc: 'Vacuum, dashboard, mats, odour treatment' },
    { id: 'full', name: 'Full wash', mins: 75, desc: 'Exterior foam + interior clean + underbody rinse' },
    { id: 'cer', name: 'Ceramic wash & polish', mins: 150, desc: 'Machine polish with ceramic sealant', centreOnly: true },
];
exports.SERVICE_MODE_INFO = {
    walkin: { label: 'At centre', desc: 'Drive in at your booked slot' },
    pickup: { label: 'Pick & Drop', desc: 'Verified driver collects and returns your vehicle' },
    home: { label: 'At home', desc: 'Team washes at your doorstep with waterless kit' },
};
exports.FLOW = {
    walkin: ['requested', 'accepted', 'checked_in', 'in_progress', 'ready', 'completed'],
    pickup: ['requested', 'accepted', 'picked_up', 'in_progress', 'out_for_delivery', 'completed'],
    home: ['requested', 'accepted', 'on_the_way', 'in_progress', 'completed'],
};
exports.STATUS_LABELS = {
    requested: 'Waiting for centre to accept',
    accepted: 'Booking accepted',
    checked_in: 'Vehicle checked in at centre',
    picked_up: 'Vehicle picked up by driver',
    on_the_way: 'Washer on the way to doorstep',
    in_progress: 'Wash in progress',
    ready: 'Ready for customer collection',
    out_for_delivery: 'Out for delivery',
    completed: 'Service completed',
    rejected: 'Declined by the centre',
    expired: 'Not accepted within 10 minutes',
};
