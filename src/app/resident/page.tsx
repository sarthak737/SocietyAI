import ComplaintForm from "@/components/ComplaintForm";
import QAWidget from "@/components/QAWidget";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import Link from "next/link";
import MyComplaints from "@/components/MyComplaints";
import ResidentChat from "@/components/ResidentChat";

import { getComplaintsByUserId } from "@/lib/db";

export default async function ResidentPortal() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?role=resident");
  }

  // Fetch data on server
  const userId = (session.user as any).id;
  const complaints = await getComplaintsByUserId(Number(userId));
  const serializedComplaints = JSON.parse(JSON.stringify(complaints));

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24 animate-fade-in relative min-h-[calc(100vh-80px)]">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Report an Issue
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Describe your problem or use the voice recorder to speak in your
          preferred language. Your Flat Number and details are automatically
          attached securely.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <ComplaintForm />
      </div>

      <div className="max-w-2xl mx-auto">
        <Link
          href="/resident/rules"
          className="inline-block mb-4 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition"
        >
          View Society Rules
        </Link>
      </div>

      <MyComplaints initialComplaints={serializedComplaints} />

      <ResidentChat />
      <QAWidget />
    </div>
  );
}
