import { z } from "zod";

const isTodayOrLater = (value: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return new Date(`${value}T00:00:00`).getTime() >= today.getTime();
};

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
    email: z.email("Enter a valid email address"),
    phone: z
      .string()
      .trim()
      .max(20, "Phone number is too long")
      .refine((value) => value === "" || value.length >= 6, "Phone number is too short"),
    role: z.enum(["TENANT", "LANDLORD"], "Choose how you want to use RentNest"),
    password: z.string().min(6, "Password must be at least 6 characters").max(72, "Password is too long"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const rentalRequestSchema = z.object({
  moveInDate: z.string().min(1, "Choose a move-in date").refine(isTodayOrLater, "Move-in date cannot be in the past"),
  durationMonths: z.number("Enter the number of months").int("Use a whole number").min(1, "Minimum stay is 1 month").max(60, "Maximum stay is 60 months"),
  message: z.string().trim().max(500, "Message cannot be more than 500 characters"),
});

export const propertySchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(150, "Title cannot be more than 150 characters"),
  description: z.string().trim().min(20, "Description must be at least 20 characters"),
  location: z.string().trim().min(2, "Location is required").max(100, "Location is too long"),
  address: z.string().trim().min(5, "Address must be at least 5 characters").max(255, "Address is too long"),
  rent: z.number("Enter the monthly rent").positive("Rent must be greater than 0").max(99999999, "Rent is too high"),
  bedrooms: z.number("Enter the bedrooms").int("Use a whole number").min(0, "Cannot be negative").max(50, "Too many bedrooms"),
  bathrooms: z.number("Enter the bathrooms").int("Use a whole number").min(0, "Cannot be negative").max(50, "Too many bathrooms"),
  categoryId: z.string().min(1, "Choose a property type"),
  amenities: z.array(z.string()).max(30, "Too many amenities"),
  images: z.array(z.url("Every image must be a valid URL")).max(8, "You can add 8 images at most"),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1, "Choose a rating").max(5),
  comment: z.string().trim().min(5, "Comment must be at least 5 characters").max(1000, "Comment cannot be more than 1000 characters"),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  phone: z
    .string()
    .trim()
    .max(20, "Phone number is too long")
    .refine((value) => value === "" || value.length >= 6, "Phone number is too short"),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
  description: z.string().trim().max(255, "Description is too long"),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type RentalRequestValues = z.infer<typeof rentalRequestSchema>;
export type PropertyValues = z.infer<typeof propertySchema>;
export type ReviewValues = z.infer<typeof reviewSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
export type CategoryValues = z.infer<typeof categorySchema>;
