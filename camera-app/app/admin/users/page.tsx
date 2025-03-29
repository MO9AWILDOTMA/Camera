"use client";

import Loading from "@/app/loading";
import GenericTable from "@/components/admin/table";
import { usersApi } from "@/lib/api";
import User from "@/models/user.model";
import { Column } from "@/types/table-types";
import React, { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ERole } from "@/models/role.model";

const columns: any = [
  { key: "firstName", label: "Name" },
  { key: "email", label: "Email" },
  {
    key: "roles",
    label: "Role",
    render: (item: any) => {
      // Define role priority (Admin > Moderator > Cinephile)
      const rolePriority = {
        [ERole.ROLE_ADMIN]: 1,
        [ERole.ROLE_MODERATOR]: 2,
        [ERole.ROLE_CINEPHILE]: 3,
      };

      // Sort roles by priority and display the most important one
      if (item.roles && item.roles.length > 0) {
        const sortedRoles = [...item.roles].sort(
          (a, b) => rolePriority[a.name] - rolePriority[b.name]
        );

        // Return the highest priority role name
        return sortedRoles[0].name;
      }

      return "No Role";
    },
  },
];

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(2);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await usersApi.getAll(page, size);
        const data = response.data;

        setUsers(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, size]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) return <Loading />;
  return (
    <div>
      <div>
        <h2 className="px-10 mb-4 font-bold text-2xl">Users Managment</h2>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <GenericTable columns={columns} data={users} />

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm">
                    Page {page} of {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
