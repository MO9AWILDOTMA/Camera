"use client";

import Loading from "@/app/loading";
import GenericTable from "@/components/admin/table";
import { usersApi } from "@/lib/api";
import User from "@/models/user.model";
import { Column } from "@/types/table-types";
import React, { useEffect, useState } from "react";

const columns: any = [
  { key: "firstName", label: "Name" },
  { key: "email", label: "Email" },
  { key: "roles", label: "Role" },
];

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await usersApi.getAll(page, size);
        const data = response.data;

        setUsers(data.content || []);
        // setPage(data)
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const showMovie = () => {};

  if (loading) return <Loading />;
  return (
    <div>
      <div>
        <h2 className="px-10 mb-4 font-bold text-2xl">Users Managment</h2>
      </div>
      <GenericTable columns={columns} data={users} />
    </div>
  );
};

export default Users;
