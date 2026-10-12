export type Role = "TENANT" | "LANDLORD" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";
export type PropertyStatus = "AVAILABLE" | "RENTED" | "UNAVAILABLE";
export type RentalStatus = "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: Meta;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  _count?: { properties: number };
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  tenant?: { id: string; name: string };
  property?: { id: string; title: string; location: string };
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  address: string;
  rent: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  status: PropertyStatus;
  isDeleted: boolean;
  landlordId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category?: { id: string; name: string };
  landlord?: { id: string; name: string; email: string; phone: string | null };
}

export interface PropertyDetails extends Property {
  reviews: Review[];
  averageRating: number | null;
  totalReviews: number;
}

export interface RentalRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  moveInDate: string;
  durationMonths: number;
  totalAmount: string;
  message: string | null;
  status: RentalStatus;
  createdAt: string;
  updatedAt: string;
  property: {
    id: string;
    title: string;
    location: string;
    address: string;
    rent: string;
    images: string[];
    status: PropertyStatus;
    landlordId: string;
  };
  tenant: { id: string; name: string; email: string; phone: string | null };
  review: { id: string; rating: number; comment: string } | null;
}

export interface Payment {
  id: string;
  transactionId: string;
  rentalRequestId: string;
  userId: string;
  amount: string;
  currency: string;
  method: string;
  provider: string;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
  rentalRequest?: {
    id: string;
    status: RentalStatus;
    moveInDate: string;
    durationMonths: number;
    property: { id: string; title: string; location: string; landlordId: string };
  };
  user?: { id: string; name: string; email: string };
}

export interface CheckoutSession {
  payment: Payment;
  checkoutUrl: string;
}

export interface TenantStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  activeRentals: number;
  completedRentals: number;
  completedPayments: number;
  totalPaid: number;
  totalReviews: number;
}

export interface LandlordStats {
  totalProperties: number;
  availableProperties: number;
  rentedProperties: number;
  pendingRequests: number;
  approvedRequests: number;
  activeRentals: number;
  completedRentals: number;
  totalEarnings: number;
  totalReviews: number;
  averageRating: number | null;
}

export interface AdminStats {
  totalUsers: number;
  totalTenants: number;
  totalLandlords: number;
  bannedUsers: number;
  totalProperties: number;
  availableProperties: number;
  rentedProperties: number;
  totalRequests: number;
  pendingRequests: number;
  activeRentals: number;
  completedPayments: number;
  totalRevenue: number;
}
