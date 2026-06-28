import { createBrowserRouter } from "react-router";
import { RedirectAuthenticated } from "@/guards/RedirectAuthenticated";
import { ProtectedRoutes } from "@/guards/ProtectedRoutes";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import TestPage from "@/pages/TestPage";
import VerifyPage from "@/pages/auth/VerifyPage";
import MainLayout from "@/pages/layout/MainLayout";
import DashboardPage from "@/pages/app/dashboard/DashboardPage";

export const router = createBrowserRouter([
    {
        Component: RedirectAuthenticated,
        children: [
            { path: "/", Component: LandingPage },
            { path: "/login", Component: LoginPage },
            { path: "/register", Component: RegisterPage },
            { path: "/verify", Component: VerifyPage },
            { path: "/test", Component: TestPage },
        ],
    },
    {
        Component: ProtectedRoutes, // Logic for auth check
        children: [
            {
                Component: MainLayout, // Your new Top Nav layout
                children: [
                    { path: "/app", Component: DashboardPage },
                ]
            }
        ]
    }
    //                { path: "/app/setup", Component: ProfilePage },
    //                 { path: "/app/setup/personal", Component: PersonalPage },
    //                 { path: "/app/job-history", Component: JobHistoryListPage },
    //                 { path: "/app/job-history/:id", Component: JobHistoryEditPage },
    //                 { path: "/app/job-history/new", Component: JobHistoryCreatePage },
    //                 { path: "/app/setup/credentials", Component: CredentialsPage },
    //                 { path: "/app/setup/skills", Component: SkillsPage },
    //                 { path: "/app/role", Component: UserTargetRolePage },
    //                 { path: "/app/application", Component: ApplicationsPage },
    //             ],
    //         },
    //     ],
    // },
]);

/*
{ path: "/app/setup/personal", Component: PersonalPage },
          { path: "/app/setup/target-roles", Component: TargetRolesPage },
          { path: "/app/setup/job-history", Component: JobHistoryPage },
          { path: "/app/setup/credentials", Component: CredentialsPage },
          { path: "/app/setup/skills", Component: SkillsPage },
          { path: "/app/training", Component: TrainingStudio },
          { path: "/app/jobs", Component: JobStudio },
*/
