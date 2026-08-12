import { X, MapPin, Mail, Phone, Building2, Users, Calendar, Wallet, Target, Share2 } from "lucide-react";
import { Mitra } from "@/lib/actions/mitra";

interface ContactMitraSidebarProps {
    isOpen: string | null;
    activeContactMitra: Mitra | undefined;
    onClose: () => void;
}

export default function MitraDetailSidebar({
    isOpen,
    activeContactMitra,
    onClose,
}: ContactMitraSidebarProps) {

    const handleCopyBankAccount = () => {
        if (activeContactMitra?.bankAccount) {
            navigator.clipboard.writeText(activeContactMitra.bankAccount);
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
            className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white z-50 shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                }`}
        >
            {activeContactMitra && (
                <div className="flex-1 flex flex-col h-full">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Detail &amp; Kontak Mitra</h2>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">Informasi lengkap UKM / Klien Posko</p>
                        </div>
                        <button
                            type="button"
                            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors active:scale-[0.95]"
                            onClick={onClose}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Profile Card Header */}
                        <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm relative">
                            {activeContactMitra.logo && (
                                <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-lg border border-slate-200 shadow-xs p-1">
                                    <img src={activeContactMitra.logo} alt="Logo" className="w-full h-full object-contain" />
                                </div>
                            )}
                            {activeContactMitra.img ? (
                                <img
                                    src={activeContactMitra.img}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mb-3"
                                    alt={activeContactMitra.name}
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-3xl border-4 border-white shadow-md mb-3">
                                    {getInitials(activeContactMitra.name)}
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                                {activeContactMitra.gender && (
                                    <span className="text-xs text-slate-400 font-normal">{activeContactMitra.gender}.</span>
                                )}
                                {activeContactMitra.name}
                            </h3>
                            <p className="text-sm font-semibold text-ocean-light">
                                {activeContactMitra.corp}
                            </p>
                            {activeContactMitra.businessType && (
                                <span className="mt-2 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                    {activeContactMitra.businessType} {activeContactMitra.businessDetailType ? `• ${activeContactMitra.businessDetailType}` : ""}
                                </span>
                            )}
                        </div>

                        {/* General Info Card */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 text-left space-y-3 shadow-xs">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Informasi Usaha</h4>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <p className="text-slate-400 font-medium">Tahun Berdiri</p>
                                    <p className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        {activeContactMitra.establishedYear || "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-400 font-medium">Anggota / Tenaga Kerja</p>
                                    <p className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                                        <Users className="w-3.5 h-3.5 text-slate-400" />
                                        {activeContactMitra.memberCount ? `${activeContactMitra.memberCount} Orang` : "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-400 font-medium">Kabupaten / Kota</p>
                                    <p className="font-bold text-slate-800 mt-0.5">{activeContactMitra.city || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 font-medium">Nama Pendamping</p>
                                    <p className="font-bold text-slate-800 mt-0.5">{activeContactMitra.mentorName || "-"}</p>
                                </div>
                            </div>

                            {activeContactMitra.address && (
                                <div className="pt-2 border-t border-slate-100">
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Alamat Lengkap</p>
                                    <p className="text-xs font-medium text-slate-700 mt-0.5">{activeContactMitra.address}</p>
                                </div>
                            )}

                            {activeContactMitra.googleMapsLink && (
                                <div className="pt-2 border-t border-slate-100">
                                    <a
                                        href={activeContactMitra.googleMapsLink}
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

                        {/* Bank Account Info Card */}
                        {(activeContactMitra.bankName || activeContactMitra.bankAccount) && (
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-left text-sm shadow-inner">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                                        Informasi Bank &amp; Rekening
                                    </p>
                                    <p className="font-bold text-slate-800">
                                        {activeContactMitra.bankName || "-"}
                                    </p>
                                    <p className="font-mono text-slate-600 text-xs mt-0.5">
                                        No. Rek: {activeContactMitra.bankAccount || "-"}
                                    </p>
                                    {activeContactMitra.bankAccountName && (
                                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                                            a.n {activeContactMitra.bankAccountName}
                                        </p>
                                    )}
                                </div>
                                {activeContactMitra.bankAccount && (
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
                                Legalitas &amp; Business Model Canvas
                            </h4>
                            {activeContactMitra.businessDesc && (
                                <div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase">
                                        Deskripsi Jenis Usaha
                                    </p>
                                    <p className="text-xs font-medium text-slate-700 mt-0.5 leading-relaxed">
                                        {activeContactMitra.businessDesc}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                {activeContactMitra.siupNumber && (
                                    <div>
                                        <p className="text-[10px] font-semibold text-slate-400 uppercase">SIUP</p>
                                        <p className="text-xs font-medium text-slate-800 mt-0.5 break-all">{activeContactMitra.siupNumber}</p>
                                    </div>
                                )}
                                {activeContactMitra.npwpNumber && (
                                    <div>
                                        <p className="text-[10px] font-semibold text-slate-400 uppercase">NPWP</p>
                                        <p className="text-xs font-medium text-slate-800 mt-0.5 break-all">{activeContactMitra.npwpNumber}</p>
                                    </div>
                                )}
                                {activeContactMitra.tdpNumber && (
                                    <div>
                                        <p className="text-[10px] font-semibold text-slate-400 uppercase">TDP</p>
                                        <p className="text-xs font-medium text-slate-800 mt-0.5 break-all">{activeContactMitra.tdpNumber}</p>
                                    </div>
                                )}
                                {activeContactMitra.pirtNumber && (
                                    <div>
                                        <p className="text-[10px] font-semibold text-slate-400 uppercase">PIRT</p>
                                        <p className="text-xs font-medium text-slate-800 mt-0.5 break-all">{activeContactMitra.pirtNumber}</p>
                                    </div>
                                )}
                            </div>

                            {(activeContactMitra.initialCapital || activeContactMitra.customerSegment || activeContactMitra.channel) && (
                                <div className="pt-3 border-t border-slate-200 space-y-2">
                                    {activeContactMitra.initialCapital ? (
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-400 font-medium flex items-center gap-1">
                                                <Wallet className="w-3.5 h-3.5 text-slate-400" /> Modal Awal:
                                            </span>
                                            <span className="font-bold text-slate-800">Rp {activeContactMitra.initialCapital.toLocaleString("id-ID")}</span>
                                        </div>
                                    ) : null}

                                    {activeContactMitra.customerSegment ? (
                                        <div className="text-xs">
                                            <span className="text-slate-400 font-medium flex items-center gap-1 mb-0.5">
                                                <Target className="w-3.5 h-3.5 text-slate-400" /> Segmen Pelanggan:
                                            </span>
                                            <p className="font-semibold text-slate-700 pl-4">{activeContactMitra.customerSegment}</p>
                                        </div>
                                    ) : null}

                                    {activeContactMitra.channel ? (
                                        <div className="text-xs">
                                            <span className="text-slate-400 font-medium flex items-center gap-1 mb-0.5">
                                                <Share2 className="w-3.5 h-3.5 text-slate-400" /> Saluran Pemasaran:
                                            </span>
                                            <p className="font-semibold text-slate-700 pl-4">{activeContactMitra.channel}</p>
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>

                        {/* Contact Options UI */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                                Kontak &amp; Komunikasi
                            </p>

                            {activeContactMitra.email && (
                                <a
                                    href={`mailto:${activeContactMitra.email}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-300 group shadow-xs cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600 shadow-inner">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                                                Kirim Email Resmi
                                            </h4>
                                            <p className="text-xs text-slate-500 font-medium">
                                                {activeContactMitra.email}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-blue-600">Buka &rarr;</span>
                                </a>
                            )}

                            {activeContactMitra.phone && (
                                <a
                                    href={`tel:${activeContactMitra.phone}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/30 transition-all duration-300 group shadow-xs cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600 shadow-inner">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-600 transition-colors">
                                                Hubungi Telepon / HP
                                            </h4>
                                            <p className="text-xs text-slate-500 font-medium">
                                                {activeContactMitra.phone}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-600">Hubungi &rarr;</span>
                                </a>
                            )}
                        </div>

                        {/* Close Footer Button */}
                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all duration-300 active:scale-[0.98] border border-slate-200"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};