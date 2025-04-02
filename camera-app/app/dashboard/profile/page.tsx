"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-provider";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Loading from "../../loading";
import { usersApi } from "@/lib/api";
import Image from "next/image";
import { ERole } from "@/models/role.model";
import { UserUpdateForm } from "./update";
import { Calendar, Phone, Mail, Ticket } from "lucide-react";

const api = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { isAuthenticated, user, logout, checkAuth } = useAuth();
  const router = useRouter();
  const [picture, setPicture] = useState(
    "https://ui-avatars.com/api/?name=User&background=f0f0f0&color=333&rounded=true&size=150"
  );
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const handleEdit = () => {
    setUpdateDialogOpen(true);
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access your profile.",
      });
      router.push("/auth?redirect=/dashboard/profile");
    } else {
      setLoading(false);
    }

    if (user?.picture) setPicture(`${api}${user.picture}`);
  }, [isAuthenticated, user]);

  const handleDeleteAccount = () => {
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await usersApi.delete(user!.id);
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully.",
      });
      logout();
      router.push("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account.",
        variant: "destructive",
      });
    } finally {
      setDeleteModalOpen(false);
    }
  };

  if (loading) return <Loading />;

  const getRoleBadgeColor = (roleName: string) => {
    const role = roleName.split("_").pop();
    switch (role) {
      case "ADMIN":
        return "bg-gray-800 text-white";
      case "MODERATOR":
        return "bg-gray-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getHighestRole = () => {
    // Define role priority (Admin > Moderator > Cinephile)
    const rolePriority = {
      [ERole.ROLE_ADMIN]: 1,
      [ERole.ROLE_MODERATOR]: 2,
      [ERole.ROLE_CINEPHILE]: 3,
    };

    // Sort roles by priority and display the most important one
    if (user?.roles && user.roles.length > 0) {
      const sortedRoles = [...user.roles].sort(
        (a, b) => rolePriority[a.name] - rolePriority[b.name]
      );
      const highestRole = sortedRoles[0].name;
      return {
        name: highestRole.split("_").pop(),
        className: getRoleBadgeColor(highestRole),
      };
    }

    return {
      name: "No Role",
      className: "bg-gray-400 text-white",
    };
  };

  const highestRole = getHighestRole();

  return (
    <div className="bg-white h-screen flex flex-col shadow-sm">
      {/* Header Banner */}
      <div className="h-40 bg-gradient-to-r from-gray-100 to-gray-200"></div>

      <div className="flex-1 px-6 py-8 ">
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="relative -mt-24 mb-4">
              <Image
                src={picture}
                alt="Profile"
                className="w-36 h-36 rounded-full border-4 border-white shadow-md"
                width={144}
                height={144}
              />
            </div>
            <span
              className={`${highestRole.className} text-xs px-4 py-1 rounded-full font-semibold uppercase tracking-wide mt-2`}
            >
              {highestRole.name}
            </span>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-gray-500">{user?.email}</p>
              </div>

              <div className="flex gap-3 mt-4 md:mt-0">
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50 text-gray-700"
                >
                  Edit Profile
                </Button>
                <Button
                  onClick={handleDeleteAccount}
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete Account
                </Button>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center p-5 bg-gray-50 rounded-lg border border-gray-100">
                <Mail className="h-6 w-6 text-gray-400 mr-4" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </p>
                  <p className="font-medium text-gray-800 mt-1">
                    {user?.email || "anass@gmail.com"}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-5 bg-gray-50 rounded-lg border border-gray-100">
                <Phone className="h-6 w-6 text-gray-400 mr-4" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </p>
                  <p className="font-medium text-gray-800 mt-1">
                    +212 682 673919
                  </p>
                </div>
              </div>

              <div className="flex items-center p-5 bg-gray-50 rounded-lg border border-gray-100">
                <Calendar className="h-6 w-6 text-gray-400 mr-4" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member Since
                  </p>
                  <p className="font-medium text-gray-800 mt-1">January 2023</p>
                </div>
              </div>

              <div className="flex items-center p-5 bg-gray-50 rounded-lg border border-gray-100">
                <Ticket className="h-6 w-6 text-gray-400 mr-4" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Bookings
                  </p>
                  <p className="font-medium text-gray-800 mt-1">
                    {user?.reservations.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Delete Account
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Are you sure you want to delete your account? This action cannot
              be undone and all your data will be permanently removed.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UserUpdateForm
        user={user!}
        checkAuth={checkAuth}
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        onUpdateSuccess={() => {
          // Refresh your data here
        }}
      />
    </div>
  );
};

export default Profile;
