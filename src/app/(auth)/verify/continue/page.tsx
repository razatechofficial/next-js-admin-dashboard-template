"use client";
import { FloatingSelect } from "@/components/ui/Input/FloatingSelect";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

interface Role {
  role_id: number; // or string, depending on your API response
  name: string;
}

const Role = () => {
  const [roles, setRoles] = useState([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [roleAssigned, setRoleAssigned] = useState(false); // State to toggle form and button

  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("to"); // Extract the "to" parameter
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  // Validation schema
  const userRoleFormSchema = z.object({
    role: z.string().nonempty("Role is required"),
  });

  // Infer the form data type from the schema
  type UserRoleFormData = z.infer<typeof userRoleFormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRoleFormData>({
    resolver: zodResolver(userRoleFormSchema),
  });

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${BASE_URL}/roles/user`);
        if (!response.ok) {
          throw new Error("Failed to fetch roles");
        }
        const data = await response.json();
        const options = data.map((role: Role) => ({
          value: role.role_id.toString(),
          label: role.name,
        }));
        setRoles(options);
      } catch (error: unknown) {
        toast.error(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      } finally {
        setIsLoadingRoles(false);
      }
    };

    fetchRoles();
  }, [BASE_URL]); // Include BASE_URL in the dependency array

  const onSubmit = async (data: UserRoleFormData) => {
    try {
      const payload = {
        userId: userId, // Send the userId from query parameters
        roleId: data.role, // Send the selected role ID
      };
      const response = await fetch(`${BASE_URL}/user-roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Convert payload to JSON
      });

      if (!response.ok) {
        throw new Error("Failed to submit role");
      }

      // const result = await response.json();
      toast.success("Role assigned successfully");
      setRoleAssigned(true); // Hide the form and show the button
    } catch (error) {
      toast.error("Error assigning role");
      console.error("Error submitting role:", error);
    }
  };

  if (!userId) {
    return (
      <div className="text-red-500 text-center font-bold">
        Unauthorized: User not authenticated
      </div>
    );
  }

  if (roleAssigned) {
    // Show login button after role assignment
    return (
      <div className="text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200">
          Role Assigned Successfully
        </h2>
        <button
          onClick={() => router.push("/login")} // Navigate to the login page
          className="group relative flex w-full justify-center rounded-sm border border-transparent bg-primary px-4 py-[0.9rem] text-sm font-medium text-white hover:bg-primary-light focus:outline-none focus:ring-0 dark:border-transparent"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-700 dark:text-gray-200">
          Continue as
        </h2>
        <p className="mt-0 text-sm text-gray-600 dark:text-gray-400">
          Select your role to proceed
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Floating Select */}
        <FloatingSelect
          label={"Role"}
          id="role"
          options={roles}
          {...register("role")}
          error={errors.role?.message}
        />
        <div>
          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-sm border border-transparent bg-primary px-4 py-[0.9rem] text-sm font-medium text-white hover:bg-primary-light focus:outline-none focus:ring-0 dark:border-transparent disabled:cursor-wait disabled:opacity-50"
            disabled={isLoadingRoles}
          >
            {isLoadingRoles ? "Loading..." : "Continue"}
          </button>
        </div>
      </form>
    </>
  );
};

export default Role;
