"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ban, Search, ShieldCheck, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { StatusBadge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import EmptyState from "@/components/ui/empty-state";
import ErrorNotice from "@/components/ui/error-notice";
import { Input, Select } from "@/components/ui/form-field";
import Pagination from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, TableSkeleton } from "@/components/ui/table";
import { api, getErrorText, showErrorToast } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { ApiResponse, User, UserStatus } from "@/types";

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const { user: admin } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [toBan, setToBan] = useState<User | null>(null);
  const queryKey = ["admin", "users", { searchTerm, role, status, page }];

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isPending, isError, error } = useQuery({
    queryKey,
    queryFn: () => api.get<User[]>("/admin/users", { searchTerm, role, status, page, limit: 8 }),
    placeholderData: keepPreviousData,
    meta: { silent: true },
  });

  const changeStatus = useMutation({
    mutationFn: ({ id, next }: { id: string; next: UserStatus }) => api.patch<User>(`/admin/users/${id}`, { status: next }),
    onMutate: async ({ id, next }) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<ApiResponse<User[]>>(queryKey);

      queryClient.setQueryData<ApiResponse<User[]>>(queryKey, (current) =>
        current ? { ...current, data: current.data.map((item) => (item.id === id ? { ...item, status: next } : item)) } : current
      );

      return { previous };
    },
    onSuccess: (result) => {
      toast.success(result.data.status === "BANNED" ? `${result.data.name} is banned` : `${result.data.name} is active again`);
    },
    onError: (mutationError, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }

      showErrorToast(mutationError);
    },
    onSettled: () => {
      setToBan(null);
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });

  return (
    <>
      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <label className="relative">
          <span className="sr-only">Search users</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name or email" className="pl-9" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} />
        </label>
        <Select
          aria-label="Filter by role"
          value={role}
          onChange={(event) => {
            setRole(event.target.value);
            setPage(1);
          }}
          className="sm:w-40"
        >
          <option value="">All roles</option>
          <option value="TENANT">Tenants</option>
          <option value="LANDLORD">Landlords</option>
          <option value="ADMIN">Admins</option>
        </Select>
        <Select
          aria-label="Filter by status"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          className="sm:w-40"
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="BANNED">Banned</option>
        </Select>
      </div>

      {isPending && <TableSkeleton rows={6} columns={5} />}

      {isError && <ErrorNotice title={getErrorText(error).title} description={getErrorText(error).description} />}

      {data && !data.data.length && <EmptyState icon={UserX} title="No users found" description="Try a different search or clear the filters." />}

      {data && data.data.length > 0 && (
        <div className="space-y-4">
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>User</TableHeaderCell>
                <TableHeaderCell>Role</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Joined</TableHeaderCell>
                <TableHeaderCell className="text-right">Action</TableHeaderCell>
              </tr>
            </TableHead>
            <TableBody>
              {data.data.map((user) => {
                const isProtected = user.role === "ADMIN" || user.id === admin?.id;

                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={user.role} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={user.status} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        {isProtected && <span className="text-xs text-muted-foreground">Protected account</span>}
                        {!isProtected && user.status === "ACTIVE" && (
                          <Button size="sm" variant="outline" className="text-destructive" disabled={changeStatus.isPending} onClick={() => setToBan(user)}>
                            <Ban className="size-4" />
                            Ban
                          </Button>
                        )}
                        {!isProtected && user.status === "BANNED" && (
                          <Button size="sm" variant="outline" disabled={changeStatus.isPending} onClick={() => changeStatus.mutate({ id: user.id, next: "ACTIVE" })}>
                            <ShieldCheck className="size-4" />
                            Unban
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {data.meta && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} total={data.meta.total} onPageChange={setPage} />}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(toBan)}
        title="Ban this user?"
        description={`${toBan?.name ?? "This user"} will not be able to login or use RentNest until you unban the account.`}
        confirmLabel="Ban user"
        destructive
        loading={changeStatus.isPending}
        onConfirm={() => toBan && changeStatus.mutate({ id: toBan.id, next: "BANNED" })}
        onClose={() => setToBan(null)}
      />
    </>
  );
};

export default AdminUsers;
