"use client";

import { useEffect, useState } from "react";
import { AppDispatch } from "@/hooks/reduxHooks";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, deleteUser } from "@/redux/actions/usersActions";
import { RootState } from "@/redux/store";
import { Trash2, RefreshCw } from "lucide-react";
import { ChangeRoleModal } from "@/components/modals/ChangeRoleModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { useToast } from "@/components/ToastProvider";
import { notFound } from "next/navigation";
import { loginSuccess } from "@/redux/slices/authSlice";
import Image from "next/image";

const UsersPage = () => {
  const dispatch = AppDispatch();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    role: string;
  } | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const { showToast } = useToast();

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDelete = (userId: string) => {
    setDeletingUserId(userId);
    setDeleteModalOpen(true);
  };

  const handleChangeRole = (userId: string, currentRole: string) => {
    setSelectedUser({ id: userId, role: currentRole });
    setModalOpen(true);
  };

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.roles?.includes("admin")) {
        dispatch(
          loginSuccess({
            token,
            user: parsedUser,
          })
        );
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } else {
      setIsAuthorized(false);
    }

    setCheckingAuth(false);
  }, [dispatch]);

  if (checkingAuth) {
    return (
      <div className=" flex justify-center items-center mt-[100px]">
        <Image
          src="/images/ripples.svg"
          alt="loading"
          width={160}
          height={160}
        />
      </div>
    );
  }

  if (!isAuthorized) {
    return notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2 text-black">Users Management</h1>
      <p className="text-gray-600 mb-6">
        Manage your platform users from here.
      </p>

      {loading && (
        <div className=" flex justify-center items-center mt-[100px]">
          <Image
            src="/images/ripples.svg"
            alt="loading"
            width={160}
            height={160}
          />
        </div>
      )}
      {error && <p className="text-red-500 font-medium">Error: {error}</p>}
      {!loading && users.length === 0 && (
        <div className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded mb-4 border border-yellow-200">
          No users found in the system.
        </div>
      )}

      {!loading && users.length > 0 && (
        <div className="overflow-x-auto rounded-lg  border border-[#FDB940] bg-white ">
          <table className="min-w-full text-sm  ">
            <thead className="bg-[#FDB940] text-gray-700 font-semibold ">
              <tr>
                <th className="px-4 py-3 text-left">Full Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Address</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {currentUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className={`hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3">
                    {user.fullname || `${user.firstname} ${user.lastname}`}
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.phone}</td>
                  <td className="px-4 py-3 capitalize">
                    {user.roles?.join(", ")}
                  </td>
                  <td className="px-4 py-3">{user.address}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() =>
                          handleChangeRole(user._id, user.roles?.[0] || "user")
                        }
                        title="Change Role"
                        className="p-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        title="Delete User"
                        className="p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <div className="flex justify-between items-center px-4 py-3 border-t border-[#FDB940]  bg-white text-sm">
            <div className="text-gray-600">
              Showing {indexOfFirstUser + 1}–
              {Math.min(indexOfLastUser, users.length)} of {users.length} users
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(currentPage - 1)}
                className="px-3 py-1 border border-gray-200 text-gray-400 rounded hover:bg-gray-100 disabled:opacity-40"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToPage(idx + 1)}
                  className={`px-3 py-1 border  text-gray-400 rounded hover:text-white hover:bg-[#FDB940] ${
                    currentPage === idx + 1
                      ? "bg-[#FDB940] text-white border-[#FDB940] font-semibold "
                      : "border-gray-200"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                className="px-3 py-1 border rounded hover:bg-gray-100 text-gray-400 border-gray-200 disabled:opacity-40"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedUser && (
        <ChangeRoleModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          userId={selectedUser.id}
          currentRole={selectedUser.role}
        />
      )}

      {deletingUserId && (
        <DeleteConfirmModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          onConfirm={async () => {
            await dispatch(deleteUser(deletingUserId));
            showToast("User Deleted", "The user was successfully removed.");
            setDeletingUserId(null);
          }}
        />
      )}
    </div>
  );
};

export default UsersPage;
