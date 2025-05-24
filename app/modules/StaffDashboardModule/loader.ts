import type { LoaderFunctionArgs } from "react-router"; 

export async function StaffDashboardLoader({ request }: LoaderFunctionArgs) {
  // Langsung tuju ke backend staff di port 8082
  const fullUrl = `http://localhost:8082/api/v1/staff/resources/dashboard`;

  console.log("==> Loader fetching directly from:", fullUrl);

  try {
    const res = await fetch(fullUrl, {
        // credentials: 'include' mungkin masih relevan jika Anda ingin
        // browser MENGIRIM cookie, meskipun backend 8082 tidak memeriksanya.
        // Anda bisa menonaktifkannya sementara jika ingin tes paling dasar.
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    console.log("==> Fetch completed! Status:", res.status);

    // KARENA BACKEND 8082 SEKARANG TIDAK ADA AUTH, SEHARUSNYA TIDAK 401/403
    // JIKA MASIH DAPAT ERROR, ITU MASALAH LAIN (MUNGKIN CORS!)

    if (!res.ok) {
        console.error("==> API call failed:", res.status, await res.text());
        throw new Error(`Failed to load staff dashboard: ${res.status}`);
    }

    console.log("==> Fetch successful! Returning data.");
    const data = await res.json();
    return data;

  } catch (error) {
      console.error("==> Fetch function caught an error:", error);
      throw error;
  }
}