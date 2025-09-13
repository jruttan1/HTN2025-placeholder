import React from "react";
import { motion } from "framer-motion";

/**
 * SegmentedToggle (Hotels / Apartments)
 * A two-option segmented control with a sliding pill that animates back and forth.
 */
export default function SlidingToggle({
  value,
  onChange,
  leftLabel = "Basic",
  rightLabel = "Advanced",
  className = "",
}: {
  value: true | false;
  onChange: (v: true | false) => void;
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
}) {
  const isRight = value === true;

  return (
    <div className={["inline-flex", className].join(" ")}>
      <div
        className={[
          "relative h-8 w-[200px] rounded-full p-0.5",
          "bg-blue-600 flex items-center justify-between",
        ].join(" ")}
        role="tablist"
        aria-label={`${leftLabel} or ${rightLabel}`}
      >
        {/* Sliding pill */}
        <motion.div
          layout
          className="absolute top-0.5 left-0.5 h-7 w-[98px] rounded-full bg-white shadow"
          initial={false}
          animate={{ x: isRight ? 100 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />

        {/* Left Option */}
        <button
          role="tab"
          aria-selected={!isRight}
          className="relative z-10 flex h-7 w-[98px] items-center justify-center rounded-full focus:outline-none"
          onClick={() => onChange(false)}
        >
          <span
            className={[
              "text-sm font-semibold transition-colors",
              !isRight ? "text-blue-600" : "text-white",
            ].join(" ")}
          >
            {leftLabel}
          </span>
        </button>

        {/* Right Option */}
        <button
          role="tab"
          aria-selected={isRight}
          className="relative z-10 flex h-7 w-[98px] items-center justify-center rounded-full focus:outline-none"
          onClick={() => onChange(true)}
        >
          <span
            className={[
              "text-sm font-semibold transition-colors",
              isRight ? "text-blue-600" : "text-white",
            ].join(" ")}
          >
            {rightLabel}
          </span>
        </button>
      </div>
    </div>
  );
}
