export default function Loading({ title }: { title: string }) {
    return (
        <div className="flex h-full w-full items-center justify-center bg-surface-container-lowest">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-on-surface-variant font-medium text-sm">{title}...</p>
            </div>
        </div>
    )
}