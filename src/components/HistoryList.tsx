interface HistoryItem {
    id: string;
    src: string;
    prompt: string;
}

interface HistoryListProps {
    history: HistoryItem[];
    onImageSelect: (item: HistoryItem) => void; // 添加点击回调
}

export function HistoryList({ history, onImageSelect }: HistoryListProps) {
    return (
        <div className="space-y-2">
            <div className="max-h-96 overflow-y-auto">
                {history.map((image) => (
                    <div
                        key={image.id}
                        className="flex items-center space-x-2 p-2 hover:bg-neutral-100 rounded cursor-pointer"
                        onClick={() => onImageSelect(image)} // 添加点击事件
                    >
                        <img
                            src={image.src}
                            alt={image.prompt}
                            className="w-16 h-16 object-cover rounded"
                            onError={() => console.error('Failed to load history image:', image.src)}
                        />
                        <span>{image.prompt}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}