import { useLoaderData, Form, useFetcher, useNavigate } from "react-router";
import type { RefundLoader } from "./loader";
import type { RefundAction } from "./action";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { useEffect } from "react";

export const RefundModule = () => {
  const { paymentId, error: loaderError } = useLoaderData<typeof RefundLoader>();
  const fetcher = useFetcher<typeof RefundAction>();
  const navigate = useNavigate();

  useEffect(() => {
    if (fetcher.data?.success) {
      // Redirect back to payments page after successful refund request
      navigate("/payments");
    }
  }, [fetcher.data]);

  if (loaderError) {
    return (
      <div className="p-4">
        <div className="text-red-500">Error: {loaderError}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Request Refund</CardTitle>
          </CardHeader>
          <CardContent>
            {fetcher.data?.error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{fetcher.data.error}</AlertDescription>
              </Alert>
            )}
            
            <fetcher.Form method="post" className="space-y-4">
              <input type="hidden" name="actionType" value="requestRefund" />
              <input type="hidden" name="paymentId" value={paymentId} />
              
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                  Why do you want to request a refund?
                </label>
                <Textarea
                  id="reason"
                  name="reason"
                  placeholder="Please explain your reason for requesting a refund..."
                  required
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={fetcher.state === "submitting"}
                >
                  {fetcher.state === "submitting" ? "Submitting..." : "Submit Refund Request"}
                </Button>
                <p className="text-sm text-gray-500 text-center">
                  Your refund request will be reviewed by our team. We'll notify you once a decision has been made.
                </p>
              </div>
            </fetcher.Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
