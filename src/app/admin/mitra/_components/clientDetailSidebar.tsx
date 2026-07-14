import { X, MapPin, Mail, Phone } from "lucide-react";
import { Client } from "@/lib/actions/client";

interface ContactClientSidebarProps {
    isOpen: string | null;
    activeContactClient: Client | undefined;
    onClose: () => void;
}

export default function ClientDetailSidebar({
    isOpen,
    activeContactClient,
    onClose,
}: ContactClientSidebarProps) {

    const handleCopyBankAccount = () => {
        if (activeContactClient?.bankAccount) {
            navigator.clipboard.writeText(activeContactClient.bankAccount);
            alert("Nomor rekening berhasil disalin!");
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <aside
            className={`fixed top-0 right-0 h-full w-full sm:w-112.5 bg-white z-50 shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                }`}
        >
            {activeContactClient && (
                <div className="flex-1 flex flex-col h-full">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
                        <h2 className="text-xl font-bold text-slate-900">Hubungi Mitra</h2>
                        <button
                            type="button"
                            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors active:scale-[0.95]"
                            onClick={onClose}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content Body */}
                    <div className="flex-1 overflow-y-auto p-8 flex flex-col justify-between">
                        <div className="space-y-8">
                            {/* Profile Card Header */}
                            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                                {activeContactClient.img ? (
                                    <img
                                        src={activeContactClient.img}
                                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mb-4"
                                        alt={activeContactClient.name}
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-3xl border-4 border-white shadow-md mb-4">
                                        {getInitials(activeContactClient.name)}
                                    </div>
                                )}
                                <h3 className="text-xl font-bold text-slate-900 mb-1">
                                    {activeContactClient.name}
                                </h3>
                                <p className="text-sm font-semibold text-slate-500">
                                    {activeContactClient.corp}
                                </p>
                            </div>

                            {/* Bank Account Info Card */}
                            {(activeContactClient.bankName || activeContactClient.bankAccount) && (
                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-left text-sm shadow-inner">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                                            Informasi Bank &amp; No. Rekening
                                        </p>
                                        <p className="font-bold text-slate-800">
                                            {activeContactClient.bankName || "-"}
                                        </p>
                                        <p className="font-mono text-slate-600 text-xs mt-0.5">
                                            No. Rek: {activeContactClient.bankAccount || "-"}
                                        </p>
                                    </div>
                                    {activeContactClient.bankAccount && (
                                        <button
                                            type="button"
                                            onClick={handleCopyBankAccount}
                                            className="p-2 bg-white rounded-lg text-slate-500 font-mono text-xs border border-slate-200 shadow-sm hover:bg-slate-50 cursor-pointer select-none transition-colors"
                                            title="Salin No Rekening"
                                        >
                                            Salin
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Legal & Business Details Card */}
                            <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-5 text-left space-y-4 shadow-sm">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Legalitas &amp; Jenis Usaha
                                </h4>
                                {activeContactClient.businessDesc && (
                                    <div>
                                        <p className="text-[10px] font-semibold text-slate-400 uppercase">
                                            Deskripsi Jenis Usaha
                                        </p>
                                        <p className="text-sm font-medium text-slate-700 mt-0.5">
                                            {activeContactClient.businessDesc}
                                        </p>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                    {activeContactClient.siupNumber && (
                                        <div>
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase">
                                                No. SIUP
                                            </p>
                                            <p className="text-xs font-medium text-slate-800 mt-0.5">
                                                {activeContactClient.siupNumber}
                                            </p>
                                        </div>
                                    )}
                                    {activeContactClient.npwpNumber && (
                                        <div>
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase">
                                                NPWP
                                            </p>
                                            <p className="text-xs font-medium text-slate-800 mt-0.5">
                                                {activeContactClient.npwpNumber}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {activeContactClient.tdpNumber && (
                                        <div>
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase">
                                                No. TDP
                                            </p>
                                            <p className="text-xs font-medium text-slate-800 mt-0.5">
                                                {activeContactClient.tdpNumber}
                                            </p>
                                        </div>
                                    )}
                                    {activeContactClient.pirtNumber && (
                                        <div>
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase">
                                                No. PIRT
                                            </p>
                                            <p className="text-xs font-medium text-slate-800 mt-0.5">
                                                {activeContactClient.pirtNumber}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {activeContactClient.googleMapsLink && (
                                    <div className="pt-2 border-t border-slate-200/60">
                                        <a
                                            href={activeContactClient.googleMapsLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-800 transition-colors"
                                        >
                                            <MapPin className="w-3.5 h-3.5" />
                                            Lihat Peta Mitra di Google Maps &rarr;
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Contact Options UI */}
                            <div className="space-y-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 pl-1">
                                    Pilih Metode Komunikasi
                                </p>

                                {/* Email Button */}
                                {activeContactClient.email && (
                                    <a
                                        href={`mailto:${activeContactClient.email}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-300 group shadow-sm hover:shadow-md cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:scale-105 transition-transform shadow-inner">
                                                <Mail className="w-6 h-6" />
                                            </div>
                                            <div className="text-left">
                                                <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                    Kirim Email Resmi
                                                </h4>
                                                <p className="text-xs text-slate-500 font-medium mt-0.5">
                                                    {activeContactClient.email}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                                            Buka &rarr;
                                        </span>
                                    </a>
                                )}

                                {/* Phone Button */}
                                {activeContactClient.phone && (
                                    <a
                                        href={`tel:${activeContactClient.phone}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-emerald-300 hover:bg-emerald-50/30 transition-all duration-300 group shadow-sm hover:shadow-md cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:scale-105 transition-transform shadow-inner">
                                                <Phone className="w-6 h-6" />
                                            </div>
                                            <div className="text-left">
                                                <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                                    Hubungi Telepon / HP
                                                </h4>
                                                <p className="text-xs text-slate-500 font-medium mt-0.5">
                                                    {activeContactClient.phone}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                                            Hubungi &rarr;
                                        </span>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Close Footer Button */}
                        <div className="mt-8">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all duration-300 active:scale-[0.98] border border-slate-200"
                            >
                                Tutup Kontak
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};