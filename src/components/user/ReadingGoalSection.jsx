// components/user/ReadingGoalSection.jsx
"use client";

import { useEffect, useState } from "react";

export default function ReadingGoalSection({ userId }) {
  const [goal, setGoal] = useState(0);
  const [booksRead, setBooksRead] = useState(0);
  const [inputGoal, setInputGoal] = useState("");

  const fetchGoal = async () => {
    if (!userId) return;

    try {
      const res = await fetch(`/api/reading-goal?userId=${userId}`);
      const data = await res.json();

      setGoal(data.readingGoal?.goal || 0);
      setBooksRead(data.booksRead || 0);
    } catch (err) {
      console.error("Failed to fetch reading goal:", err);
    }
  };

  useEffect(() => {
    fetchGoal();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !inputGoal) return;

    try {
      const res = await fetch("/api/reading-goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, goal: parseInt(inputGoal) }),
      });

      if (!res.ok) throw new Error("Failed to set goal");

      setInputGoal("");
      fetchGoal(); // refresh after setting goal
    } catch (err) {
      console.error(err);
      alert("Failed to set goal");
    }
  };

  return (
    <div className="space-y-2">
      <p>Goal: {goal} books | Read: {booksRead} books</p>

      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <input
          type="number"
          placeholder="Set your reading goal"
          value={inputGoal}
          onChange={(e) => setInputGoal(e.target.value)}
          className="border px-2 py-1 rounded"
          min={1}
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
          Save
        </button>
      </form>
    </div>
  );
}
