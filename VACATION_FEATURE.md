# Doctor Vacation Feature

## Overview
This feature displays doctor vacation information in both the Find Care page and Doctor Profile page. It shows the next upcoming vacation or current vacation status for each doctor.

## Files Created/Modified

### Created:
1. **`src/types/doctor.ts`** - New TypeScript types and utility functions
   - `Doctor` interface with vacation field
   - `DoctorVacation` interface matching backend model
   - `getNextVacation()` - Gets the next upcoming vacation for a doctor
   - `isOnVacation()` - Checks if doctor is currently on vacation
   - `formatVacationDates()` - Formats vacation date ranges for display

### Modified:
1. **`src/app/find-care/page.tsx`**
   - Added vacation badges to DoctorCard component
   - Added vacation badges to DoctorListItem component
   - Shows both "On Vacation" (current) and "Upcoming Vacation" states
   - Color-coded: Orange for current vacation, Amber for upcoming

2. **`src/app/doctors/[id]/page.tsx`**
   - Added vacation card in the right sidebar
   - Shows vacation dates, reason (if provided), and warning message
   - Prominent display with color-coded backgrounds

## Backend Model Reference
From `/carepoint-backend/src/users/entities/user.entity.ts`:
```typescript
@Column({ type: "json", nullable: true })
vacations?: Array<{
  startDate: string;  // ISO date string
  endDate: string;    // ISO date string
  reason?: string;    // Optional vacation reason
}>;
```

## Features

### Find Care Page
- **Card View**: Vacation badge displayed between working hours and availability section
- **List View**: Compact vacation badge inline with working hours
- **States**:
  - "On Vacation" - Orange/red styling when doctor is currently on vacation
  - "Upcoming Vacation" - Amber/yellow styling for future vacations
  
### Doctor Profile Page
- **Dedicated Vacation Card** in the right sidebar
- Shows vacation dates in readable format
- Displays reason if provided
- Warning message when doctor is currently unavailable
- Prominent visual design with gradient backgrounds

## Date Formatting

The `formatVacationDates()` function handles various scenarios:
- Single day: "Nov 9"
- Same month: "Nov 9 - 15"
- Different months: "Nov 9 - Dec 3"
- Different years: "Dec 25, 2024 - Jan 5, 2025"

## Testing

For comprehensive testing instructions, see [VACATION_TESTING_GUIDE.md](./VACATION_TESTING_GUIDE.md)

### Quick Test Setup

1. **Backend**: Add test vacation data
```bash
cd ../carepoint-backend
psql -U postgres -d carepoint_db -f scripts/add-test-vacations.sql
```

2. **Frontend**: Start dev server
```bash
npm run dev
# Visit http://localhost:3000/find-care
```

### Test Cases Summary
- [ ] Doctor with no vacations - no badge shown
- [ ] Doctor with past vacations only - no badge shown
- [ ] Doctor with upcoming vacation - amber badge shown
- [ ] Doctor currently on vacation - orange badge shown
- [ ] Doctor with multiple vacations - shows next one
- [ ] Date formatting for various date ranges
- [ ] Vacation reason display (when provided)
- [ ] Responsive design on mobile/tablet

**See [VACATION_TESTING_GUIDE.md](./VACATION_TESTING_GUIDE.md) for detailed testing scenarios and troubleshooting.**

## Color Scheme

### Current Vacation (On Vacation)
- Background: `bg-orange-50` to `bg-red-50`
- Border: `border-orange-200` to `border-orange-300`
- Text: `text-orange-700` to `text-orange-900`

### Upcoming Vacation
- Background: `bg-amber-50` to `bg-yellow-50`
- Border: `border-amber-200` to `border-amber-300`
- Text: `text-amber-700` to `text-amber-900`

## Responsive Design
- Mobile: Compact badges with smaller text
- Tablet: Medium-sized badges
- Desktop: Full-sized badges with complete text

## Future Enhancements
- Filter doctors by availability (exclude those on vacation)
- Show all upcoming vacations in profile
- Calendar view with vacation periods highlighted
- Email notifications for patient appointments when doctor goes on vacation
- Automatic appointment rescheduling suggestions

