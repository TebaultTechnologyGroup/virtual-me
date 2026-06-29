import { createBrowserRouter } from "react-router";
import { RedirectAuthenticated } from "@/guards/RedirectAuthenticated";
import { ProtectedRoutes } from "@/guards/ProtectedRoutes";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import VerifyPage from "@/pages/auth/VerifyPage";
import MainLayout from "@/pages/layout/MainLayout";
import DashboardPage from "@/pages/app/dashboard/DashboardPage";
import SetupPage from "@/pages/app/setup/SetupPage";
import SetupGeneral from "@/pages/app/setup/components/SetupGeneral";
import JobHistoryCreatePage from "@/pages/app/history/JobHistoryCreatePage";
import JobHistoryEditPage from "@/pages/app/history/JobHistoryEditPage";
import JobHistoryListPage from "@/pages/app/history/JobHistoryListPage";
import CredentialsPage from "@/pages/app/setup/components/CredentialsPage";
import SkillsPage from "@/pages/app/setup/components/SkillsPage";
import UserTargetRolePage from "@/pages/app/role/UserTargetRolePage";
import ApplicationsPage from "@/pages/app/applications/ApplicationsPage";

export const router = createBrowserRouter([
    {
        Component: RedirectAuthenticated,
        children: [
            { path: "/", Component: LandingPage },
            { path: "/login", Component: LoginPage },
            { path: "/register", Component: RegisterPage },
            { path: "/verify", Component: VerifyPage }
        ],
    },
    {
        Component: ProtectedRoutes, // Logic for auth check
        children: [
            {
                Component: MainLayout, // Your new Top Nav layout
                children: [
                    { path: "/app", Component: DashboardPage },
                    { path: "/app/setup", Component: SetupPage },
                    { path: "/app/setup/general", Component: SetupGeneral },
                    { path: "/app/setup/skills", Component: SkillsPage },
                    { path: "/app/job-history", Component: JobHistoryListPage },
                    { path: "/app/job-history/:id", Component: JobHistoryEditPage },
                    { path: "/app/job-history/new", Component: JobHistoryCreatePage },
                    { path: "/app/setup/credentials", Component: CredentialsPage },
                    { path: "/app/role", Component: UserTargetRolePage },
                    { path: "/app/application", Component: ApplicationsPage },

                ]
            }
        ]
    }
]);
