import React from 'react';
import { useLoaderData } from 'react-router-dom';

export const StaffDashboardModule = () => {
  const { refunds, payments, tutorApplications } = useLoaderData() as {
    refunds: any[];
    payments: any[];
    tutorApplications: any[];
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Staff Dashboard</h1>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">Refunds</h2>
        <ul>{refunds.map((r, i) => <li key={i}>{JSON.stringify(r)}</li>)}</ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">Payments</h2>
        <ul>{payments.map((p, i) => <li key={i}>{JSON.stringify(p)}</li>)}</ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">Tutor Applications</h2>
        <ul>{tutorApplications.map((t, i) => <li key={i}>{JSON.stringify(t)}</li>)}</ul>
      </section>
    </main>
  );
};