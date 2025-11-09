# Doctor Vacation Feature - Testing Guide

## Quick Start

### 1. Backend Setup

First, add vacation data to your test doctors in the database.

#### Using PostgreSQL CLI:
```bash
cd carepoint-backend
psql -U postgres -d carepoint_db

# Copy and paste the SQL from scripts/add-test-vacations.sql
```

#### Using SQL File:
```bash
cd carepoint-backend
psql -U postgres -d carepoint_db -f scripts/add-test-vacations.sql
```

#### Direct SQL Example:
```sql
-- Add upcoming vacation to Dr. John Smith
UPDATE users 
SET vacations = '[
  {
    "startDate": "2025-11-20",
    "endDate": "2025-11-25",
    "reason": "Medical Conference"
  }
]'::json
WHERE role = 'doctor' AND first_name = 'John' AND last_name = 'Smith';
```

### 2. Restart Backend
```bash
cd carepoint-backend
npm run start:dev
```

### 3. Test Frontend
```bash
cd carepoint-patient
npm run dev
```

Visit http://localhost:3000/find-care

## Testing Scenarios

### Scenario 1: Doctor with Upcoming Vacation
**Expected Result**: Yellow/amber badge showing "Upcoming Vacation" with dates

**Test Steps**:
1. Add vacation with future dates:
```sql
UPDATE users 
SET vacations = '[{"startDate": "2025-11-20", "endDate": "2025-11-25"}]'::json
WHERE role = 'doctor' AND email = 'doctor@example.com';
```
2. Visit `/find-care`
3. Look for the doctor card
4. Should see yellow badge: "Upcoming Vacation: Nov 20 - 25"

### Scenario 2: Doctor Currently on Vacation
**Expected Result**: Orange/red badge showing "On Vacation" with dates

**Test Steps**:
1. Add vacation with current dates:
```sql
UPDATE users 
SET vacations = '[
  {
    "startDate": "2025-11-08",
    "endDate": "2025-11-12",
    "reason": "Personal Leave"
  }
]'::json
WHERE role = 'doctor' AND email = 'doctor@example.com';
```
2. Visit `/find-care`
3. Should see orange badge: "On Vacation: Nov 8 - 12"
4. Click on doctor to view profile
5. Should see prominent vacation card with warning message

### Scenario 3: Doctor with Multiple Vacations
**Expected Result**: Only shows the NEXT upcoming vacation

**Test Steps**:
1. Add multiple vacations:
```sql
UPDATE users 
SET vacations = '[
  {
    "startDate": "2025-11-15",
    "endDate": "2025-11-16",
    "reason": "Workshop"
  },
  {
    "startDate": "2025-12-10",
    "endDate": "2025-12-15",
    "reason": "Holiday"
  }
]'::json
WHERE role = 'doctor' AND email = 'doctor@example.com';
```
2. Should show Nov 15-16 vacation (the nearest one)
3. After Nov 16, should automatically show Dec 10-15 vacation

### Scenario 4: Doctor with No Vacations
**Expected Result**: No vacation badge shown

**Test Steps**:
1. Clear vacations:
```sql
UPDATE users 
SET vacations = NULL
WHERE role = 'doctor' AND email = 'doctor@example.com';
```
2. Doctor card should show normally without vacation badge

### Scenario 5: Past Vacations Only
**Expected Result**: No vacation badge shown (only future/current shown)

**Test Steps**:
1. Add only past vacations:
```sql
UPDATE users 
SET vacations = '[
  {
    "startDate": "2025-10-01",
    "endDate": "2025-10-05",
    "reason": "Past vacation"
  }
]'::json
WHERE role = 'doctor' AND email = 'doctor@example.com';
```
2. No vacation badge should appear

## Visual Testing Checklist

### Find Care Page - Card View
- [ ] Vacation badge appears between working hours and availability
- [ ] Yellow/amber color for upcoming vacations
- [ ] Orange/red color for current vacations
- [ ] Dates formatted correctly (e.g., "Nov 20 - 25")
- [ ] Badge is responsive on mobile
- [ ] Badge text doesn't overflow

### Find Care Page - List View
- [ ] Compact vacation badge inline with other info
- [ ] Smaller text but still readable
- [ ] Proper spacing with other elements
- [ ] Icon displays correctly

### Doctor Profile Page
- [ ] Vacation card appears in right sidebar
- [ ] Gradient background (orange for current, amber for upcoming)
- [ ] Calendar icon displays
- [ ] Title shows "Currently on Vacation" or "Upcoming Vacation"
- [ ] Dates formatted correctly
- [ ] Reason displays when provided
- [ ] Warning message shows for current vacations
- [ ] Responsive on mobile/tablet

## Browser Testing

Test in the following browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## API Verification

### Check if vacation data is returned:

```bash
# Get all doctors
curl http://localhost:3001/doctors | jq '.[0].vacations'

# Get specific doctor
curl http://localhost:3001/doctors/DOCTOR_UUID | jq '.vacations'
```

Expected response:
```json
[
  {
    "startDate": "2025-11-20",
    "endDate": "2025-11-25",
    "reason": "Medical Conference"
  }
]
```

## Common Issues & Solutions

### Issue: Vacation badge not showing

**Solution 1**: Check backend is returning vacation data
```bash
curl http://localhost:3001/doctors | jq '.[0]' | grep vacations
```

**Solution 2**: Check browser console for errors
- Open Developer Tools (F12)
- Check Console tab
- Look for any TypeScript or API errors

**Solution 3**: Verify date format
- Dates must be ISO 8601 format: "YYYY-MM-DD"
- Start date must be before end date

### Issue: Wrong vacation showing (should be next one)

**Solution**: Check the `getNextVacation()` logic in `/src/types/doctor.ts`
- It filters for future/current vacations
- Sorts by start date
- Returns the first one

### Issue: Vacation data not saved in database

**Solution**: Check JSON format in SQL
```sql
-- Correct format (use single quotes for SQL, double quotes for JSON keys)
'[{"startDate": "2025-11-20", "endDate": "2025-11-25"}]'

-- Wrong formats:
"[{'startDate': '2025-11-20'}]"  -- Wrong quote usage
[{startDate: "2025-11-20"}]       -- Missing quotes around SQL JSON
```

## Performance Testing

1. Load find-care page with 20+ doctors
2. Some doctors should have vacations, some shouldn't
3. Page should load smoothly without lag
4. Check Network tab for API response times

## Accessibility Testing

- [ ] Vacation badges have proper contrast ratios
- [ ] Screen reader announces vacation information
- [ ] Keyboard navigation works through doctor cards
- [ ] Focus indicators visible

## Sample Test Data SQL

Use this to set up comprehensive test data:

```sql
-- Doctor 1: Currently on vacation
UPDATE users SET vacations = '[{"startDate": "2025-11-08", "endDate": "2025-11-12", "reason": "Conference"}]'::json WHERE role = 'doctor' AND id = (SELECT id FROM users WHERE role = 'doctor' LIMIT 1 OFFSET 0);

-- Doctor 2: Upcoming vacation next week
UPDATE users SET vacations = '[{"startDate": "2025-11-18", "endDate": "2025-11-22", "reason": "Personal"}]'::json WHERE role = 'doctor' AND id = (SELECT id FROM users WHERE role = 'doctor' LIMIT 1 OFFSET 1);

-- Doctor 3: Multiple vacations
UPDATE users SET vacations = '[{"startDate": "2025-11-20", "endDate": "2025-11-22"}, {"startDate": "2025-12-24", "endDate": "2026-01-02", "reason": "Holidays"}]'::json WHERE role = 'doctor' AND id = (SELECT id FROM users WHERE role = 'doctor' LIMIT 1 OFFSET 2);

-- Doctor 4: No vacation
UPDATE users SET vacations = NULL WHERE role = 'doctor' AND id = (SELECT id FROM users WHERE role = 'doctor' LIMIT 1 OFFSET 3);

-- Doctor 5: Past vacation only (should not show badge)
UPDATE users SET vacations = '[{"startDate": "2025-10-01", "endDate": "2025-10-05"}]'::json WHERE role = 'doctor' AND id = (SELECT id FROM users WHERE role = 'doctor' LIMIT 1 OFFSET 4);
```

## Automated Testing (Future Enhancement)

To add automated tests, create:
- Unit tests for `getNextVacation()`, `isOnVacation()`, `formatVacationDates()`
- Integration tests for API endpoints
- E2E tests for UI rendering

Example test structure:
```typescript
describe('Doctor Vacation Utils', () => {
  test('getNextVacation returns next upcoming vacation', () => {
    const doctor = {
      vacations: [
        { startDate: '2025-11-20', endDate: '2025-11-25' },
        { startDate: '2025-12-01', endDate: '2025-12-05' }
      ]
    };
    const next = getNextVacation(doctor);
    expect(next.startDate).toBe('2025-11-20');
  });
});
```

## Deployment Checklist

Before deploying to production:
- [ ] Test on staging environment
- [ ] Verify all doctors load correctly
- [ ] Check mobile responsiveness
- [ ] Verify date calculations across timezones
- [ ] Test with various date ranges
- [ ] Ensure backward compatibility (doctors without vacations)
- [ ] Monitor API performance
- [ ] Check error handling for malformed vacation data

