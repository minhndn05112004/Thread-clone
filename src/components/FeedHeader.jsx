import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";

export default function FeedHeader({ title, showBack }) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-20 bg-white dark:bg-[rgb(16,16,16)]">
      {/* Back button */}
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="absolute left-6 top-1/2 -translate-y-1/2 p-2 rounded-full
            hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150"
          aria-label="Quay lại"
        >
          <ChevronLeft size={22} className="text-black dark:text-white" />
        </button>
      )}

      {/* Title */}
      <h1 className="text-lg font-semibold text-center p-[16px]">
        {title}
      </h1>

      {/* Border bottom */}
      <div
        className={`absolute left-[25px] bottom-0 h-[10px] w-[calc(100%-50px)]
          border-b border-neutral-300 dark:border-neutral-700
          transition-opacity duration-200
        `}
      />

      {/* Left corner */}
      <div className="absolute top-[34px] -left-[25px] w-[50px] h-[50px] overflow-hidden">
        <div className="relative top-[25px] left-[25px] w-[50px] h-[50px] rounded-full border border-neutral-300 dark:border-neutral-700 outline outline-[50px] outline-white dark:outline-[rgb(16,16,16)]" />
      </div>

      {/* Right corner */}
      <div className="absolute top-[34px] -right-[25px] w-[50px] h-[50px] overflow-hidden">
        <div className="relative top-[25px] right-[25px] w-[50px] h-[50px] rounded-full border border-neutral-300 dark:border-neutral-700 outline outline-[50px] outline-white dark:outline-[rgb(16,16,16)]" />
      </div>
    </div>
  );
}