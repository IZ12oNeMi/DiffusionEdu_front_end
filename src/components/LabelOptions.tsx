import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface LabelOptionsProps {
    fontSize: number;
    color: string;
    opacity: number;
    labelText: string;
    onFontSizeChange: (value: number) => void;
    onColorChange: (value: string) => void;
    onOpacityChange: (value: number) => void;
    onLabelTextChange: (value: string) => void;
}

export function LabelOptions({
                                 fontSize,
                                 color,
                                 opacity,
                                 labelText,
                                 onFontSizeChange,
                                 onColorChange,
                                 onOpacityChange,
                                 onLabelTextChange,
                             }: LabelOptionsProps) {
    // 处理 Font Size 输入，确保格式正确
    const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const parsedValue = parseInt(value, 10);
        if (!isNaN(parsedValue) && parsedValue >= 10 && parsedValue <= 100) {
            onFontSizeChange(parsedValue);
        } else if (value === '') {
            onFontSizeChange(10); // 默认值
        }
    };

    return (
        <div className="space-y-4">
            {/* Font Size */}
            <div>
                <Label htmlFor="font-size" className="text-sm font-medium">
                    字体大小 (10px-100px)
                </Label>
                <Input
                    id="font-size"
                    type="number"
                    value={fontSize}
                    onChange={handleFontSizeChange}
                    min={10}
                    max={100}
                    className="mt-1 h-8"
                />
            </div>

            {/* Color Picker */}
            <div>
                <Label className="text-sm font-medium">字体颜色</Label>
                <div className="flex items-center gap-2 mt-1">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-10 h-8 p-0"
                                style={{ backgroundColor: color }}
                            >
                                <span className="sr-only">打开颜色选择器</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48">
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => onColorChange(e.target.value)}
                                className="w-full h-8 border-none"
                            />
                        </PopoverContent>
                    </Popover>
                    <span className="text-sm text-muted-foreground">{color}</span>
                </div>
            </div>

            {/* Opacity Slider */}
            <div>
                <Label className="text-sm font-medium">颜色透明度</Label>
                <Slider
                    value={[opacity]}
                    onValueChange={(value) => onOpacityChange(value[0])}
                    min={0}
                    max={1}
                    step={0.01}
                    className="mt-1"
                />
                <span className="text-sm text-muted-foreground">{(opacity * 100).toFixed(0)}%</span>
            </div>

            {/* Label Text */}
            <div>
                <Label htmlFor="label-text" className="text-sm font-medium">
                    标签文本
                </Label>
                <Input
                    id="label-text"
                    value={labelText}
                    onChange={(e) => onLabelTextChange(e.target.value)}
                    placeholder="请输入标签文字"
                    className="mt-1 h-8"
                />
            </div>
        </div>
    );
}