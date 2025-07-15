"use server";

import { createClient } from "@/utils/supabase/server";

export interface ResetPasswordResult {
    success?: boolean;
    error?: string;
}

export async function resetPassword(
    accessToken: string,
    refreshToken: string,
    password: string
): Promise<ResetPasswordResult> {
    try {
        const supabase = await createClient();

        // Set the session with the tokens from the URL
        const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
        });

        if (sessionError) {
            console.error("Error setting session:", sessionError);
            return {
                error: "Invalid or expired reset link. Please request a new password reset."
            };
        }

        // Update the user's password
        const { error: updateError } = await supabase.auth.updateUser({
            password: password,
        });

        if (updateError) {
            if (updateError.message.includes("New password should be different")) {
                return {
                    error: "New password must be different from your current password."
                };
            } else if (updateError.message.includes("Password should be")) {
                return {
                    error: "Password does not meet security requirements."
                };
            } else {
                return {
                    error: "Failed to update password. Please try again."
                };
            }
        }

        return { success: true };
    } catch (err) {
        console.error("Password reset error:", err);
        return {
            error: "An unexpected error occurred. Please try again."
        };
    }
}

export async function validateResetToken(
    accessToken: string | null,
    refreshToken: string | null,
    type: string | null
): Promise<{ valid: boolean; error?: string }> {
    console.error("Validating reset token", { accessToken, refreshToken, type });
    if (type !== "recovery" || !accessToken || !refreshToken) {
        return {
            valid: false,
            error: "Invalid reset link. Please request a new password reset."
        };
    }

    try {
        const supabase = await createClient();

        const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
        });
        console.error("Session set with access token:", accessToken);

        if (error) {
            console.error("Error validating session:", error);
            return {
                valid: false,
                error: "Invalid or expired reset link. Please request a new password reset."
            };
        }
        console.log("Token validation successful");
        return { valid: true };
    } catch (err) {
        console.error("Token validation error:", err);
        return {
            valid: false,
            error: "Invalid or expired reset link. Please request a new password reset."
        };
    }
}
