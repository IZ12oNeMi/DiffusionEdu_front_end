import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { Stage, Layer, Image as KonvaImage, Text, Rect, Circle, Arrow, Line, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

interface Label {
    id: string;
    x: number;
    y: number;
    text: string;
    fontSize: number;
    fill: string;
    opacity: number;
}

interface Shape {
    id: string;
    type: 'rectangle' | 'circle' | 'arrow' | 'line';
    x: number;
    y: number;
    width?: number;
    height?: number;
    points?: number[];
    fill?: string;
    stroke: string;
    strokeWidth: number;
}

interface ImageCanvasProps {
    imageUrl: string | null;
    isLoading: boolean;
    labels: Label[];
    onAddLabel: (x: number, y: number) => void;
    onLabelDrag: (id: string, x: number, y: number) => void;
    activeTool: 'rectangle' | 'circle' | 'arrow' | 'line' | null;
    shapes: Shape[];
    onAddShape: (shape: Shape) => void;
    onShapeDrag: (id: string, x: number, y: number) => void;
    onDeleteShape: (id: string) => void;
}

export function ImageCanvas({
                                imageUrl,
                                isLoading,
                                labels,
                                onAddLabel,
                                onLabelDrag,
                                activeTool,
                                shapes,
                                onAddShape,
                                onShapeDrag,
                                onDeleteShape,
                            }: ImageCanvasProps) {
    const baseUrl = 'http://localhost:8000';
    const fullImageUrl = imageUrl ? `${baseUrl}${imageUrl}` : null;
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({ width: 512, height: 512 });
    const [error, setError] = useState<string | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);

    const canvasWidth = 512;
    const canvasHeight = 512;

    // 加载图片
    useEffect(() => {
        if (fullImageUrl) {
            const img = new window.Image();
            img.src = fullImageUrl;
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                console.log('Image loaded successfully:', fullImageUrl);
                imageRef.current = img;

                // 自适应画布尺寸，保持宽高比，确保图片完整显示
                const imageWidth = img.width;
                const imageHeight = img.height;
                const aspectRatio = imageWidth / imageHeight;

                let newWidth = imageWidth;
                let newHeight = imageHeight;

                if (aspectRatio > 1) {
                    newWidth = canvasWidth;
                    newHeight = canvasWidth / aspectRatio;
                } else {
                    newHeight = canvasHeight;
                    newWidth = canvasHeight * aspectRatio;
                }

                if (newWidth > canvasWidth) {
                    newWidth = canvasWidth;
                    newHeight = canvasWidth / aspectRatio;
                }
                if (newHeight > canvasHeight) {
                    newHeight = canvasHeight;
                    newWidth = canvasHeight * aspectRatio;
                }

                setImageDimensions({ width: newWidth, height: newHeight });
                setImageLoaded(true);
                setError(null);
            };
            img.onerror = (error) => {
                console.error('Failed to load image:', fullImageUrl, error);
                setImageLoaded(false);
                setError('无法加载图片，请检查图片路径或后端服务');
            };
        } else {
            setImageLoaded(false);
            setError(null);
        }
    }, [fullImageUrl]);

    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if (!imageUrl || !imageLoaded || !activeTool) return;
        const stage = e.target.getStage();
        if (!stage) return;
        const pointerPosition = stage.getPointerPosition();
        if (!pointerPosition) return;

        setIsDrawing(true);
        setStartPos({ x: pointerPosition.x, y: pointerPosition.y });
    };

    const handleMouseMove = () => {
        if (!isDrawing || !activeTool || !startPos) return;
        // 实时更新图形尺寸（可选，此处仅在 mouseup 时创建图形）
    };

    const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
        if (!isDrawing || !activeTool || !startPos) return;
        const stage = e.target.getStage();
        if (!stage) return;
        const pointerPosition = stage.getPointerPosition();
        if (!pointerPosition) return;

        const endX = pointerPosition.x;
        const endY = pointerPosition.y;
        const startX = startPos.x;
        const startY = startPos.y;

        const newShape: Shape = {
            id: Date.now().toString(),
            type: activeTool,
            x: Math.min(startX, endX),
            y: Math.min(startY, endY),
            stroke: '#000000',
            strokeWidth: 2,
        };

        if (activeTool === 'rectangle') {
            newShape.width = Math.abs(endX - startX);
            newShape.height = Math.abs(endY - startY);
            newShape.fill = 'rgba(0, 0, 255, 0.2)';
        } else if (activeTool === 'circle') {
            const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)) / 2;
            newShape.x = startX;
            newShape.y = startY;
            newShape.width = radius;
            newShape.fill = 'rgba(255, 0, 0, 0.2)';
        } else if (activeTool === 'arrow' || activeTool === 'line') {
            newShape.points = [startX, startY, endX, endY];
        }

        onAddShape(newShape);
        setIsDrawing(false);
        setStartPos(null);
    };

    const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
        if (activeTool) return; // 如果有绘图工具激活，不添加标签
        if (!imageUrl || !imageLoaded) return;
        const stage = e.target.getStage();
        if (!stage) return;
        const pointerPosition = stage.getPointerPosition();
        if (!pointerPosition) return;
        const x = Math.max(0, Math.min(pointerPosition.x, canvasWidth - 50));
        const y = Math.max(0, Math.min(pointerPosition.y, canvasHeight - 20));
        onAddLabel(x, y);
    };

    const handleLabelDragEnd = (id: string, e: KonvaEventObject<DragEvent>) => {
        let { x, y } = e.target.position();
        x = Math.max(0, Math.min(x, canvasWidth - 50));
        y = Math.max(0, Math.min(y, canvasHeight - 20));
        e.target.position({ x, y });
        onLabelDrag(id, x, y);
    };

    const handleShapeDragEnd = (id: string, e: KonvaEventObject<DragEvent>) => {
        let { x, y } = e.target.position();
        x = Math.max(0, Math.min(x, canvasWidth - 50));
        y = Math.max(0, Math.min(y, canvasHeight - 20));
        e.target.position({ x, y });
        onShapeDrag(id, x, y);
    };

    const handleDeleteShape = (id: string) => {
        onDeleteShape(id);
    };

    const handleDownload = async () => {
        if (!fullImageUrl) {
            console.error('No image to download');
            return;
        }

        try {
            const response = await fetch(fullImageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'generated_image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download image:', error);
        }
    };

    return (
        <div className="space-y-4">
            <Card className="p-4">
                <div className="w-full h-96 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : fullImageUrl && imageLoaded ? (
                        <Stage
                            width={canvasWidth}
                            height={canvasHeight}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onClick={handleStageClick}
                            style={{ backgroundColor: '#f0f0f0', border: '1px solid #e5e5e5' }}
                        >
                            <Layer>
                                {imageRef.current && (
                                    <KonvaImage
                                        image={imageRef.current}
                                        width={imageDimensions.width}
                                        height={imageDimensions.height}
                                        x={(canvasWidth - imageDimensions.width) / 2}
                                        y={(canvasHeight - imageDimensions.height) / 2}
                                    />
                                )}
                                {labels.map((label) => (
                                    <Text
                                        key={label.id}
                                        x={label.x}
                                        y={label.y}
                                        text={label.text}
                                        fontSize={label.fontSize}
                                        fill={label.fill}
                                        opacity={label.opacity}
                                        draggable
                                        onDragEnd={(e) => handleLabelDragEnd(label.id, e)}
                                    />
                                ))}
                                {shapes.map((shape) => (
                                    <Group key={shape.id}>
                                        {shape.type === 'rectangle' && (
                                            <Rect
                                                x={shape.x}
                                                y={shape.y}
                                                width={shape.width}
                                                height={shape.height}
                                                fill={shape.fill}
                                                stroke={shape.stroke}
                                                strokeWidth={shape.strokeWidth}
                                                draggable
                                                onDragEnd={(e) => handleShapeDragEnd(shape.id, e)}
                                            />
                                        )}
                                        {shape.type === 'circle' && (
                                            <Circle
                                                x={shape.x}
                                                y={shape.y}
                                                radius={shape.width}
                                                fill={shape.fill}
                                                stroke={shape.stroke}
                                                strokeWidth={shape.strokeWidth}
                                                draggable
                                                onDragEnd={(e) => handleShapeDragEnd(shape.id, e)}
                                            />
                                        )}
                                        {shape.type === 'arrow' && (
                                            <Arrow
                                                points={shape.points || []}
                                                stroke={shape.stroke}
                                                strokeWidth={shape.strokeWidth}
                                                draggable
                                                onDragEnd={(e) => handleShapeDragEnd(shape.id, e)}
                                            />
                                        )}
                                        {shape.type === 'line' && (
                                            <Line
                                                points={shape.points || []}
                                                stroke={shape.stroke}
                                                strokeWidth={shape.strokeWidth}
                                                draggable
                                                onDragEnd={(e) => handleShapeDragEnd(shape.id, e)}
                                            />
                                        )}
                                        <Rect
                                            x={shape.x + (shape.width || 0)}
                                            y={shape.y - 20}
                                            width={20}
                                            height={20}
                                            fill="red"
                                            onClick={() => handleDeleteShape(shape.id)}
                                        />
                                        <Text
                                            x={shape.x + (shape.width || 0) + 3}
                                            y={shape.y - 17}
                                            text="X"
                                            fontSize={14}
                                            fill="white"
                                            onClick={() => handleDeleteShape(shape.id)}
                                        />
                                    </Group>
                                ))}
                            </Layer>
                        </Stage>
                    ) : (
                        <p className="text-muted-foreground">开始生成吧^^</p>
                    )}
                </div>
            </Card>
            <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleDownload}
                disabled={!fullImageUrl || !imageLoaded}
            >
                <Download className="mr-2 h-4 w-4" />
                保存图片
            </Button>
        </div>
    );
}