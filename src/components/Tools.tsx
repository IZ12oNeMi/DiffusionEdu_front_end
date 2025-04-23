import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { Square, Circle, ArrowRight, Minus } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface ToolsProps {
    activeTool: 'rectangle' | 'circle' | 'arrow' | 'line' | null;
    onToolChange: (tool: 'rectangle' | 'circle' | 'arrow' | 'line' | null) => void;
}

export function Tools({ activeTool, onToolChange }: ToolsProps) {
    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium">绘图辅助工具</Label>
            <ToggleGroup
                type="single"
                value={activeTool || undefined}
                onValueChange={(value) => onToolChange(value as 'rectangle' | 'circle' | 'arrow' | 'line' | null)}
                className="flex justify-between gap-2"
            >
                <ToggleGroupItem value="rectangle" asChild>
                    <Button variant={activeTool === 'rectangle' ? 'default' : 'outline'} size="sm">
                        <Square className="h-4 w-4" />
                    </Button>
                </ToggleGroupItem>
                <ToggleGroupItem value="circle" asChild>
                    <Button variant={activeTool === 'circle' ? 'default' : 'outline'} size="sm">
                        <Circle className="h-4 w-4" />
                    </Button>
                </ToggleGroupItem>
                <ToggleGroupItem value="arrow" asChild>
                    <Button variant={activeTool === 'arrow' ? 'default' : 'outline'} size="sm">
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </ToggleGroupItem>
                <ToggleGroupItem value="line" asChild>
                    <Button variant={activeTool === 'line' ? 'default' : 'outline'} size="sm">
                        <Minus className="h-4 w-4" />
                    </Button>
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
}