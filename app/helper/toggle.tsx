import React from "react";
import { motion } from "framer-motion";

/**
 * SlidingToggle
 * A11y-friendly, animated toggle that slides a knob left/right.
 * Tailwind + Framer Motion. Drop-in compatible with shadcn's <Toggle> API
 * via `pressed` and `onPressedChange` props.
 */
export default function SlidingToggle({
  pressed,
  onPressedChange,
  onLabel = "On",
  offLabel = "Off",
  className = "",
}: {
  pressed: boolean;
  onPressedChange: (value: boolean) => void;
  onLabel?: string;
  offLabel?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={pressed}
      onClick={() => onPressedChange(!pressed)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPressedChange(!pressed);
        }
      }}
      className={[
        "relative inline-flex h-9 w-35 items-center rounded-full p-1 transition-[box-shadow]",
        "shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black/20",
        pressed
          ? "bg-gradient-to-br from-blue-600 to-blue-700"
          : "bg-neutral-200",
        className,
      ].join(" ")}
    >
      {/* Track border shimmer */}
      <motion.span
        aria-hidden="true"
        className="absolute rounded-full ring-2"
        animate={{
          boxShadow: pressed
            ? "0 4px 14px rgba(0,0,0,0.18)"
            : "0 2px 6px rgba(0,0,0,0.08)",
        }}
      />

      {/* Labels (fade/slide) */}
      <span className="sr-only">{pressed ? onLabel : offLabel}</span>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-3 text-xs font-medium text-white/80"
        initial={false}
        animate={{ opacity: pressed ? 1 : 0, x: pressed ? 0 : -4 }}
        transition={{ type: "tween", duration: 0.18 }}
      >
        {onLabel}
      </motion.span>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute right-3 text-xs font-medium text-neutral-600"
        initial={false}
        animate={{ opacity: pressed ? 0 : 1, x: pressed ? 4 : 0 }}
        transition={{ type: "tween", duration: 0.18 }}
      >
        {offLabel}
      </motion.span>

      {/* Knob */}
      <motion.div
        layout
        className={[
          "relative z-10 h-7 w-7 rounded-full bg-white",
          "ring-1 ring-black/10",
        ].join(" ")}
        initial={false}
        animate={{ x: pressed ? 105 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        whileTap={{ scale: 0.96 }}
      >
        {/* subtle inner highlight */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/90 to-white/70" />
      </motion.div>
    </button>
  );
}

/**
 * Example usage in your Filters UI
 */
export function FiltersHeaderExample() {
  const [advancedFilterToggled, setAdvancedFilterToggled] =
    React.useState(false);
  return (
    <div className="flex items-center gap-3">
      <SlidingToggle
        pressed={advancedFilterToggled}
        onPressedChange={setAdvancedFilterToggled}
        onLabel="Hide"
        offLabel="Show"
      />
      <span className="text-sm select-none">
        {advancedFilterToggled ? "Hide Filters" : "Show Filters"}
      </span>
    </div>
  );
}
