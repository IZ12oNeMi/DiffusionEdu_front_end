import { useState } from 'react';
import { Logo } from './components/Logo.tsx';
import { PromptInput } from './components/PromptInput';
import { TagsSelector } from './components/TagsSelector';
import { ImageCanvas } from './components/ImageCanvas';
import { LabelOptions } from './components/LabelOptions.tsx';
import { HistoryList } from './components/HistoryList';
import { Tools } from './components/Tools.tsx';
import { Card } from '@/components/ui/card';
import { cn } from './lib/utils.ts';
import { AdvancedOptions } from '@/components/AdvancedOptions.tsx';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// 定义历史记录的类型
interface HistoryItem {
    id: string;
    src: string;
    prompt: string;
}

// 定义标签的类型
interface Label {
    id: string;
    x: number;
    y: number;
    text: string;
    fontSize: number;
    fill: string;
    opacity: number;
}

// 定义图形的类型
interface Shape {
    id: string;
    type: 'rectangle' | 'circle' | 'arrow' | 'line';
    x: number;
    y: number;
    width?: number; // 用于矩形、圆形
    height?: number; // 用于矩形
    points?: number[]; // 用于箭头、直线
    fill?: string;
    stroke: string;
    strokeWidth: number;
}

export default function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [prompt, setPrompt] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [steps, setSteps] = useState(50);
    const [guidanceScale, setGuidanceScale] = useState(7.5);
    const [imageSize, setImageSize] = useState('512x512');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([
        { id: '1', src: 'http://localhost:8000/images/image_7c737488.png', prompt: '一只颜色艳丽的鸟' },
        { id: '2', src: 'http://localhost:8000/images/image_9ee327da.png', prompt: '一棵老树（写实风）' },
        { id: '3', src: 'http://localhost:8000/images/image_3cef27f0.png', prompt: '黎明的湖面' },
        { id: '4', src: 'http://localhost:8000/images/image_d1b3f248.png', prompt: '一棵老树（插画风）' },
        { id: '5', src: 'http://localhost:8000/images/image_d039f5bd.png', prompt: '细胞结构展示' },
    ]);
    // 标签相关状态
    const [labels, setLabels] = useState<Label[]>([]);
    const [fontSize, setFontSize] = useState(16);
    const [color, setColor] = useState('#000000');
    const [opacity, setOpacity] = useState(1);
    const [labelText, setLabelText] = useState('');
    // 绘图工具相关状态
    const [activeTool, setActiveTool] = useState<'rectangle' | 'circle' | 'arrow' | 'line' | null>(null);
    const [shapes, setShapes] = useState<Shape[]>([]);
    const { toast } = useToast();

    const handleGenerate = async () => {
        setIsLoading(true);
        setLabels([]); // 生成新图片时清空标签
        setShapes([]); // 生成新图片时清空图形
        try {
            const [height, width] = imageSize.split('x').map(Number);
            const response = await fetch('http://localhost:8000/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    selected_tags: selectedTags,
                    steps,
                    guidance_scale: guidanceScale,
                    height,
                    width,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            const newImageUrl = data.image_path;
            setImageUrl(newImageUrl);

            // 添加到历史记录
            const newHistoryItem: HistoryItem = {
                id: Date.now().toString(),
                src: `http://localhost:8000${newImageUrl}`,
                prompt,
            };
            setHistory([newHistoryItem, ...history]);
        } catch (error) {
            console.error('Failed to generate image:', error);
            toast({
                title: 'Error',
                description: `Failed to generate image: ${(error as Error).message || String(error)}`,
                variant: 'destructive',
            });
            setImageUrl(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageSelect = (item: HistoryItem) => {
        setImageUrl(item.src.startsWith('http') ? item.src.substring('http://localhost:8000'.length) : item.src);
        setPrompt(item.prompt);
        setLabels([]); // 切换图片时清空标签
        setShapes([]); // 切换图片时清空图形
    };

    const handleAddLabel = (x: number, y: number) => {
        if (!labelText) {
            toast({
                title: '提示',
                description: '请先输入标签文本',
                variant: 'destructive',
            });
            return;
        }
        const newLabel: Label = {
            id: Date.now().toString(),
            x,
            y,
            text: labelText,
            fontSize,
            fill: color,
            opacity,
        };
        setLabels([...labels, newLabel]);
    };

    const handleLabelDrag = (id: string, x: number, y: number) => {
        setLabels(labels.map(label =>
            label.id === id ? { ...label, x, y } : label
        ));
    };

    const handleAddShape = (shape: Shape) => {
        setShapes([...shapes, shape]);
    };

    const handleShapeDrag = (id: string, x: number, y: number) => {
        setShapes(shapes.map(shape =>
            shape.id === id ? { ...shape, x, y } : shape
        ));
    };

    const handleDeleteShape = (id: string) => {
        setShapes(shapes.filter(shape => shape.id !== id));
    };

    return (
        <div className={cn('min-h-screen bg-neutral-50 flex')}>
            <aside className="w-64 p-4 hidden lg:block">
                <Logo />
            </aside>
            <main className="flex-1 p-4 max-w-4xl mx-auto">
                <Card className="p-6 space-y-4 w-full bg-white shadow-md">
                    <div className="rounded-md p-4">
                        <ImageCanvas
                            imageUrl={imageUrl}
                            isLoading={isLoading}
                            labels={labels}
                            onAddLabel={handleAddLabel}
                            onLabelDrag={handleLabelDrag}
                            activeTool={activeTool}
                            shapes={shapes}
                            onAddShape={handleAddShape}
                            onShapeDrag={handleShapeDrag}
                            onDeleteShape={handleDeleteShape}
                        />
                    </div>
                    <hr className="border-t border-muted my-2" />
                    <div className="space-y-4 rounded-md p-4">
                        <PromptInput
                            prompt={prompt}
                            onPromptChange={setPrompt}
                            onGenerate={handleGenerate}
                            isLoading={isLoading}
                        />
                        <TagsSelector
                            selectedTags={selectedTags}
                            onTagsChange={setSelectedTags}
                        />
                        <AdvancedOptions
                            steps={steps}
                            guidanceScale={guidanceScale}
                            imageSize={imageSize}
                            onStepsChange={setSteps}
                            onGuidanceScaleChange={setGuidanceScale}
                            onImageSizeChange={setImageSize}
                        />
                    </div>
                </Card>
            </main>
            <div className="relative hidden lg:block">
                <div
                    className={cn(
                        'h-screen bg-white shadow-md transition-all duration-300',
                        isSidebarOpen ? 'w-80' : 'w-0'
                    )}
                >
                    <Card
                        className={cn(
                            'h-full p-4 space-y-4 overflow-y-auto',
                            isSidebarOpen ? 'block' : 'hidden'
                        )}
                    >
                        <h2 className="text-lg font-semibold">标签属性</h2>
                        <LabelOptions
                            fontSize={fontSize}
                            color={color}
                            opacity={opacity}
                            labelText={labelText}
                            onFontSizeChange={setFontSize}
                            onColorChange={setColor}
                            onOpacityChange={setOpacity}
                            onLabelTextChange={setLabelText}
                        />
                        <Tools activeTool={activeTool} onToolChange={setActiveTool} />
                        <hr className="border-t border-muted" />
                        <h2 className="text-lg font-semibold">历史生成图片</h2>
                        <HistoryList history={history} onImageSelect={handleImageSelect} />
                    </Card>
                </div>
                <Button
                    variant="ghost"
                    className="absolute top-4 -left-10 p-2"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? (
                        <ChevronRight className="h-6 w-6" />
                    ) : (
                        <ChevronLeft className="h-6 w-6" />
                    )}
                </Button>
            </div>
        </div>
    );
}