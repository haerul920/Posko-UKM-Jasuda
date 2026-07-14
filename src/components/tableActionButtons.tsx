import { Star, Phone, Edit, Trash } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Define a common interface for the item
interface BaseItem {
    id: string;
    name: string;
    favorite: boolean;
}

interface ActionButtonsProps<T extends BaseItem> {
    item: T;
    onToggleFavorite?: (item: T) => void;
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
    onContact?: (item: T) => void;
}

export default function TableActionButtons<T extends BaseItem>({
    item,
    onToggleFavorite,
    onEdit,
    onDelete,
    onContact,
}: ActionButtonsProps<T>) {
    return (
        <div className="flex items-center justify-center gap-2">
            {/* Star Button */}
            {onToggleFavorite && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item);
                    }}
                    className={`p-2 rounded-lg transition-all active:scale-[0.98] shadow-sm ${item.favorite
                        ? "text-amber-500 hover:text-slate-400 hover:bg-white"
                        : "text-slate-400 hover:text-amber-500 hover:bg-white"
                        }`}
                >
                    <Star className={`w-4 h-4 ${item.favorite ? "fill-current" : ""}`} />
                </button>
            )}

            {/* Optional Contact Button */}
            {onContact && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onContact(item);
                    }}
                    className="p-2 text-slate-400 hover:text-emerald-500"
                >
                    <Phone className="w-4 h-4" />
                </button>
            )}

            {/* Edit Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                }}
                className="p-2 text-slate-400 hover:text-ocean-light"
            >
                <Edit className="w-4 h-4" />
            </button>

            {/* Delete Button */}
            <div onClick={(e) => e.stopPropagation()}>
                <AlertDialog>
                    <AlertDialogTrigger render={
                        <button
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-all active:scale-[0.98] shadow-sm cursor-pointer"
                        >
                            <Trash className="w-4 h-4" />
                        </button>
                    } />
                    <AlertDialogContent className="bg-white ring-0 shadow-md">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl mb-2">Yakin ingin menghapus &quot;<span className="font-bold">{item.name}</span>&quot;?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Aksi ini akan menghapus data secara permanen dari database sehingga kamu harus menambahkan ulang secara manual.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="border-0 mt-0 pt-0">
                            <AlertDialogCancel className="hover:bg-black/5 transition-all cursor-pointer">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-red-600 hover:bg-red-500 transition-all cursor-pointer border border-red-600  text-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(item)
                                }}
                            >
                                Hapus
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
