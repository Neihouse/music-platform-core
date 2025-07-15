import type { Metadata } from "next";
import AuthErrorClient from "./AuthErrorClient";

export const metadata: Metadata = {
    title: "Authentication Error - Myuzo",
    description: "There was an issue with your authentication link",
};

interface AuthErrorPageProps {
    searchParams: Promise<{
        type?: string;
        error?: string;
    }>;
}

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
    const { type, error } = await searchParams;

    // Determine the error message based on the type or error parameter
    const getErrorDetails = () => {
        if (type === "recovery" || error === "invalid_recovery_token") {
            return {
                title: "Invalid Password Reset Link",
                message: "This password reset link is either invalid, expired, or has already been used.",
                suggestion: "Please request a new password reset link to continue.",
                primaryAction: {
                    label: "Request New Password Reset",
                    href: "/login",
                    iconType: "mail"
                }
            };
        }

        if (type === "email_verification" || error === "invalid_verification_token") {
            return {
                title: "Invalid Email Verification Link",
                message: "This email verification link is either invalid, expired, or has already been used.",
                suggestion: "Please check your email for a new verification link or sign up again.",
                primaryAction: {
                    label: "Go to Sign Up",
                    href: "/signup",
                    iconType: "refresh"
                }
            };
        }

        if (error === "expired_token") {
            return {
                title: "Expired Authentication Link",
                message: "This authentication link has expired for security reasons.",
                suggestion: "Please request a new link to continue.",
                primaryAction: {
                    label: "Try Again",
                    href: "/login",
                    iconType: "refresh"
                }
            };
        }

        // Generic error
        return {
            title: "Authentication Error",
            message: "There was a problem with your authentication link.",
            suggestion: "Please try the process again or contact support if the problem persists.",
            primaryAction: {
                label: "Go to Login",
                href: "/login",
                iconType: "refresh"
            }
        };
    };

    const errorDetails = getErrorDetails();

    return <AuthErrorClient errorDetails={errorDetails} />;
}
