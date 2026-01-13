"use client";

import React from "react";
import Image from "next/image";
import { AiOutlineInfoCircle } from "react-icons/ai";
import * as Tooltip from "@radix-ui/react-tooltip";

const RecommendationCard = ({ book }) => {
  return (
    <div className="relative w-44 md:w-48 flex-shrink-0 bg-white dark:bg-zinc-900 rounded-xl shadow-md overflow-hidden group">
      {/* Book Cover */}
      <div className="relative w-full h-60 md:h-64">
        <Image
          src={book.coverImage || "/placeholder.png"}
          alt={book.title}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Book Info */}
      <div className="p-2 md:p-3 flex flex-col gap-1">
        <h3 className="text-sm md:text-base font-semibold text-gray-800 dark:text-white truncate">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {book.genre}
        </p>
        <p className="text-sm text-yellow-500">
          {"★".repeat(Math.round(book.rating || 0))}
          {"☆".repeat(5 - Math.round(book.rating || 0))}
        </p>
      </div>

      {/* Tooltip */}
      <div className="absolute top-2 right-2">
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <AiOutlineInfoCircle size={18} />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="bg-gray-800 text-white text-xs p-2 rounded-md shadow-lg z-50">
                {book.reason || "Recommended for you!"}
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </div>
  );
};

export default RecommendationCard;
