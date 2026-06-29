// PageCanvas.tsx
import { useRef, useEffect, useState } from "react";

export function PageCanvas({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const PAGE_W = 816; // 8.5" × 96dpi
  const PAGE_H = 1056; // 11"  × 96dpi
  const MARGIN = 48; // .5" × 96dpi

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const availableWidth = entry.contentRect.width;
      setScale(Math.min(1, availableWidth / PAGE_W));
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    // Outer container tracks available width
    <div ref={containerRef} style={{ width: "100%", overflow: "hidden" }}>
      {/* Spacer keeps the layout height correct as scale changes */}
      <div
        style={{
          height: PAGE_H * scale,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* The actual page — always 816×1056, scaled down to fit */}
        <div
          style={{
            width: PAGE_W,
            height: PAGE_H,
            padding: MARGIN,
            background: "#fff",
            boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
            transformOrigin: "top center",
            transform: `scale(${scale})`,
            flexShrink: 0,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
