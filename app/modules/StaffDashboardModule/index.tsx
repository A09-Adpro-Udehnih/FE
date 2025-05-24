import React from 'react';
import { useLoaderData } from 'react-router-dom'; // Pastikan ini yang benar, bukan 'react-router' jika sebelumnya error

// Asumsi tipe data (SESUAIKAN DENGAN DATA ASLI ANDA)
interface RefundItem {
  id: string;
  amount: number;
  status: string;
}

interface PaymentItem {
  id: string;
  paymentReference: string;
  status: string;
  createdAt: string;
}

interface TutorApplicationItem {
  id: string;
  studentId: string;
  status: string;
  createdAt: string;
}

interface DashboardData {
  refunds: RefundItem[];
  payments: PaymentItem[];
  tutorApplications: TutorApplicationItem[];
}

// Komponen untuk Kartu Data (dimodifikasi untuk menyertakan tombol)
interface DataItemCardProps {
  item: RefundItem | PaymentItem | TutorApplicationItem;
  type: 'refund' | 'payment' | 'tutorApplication';
}

const DataItemCard: React.FC<DataItemCardProps> = ({ item, type }) => {
  let cardTitle = '';
  const cardDetails: string[] = [];

  if (type === 'payment') {
    const payment = item as PaymentItem;
    cardTitle = `Payment Ref: ${payment.paymentReference}`;
    cardDetails.push(`Status: ${payment.status}`);
    cardDetails.push(`Tanggal: ${new Date(payment.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}`);
  } else if (type === 'refund') {
    const refund = item as RefundItem;
    cardTitle = `Refund Amount: Rp ${refund.amount.toLocaleString('id-ID')}`;
    cardDetails.push(`Status: ${refund.status}`);
  } else if (type === 'tutorApplication') {
    const application = item as TutorApplicationItem;
    cardTitle = `Pendaftar (ID): ${application.studentId}`;
    cardDetails.push(`Status: ${application.status}`);
    cardDetails.push(`Tanggal Daftar: ${new Date(application.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}`);
  }

  return (
    <div
      className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between min-h-[150px]" // Menambahkan min-h untuk konsistensi & flex
    >
      <div> {/* Wrapper untuk konten atas */}
        <h3 className="font-semibold text-md text-blue-700 truncate mb-2">{cardTitle}</h3>
        {cardDetails.map((detail, index) => (
          <p key={index} className="text-sm text-gray-600 truncate">{detail}</p>
        ))}
      </div>

      {/* Bagian Tombol Aksi */}
      <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end space-x-2">
        <button
          type="button" // Tambahkan type="button" untuk mencegah submit form jika ada
          className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition-colors"
          // onClick handler akan ditambahkan nanti
        >
          Reject
        </button>
        <button
          type="button"
          className="px-3 py-1.5 text-xs font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-colors"
          // onClick handler akan ditambahkan nanti
        >
          Accept
        </button>
      </div>
    </div>
  );
};


export const StaffDashboardModule = () => {
  const dashboardData = useLoaderData() as DashboardData;

  const sections = [
    { title: 'Permintaan Pengembalian Dana (Refunds)', data: dashboardData?.refunds || [], type: 'refund' as const },
    { title: 'Pendaftaran Pengajar (Tutor Applications)', data: dashboardData?.tutorApplications || [], type: 'tutorApplication' as const },
    { title: 'Riwayat Pembayaran (Payments)', data: dashboardData?.payments || [], type: 'payment' as const },
  ];

  return (
    <main className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Staff Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <section key={section.title} className="bg-white shadow-xl rounded-xl p-5 hover:shadow-2xl transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">{section.title}</h2>
            {section.data && section.data.length > 0 ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {section.data.map((item) => (
                  <DataItemCard
                    key={item.id}
                    item={item}
                    type={section.type}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Tidak ada data {section.title.toLowerCase().replace(/\s*\(.*\)\s*/g, '')}.</p>
            )}
          </section>
        ))}
      </div>
    </main>
  );
};

// export default StaffDashboardModule; // Jika Anda ingin