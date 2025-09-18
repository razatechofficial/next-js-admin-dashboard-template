"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const refToken = searchParams.get("ref"); // Extract the "code" parameter
  const [message, setMessage] = useState("Verifying...");
  const router = useRouter();

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  // Server action for verifying the token
  const verifyEmail = useCallback(
    async (token: string) => {
      const ref = token;
      try {
        const response = await fetch(`${BASE_URL}/auth/verify?token=${ref}`);
        const data = await response.json();
        return data;
      } catch (error) {
        return { success: false, message: `Internal server error: ${error}` };
      }
    },
    [BASE_URL]
  ); // Add BASE_URL as a dependency if it can change

  // Handle the verification when the component is mounted and the token is available
  useEffect(() => {
    if (refToken) {
      verifyEmail(refToken)
        .then((data) => {
          if (data.success) {
            setMessage("Email verified successfully!");

            const userId = data.userId;
            if (userId) {
              // Redirect to profile or continue page with userId
              router.push(`/verify/continue?to=${userId}`);
            }
          } else {
            setMessage("Verification failed.");
          }
        })
        .catch(() => setMessage("Error during verification."));
    } else {
      setMessage("Invalid verification link.");
    }
  }, [refToken, verifyEmail, router]);

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-700 dark:text-gray-200">
          Email Verification
        </h2>
        <p className="text-sm text-center mt-4"> {message}</p>
      </div>
      <form className="space-y-6">
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={message !== "Verifying..."} // Disable button while verifying
            className="group relative flex w-full justify-center rounded-sm border border-transparent bg-primary px-4 py-[0.9rem] text-sm font-medium text-white hover:bg-primary-light focus:outline-none focus:ring-0 dark:border-transparent disabled:cursor-wait disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </form>
    </>
  );
}
