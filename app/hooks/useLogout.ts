import { useCallback } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";

export function useLogout() {
  const fetcher = useFetcher();

  const logout = useCallback(() => {
    fetcher.submit(null, { method: "post", action: "/api/logout" });

    toast.success("Logged out");
  }, [fetcher]);

  return logout;
}
