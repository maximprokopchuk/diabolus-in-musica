"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ArrowLeft, Wand2 } from "lucide-react";
import { toast } from "sonner";

type TheoryBlock = {
  id: string;
  type: string;
  content: string;
  order: number;
  metadata: Record<string, unknown> | null;
};

type Topic = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  order: number;
  lesson: { id: string; title: string; instrument: string };
  theoryBlocks: TheoryBlock[];
};

export default function EditTopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // New block dialog
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockType, setBlockType] = useState("TEXT");
  const [blockContent, setBlockContent] = useState("");

  // Edit block
  const [editingBlock, setEditingBlock] = useState<TheoryBlock | null>(null);
  const [editContent, setEditContent] = useState("");

  // AI generation
  const [generating, setGenerating] = useState(false);

  async function loadTopic() {
    const res = await fetch(`/api/topics/${id}`);
    if (res.ok) {
      const data = await res.json();
      setTopic(data);
      setTitle(data.title);
      setDescription(data.description || "");
    }
  }

  useEffect(() => { loadTopic(); }, [id]);

  async function saveTopic(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/topics/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    if (res.ok) {
      toast.success("Тема сохранена");
      loadTopic();
    }
  }

  async function createBlock(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/theory-blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topicId: id,
        type: blockType,
        content: blockContent,
        order: topic?.theoryBlocks.length || 0,
      }),
    });
    if (res.ok) {
      toast.success("Блок добавлен");
      setBlockDialogOpen(false);
      setBlockContent("");
      loadTopic();
    }
  }

  async function updateBlock(blockId: string) {
    const res = await fetch(`/api/theory-blocks/${blockId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editContent }),
    });
    if (res.ok) {
      toast.success("Блок обновлён");
      setEditingBlock(null);
      loadTopic();
    }
  }

  async function deleteBlock(blockId: string) {
    if (!confirm("Удалить блок теории?")) return;
    await fetch(`/api/theory-blocks/${blockId}`, { method: "DELETE" });
    toast.success("Блок удалён");
    loadTopic();
  }

  async function generateTheory() {
    if (!topic) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId: id,
          message: `Сгенерируй подробный теоретический материал для темы "${topic.title}" из урока "${topic.lesson.title}" для ${topic.lesson.instrument}. Напиши в формате markdown.`,
        }),
      });
      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let content = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
          for (const line of lines) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              content += parsed.content;
            } catch {}
          }
        }
        if (content) {
          setBlockType("TEXT");
          setBlockContent(content);
          setBlockDialogOpen(true);
          toast.success("Теория сгенерирована! Проверьте и сохраните.");
        }
      }
    } catch {
      toast.error("Ошибка генерации");
    } finally {
      setGenerating(false);
    }
  }

  if (!topic) return <p className="text-muted-foreground">Загрузка...</p>;

  return (
    <div>
      <Button variant="ghost" className="mb-4" onClick={() => router.push(`/admin/lessons/${topic.lesson.id}`)}>
        <ArrowLeft className="h-4 w-4 mr-2" />Назад к уроку
      </Button>

      <h1 className="text-2xl font-bold mb-6">Редактирование темы</h1>

      <form onSubmit={saveTopic} className="space-y-4 max-w-lg mb-8">
        <div>
          <Label>Название</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label>Описание</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <Button type="submit">Сохранить</Button>
      </form>

      <Separator className="my-8" />

      {/* Theory Blocks */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Блоки теории</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={generateTheory} disabled={generating}>
            <Wand2 className="h-4 w-4 mr-2" />
            {generating ? "Генерация..." : "AI генерация"}
          </Button>
          <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
            <DialogTrigger render={<Button size="sm" />}>
              <Plus className="h-4 w-4 mr-2" />Добавить блок
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Новый блок теории</DialogTitle>
              </DialogHeader>
              <form onSubmit={createBlock} className="space-y-4">
                <div>
                  <Label>Тип</Label>
                  <Select value={blockType} onValueChange={(v) => v && setBlockType(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEXT">Текст (Markdown)</SelectItem>
                      <SelectItem value="IMAGE">Изображение (URL)</SelectItem>
                      <SelectItem value="NOTATION">Нотация</SelectItem>
                      <SelectItem value="CODE_EXAMPLE">Код</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{blockType === "IMAGE" ? "URL изображения" : "Контент"}</Label>
                  <Textarea
                    value={blockContent}
                    onChange={(e) => setBlockContent(e.target.value)}
                    rows={blockType === "TEXT" ? 15 : 5}
                    className="font-mono text-sm"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Добавить</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-3">
        {topic.theoryBlocks.map((block) => (
          <Card key={block.id}>
            <CardHeader className="flex-row items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{block.type}</Badge>
                <span className="text-sm text-muted-foreground truncate max-w-xs">
                  {block.content.slice(0, 80)}...
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingBlock(block);
                    setEditContent(block.content);
                  }}
                >
                  Редактировать
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteBlock(block.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            {editingBlock?.id === block.id && (
              <CardContent className="pt-0">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={12}
                  className="font-mono text-sm mb-3"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => updateBlock(block.id)}>Сохранить</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingBlock(null)}>Отмена</Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
        {topic.theoryBlocks.length === 0 && (
          <p className="text-muted-foreground text-center py-4">Блоков теории пока нет</p>
        )}
      </div>
    </div>
  );
}
