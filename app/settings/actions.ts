"use server";

import { validateEmail, validatePassword } from "@/components/auth/validation";
import { getUser } from "@/db/queries/users";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function updateEmail(formData: FormData) {
    const supabase = await createClient();
    const newEmail = formData.get("email") as string;

    // Validate email
    const emailError = validateEmail(newEmail);
    if (emailError) {
        return { error: emailError };
    }

    try {
        const { error } = await supabase.auth.updateUser({
            email: newEmail,
        });

        if (error) {
            return { error: error.message };
        }

        return { success: "Email update initiated. Please check your email to confirm the change." };
    } catch (error) {
        return { error: "Failed to update email" };
    }
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient();
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validate passwords
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
        return { error: passwordError };
    }

    if (newPassword !== confirmPassword) {
        return { error: "New passwords do not match" };
    }

    try {
        // Verify current password by attempting to sign in
        const user = await getUser(supabase);
        if (!user?.email) {
            return { error: "User not found" };
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: currentPassword,
        });

        if (signInError) {
            return { error: "Current password is incorrect" };
        }

        // Update password
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            return { error: error.message };
        }

        return { success: "Password updated successfully" };
    } catch (error) {
        return { error: "Failed to update password" };
    }
}

export async function deleteAccount() {
    const supabase = await createClient();

    try {
        const user = await getUser(supabase);
        if (!user) {
            return { error: "User not found" };
        }

        // Delete user account
        const { error } = await supabase.auth.admin.deleteUser(user.id);

        if (error) {
            return { error: error.message };
        }

        // Sign out and redirect
        await supabase.auth.signOut();
        redirect("/");
    } catch (error) {
        return { error: "Failed to delete account" };
    }
}
