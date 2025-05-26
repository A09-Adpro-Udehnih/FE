import { useLoaderData } from "react-router-dom";
import type { RefundLoader } from "./loader";

export default function RefundPage() {
  const { refunds, error } = useLoaderData<typeof RefundLoader>();

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Refund Management</h1>
      
      {/* Basic Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Payment ID</th>
              <th className="px-4 py-2">Reason</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {refunds.map((refund) => (
              <tr key={refund.id}>
                <td className="px-4 py-2">{refund.id}</td>
                <td className="px-4 py-2">{refund.paymentId}</td>
                <td className="px-4 py-2">{refund.reason}</td>
                <td className="px-4 py-2">{refund.status}</td>
                <td className="px-4 py-2">{refund.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
