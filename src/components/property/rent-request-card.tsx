"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarCheck, CircleCheck, Info, LogIn } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import Button, { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/form-field";
import Skeleton from "@/components/ui/skeleton";
import { api, applyFieldErrors, showErrorToast } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { rentalRequestSchema, type RentalRequestValues } from "@/lib/validations";
import type { PropertyStatus, RentalRequest } from "@/types";

interface RentRequestCardProps {
  property: {
    id: string;
    rent: string;
    status: PropertyStatus;
  };
}

const Notice = ({ text }: { text: string }) => {
  return (
    <p className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
      <Info className="mt-0.5 size-4 shrink-0" />
      {text}
    </p>
  );
};

const RequestForm = ({ property }: RentRequestCardProps) => {
  const queryClient = useQueryClient();
  const [sent, setSent] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<RentalRequestValues>({
    resolver: zodResolver(rentalRequestSchema),
    defaultValues: { moveInDate: "", durationMonths: 6, message: "" },
  });

  const months = watch("durationMonths");
  const total = Number(property.rent) * (Number.isFinite(months) ? months : 0);

  const mutation = useMutation({
    mutationFn: (values: RentalRequestValues) =>
      api.post<RentalRequest>("/rentals", {
        propertyId: property.id,
        moveInDate: values.moveInDate,
        durationMonths: values.durationMonths,
        ...(values.message ? { message: values.message } : {}),
      }),
    onSuccess: () => {
      setSent(true);
      toast.success("Rental request sent", { description: "The landlord will review your request soon." });
      queryClient.invalidateQueries({ queryKey: ["tenant"] });
    },
    onError: (error) => {
      if (!applyFieldErrors(error, setError, ["moveInDate", "durationMonths", "message"])) {
        showErrorToast(error);
      }
    },
  });

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
          <CircleCheck className="size-6" />
        </span>
        <div>
          <p className="font-semibold">Your request is on its way</p>
          <p className="mt-1 text-sm text-muted-foreground">You can pay as soon as the landlord approves it.</p>
        </div>
        <Link href="/dashboard/tenant/requests" className={buttonStyles("primary", "md", "w-full")}>
          View my requests
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate className="space-y-4">
      <Field label="Move-in date" htmlFor="moveInDate" error={errors.moveInDate?.message} required>
        <Input id="moveInDate" type="date" min={today} aria-invalid={Boolean(errors.moveInDate)} {...register("moveInDate")} />
      </Field>

      <Field label="How many months?" htmlFor="durationMonths" error={errors.durationMonths?.message} required>
        <Input id="durationMonths" type="number" min={1} max={60} aria-invalid={Boolean(errors.durationMonths)} {...register("durationMonths", { valueAsNumber: true })} />
      </Field>

      <Field label="Message to the landlord" htmlFor="message" error={errors.message?.message} hint="Optional">
        <Textarea id="message" rows={3} placeholder="Tell the landlord a little about yourself" aria-invalid={Boolean(errors.message)} {...register("message")} />
      </Field>

      <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-3 text-sm">
        <span className="text-muted-foreground">Total for the stay</span>
        <span className="text-lg font-bold">{formatCurrency(total)}</span>
      </div>

      <Button type="submit" size="lg" loading={mutation.isPending} className="w-full">
        <CalendarCheck className="size-4" />
        Request to rent
      </Button>
    </form>
  );
};

const RentRequestCard = ({ property }: RentRequestCardProps) => {
  const { user, isLoading } = useAuth();

  return (
    <Card className="p-6 lg:sticky lg:top-24">
      <p className="mb-5">
        <span className="text-3xl font-bold text-primary">{formatCurrency(property.rent)}</span>
        <span className="text-muted-foreground"> / month</span>
      </p>

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-12" />
        </div>
      )}

      {!isLoading && property.status !== "AVAILABLE" && <Notice text="This property is not available for new requests right now." />}

      {!isLoading && property.status === "AVAILABLE" && !user && (
        <div className="space-y-3">
          <Notice text="Login as a tenant to send a rental request for this property." />
          <Link href={`/auth/login?redirect=/properties/${property.id}`} className={buttonStyles("primary", "lg", "w-full")}>
            <LogIn className="size-4" />
            Login to request
          </Link>
        </div>
      )}

      {!isLoading && property.status === "AVAILABLE" && user && user.role !== "TENANT" && <Notice text="Only tenant accounts can send rental requests." />}

      {!isLoading && property.status === "AVAILABLE" && user?.role === "TENANT" && <RequestForm property={property} />}
    </Card>
  );
};

export default RentRequestCard;
