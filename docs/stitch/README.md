# Stitch screen HTML references

Source project: **Avere Luxury Salon Digital Experience** (`10694160950357827758`).

These HTML dumps are the visual/layout source of truth for porting into Averie (App Router + Tailwind). Prefer Tailwind **canonical** classes (`leading-12`, `text-4xl`, …) over arbitrary values when a scale class exists. Do not paste Stitch HTML wholesale into React.

Landing (`landing.html`) is out of scope for `align-remaining-screens-to-stitch` unless checking regressions.

| Basename                       | screenId                           | Route / step                    | Title                    |
| ------------------------------ | ---------------------------------- | ------------------------------- | ------------------------ |
| `landing.html`                 | (existing)                         | `/`                             | Landing (reference only) |
| `book-select-service.html`     | `22c574d860ee47388cbdea0dee49b59d` | `/book` step: service           | Select Service           |
| `book-select-employee.html`    | `8f188e9819be47d5a28ad180a6277e08` | `/book` step: employee          | Select Employee          |
| `book-select-date.html`        | `d167d5a1ef774a77b64159e0d9d01b80` | `/book` step: date              | Select Date              |
| `book-select-time.html`        | `9721ec9cdd1e4a6a9a6a720ab6c0ccb6` | `/book` step: time              | Select Time              |
| `book-customer-info.html`      | `009dfed04b7f4d34864cd073d712f29f` | `/book` step: customer          | Customer Information     |
| `book-review.html`             | `33644b0056b940ebaa372d16580949e0` | `/book` step: review            | Review Details           |
| `book-confirmation.html`       | `571b290ee21d4f458d662340ec45ac00` | `/book/confirmation`            | Confirmation             |
| `client-login.html`            | `088ee3a29aa44062b97fb442d85ab7f1` | `/login`                        | Client Login             |
| `admin-login.html`             | `ec232374ed214ab2b79bdbb93c964867` | `/admin/login`                  | Admin Login              |
| `admin-overview.html`          | `c3a7398302454649b313cb28ffedda1e` | `/admin`                        | Overview                 |
| `admin-bookings-list.html`     | `2f98dae2fc0447e6baee07d1dec7358b` | `/admin/bookings`               | Bookings List            |
| `admin-booking-detail.html`    | `3477e208e49244838c22fe6e0489399e` | `/admin/bookings/[id]`          | Booking Details          |
| `admin-services.html`          | `7ef3bdd0f35f41d8ba0ef9a368475871` | `/admin/services`               | Service Management       |
| `admin-staff.html`             | `7c31d6e6e641444c8982bbfff5af8c75` | `/admin/staff`                  | Staff Management         |
| `admin-staff-schedule.html`    | `8ec146a01f534971b7c8abc0f9ee3ab6` | `/admin/staff/[id]` or schedule | Staff Schedule Details   |
| `admin-master-schedule.html`   | `aff129a7f8ef491b99637a367ee9d852` | `/admin/schedule`               | Master Schedule          |
| `admin-shifts.html`            | `09ef2e32815d4204a6630d846d93c6e7` | `/admin/shifts`                 | Shift Management         |
| `admin-schedule-settings.html` | `76bee72745724938a62bc024777e14c5` | `/admin/settings`               | Schedule Settings        |

Canonical list also in `_manifest.json` (batch-fetch output).
