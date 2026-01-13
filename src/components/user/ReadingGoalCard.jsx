"use client";

import React, { useEffect, useState } from "react";

const ReadingGoalCard = ({ userId }) => {
  const [goalData, setGoalData] = useState(null);
  const [progressData, setProgressData] = useState(null);

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const res = await fetch(`/api/reading-goal?userId=${userId}`);
        const data = await res.json();
        setGoalData(data.goal || null);
        setProgressData(data.progress || null);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGoal();
  }, [userId]);

  const percentage = goalData && progressData ? Math.min(Math.round((progressData.booksRead / goalData.goal) * 100), 100) : 0;

  if (!goalData) {
    return (
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Your Reading Goal</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">You haven’t set a reading goal for this year yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Your Reading Goal: {goalData.goal} books</h3>

      {/* Circular progress */}
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32">
          <circle
            className="text-gray-200 dark:text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="48"
            cx="64"
            cy="64"
          />
          <circle
            className="text-yellow-500"
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 48}
            strokeDashoffset={2 * Math.PI * 48 * (1 - percentage / 100)}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="48"
            cx="64"
            cy="64"
            transform="rotate(-90 64 64)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-800 dark:text-white">
          {percentage}%
        </div>
      </div>

      {/* Stats */}
      {progressData && (
        <div className="flex flex-col gap-2 text-sm md:text-base">
          <p>Books read: {progressData.booksRead}</p>
          <p>Total pages: {progressData.pagesRead}</p>
          <p>Avg rating: {progressData.avgRating || 0}</p>
          <p>Favorite genre: {progressData.favoriteGenre || "N/A"}</p>
        </div>
      )}
    </div>
  );
};

export default ReadingGoalCard;
