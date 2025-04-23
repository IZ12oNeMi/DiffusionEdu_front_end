import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AdvancedOptionsProps {
    steps: number;
    guidanceScale: number;
    imageSize: string;
    onStepsChange: (value: number) => void;
    onGuidanceScaleChange: (value: number) => void;
    onImageSizeChange: (value: string) => void;
}

export function AdvancedOptions({
                                    steps,
                                    guidanceScale,
                                    imageSize,
                                    onStepsChange,
                                    onGuidanceScaleChange,
                                    onImageSizeChange,
                                }: AdvancedOptionsProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="space-y-2">
            <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setIsOpen(!isOpen)}
            >
                高级选项 {isOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </Button>
            {isOpen && (
                <div className="space-y-2 p-4 bg-muted rounded-md">
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <Label htmlFor="steps">生成步数 (20-100)</Label>
                            <Input
                                id="steps"
                                type="number"
                                value={steps}
                                onChange={(e) => onStepsChange(Number(e.target.value))}
                                min={20}
                                max={100}
                            />
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="guidance-scale">引导力度 (2-20)</Label>
                            <Input
                                id="guidance-scale"
                                type="number"
                                value={guidanceScale}
                                onChange={(e) => onGuidanceScaleChange(Number(e.target.value))}
                                min={2}
                                max={20}
                                step={0.1}
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="image-size">图片尺寸</Label>
                        <Select value={imageSize} onValueChange={onImageSizeChange}>
                            <SelectTrigger id="image-size" className="w-full">
                                <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="512x512">512x512</SelectItem>
                                <SelectItem value="768x768">768x768</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}
        </div>
    );
}