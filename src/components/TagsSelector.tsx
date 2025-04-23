import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface Tag {
    id: string;
    name: string;
}

interface TagsSelectorProps {
    selectedTags: string[] | undefined;
    onTagsChange: (tags: string[]) => void;
}

export function TagsSelector({ selectedTags = [], onTagsChange }: TagsSelectorProps) {
    const [tags, setTags] = useState<Tag[]>([]);

    // 从后端获取标签列表
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch('http://localhost:8000/tags');
                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched tags data:', data);

                if (!data || typeof data !== 'object') {
                    throw new Error('Invalid tags data format');
                }

                const tagsArray = Object.entries(data).map(([id, name]) => ({
                    id,
                    name: (name as string).replace(/^,\s*/, '').trim(),
                }));
                setTags(tagsArray);
            } catch (error) {
                console.error('Failed to fetch tags:', error);
                setTags([
                    { id: '1', name: 'vibrant colors' },
                    { id: '2', name: 'historical style' },
                    { id: '3', name: 'sunny day' },
                    { id: '4', name: 'scientific style' },
                    { id: '5', name: 'high detail' },
                    { id: '6', name: 'illustration' },
                    { id: '7', name: 'realistic style' },
                    { id: '8', name: 'cartoon style' },
                    { id: '9', name: 'watercolor style' },
                    { id: '10', name: 'ultra-realistic' },
                    { id: '11', name: 'labeled components' },
                    { id: '12', name: 'night scene' },
                    { id: '13', name: 'educational diagram' },
                    { id: '14', name: 'geological feature' },
                ]);
            }
        };

        fetchTags();
    }, []);

    console.log('Current tags state:', tags);

    const handleTagChange = (tagId: string) => {
        const newSelectedTags = selectedTags.includes(tagId)
            ? selectedTags.filter((id) => id !== tagId)
            : [...selectedTags, tagId];
        onTagsChange(newSelectedTags);
    };

    return (
        <div className="space-y-2">
            <Label className="text-lg font-semibold text-primary">属性标签</Label>
            {tags.length === 0 ? (
                <p className="text-muted-foreground">加载标签...</p>
            ) : (
                <div className="grid grid-cols-2 gap-2 max-h-20 overflow-y-auto">
                    {tags.map((tag) => (
                        <div key={tag.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={tag.id}
                                checked={selectedTags.includes(tag.id)}
                                onCheckedChange={() => handleTagChange(tag.id)}
                            />
                            <Label htmlFor={tag.id}>{tag.name}</Label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}