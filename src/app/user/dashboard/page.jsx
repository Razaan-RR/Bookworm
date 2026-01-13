// app/user/dashboard/page.jsx
import React from "react";
import { getCurrentUser } from "@/lib/getCurrentUser";
import ReadingGoalSection from "@/components/user/ReadingGoalSection";
import RecommendationsSection from "@/components/user/RecommendationsSection";
import { connectDB } from "@/lib/db";

const DashboardPage = async () => {
  await connectDB();
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <p className="text-center mt-10">User not found</p>;
  }

  return (
    <div className="p-4 md:p-6 space-y-8">
      <section>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Your Reading Goal
        </h2>
        {currentUser._id ? (
          <ReadingGoalSection userId={currentUser._id} />
        ) : (
          <p>Loading...</p>
        )}
      </section>

      <section>
        <RecommendationsSection userId={currentUser._id} />
      </section>
    </div>
  );
};

export default DashboardPage;
