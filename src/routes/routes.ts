import { createBrowserRouter } from "react-router";
import { RedirectAuthenticated } from "@/guards/RedirectAuthenticated";
import { ProtectedRoutes } from "@/guards/ProtectedRoutes";
import LandingPage from "@/lib/pages/LandingPage";

export const router = createBrowserRouter([
    {
        Component: RedirectAuthenticated,
        children: [
            { path: "/", Component: LandingPage },
            //     { path: "/login", Component: LoginPage },
            //     { path: "/register", Component: RegisterPage },
            //     { path: "/verify-email", Component: VerifyEmailPage },
        ],
    },
    // {
    //     Component: ProtectedRoutes, // Logic for auth check
    //     children: [
    //         {
    //             Component: MainLayout, // Your new Top Nav layout
    //             children: [
    //                 { path: "/app", Component: DashboardPage },
    //                 { path: "/app/setup", Component: ProfilePage },
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
