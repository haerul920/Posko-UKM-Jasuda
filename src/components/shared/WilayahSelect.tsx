"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MapPin, ChevronDown } from "lucide-react";

export interface WilayahOption {
  id: string;
  name: string;
}

export interface WilayahValue {
  provinceId: string;
  provinceName: string;
  cityId: string;
  cityName: string;
  districtId: string;
  districtName: string;
}

interface WilayahSelectProps {
  /** Nilai terpilih saat ini */
  value: WilayahValue;
  /** Callback ketika pilihan berubah */
  onChange: (val: WilayahValue) => void;
  /** Apakah field wajib diisi */
  required?: boolean;
  /** Apakah dinonaktifkan */
  disabled?: boolean;
}

// ── Reusable Select Atom ────────────────────────────────────────────────────
function SelectField({
  label,
  required,
  loading,
  loadingText,
  error,
  value,
  onChange,
  disabled,
  placeholder,
  options,
}: {
  label: string;
  required?: boolean;
  loading: boolean;
  loadingText: string;
  error: string | null;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
  placeholder: string;
  options: WilayahOption[];
}) {
  const selectClass =
    "w-full bg-surface-container/50 border border-outline-variant/50 rounded-xl px-4 py-2.5 pr-10 text-sm text-on-surface focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400";

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-on-surface flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {loading ? (
          <div className="w-full bg-slate-100 border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-slate-400 flex items-center gap-2 animate-pulse">
            <div className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
            {loadingText}
          </div>
        ) : error ? (
          <div className="w-full bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-xs text-red-700 font-semibold">
            {error}
          </div>
        ) : (
          <select
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={selectClass}
          >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
        )}
        {!loading && !error && (
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        )}
      </div>
    </div>
  );
}

// ── Helper: generic fetcher ─────────────────────────────────────────────────
function useFetchWilayah(url: string | null) {
  const [data, setData] = useState<WilayahOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(
    (targetUrl: string) => {
      let cancelled = false;
      setLoading(true);
      setError(null);
      setData([]);

      fetch(targetUrl)
        .then((r) => r.json())
        .then((res) => {
          if (cancelled) return;
          if (res.success && Array.isArray(res.data)) {
            setData(res.data);
          } else {
            setError("Gagal memuat data");
          }
        })
        .catch(() => {
          if (!cancelled) setError("Gagal memuat data");
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });

      return () => { cancelled = true; };
    },
    []
  );

  return { data, loading, error, fetch: fetch_ };
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function WilayahSelect({
  value,
  onChange,
  required = false,
  disabled = false,
}: WilayahSelectProps) {
  const provinces = useFetchWilayah(null);
  const cities = useFetchWilayah(null);
  const districts = useFetchWilayah(null);

  // ── Fetch provinces on mount ──────────────────────────────────────────────
  useEffect(() => {
    provinces.fetch("/api/wilayah/provinsi");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fetch cities when provinceId changes ─────────────────────────────────
  useEffect(() => {
    if (value.provinceId) {
      cities.fetch(`/api/wilayah/kota/${value.provinceId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.provinceId]);

  // ── Fetch districts when cityId changes ──────────────────────────────────
  useEffect(() => {
    if (value.cityId) {
      districts.fetch(`/api/wilayah/kecamatan/${value.cityId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.cityId]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = provinces.data.find((p) => p.id === e.target.value);
    if (!selected) return;
    // Reset kota & kecamatan saat provinsi berganti
    onChange({
      provinceId: selected.id,
      provinceName: selected.name,
      cityId: "",
      cityName: "",
      districtId: "",
      districtName: "",
    });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = cities.data.find((c) => c.id === e.target.value);
    if (!selected) return;
    // Reset kecamatan saat kota berganti
    onChange({
      ...value,
      cityId: selected.id,
      cityName: selected.name,
      districtId: "",
      districtName: "",
    });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = districts.data.find((d) => d.id === e.target.value);
    if (!selected) return;
    onChange({
      ...value,
      districtId: selected.id,
      districtName: selected.name,
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Provinsi */}
      <SelectField
        label="Provinsi"
        required={required}
        loading={provinces.loading}
        loadingText="Memuat provinsi..."
        error={provinces.error}
        value={value.provinceId}
        onChange={handleProvinceChange}
        disabled={disabled}
        placeholder="-- Pilih Provinsi --"
        options={provinces.data}
      />

      {/* Kota / Kabupaten */}
      <SelectField
        label="Kota / Kabupaten"
        required={required}
        loading={cities.loading}
        loadingText="Memuat kota..."
        error={cities.error}
        value={value.cityId}
        onChange={handleCityChange}
        disabled={disabled || !value.provinceId}
        placeholder={
          !value.provinceId
            ? "-- Pilih provinsi dulu --"
            : cities.data.length === 0 && !cities.loading
            ? "-- Tidak ada kota --"
            : "-- Pilih Kota/Kabupaten --"
        }
        options={cities.data}
      />

      {/* Kecamatan */}
      <SelectField
        label="Kecamatan"
        required={required}
        loading={districts.loading}
        loadingText="Memuat kecamatan..."
        error={districts.error}
        value={value.districtId}
        onChange={handleDistrictChange}
        disabled={disabled || !value.cityId}
        placeholder={
          !value.cityId
            ? "-- Pilih kota dulu --"
            : districts.data.length === 0 && !districts.loading
            ? "-- Tidak ada kecamatan --"
            : "-- Pilih Kecamatan --"
        }
        options={districts.data}
      />
    </div>
  );
}
