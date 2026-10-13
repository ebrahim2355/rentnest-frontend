"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FolderTree, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Button from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import EmptyState from "@/components/ui/empty-state";
import ErrorNotice from "@/components/ui/error-notice";
import { Field, Input, Textarea } from "@/components/ui/form-field";
import Modal from "@/components/ui/modal";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, TableSkeleton } from "@/components/ui/table";
import { api, applyFieldErrors, getErrorText, showErrorToast } from "@/lib/api";
import { categorySchema, type CategoryValues } from "@/lib/validations";
import type { Category } from "@/types";

interface CategoryFormProps {
  category: Category | null;
  onDone: () => void;
}

const CategoryForm = ({ category, onDone }: CategoryFormProps) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: category?.name ?? "", description: category?.description ?? "" },
  });

  const mutation = useMutation({
    mutationFn: (values: CategoryValues) => {
      const body = { name: values.name, ...(values.description ? { description: values.description } : {}) };

      return category ? api.patch<Category>(`/admin/categories/${category.id}`, body) : api.post<Category>("/admin/categories", body);
    },
    onSuccess: () => {
      toast.success(category ? "Category updated" : "Category created");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onDone();
    },
    onError: (error) => {
      if (!applyFieldErrors(error, setError, ["name", "description"])) {
        showErrorToast(error);
      }
    },
  });

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate className="space-y-4">
      <Field label="Name" htmlFor="category-name" error={errors.name?.message} required>
        <Input id="category-name" placeholder="e.g. Penthouse" aria-invalid={Boolean(errors.name)} {...register("name")} />
      </Field>
      <Field label="Description" htmlFor="category-description" error={errors.description?.message} hint="Optional">
        <Textarea id="category-description" rows={3} placeholder="A short description of this property type" aria-invalid={Boolean(errors.description)} {...register("description")} />
      </Field>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onDone} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button type="submit" loading={mutation.isPending}>
          {category ? "Save changes" : "Create category"}
        </Button>
      </div>
    </form>
  );
};

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [toDelete, setToDelete] = useState<Category | null>(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await api.get<Category[]>("/categories")).data,
    meta: { silent: true },
  });

  const remove = useMutation({
    mutationFn: (category: Category) => api.delete<null>(`/admin/categories/${category.id}`),
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: showErrorToast,
    onSettled: () => setToDelete(null),
  });

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setFormOpen(true);
  };

  return (
    <>
      <div className="mb-5 flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Add category
        </Button>
      </div>

      {isPending && <TableSkeleton rows={5} columns={4} />}

      {isError && <ErrorNotice title={getErrorText(error).title} description={getErrorText(error).description} />}

      {data && !data.length && <EmptyState icon={FolderTree} title="No categories yet" description="Create the first property type so landlords can use it." />}

      {data && data.length > 0 && (
        <Table>
          <TableHead>
            <tr>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              <TableHeaderCell>Listings</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </tr>
          </TableHead>
          <TableBody>
            {data.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="max-w-80 text-muted-foreground">{category.description ?? "No description"}</TableCell>
                <TableCell>{category._count?.properties ?? 0}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(category)}>
                      <Pencil className="size-4" />
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setToDelete(category)}>
                      <Trash2 className="size-4" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit category" : "Add category"} description="Categories are the property types tenants can filter by.">
        <CategoryForm key={editing?.id ?? "new"} category={editing} onDone={() => setFormOpen(false)} />
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this category?"
        description={`"${toDelete?.name ?? ""}" will be deleted. A category that still has properties cannot be deleted.`}
        confirmLabel="Delete category"
        destructive
        loading={remove.isPending}
        onConfirm={() => toDelete && remove.mutate(toDelete)}
        onClose={() => setToDelete(null)}
      />
    </>
  );
};

export default AdminCategories;
