import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';

interface PromptInputProps {
    prompt: string;
    onPromptChange: (value: string) => void;
    onGenerate: () => void;
    isLoading?: boolean; // 添加 isLoading 属性
}

export function PromptInput({ prompt, onPromptChange, onGenerate, isLoading = false }: PromptInputProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="prompt" className="text-lg font-semibold text-primary">
                提示文本
            </Label>
            <div className="flex flex-row items-center gap-2">
                <Input
                    id="prompt"
                    value={prompt}
                    onChange={(e) => onPromptChange(e.target.value)}
                    placeholder="请输入文本提示 (例如：细胞有丝分裂的过程展示)"
                    className="h-10 flex-1"
                    disabled={isLoading} // 禁用输入框，避免生成时修改
                />
                <Button
                    className="bg-black text-white hover:bg-gray-800 h-10 w-10 flex items-center justify-center"
                    onClick={onGenerate}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" /> // 生成时显示旋转方形图标
                    ) : (
                        <Send className="h-5 w-5" /> // 默认显示发送图标
                    )}
                </Button>
            </div>
        </div>
    );
}