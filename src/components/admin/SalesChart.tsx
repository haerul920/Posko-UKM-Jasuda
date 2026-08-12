"use client";

import React, { useState, useMemo, useCallback } from "react";
import { type DailySalesData } from "@/lib/actions/dashboard";

interface SalesChartProps {
  month: string;
  chartType?: "line" | "bar";
  customData?: DailySalesData[];
}

export const SalesChart = React.memo(function SalesChart({
  month,
  chartType = "line",
  customData,
}: SalesChartProps) {
  const daysInMonth = useMemo(() => {
    if (month.startsWith("Februari")) return 28;
    if (
      month.startsWith("April") ||
      month.startsWith("Juni") ||
      month.startsWith("September") ||
      month.startsWith("November")
    )
      return 30;
    return 31;
  }, [month]);

  const data = useMemo(() => {
    if (customData && customData.length > 0) {
      return customData.slice(0, daysInMonth);
    }
    return Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      value: 0,
    }));
  }, [daysInMonth, customData]);

  const maxVal = useMemo(() => {
    return Math.max(100000, Math.max(...data.map((d) => d.value)) * 1.1);
  }, [data]);

  const minVal = 0;
  const viewBoxWidth = 800;
  const viewBoxHeight = 250;

  const getX = useCallback(
    (index: number) => (index / Math.max(1, daysInMonth - 1)) * viewBoxWidth,
    [daysInMonth]
  );

  const getY = useCallback(
    (val: number) => viewBoxHeight - ((val - minVal) / (maxVal - minVal)) * viewBoxHeight,
    [maxVal]
  );

  const pathD = useMemo(() => {
    if (data.length === 0) return "";
    let d = `M ${getX(0)} ${getY(data[0]?.value || 0)}`;
    for (let i = 1; i < data.length; i++) {
      const prevX = getX(i - 1);
      const prevY = getY(data[i - 1].value);
      const currX = getX(i);
      const currY = getY(data[i].value);
      const cpX1 = prevX + (currX - prevX) * 0.5;
      const cpX2 = currX - (currX - prevX) * 0.5;
      d += ` C ${cpX1} ${prevY}, ${cpX2} ${currY}, ${currX} ${currY}`;
    }
    return d;
  }, [data, getX, getY]);

  const areaPathD = useMemo(() => {
    return `${pathD} L ${viewBoxWidth} ${viewBoxHeight} L 0 ${viewBoxHeight} Z`;
  }, [pathD]);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const formatCurrency = useCallback((val: number) => `Rp ${val.toLocaleString("id-ID")}`, []);
  const barWidth = (viewBoxWidth / daysInMonth) * 0.6;

  return (
    <div className="w-full h-64 relative mt-4">
      <svg
        className="w-full h-full overflow-visible"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#005e97" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#005e97" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#005e97" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#005e97" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line
            key={i}
            x1="0"
            y1={viewBoxHeight * ratio}
            x2={viewBoxWidth}
            y2={viewBoxHeight * ratio}
            stroke="#f1f5f9"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {chartType === "line" ? (
          <>
            <path d={areaPathD} fill="url(#chartGradient)" />
            <path
              d={pathD}
              fill="none"
              stroke="#005e97"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : (
          data.map((d, i) => {
            const h = viewBoxHeight - getY(d.value);
            return (
              <rect
                key={i}
                x={getX(i) - barWidth / 2}
                y={getY(d.value)}
                width={barWidth}
                height={h}
                fill="url(#barGradient)"
                rx="4"
              />
            );
          })
        )}

        {data.map((d, i) => (
          <g key={i}>
            {hoveredIndex === i && (
              <>
                {chartType === "line" ? (
                  <>
                    <line
                      x1={getX(i)}
                      y1="0"
                      x2={getX(i)}
                      y2={viewBoxHeight}
                      stroke="#005e97"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      opacity="0.5"
                    />
                    <circle
                      cx={getX(i)}
                      cy={getY(d.value)}
                      r="5"
                      fill="#ffffff"
                      stroke="#005e97"
                      strokeWidth="3"
                      className="shadow-sm"
                    />
                  </>
                ) : (
                  <rect
                    x={getX(i) - barWidth / 2}
                    y={getY(d.value)}
                    width={barWidth}
                    height={viewBoxHeight - getY(d.value)}
                    fill="#005e97"
                    rx="4"
                  />
                )}
              </>
            )}
            <rect
              x={Math.max(0, getX(i) - viewBoxWidth / daysInMonth / 2)}
              y="0"
              width={viewBoxWidth / daysInMonth}
              height={viewBoxHeight}
              fill="transparent"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-crosshair outline-none"
            />
          </g>
        ))}
      </svg>

      <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[11px] font-bold text-slate-400">
        <span>1 {month.split(" ")[0]}</span>
        <span>
          {Math.floor(daysInMonth / 2)} {month.split(" ")[0]}
        </span>
        <span>
          {daysInMonth} {month.split(" ")[0]}
        </span>
      </div>

      {hoveredIndex !== null && data[hoveredIndex] && (
        <div
          className="absolute z-20 bg-slate-900 text-white px-3 py-2 rounded-xl shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-75 ease-out"
          style={{
            left: `${(hoveredIndex / Math.max(1, daysInMonth - 1)) * 100}%`,
            top: `${((viewBoxHeight - ((data[hoveredIndex].value - minVal) / (maxVal - minVal)) * viewBoxHeight) / viewBoxHeight) * 100}%`,
            marginTop: "-12px",
          }}
        >
          <div className="text-slate-400 font-bold text-[10px] mb-0.5 uppercase tracking-wider">
            {data[hoveredIndex].day} {month}
          </div>
          <div className="text-sm font-bold text-white whitespace-nowrap">
            {formatCurrency(data[hoveredIndex].value)}
          </div>
          <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45"></div>
        </div>
      )}
    </div>
  );
});
