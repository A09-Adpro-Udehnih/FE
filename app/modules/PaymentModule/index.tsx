import React, { useState, useEffect } from 'react';
import { useFetcher } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../components/ui/form";
import { Textarea } from "../../components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Interface definitions
interface PaymentData {
  paymentId: string;
  userId: string;
  courseId: string;
  amount: number;
  paymentMethod: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUND_REQUESTED' | 'REFUNDED';
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
const PaymentStatusBadge: React.FC<{ status: PaymentData['status'] }> = ({ status }) => {
  const statusVariants = {
    PENDING: 'bg-yellow-500',
    PAID: 'bg-green-500',
    FAILED: 'bg-red-500',
    REFUND_REQUESTED: 'bg-orange-500',
    REFUNDED: 'bg-purple-500',
  };

  return (
    <Badge variant="secondary" className={statusVariants[status]}>
      {status.replace('_', ' ')}
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
  onPaymentUpdate 
}) => {
  const fetcher = useFetcher();
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [refundReason, setRefundReason] = useState('');

  const handleStatusUpdate = (newStatus: string) => {
    fetcher.submit(
      {
        actionType: 'updatePaymentStatus',
        paymentId: payment.paymentId,
        status: newStatus,
      },
      { method: 'POST' }
    );
  };

  const handleRefundRequest = () => {
    if (!refundReason.trim()) {
      alert('Please provide a reason for refund');
      return;
    }

    fetcher.submit(
      {
        actionType: 'requestRefund',
        paymentId: payment.paymentId,
        reason: refundReason,
      },
      { method: 'POST' }
    );

    setShowRefundForm(false);
    setRefundReason('');
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.success && onPaymentUpdate) {
      onPaymentUpdate(payment.paymentId);
    }
  }, [fetcher.state, fetcher.data, payment.paymentId, onPaymentUpdate]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-blue-700">{payment.paymentReference}</CardTitle>
            <CardDescription>Payment ID: {payment.paymentId}</CardDescription>
          </div>
          <PaymentStatusBadge status={payment.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Amount</p>
            <p className="text-lg font-semibold text-green-600">
              Rp {payment.amount.toLocaleString('id-ID')}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Method</p>
            <p className="text-sm">{payment.paymentMethod.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">User ID</p>
            <p className="text-sm truncate">{payment.userId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Course ID</p>
            <p className="text-sm truncate">{payment.courseId}</p>
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>Created: {new Date(payment.createdAt).toLocaleString('id-ID')}</span>
          {payment.updatedAt && (
            <span>Updated: {new Date(payment.updatedAt).toLocaleString('id-ID')}</span>
          )}
        </div>

        {payment.refundReason && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              <strong>Refund Reason:</strong> {payment.refundReason}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="flex flex-wrap gap-2">
          {payment.status === 'PENDING' && (
            <>
              <Button
                variant="default"
                onClick={() => handleStatusUpdate('PAID')}
                disabled={fetcher.state === 'submitting'}
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleStatusUpdate('FAILED')}
                disabled={fetcher.state === 'submitting'}
              >
                Reject
              </Button>
            </>
          )}

          {payment.status === 'PAID' && !showRefundForm && (
            <Button
              variant="outline"
              onClick={() => setShowRefundForm(true)}
            >
              Request Refund
            </Button>
          )}

          {payment.status === 'REFUND_REQUESTED' && (
            <>
              <Button
                variant="default"
                onClick={() => handleStatusUpdate('REFUNDED')}
                disabled={fetcher.state === 'submitting'}
              >
                Process Refund
              </Button>
              <Button
                variant="outline"
                onClick={() => handleStatusUpdate('PAID')}
                disabled={fetcher.state === 'submitting'}
              >
                Deny Refund
              </Button>
            </>
          )}

          {showRefundForm && (
            <div className="w-full mt-4">
              <Textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Please provide a reason for the refund..."
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button
                  variant="default"
                  onClick={handleRefundRequest}
                  disabled={fetcher.state === 'submitting'}
                >
                  Submit Refund Request
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRefundForm(false);
                    setRefundReason('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardFooter>
      )}

      {fetcher.state === 'submitting' && (
        <CardFooter>
          <p className="text-sm text-gray-600">Processing...</p>
        </CardFooter>
      )}
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

const CreatePaymentForm: React.FC<CreatePaymentFormProps> = ({ onPaymentCreated }) => {
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
        actionType: 'createPayment',
        ...values,
      },
      { method: 'POST' }
    );
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.success) {
      form.reset();
      if (onPaymentCreated) {
        onPaymentCreated();
      }
    }
  }, [fetcher.state, fetcher.data, onPaymentCreated]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Create New Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Course ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" {...field} />
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
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
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
                    <FormLabel>Bank Account</FormLabel>
                    <FormControl>
                      <Input placeholder="10-20 digits" pattern="^[0-9]{10,20}$" {...field} />
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
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input placeholder="13-16 digits" pattern="^[0-9]{13,16}$" {...field} />
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
                      <FormLabel>CVC</FormLabel>
                      <FormControl>
                        <Input placeholder="3-4 digits" pattern="^[0-9]{3,4}$" {...field} />
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
                className="w-full"
                disabled={fetcher.state === 'submitting'}
              >
                {fetcher.state === 'submitting' ? 'Creating Payment...' : 'Create Payment'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

// Main Payment Module Component
export const PaymentModule: React.FC<PaymentModuleProps> = ({ initialData }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [payments, setPayments] = useState<PaymentData[]>(initialData?.payments || []);
  const [error, setError] = useState<string | undefined>(initialData?.error);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const refreshPayments = async () => {
    try {
      const response = await fetch('/api/payments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPayments(Array.isArray(data.payments) ? data.payments : []);
        setError(undefined);
      }
    } catch (err) {
      console.error('Failed to refresh payments:', err);
    }
  };

  const handlePaymentUpdate = (paymentId: string) => {
    setSuccessMessage('Payment updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    refreshPayments();
  };

  const handlePaymentCreated = () => {
    setSuccessMessage('Payment created successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    setShowCreateForm(false);
    refreshPayments();
  };

  return (
    <main className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Payment Management</h1>
          <Button
            variant="default"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Hide Form' : 'Create Payment'}
          </Button>
        </div>

        {successMessage && (
          <Alert variant="default" className="mb-6">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {showCreateForm && <CreatePaymentForm onPaymentCreated={handlePaymentCreated} />}

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {payments && payments.length > 0 ? (
            payments.map((payment) => (
              <PaymentCard 
                key={payment.paymentId} 
                payment={payment} 
                onPaymentUpdate={handlePaymentUpdate}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No payments found.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default PaymentModule;