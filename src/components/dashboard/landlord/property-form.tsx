"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import PropertyImage from "@/components/property/property-image";
import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form-field";
import { api, applyFieldErrors, showErrorToast } from "@/lib/api";
import { COMMON_AMENITIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { propertySchema, type PropertyValues } from "@/lib/validations";
import type { Category, Property } from "@/types";

const MAX_IMAGES = 8;

const fieldNames = ["title", "description", "location", "address", "rent", "bedrooms", "bathrooms", "categoryId", "amenities", "images"] as const;

const isValidUrl = (value: string) => {
  try {
    const url = new URL(value);

    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

const PropertyForm = ({ property }: { property?: Property }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState<string | null>(null);
  const [customAmenity, setCustomAmenity] = useState("");
  const isEdit = Boolean(property);

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await api.get<Category[]>("/categories")).data,
    staleTime: 5 * 60_000,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<PropertyValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: property?.title ?? "",
      description: property?.description ?? "",
      location: property?.location ?? "",
      address: property?.address ?? "",
      rent: property ? Number(property.rent) : Number.NaN,
      bedrooms: property?.bedrooms ?? 1,
      bathrooms: property?.bathrooms ?? 1,
      categoryId: property?.categoryId ?? "",
      amenities: property?.amenities ?? [],
      images: property?.images ?? [],
    },
  });

  const amenities = watch("amenities");
  const images = watch("images");
  const amenityOptions = [...new Set([...COMMON_AMENITIES, ...amenities])];

  const mutation = useMutation({
    mutationFn: (values: PropertyValues) => (property ? api.put<Property>(`/landlord/properties/${property.id}`, values) : api.post<Property>("/landlord/properties", values)),
    onSuccess: () => {
      toast.success(isEdit ? "Property updated" : "Property listed", { description: isEdit ? "Your changes are saved." : "Tenants can now find it and send requests." });
      queryClient.invalidateQueries({ queryKey: ["landlord"] });
      router.push("/dashboard/landlord/properties");
    },
    onError: (error) => {
      if (!applyFieldErrors(error, setError, fieldNames)) {
        showErrorToast(error);
      }
    },
  });

  const toggleAmenity = (amenity: string) => {
    const next = amenities.includes(amenity) ? amenities.filter((item) => item !== amenity) : [...amenities, amenity];

    setValue("amenities", next, { shouldDirty: true });
  };

  const addCustomAmenity = () => {
    const amenity = customAmenity.trim().toLowerCase();

    if (amenity && !amenities.includes(amenity)) {
      setValue("amenities", [...amenities, amenity], { shouldDirty: true });
    }

    setCustomAmenity("");
  };

  const addImage = () => {
    const url = imageUrl.trim();

    if (!isValidUrl(url)) {
      setImageError("Enter a full image link that starts with https://");
      return;
    }

    if (images.includes(url)) {
      setImageError("This image is already added");
      return;
    }

    if (images.length >= MAX_IMAGES) {
      setImageError(`You can add ${MAX_IMAGES} images at most`);
      return;
    }

    setValue("images", [...images, url], { shouldDirty: true, shouldValidate: true });
    setImageUrl("");
    setImageError(null);
  };

  const removeImage = (url: string) => {
    setValue(
      "images",
      images.filter((image) => image !== url),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate className="space-y-6">
      <Card className="space-y-5 p-5 sm:p-6">
        <h2 className="font-semibold">Basic details</h2>

        <Field label="Title" htmlFor="title" error={errors.title?.message} required>
          <Input id="title" placeholder="e.g. Sunny 2 bedroom apartment in Dhanmondi" aria-invalid={Boolean(errors.title)} {...register("title")} />
        </Field>

        <Field label="Description" htmlFor="description" error={errors.description?.message} hint="At least 20 characters" required>
          <Textarea id="description" rows={5} placeholder="Describe the place, the neighbourhood and what makes it special" aria-invalid={Boolean(errors.description)} {...register("description")} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Location" htmlFor="location" error={errors.location?.message} hint="Area and city" required>
            <Input id="location" placeholder="e.g. Dhanmondi, Dhaka" aria-invalid={Boolean(errors.location)} {...register("location")} />
          </Field>
          <Field label="Property type" htmlFor="categoryId" error={errors.categoryId?.message} required>
            <Select id="categoryId" aria-invalid={Boolean(errors.categoryId)} disabled={categories.isPending} {...register("categoryId")}>
              <option value="">{categories.isPending ? "Loading types" : "Choose a type"}</option>
              {categories.data?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Full address" htmlFor="address" error={errors.address?.message} required>
          <Input id="address" placeholder="House, road and area" aria-invalid={Boolean(errors.address)} {...register("address")} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Monthly rent (USD)" htmlFor="rent" error={errors.rent?.message} required>
            <Input id="rent" type="number" min={1} step="0.01" inputMode="decimal" placeholder="450" aria-invalid={Boolean(errors.rent)} {...register("rent", { valueAsNumber: true })} />
          </Field>
          <Field label="Bedrooms" htmlFor="bedrooms" error={errors.bedrooms?.message} required>
            <Input id="bedrooms" type="number" min={0} aria-invalid={Boolean(errors.bedrooms)} {...register("bedrooms", { valueAsNumber: true })} />
          </Field>
          <Field label="Bathrooms" htmlFor="bathrooms" error={errors.bathrooms?.message} required>
            <Input id="bathrooms" type="number" min={0} aria-invalid={Boolean(errors.bathrooms)} {...register("bathrooms", { valueAsNumber: true })} />
          </Field>
        </div>
      </Card>

      <Card className="space-y-4 p-5 sm:p-6">
        <div>
          <h2 className="font-semibold">Amenities</h2>
          <p className="text-sm text-muted-foreground">Pick everything the property offers.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {amenityOptions.map((amenity) => {
            const selected = amenities.includes(amenity);

            return (
              <button
                key={amenity}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleAmenity(amenity)}
                className={cn(
                  "cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium capitalize transition",
                  selected ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:border-primary hover:text-primary"
                )}
              >
                {amenity}
              </button>
            );
          })}
        </div>
        <div className="flex max-w-sm gap-2">
          <Input
            aria-label="Add another amenity"
            placeholder="Add another amenity"
            value={customAmenity}
            onChange={(event) => setCustomAmenity(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addCustomAmenity();
              }
            }}
          />
          <Button variant="outline" onClick={addCustomAmenity}>
            <Plus className="size-4" />
            Add
          </Button>
        </div>
        {errors.amenities?.message && (
          <p role="alert" className="text-xs font-medium text-destructive">
            {errors.amenities.message}
          </p>
        )}
      </Card>

      <Card className="space-y-4 p-5 sm:p-6">
        <div>
          <h2 className="font-semibold">Photos</h2>
          <p className="text-sm text-muted-foreground">
            Paste image links one by one. The first photo is used as the cover. {images.length} of {MAX_IMAGES} added.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            aria-label="Image link"
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            value={imageUrl}
            aria-invalid={Boolean(imageError)}
            onChange={(event) => {
              setImageUrl(event.target.value);
              setImageError(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addImage();
              }
            }}
          />
          <Button variant="outline" onClick={addImage} className="shrink-0">
            <ImagePlus className="size-4" />
            Add photo
          </Button>
        </div>
        {(imageError || errors.images?.message) && (
          <p role="alert" className="text-xs font-medium text-destructive">
            {imageError ?? errors.images?.message}
          </p>
        )}

        {images.length > 0 && (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((image, index) => (
              <li key={image} className="group relative aspect-4/3 overflow-hidden rounded-lg border">
                <PropertyImage src={image} alt={`Photo ${index + 1}`} sizes="200px" />
                {index === 0 && <span className="absolute bottom-2 left-2 rounded-md bg-slate-950/70 px-2 py-0.5 text-xs font-medium text-white">Cover</span>}
                <button
                  type="button"
                  aria-label={`Remove photo ${index + 1}`}
                  onClick={() => removeImage(image)}
                  className="absolute top-2 right-2 inline-flex size-7 cursor-pointer items-center justify-center rounded-full bg-slate-950/70 text-white transition hover:bg-destructive"
                >
                  <X className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="outline" onClick={() => router.push("/dashboard/landlord/properties")} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button type="submit" size="lg" loading={mutation.isPending}>
          {isEdit ? "Save changes" : "Publish listing"}
        </Button>
      </div>
    </form>
  );
};

export default PropertyForm;
