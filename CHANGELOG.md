# Changelog

All notable changes to the CarePoint Patient Portal will be documented in this file.

## [Unreleased] - 2025-11-09

### Added

#### Medical Team Feature
- **Doctor Categorization System**: Intelligent organization of doctors into three priority categories
  - "My Medical Team" - Shows doctors you've previously visited
  - "Recommended for You" - High-rated (≥4.8) and featured doctors
  - "Other Doctors" - All remaining doctors
- **Visual Indicators**: Color-coded badges (blue for your doctors, green for recommended)
- **Smart Detection**: Automatically identifies your medical team from appointment history
- **Personalized Summary**: Badge showing count of doctors in your team
- Implemented in: `src/app/find-care/page.tsx`

#### Doctor Vacation Feature
- **Vacation Display**: Shows doctor vacation information across the application
  - Current vacation status with "On Vacation" badge (orange)
  - Upcoming vacation display with date ranges (amber)
- **Doctor Profile Card**: Dedicated vacation card in doctor profiles showing dates and reasons
- **Type System**: New TypeScript types and utilities in `src/types/doctor.ts`
  - `DoctorVacation` interface
  - `getNextVacation()` utility function
  - `isOnVacation()` checker function
  - `formatVacationDates()` formatter
- **Responsive Badges**: Vacation indicators in both card and list views
- Implemented in: `src/app/find-care/page.tsx`, `src/app/doctors/[id]/page.tsx`, `src/types/doctor.ts`

#### Mobile Responsive Design
- **Custom Breakpoint**: Added `xs` breakpoint at 375px for better small device support
- **Comprehensive Mobile Optimization** across all pages:
  - Find Care page with responsive cards, search, and filters
  - Appointment booking with adaptive calendar and time slot grids
  - Login page with properly sized inputs and buttons
  - Dashboard with flexible layouts and responsive components
- **Safe Area Support**: Added CSS utilities for notched devices (iPhone X and newer)
- **Progressive Typography**: Scale text appropriately from mobile to desktop
- **Touch-Optimized**: Minimum 44x44px tap targets for mobile interaction
- Modified files: `tailwind.config.js`, `src/app/globals.css`, and multiple component files

### Changed
- **Bottom Navigation**: Improved height (`h-14 sm:h-16`) and icon sizes for better thumb reach
- **Desktop Sidebar**: Compact display with responsive avatar and navigation items
- **Welcome Card**: Adaptive button layout (row on mobile, column on desktop)
- **Quick Actions**: Grid changes from 1 to 2 columns at `xs` breakpoint
- **Appointment Pages**: Better spacing and responsive form fields
- **Chat Widget**: Improved mobile responsiveness

### Improved
- **User Experience**: Faster doctor discovery with personalized categorization
- **Continuity of Care**: Easy access to previously visited doctors
- **Decision Making**: Clear visual hierarchy and trust indicators
- **Mobile Usability**: Optimized for devices from iPhone mini (320px) to large foldables
- **Performance**: Efficient categorization with no additional API calls

### Technical
- **New Dependencies**: None (uses existing hooks and utilities)
- **Breaking Changes**: None (backward compatible)
- **Browser Support**: All modern browsers with mobile-first responsive design
- **Device Support**: iPhone mini (320px) to large foldables and desktop

### Documentation
- Added `MEDICAL_TEAM_FEATURE.md` - Complete medical team feature documentation
- Added `VACATION_FEATURE.md` - Doctor vacation feature documentation
- Added `VACATION_TESTING_GUIDE.md` - Testing guide for vacation feature
- Added `RESPONSIVE_IMPROVEMENTS.md` - Mobile responsive design documentation

---

## Format

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### Categories
- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

