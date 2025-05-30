import React, { useState, useEffect } from "react";
import { useFetcher, useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../components/ui/form";
import { Textarea } from "../../components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { Skeleton } from "../../components/ui/skeleton";
import { cn } from "../../lib/utils";

// Interface definitions
interface PaymentData {
  paymentId: string;
  userId: string;
  courseId: string;
  amount: number;
  paymentMethod: string;
  status: "PENDING" | "PAID" | "FAILED" | "REFUND_REQUESTED" | "REFUNDED";
  paymentReference: string;
  createdAt: string;
  updatedAt?: string;
  refundReason?: string;
}

interface LoaderData {
  payments: PaymentData[];
  error?: string;
  endpoint: string;
  userId?: string;
  paymentId?: string;
}

interface ActionData {
  success: boolean;
  payment?: PaymentData;
  error?: string;
}

interface PaymentModuleProps {
  initialData?: LoaderData;
}

// Payment Status Badge Component
const PaymentStatusBadge: React.FC<{ status: PaymentData["status"] }> = ({
  status,
}) => {
  const statusConfig = {
    PENDING: { bg: "bg-yellow-500/10", text: "text-yellow-500", icon: "⏳" },
    PAID: { bg: "bg-green-500/10", text: "text-green-500", icon: "✓" },
    FAILED: { bg: "bg-red-500/10", text: "text-red-500", icon: "✕" },
    REFUND_REQUESTED: {
      bg: "bg-orange-500/10",
      text: "text-orange-500",
      icon: "↺",
    },
    REFUNDED: { bg: "bg-purple-500/10", text: "text-purple-500", icon: "↩" },
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        "px-3 py-1 rounded-full font-medium transition-all",
        config.bg,
        config.text
      )}
    >
      <span className="mr-1">{config.icon}</span>
      {status.replace("_", " ")}
    </Badge>
  );
};

// Payment Card Component
interface PaymentCardProps {
  payment: PaymentData;
  showActions?: boolean;
  onPaymentUpdate?: (paymentId: string) => void;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  showActions = true,
  onPaymentUpdate,
}) => {
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const handleRefundRequest = () => {
    navigate(`/refund/${payment.paymentId}`);
  };

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success && onPaymentUpdate) {
      onPaymentUpdate(payment.paymentId);
    }
  }, [fetcher.state, fetcher.data, payment.paymentId, onPaymentUpdate]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Payment #{payment.paymentId.substring(0, 8)}</span>
          <PaymentStatusBadge status={payment.status} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-medium">${payment.amount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Method</p>
              <p className="font-medium">{payment.paymentMethod}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Course</p>
            <p className="font-medium">{payment.courseId}</p>
          </div>

          {showActions && payment.status === "PAID" && (
            <div className="mt-4">
              <Button
                onClick={handleRefundRequest}
                variant="outline"
                className="w-full"
              >
                Request Refund
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Form Schema
const createPaymentSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  courseId: z.string().min(1, "Course ID is required"),
  amount: z.string().min(1, "Amount is required"),
  method: z.string().min(1, "Payment method is required"),
  bankAccount: z.string().optional(),
  cardNumber: z.string().optional(),
  cardCvc: z.string().optional(),
});

// Create Payment Form Component
interface CreatePaymentFormProps {
  onPaymentCreated?: () => void;
}

const CreatePaymentForm: React.FC<CreatePaymentFormProps> = ({
  onPaymentCreated,
}) => {
  const fetcher = useFetcher();
  const form = useForm<z.infer<typeof createPaymentSchema>>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      userId: "",
      courseId: "",
      amount: "",
      method: "BANK_TRANSFER",
    },
  });

  const onSubmit = (values: z.infer<typeof createPaymentSchema>) => {
    fetcher.submit(
      {
        actionType: "createPayment",
        ...values,
      },
      { method: "POST" }
    );
  };

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      form.reset();
      if (onPaymentCreated) {
        onPaymentCreated();
      }
    }
  }, [fetcher.state, fetcher.data, onPaymentCreated]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="mb-6 border-2 border-opacity-50 hover:border-opacity-100 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Create New Payment
          </CardTitle>
          <CardDescription>
            Fill in the payment details below to create a new transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">User ID</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Course ID</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        {...field}
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">
                      Payment Method
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BANK_TRANSFER">
                          Bank Transfer
                        </SelectItem>
                        <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("method") === "BANK_TRANSFER" && (
                <FormField
                  control={form.control}
                  name="bankAccount"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="font-medium">
                        Bank Account
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="10-20 digits"
                          pattern="^[0-9]{10,20}$"
                          {...field}
                          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch("method") === "CREDIT_CARD" && (
                <>
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          Card Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="13-16 digits"
                            pattern="^[0-9]{13,16}$"
                            {...field}
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cardCvc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">CVC</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="3-4 digits"
                            pattern="^[0-9]{3,4}$"
                            {...field}
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <div className="md:col-span-2">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 transition-all duration-300"
                  disabled={fetcher.state === "submitting"}
                >
                  {fetcher.state === "submitting" ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Payment...
                    </div>
                  ) : (
                    "Create Payment"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Loading Skeleton
const PaymentCardSkeleton = () => (
  <Card className="w-full">
    <CardHeader>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2 mt-2" />
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-32" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Main Payment Module Component
export const PaymentModule: React.FC<PaymentModuleProps> = ({
  initialData,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [payments, setPayments] = useState<PaymentData[]>(
    initialData?.payments || []
  );
  const [error, setError] = useState<string | undefined>(initialData?.error);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const refreshPayments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/payments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPayments(Array.isArray(data.payments) ? data.payments : []);
        setError(undefined);
      }
    } catch (err) {
      console.error("Failed to refresh payments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentUpdate = (paymentId: string) => {
    setSuccessMessage("Payment updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
    refreshPayments();
  };

  const handlePaymentCreated = () => {
    setSuccessMessage("Payment created successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
    setShowCreateForm(false);
    refreshPayments();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Payment Management
          </h1>
          <Button
            variant="default"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 transition-all duration-300"
          >
            {showCreateForm ? (
              <span className="flex items-center">
                <span className="mr-2">✕</span> Hide Form
              </span>
            ) : (
              <span className="flex items-center">
                <span className="mr-2">+</span> Create Payment
              </span>
            )}
          </Button>
        </div>

        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert
                variant="default"
                className="mb-6 bg-green-50 border-green-200 text-green-800"
              >
                <AlertDescription className="flex items-center">
                  <span className="mr-2">✓</span> {successMessage}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert variant="destructive" className="mb-6">
                <AlertDescription className="flex items-center">
                  <span className="mr-2">⚠️</span> {error}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCreateForm && (
            <CreatePaymentForm onPaymentCreated={handlePaymentCreated} />
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {isLoading ? (
              Array(3)
                .fill(null)
                .map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <PaymentCardSkeleton />
                  </motion.div>
                ))
            ) : payments && payments.length > 0 ? (
              payments.map((payment) => (
                <PaymentCard
                  key={payment.paymentId}
                  payment={payment}
                  onPaymentUpdate={handlePaymentUpdate}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full"
              >
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="text-6xl">💳</div>
                      <h3 className="text-2xl font-semibold text-gray-700">
                        No payments found
                      </h3>
                      <p className="text-gray-500">
                        Start by creating a new payment using the button above.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
};

export default PaymentModule;
