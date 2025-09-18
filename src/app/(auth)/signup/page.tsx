"use client";
import { FloatingInput } from "@/components/ui/Input/FloatingInput";
import { CustomLink } from "@/components/ui/Link/Link";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import SocialLoading from "../_components/SocialLoading";
import dynamic from "next/dynamic";

const SocialLogin = dynamic(() => import("../_components/SocialLogin"), {
  ssr: false,
  loading: () => <SocialLoading />,
});

// Define Zod schema for validation
const signupSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
      "Password must contain letters and numbers"
    ),
});

// Define the form data type based on Zod schema
type SignupFormData = z.infer<typeof signupSchema>;

const Signup = () => {
  // const BASE_URL = process.env.API_URL || "http://localhost:3401";
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });
  const router = useRouter();
  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    try {
      // Simulating API call
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }

      const responseData = await response.json();
      toast.success(responseData.message);
      router.push("/login");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-700 dark:text-gray-200">
          Let&apos;s Get Started
        </h2>
        <p className="mt-0 text-sm text-gray-600 dark:text-gray-400">
          Sign up to continue
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <FloatingInput
          id="name"
          label="Name"
          type="text"
          {...register("name")}
          error={errors.name?.message}
        />

        {/* Email Field */}
        <FloatingInput
          id="email"
          label="Email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />

        {/* Password Field */}
        <FloatingInput
          id="password"
          label="Password"
          type="password"
          {...register("password")}
          error={errors.password?.message}
        />

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-sm border border-transparent bg-primary px-4 py-[0.9rem] text-sm font-medium text-white hover:bg-primary-light focus:outline-none focus:ring-0 dark:border-transparent disabled:cursor-wait disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </form>

      {/* Already have an account */}
      <div className="m-auto mt-5 w-fit md:mt-5">
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <CustomLink
            href="/login"
            color="primary"
            className="font-medium text-primary hover:text-primary-light"
          >
            Sign In
          </CustomLink>
        </p>
      </div>
      <SocialLogin />
    </>
  );
};

export default Signup;
