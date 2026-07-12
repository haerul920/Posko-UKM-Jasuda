"use client";

import React, { useState, useMemo } from "react";
import {
  MoreVertical,
  TrendingUp,
  DollarSign,
  Briefcase,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Store
} from "lucide-react";

const monthsList = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

function CustomMonthSelect({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const initialYear = parseInt(value.split(' ')[1]) || 2026;
  const [viewYear, setViewYear] = useState(initialYear);

  const handleOpen = () => {
    setViewYear(parseInt(value.split(' ')[1]) || 2026);
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left w-44">
      <button
        type="button"
        onClick={handleOpen}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light shadow-sm transition-all duration-300 cursor-pointer hover:bg-slate-50"
      >
        <span>{value}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-64 origin-top-right bg-white border border-slate-100 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <button 
              type="button"
              onClick={() => setViewYear(v => v - 1)}
              className="p-1 hover:bg-slate-100 rounded-md transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <span className="font-bold text-slate-700">{viewYear}</span>
            <button 
              type="button"
              onClick={() => setViewYear(v => v + 1)}
              className="p-1 hover:bg-slate-100 rounded-md transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
          
          <div className="p-3 grid grid-cols-3 gap-2">
            {monthsList.map((m) => {
              const optionValue = `${m} ${viewYear}`;
              const isSelected = value === optionValue;
              return (
                <button
                  key={m}
                  onClick={() => {
                    onChange(optionValue);
                    setIsOpen(false);
                  }}
                  className={`px-2 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center ${
                    isSelected 
                      ? 'bg-ocean-light text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {m.substring(0, 3)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SalesChart({
  month,
  chartType = "line",
}: {
  month: string;
  chartType?: "line" | "bar";
}) {
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
    return Array.from({ length: daysInMonth }, (_, i) => {
      const seed =
        (i +
          (month === "Januari 2026" ? 5 : month === "Februari 2026" ? 10 : 0)) *
        0.5;
      const val =
        12000000 +
        Math.sin(seed) * 4000000 +
        Math.cos(seed * 0.5) * 2000000 +
        Math.random() * 1000000;
      return {
        day: i + 1,
        value: Math.max(5000000, Math.floor(val)),
      };
    });
  }, [daysInMonth, month]);

  const maxVal = Math.max(...data.map((d) => d.value)) * 1.1;
  const minVal = 0;
  const viewBoxWidth = 800;
  const viewBoxHeight = 250;

  const getX = (index: number) => (index / (daysInMonth - 1)) * viewBoxWidth;
  const getY = (val: number) =>
    viewBoxHeight - ((val - minVal) / (maxVal - minVal)) * viewBoxHeight;

  let pathD = `M ${getX(0)} ${getY(data[0].value)}`;
  for (let i = 1; i < data.length; i++) {
    const prevX = getX(i - 1);
    const prevY = getY(data[i - 1].value);
    const currX = getX(i);
    const currY = getY(data[i].value);
    const cpX1 = prevX + (currX - prevX) * 0.5;
    const cpX2 = currX - (currX - prevX) * 0.5;
    pathD += ` C ${cpX1} ${prevY}, ${cpX2} ${currY}, ${currX} ${currY}`;
  }

  const areaPathD = `${pathD} L ${viewBoxWidth} ${viewBoxHeight} L 0 ${viewBoxHeight} Z`;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const formatCurrency = (val: number) => `Rp ${(val / 1000000).toFixed(1)} Jt`;

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

      {hoveredIndex !== null && (
        <div
          className="absolute z-20 bg-slate-900 text-white px-3 py-2 rounded-xl shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-75 ease-out"
          style={{
            left: `${(hoveredIndex / (daysInMonth - 1)) * 100}%`,
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
}

export default function AdminSalesPage() {
  const [jasudaMonth, setJasudaMonth] = useState("Januari 2026");
  const [mitraMonth, setMitraMonth] = useState("Januari 2026");
  const [jasudaChartType, setJasudaChartType] = useState<'line' | 'bar'>('line');
  const [jasudaMenuOpen, setJasudaMenuOpen] = useState(false);
  const [mitraChartType, setMitraChartType] = useState<'line' | 'bar'>('line');
  const [mitraMenuOpen, setMitraMenuOpen] = useState(false);

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h2>
        <p className="text-sm font-medium text-slate-500">
          Ringkasan metrik dan produk teratas untuk Jasuda dan Mitra.
        </p>
      </div>

      {/* =========================================================
          BAGIAN JASUDA
         ========================================================= */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-ocean-light rounded-full"></div>
            <h3 className="text-2xl font-bold text-slate-900">
              Performa Jasuda
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500">
              Pilih Bulan:
            </span>
            <CustomMonthSelect value={jasudaMonth} onChange={setJasudaMonth} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Jasuda Gross Revenue */}
          <div className="bg-white rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-md border border-slate-100/50 group transition-all duration-300 ease-in-out">
            <p className="text-sm font-medium text-slate-500 mb-2">
              Pendapatan Kotor
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Rp 425.890.000
            </h3>
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-100 w-fit px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-bold">+8.2% vs bulan lalu</span>
            </div>
          </div>

          {/* Jasuda Net Revenue */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-ocean-gradient rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="bg-slate-900 rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-md border border-slate-800 transition-all duration-300 ease-in-out h-full">
              <p className="text-sm font-medium text-slate-400 mb-2">
                Pendapatan Bersih
              </p>
              <h3 className="text-3xl font-bold text-white mb-4">
                Rp 385.500.000
              </h3>
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-900/40 border border-emerald-800 w-fit px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-bold">+9.1% vs bulan lalu</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Revenue Chart Jasuda */}
          <div className="bg-white shadow-sm hover:shadow-md border border-slate-100/50 rounded-2xl p-6 transition-all duration-300 ease-in-out">
            <div className="flex justify-between items-center mb-6 relative">
              <h3 className="text-lg font-bold text-slate-900">
                Tren Pendapatan
              </h3>
              <div>
                <button 
                  onClick={() => setJasudaMenuOpen(!jasudaMenuOpen)}
                  onBlur={() => setTimeout(() => setJasudaMenuOpen(false), 200)}
                  className="text-slate-400 hover:text-slate-900 transition-colors active:scale-[0.98]"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {jasudaMenuOpen && (
                  <div className="absolute right-0 top-8 bg-white border border-slate-100 shadow-lg rounded-xl py-2 w-40 z-30 animate-in fade-in zoom-in-95 duration-200">
                    <button 
                      onClick={() => setJasudaChartType('line')}
                      className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors ${jasudaChartType === 'line' ? 'text-ocean-light bg-slate-50' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      Grafik Garis
                    </button>
                    <button 
                      onClick={() => setJasudaChartType('bar')}
                      className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors ${jasudaChartType === 'bar' ? 'text-ocean-light bg-slate-50' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      Grafik Batang
                    </button>
                  </div>
                )}
              </div>
            </div>

            <SalesChart month={jasudaMonth} chartType={jasudaChartType} />
          </div>

          {/* Top 10 Products Jasuda */}
          <div className="bg-white shadow-sm hover:shadow-md border border-slate-100/50 rounded-2xl overflow-hidden transition-all duration-300 ease-in-out">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                10 Produk Teratas Jasuda
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      No
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Nama Produk
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                      Stok
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                      Terjual
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                      Pendapatan Kotor
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                      Pendapatan Bersih
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    {
                      name: "Premium Kombu Strips",
                      stock: 1250,
                      sold: 345,
                      gross: "Rp 24.500.000",
                      net: "Rp 22.050.000",
                    },
                    {
                      name: "Liquid Kelp Extract",
                      stock: 840,
                      sold: 210,
                      gross: "Rp 18.200.000",
                      net: "Rp 16.380.000",
                    },
                    {
                      name: "Dried Sugar Kelp",
                      stock: 2100,
                      sold: 520,
                      gross: "Rp 12.400.000",
                      net: "Rp 11.160.000",
                    },
                    {
                      name: "Organic Dulse Flakes",
                      stock: 450,
                      sold: 110,
                      gross: "Rp 9.800.000",
                      net: "Rp 8.820.000",
                    },
                    {
                      name: "Kelp Seasoning Blend",
                      stock: 3200,
                      sold: 840,
                      gross: "Rp 5.100.000",
                      net: "Rp 4.590.000",
                    },
                    {
                      name: "Seaweed Snacks BBQ",
                      stock: 5400,
                      sold: 1200,
                      gross: "Rp 4.200.000",
                      net: "Rp 3.780.000",
                    },
                    {
                      name: "Agar-Agar Powder",
                      stock: 1100,
                      sold: 430,
                      gross: "Rp 3.800.000",
                      net: "Rp 3.420.000",
                    },
                    {
                      name: "Spicy Nori Sheets",
                      stock: 950,
                      sold: 310,
                      gross: "Rp 3.100.000",
                      net: "Rp 2.790.000",
                    },
                    {
                      name: "Roasted Wakame",
                      stock: 780,
                      sold: 280,
                      gross: "Rp 2.600.000",
                      net: "Rp 2.340.000",
                    },
                    {
                      name: "Kombu Dashi Stock",
                      stock: 620,
                      sold: 150,
                      gross: "Rp 1.900.000",
                      net: "Rp 1.710.000",
                    },
                  ].map((item, i) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-50/80 transition-colors duration-300 group"
                    >
                      <td className="py-4 px-6 text-sm font-bold text-slate-900">
                        {i + 1}
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-slate-900 group-hover:text-ocean-light transition-colors">
                        {item.name}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-slate-500 text-center">
                        {item.stock}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-slate-500 text-center">
                        {item.sold}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-slate-500 text-right">
                        {item.gross}
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-ocean-light text-right">
                        {item.net}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          BAGIAN MITRA
         ========================================================= */}
      <div className="mb-8 pt-8 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-ocean-light rounded-full"></div>
            <h3 className="text-2xl font-bold text-slate-900">
              Performa Mitra
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500">
              Pilih Bulan:
            </span>
            <CustomMonthSelect value={mitraMonth} onChange={setMitraMonth} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Mitra Gross Revenue */}
          <div className="bg-white rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-md border border-slate-100/50 group transition-all duration-300 ease-in-out">
            <p className="text-sm font-medium text-slate-500 mb-2">
              Pendapatan Kotor Mitra
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              Rp 842.150.000
              <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100/50">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                +8.2%
              </span>
            </h3>
            <p className="text-xs font-semibold text-slate-400 bg-slate-100 w-fit px-3 py-1 rounded-full">
              *Sebelum dipotong komisi Jasuda
            </p>
          </div>

          {/* Mitra Net Revenue */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-ocean-gradient rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="bg-slate-900 rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-md border border-slate-800 transition-all duration-300 ease-in-out h-full">
              <p className="text-sm font-medium text-slate-400 mb-2">
                Pendapatan Bersih Mitra
              </p>
              <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                Rp 757.935.000
                <span className="flex items-center text-sm font-medium text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" />
                  +9.1%
                </span>
              </h3>
              <p className="text-xs font-semibold text-ocean-light bg-ocean-light/10 border border-ocean-light/20 w-fit px-3 py-1 rounded-full">
                *Setelah dipotong komisi Jasuda
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Revenue Chart Mitra */}
          <div className="bg-white shadow-sm hover:shadow-md border border-slate-100/50 rounded-2xl p-6 transition-all duration-300 ease-in-out">
            <div className="flex justify-between items-center mb-6 relative">
              <h3 className="text-lg font-bold text-slate-900">
                Tren Pendapatan Mitra
              </h3>
              <div>
                <button 
                  onClick={() => setMitraMenuOpen(!mitraMenuOpen)}
                  onBlur={() => setTimeout(() => setMitraMenuOpen(false), 200)}
                  className="text-slate-400 hover:text-slate-900 transition-colors active:scale-[0.98]"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {mitraMenuOpen && (
                  <div className="absolute right-0 top-8 bg-white border border-slate-100 shadow-lg rounded-xl py-2 w-40 z-30 animate-in fade-in zoom-in-95 duration-200">
                    <button 
                      onClick={() => setMitraChartType('line')}
                      className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors ${mitraChartType === 'line' ? 'text-ocean-light bg-slate-50' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      Grafik Garis
                    </button>
                    <button 
                      onClick={() => setMitraChartType('bar')}
                      className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors ${mitraChartType === 'bar' ? 'text-ocean-light bg-slate-50' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      Grafik Batang
                    </button>
                  </div>
                )}
              </div>
            </div>

            <SalesChart month={mitraMonth} chartType={mitraChartType} />
          </div>

          {/* Top 10 Products Mitra */}
        <div className="bg-white shadow-sm hover:shadow-md border border-slate-100/50 rounded-2xl overflow-hidden transition-all duration-300 ease-in-out">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">
              10 Produk Teratas Mitra
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Nama Produk
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                    Stok
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                    Terjual
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Pendapatan Kotor
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Pendapatan Bersih
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  {
                    name: "Rumput Laut Kering Grade A",
                    mitra: "Koperasi Nelayan Sejahtera",
                    stock: 4500,
                    sold: 1240,
                    gross: "Rp 18.600.000",
                    net: "Rp 16.740.000"
                  },
                  {
                    name: "Kerupuk Nori Renyah",
                    mitra: "UMKM Mandiri",
                    stock: 3200,
                    sold: 985,
                    gross: "Rp 14.775.000",
                    net: "Rp 13.297.500"
                  },
                  {
                    name: "Ekstrak Karagenan Murni",
                    mitra: "Alga Tech",
                    stock: 1100,
                    sold: 752,
                    gross: "Rp 22.560.000",
                    net: "Rp 20.304.000"
                  },
                  {
                    name: "Sirup Rumput Laut",
                    mitra: "Toko Segar Bugar",
                    stock: 890,
                    sold: 630,
                    gross: "Rp 9.450.000",
                    net: "Rp 8.505.000"
                  },
                  {
                    name: "Bubuk Agar-agar Premium",
                    mitra: "Koperasi Nelayan Sejahtera",
                    stock: 2100,
                    sold: 512,
                    gross: "Rp 10.240.000",
                    net: "Rp 9.216.000"
                  },
                  {
                    name: "Mie Rumput Laut",
                    mitra: "Bunda Kreatif",
                    stock: 1500,
                    sold: 490,
                    gross: "Rp 7.350.000",
                    net: "Rp 6.615.000"
                  },
                  {
                    name: "Masker Wajah Kolagen Alga",
                    mitra: "Alga Beauty",
                    stock: 300,
                    sold: 410,
                    gross: "Rp 16.400.000",
                    net: "Rp 14.760.000"
                  },
                  {
                    name: "Salad Wakame Segar",
                    mitra: "Dapur Sehat",
                    stock: 120,
                    sold: 380,
                    gross: "Rp 9.500.000",
                    net: "Rp 8.550.000"
                  },
                  {
                    name: "Pupuk Organik Rumput Laut",
                    mitra: "Tani Makmur",
                    stock: 5000,
                    sold: 350,
                    gross: "Rp 17.500.000",
                    net: "Rp 15.750.000"
                  },
                  {
                    name: "Permen Jelly Agar",
                    mitra: "Manis Legit",
                    stock: 4200,
                    sold: 310,
                    gross: "Rp 4.650.000",
                    net: "Rp 4.185.000"
                  },
                ].map((item, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50/80 transition-colors duration-300 group"
                  >
                    <td className="py-4 px-6 text-sm font-bold text-slate-900">
                      {i + 1}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-ocean-light transition-colors">
                          {item.name}
                        </span>
                        <span className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-ocean-light/70" />
                          <span className="bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 border border-slate-200/50 shadow-sm">
                            {item.mitra}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-500 text-center">
                      {item.stock}
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-500 text-center">
                      {item.sold}
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-500 text-right">
                      {item.gross}
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-ocean-light text-right">
                      {item.net}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}
