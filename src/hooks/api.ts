import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import { toast } from "react-hot-toast";

// Doctors
export function useDoctors(params?: { specialty?: string; search?: string }) {
  return useQuery({
    queryKey: ["doctors", params],
    queryFn: () => api.getDoctors(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: () => api.getDoctor(id),
    enabled: !!id,
  });
}

export function useDoctorAvailability(doctorId: string, date: string) {
  return useQuery({
    queryKey: ["doctor-availability", doctorId, date],
    queryFn: () => api.getDoctorAvailability(doctorId, date),
    enabled: !!doctorId && !!date,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Appointments
export function usePatientAppointments(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: ["patient-appointments", params],
    queryFn: () => api.getPatientAppointments(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-appointments"] });
      toast.success("Appointment booked successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to book appointment");
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<unknown> }) =>
      api.updateAppointment(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-appointments"] });
      toast.success("Appointment updated successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to update appointment");
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-appointments"] });
      toast.success("Appointment cancelled successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to cancel appointment");
    },
  });
}

// Health Records
export function useHealthRecords(params?: {
  category?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["health-records", params],
    queryFn: () => api.getHealthRecords(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Profile
export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: api.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
}
