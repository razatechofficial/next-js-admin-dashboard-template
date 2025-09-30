"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Modal from "@/components/ui/Modal/Modal";
import AddUser from "./_Forms/AddUser";
import Image from "next/image";

// TypeScript types
import type {
  BaseTableData,
  ColumnDefinition,
} from "@/components/ui/Table/DataTable";
import { getInitialsFromName } from "@/utils/NameLetterSeperator";
import { useRBAC } from "@/hooks/rbacNewO1";
import ContentLoading from "@/components/ui/Loading/ContentLoading";
import ContentUnAuthorized from "@/components/ui/UnAuthorized/ContentUnAuthorized";
const DataTable = dynamic(
  () => import("@/components/ui/Table/DataTable").then((mod) => mod.DataTable),
  {
    ssr: false,
  }
);

// Column fields as per API response
interface Users extends BaseTableData {
  user_id: number;
  name: string;
  profile_image: string;
  email: string;
  roles: string;
  is_active: string;
  is_verified: string;
  formatted_created_at: string;
}

const Users = () => {
  const { isLoading, hasServiceAccess, hasSectionAccess, hasComponentAccess } =
    useRBAC();

  // Define service, section, and component names for RBAC checks
  const service = "users";
  const section = "users_crud";
  const component = "users_crud_operations";

  // RBAC permission checks
  const hasAccessUsersService = hasServiceAccess(service);
  const hasUsersCrudSectionAccess = hasSectionAccess(service, section);
  const usersCrudOperationsPermissions = hasComponentAccess(
    service,
    section,
    component
  );

  // Modal states
  const [isViewRecordModalOpen, setIsViewRecordModalOpen] = useState(false);
  const [isCreateRecordModalOpen, setIsCreateRecordModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Users | null>(null);

  // Define table columns
  const columns: ColumnDefinition<Users>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      renderCell(row) {
        return (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full border-2 border-primary bg-slate-200 dark:bg-gray-600 flex items-center justify-center">
              {row?.profile_image ? (
                <Image
                  alt={`${row.name}'s profile`}
                  height={48}
                  width={48}
                  src={row.profile_image}
                  unoptimized
                  loader={({ src }) => src}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  className="overflow-hidden object-cover rounded-full"
                />
              ) : (
                <span className="font-medium text-lg">
                  {/* {row?.name ? row.name.charAt(0).toUpperCase() : "?"} */}
                  {getInitialsFromName(row?.name)}
                </span>
              )}
            </div>
            <span className="text-sm text-nowrap font-medium text-gray-900 dark:text-gray-200">
              {row?.name || "Name not available"}
            </span>
          </div>
        );
      },
    },
    { key: "email", label: "Email", sortable: true },
    { key: "roles", label: "Role", sortable: true },
    { key: "formatted_created_at", label: "Registered on", sortable: true },
    { key: "is_verified", label: "Verification Status", sortable: true },
    { key: "is_active", label: "Status", sortable: true },
  ];

  // Fetch data function
  const fetchData = async ({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  }: {
    page: number;
    limit: number;
    search: string;
    sortBy: string;
    sortOrder: "ASC" | "DESC";
  }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      sortBy,
      sortOrder,
    });

    try {
      const response = await fetch(
        `/api/iam/identity/users?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch Records");
      }
      const data = await response.json();
      return {
        data: data.data || [],
        totalPages: data.totalPages || 1,
        range: data.range || "",
      };
    } catch (error) {
      console.error("Error fetching Records:", error);
      return { data: [], totalPages: 1, range: "" };
    }
  };

  // Handlers
  const handleAddNewRecord = () => setIsCreateRecordModalOpen(true);
  const handleRowClick = (user: Users) => {
    setSelectedRecord(user);
    setIsViewRecordModalOpen(true);
  };

  return (
    <div>
      {isLoading ? (
        <ContentLoading />
      ) : !hasAccessUsersService ? (
        <ContentUnAuthorized />
      ) : (
        <>
          {hasUsersCrudSectionAccess &&
            usersCrudOperationsPermissions.can_read && (
              <>
                <div>
                  <DataTable
                    columns={columns as ColumnDefinition<BaseTableData>[]}
                    fetchData={fetchData}
                    onRowClick={
                      usersCrudOperationsPermissions.can_read
                        ? (row: BaseTableData) => handleRowClick(row as Users)
                        : undefined
                    }
                    tableTitle="Users"
                    addNewButton={
                      usersCrudOperationsPermissions.can_write
                        ? {
                            label: "Add New User",
                            onClick: handleAddNewRecord,
                          }
                        : undefined
                    }
                    enableDelete={usersCrudOperationsPermissions.can_delete}
                    enableExport={usersCrudOperationsPermissions.can_export}
                    enableSearch={true}
                    enablePagination={true}
                    pageSizeOptions={[5, 10, 25, 50, 100]}
                  />
                </div>

                {/* Create new Users Modal */}
                <Modal
                  isOpen={isCreateRecordModalOpen}
                  onClose={() => setIsCreateRecordModalOpen(false)}
                  title="Add new User"
                  size="md"
                >
                  <AddUser
                    onSuccess={() => setIsCreateRecordModalOpen(false)}
                  />
                </Modal>

                {/* View Users Modal */}
                <Modal
                  isOpen={isViewRecordModalOpen}
                  onClose={() => setIsViewRecordModalOpen(false)}
                  title="User Details"
                  size="md"
                >
                  {selectedRecord ? (
                    <div>
                      <p>
                        <strong>ID:</strong> {selectedRecord.user_id}
                      </p>
                      <p>
                        <strong>Name:</strong> {selectedRecord.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedRecord.email}
                      </p>
                      <p>
                        <strong>Status :</strong> {selectedRecord.is_active}
                      </p>
                      <button
                        onClick={() => console.log("Edit User Logic Here")}
                        className="btn btn-primary"
                      >
                        Edit User Details
                      </button>
                    </div>
                  ) : (
                    <p>No User selected.</p>
                  )}
                </Modal>
              </>
            )}
        </>
      )}
    </div>
  );
};

export default Users;
