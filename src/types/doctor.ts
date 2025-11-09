export interface DoctorVacation {
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialty?: string;
  bio?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  isActive: boolean;
  workingHours?: Record<string, any>;
  appointmentSettings?: Record<string, any>;
  socialMedia?: {
    website?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  vacations?: DoctorVacation[];
  rating?: number;
  featured?: boolean;
  acceptsVideo?: boolean;
  education?: string;
  experience?: string;
  licenseNumber?: string;
  languages?: string[];
}

/**
 * Get the next upcoming vacation for a doctor
 * Returns null if no upcoming vacations
 */
export function getNextVacation(doctor: Doctor): DoctorVacation | null {
  if (!doctor.vacations || doctor.vacations.length === 0) {
    return null;
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0); // Start of today

  // Filter for future or current vacations and sort by start date
  const upcomingVacations = doctor.vacations
    .filter((vacation) => {
      const endDate = new Date(vacation.endDate);
      endDate.setHours(23, 59, 59, 999); // End of day
      return endDate >= now;
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return upcomingVacations.length > 0 ? upcomingVacations[0] : null;
}

/**
 * Check if doctor is currently on vacation
 */
export function isOnVacation(doctor: Doctor): boolean {
  if (!doctor.vacations || doctor.vacations.length === 0) {
    return false;
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return doctor.vacations.some((vacation) => {
    const startDate = new Date(vacation.startDate);
    const endDate = new Date(vacation.endDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    
    return now >= startDate && now <= endDate;
  });
}

/**
 * Format vacation dates for display
 */
export function formatVacationDates(vacation: DoctorVacation): string {
  const startDate = new Date(vacation.startDate);
  const endDate = new Date(vacation.endDate);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: startDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  // If same day
  if (startDate.toDateString() === endDate.toDateString()) {
    return formatDate(startDate);
  }

  // If same month and year
  if (
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear()
  ) {
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.getDate()}`;
  }

  // Different months or years
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

