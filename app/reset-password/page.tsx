import {
    Box,
    Container,
    Paper,
    Title
} from "@mantine/core";
import ResetPasswordForm from "./ResetPasswordForm";

interface ResetPasswordPageProps {
    searchParams: Promise<{
        access_token?: string;
        refresh_token?: string;
        type?: string;
    }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
    const { access_token, refresh_token, type } = await searchParams;

    return (
        <Container
            size="sm"
            px={{ base: "md", sm: "xl" }}
            py={{ base: "xl", sm: "3xl" }}
            style={{
                minHeight: 'calc(100vh - 60px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Box
                w="100%"
                maw={{ base: "100%", xs: 480, sm: 400 }}
                mx="auto"
            >
                <Paper radius="md" p={{ base: "md", sm: "xl" }} withBorder>
                    <Title order={2} size="h3" mb="md">
                        Reset Your Password
                    </Title>

                    <ResetPasswordForm
                        accessToken={access_token!}
                        refreshToken={refresh_token!}
                    />
                </Paper>
            </Box>
        </Container>
    );
}
