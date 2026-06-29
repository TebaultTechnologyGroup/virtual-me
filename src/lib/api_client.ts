// src/lib/api-client.ts
import { supabase } from "@/lib/supabase-client"; // adjust import

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL;

export async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    // Get Supabase session (includes JWT)
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
        throw new Error("Failed to get auth session");
    }

    const token = session?.access_token;

    const url = `${API_BASE_URL}${path}`;
    console.log("url =", url);

    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? `API error ${res.status}`);
    }

    return res.json();
}
// import { fetchAuthSession } from "@aws-amplify/auth";

// const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL;

// export async function apiFetch<T>(
//     path: string,
//     options: RequestInit = {}
// ): Promise<T> {
//     // Get the Cognito JWT — Amplify handles refresh automatically
//     const session = await fetchAuthSession();
//     const token = session.tokens?.idToken?.toString();

//     const url = `${API_BASE_URL}${path}`;
//     console.log("url = " + url);

//     const res = await fetch(`${API_BASE_URL}${path}`, {
//         ...options,
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//             ...options.headers,
//         },
//     });

//     if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         throw new Error(err.message ?? `API error ${res.status}`);
//     }

//     return res.json();
// }