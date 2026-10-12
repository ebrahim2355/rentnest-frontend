"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Button from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/form-field";
import Modal from "@/components/ui/modal";
import { api, applyFieldErrors, showErrorToast } from "@/lib/api";
import { cn } from "@/lib/utils";
import { reviewSchema, type ReviewValues } from "@/lib/validations";
import type { RentalRequest, Review } from "@/types";

interface ReviewDialogProps {
  rental: RentalRequest | null;
  onClose: () => void;
}

const ReviewForm = ({ rental, onClose }: { rental: RentalRequest; onClose: () => void }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ReviewValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  });

  const rating = watch("rating");

  const mutation = useMutation({
    mutationFn: (values: ReviewValues) => api.post<Review>("/reviews", { rentalRequestId: rental.id, ...values }),
    onSuccess: () => {
      toast.success("Thanks for your review");
      queryClient.invalidateQueries({ queryKey: ["tenant"] });
      onClose();
    },
    onError: (error) => {
      if (!applyFieldErrors(error, setError, ["rating", "comment"])) {
        showErrorToast(error);
      }
    },
  });

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate className="space-y-4">
      <Field label="Your rating" error={errors.rating?.message} required>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
              onClick={() => setValue("rating", star, { shouldValidate: true })}
              className="cursor-pointer rounded-md p-1 transition hover:scale-110"
            >
              <Star className={cn("size-7", star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40")} />
            </button>
          ))}
        </div>
      </Field>

      <Field label="Your review" htmlFor="comment" error={errors.comment?.message} required>
        <Textarea id="comment" rows={4} placeholder="How was your stay?" aria-invalid={Boolean(errors.comment)} {...register("comment")} />
      </Field>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button type="submit" loading={mutation.isPending}>
          Submit review
        </Button>
      </div>
    </form>
  );
};

const ReviewDialog = ({ rental, onClose }: ReviewDialogProps) => {
  return (
    <Modal open={Boolean(rental)} onClose={onClose} title="Leave a review" description={rental?.property.title ?? ""}>
      {rental && <ReviewForm key={rental.id} rental={rental} onClose={onClose} />}
    </Modal>
  );
};

export default ReviewDialog;
