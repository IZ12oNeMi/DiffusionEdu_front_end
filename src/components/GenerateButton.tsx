import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export function GenerateButton() {
    return (
        <Button className="bg-black text-white hover:bg-gray-800 p-2">
            <Send className="h-5 w-5" />
        </Button>
    );
}