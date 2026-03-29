"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type Topic = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  order: number;
};

type Lesson = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  instrument: string;
  order: number;
  published: boolean;
  topics: Topic[];
};

function slugify(text: string): string {
  const ru: Record<string, string> = {
    а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"j",
    к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",
    х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya",
  };
  return text
    .toLowerCase()
    .split("")
    .map((c) => ru[c] || c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function EditLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [instrument, setInstrument] = useState("GUITAR");
  const [published, setPublished] = useState(false);

  // New topic dialog
  const [topicDialogOpen, setTopicDialogOpen] = useState(false);
  const [topicTitle, setTopicTitle] = useState("");
  const [topicSlug, setTopicSlug] = useState("");
  const [topicDesc, setTopicDesc] = useState("");

  async function loadLesson() {
    const res = await fetch(`/api/lessons/${id}`);
    if (res.ok) {
      const data = await res.json();
      setLesson(data);
      setTitle(data.title);
      setSlug(data.slug);
      setDescription(data.description || "");
      setInstrument(data.instrument);
      setPublished(data.published);
    }
  }

  useEffect(() => { loadLesson(); }, [id]);

  async function saveLesson(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/lessons/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, description, instrument, published }),
    });
    if (res.ok) {
      toast.success("Урок сохранён");
      loadLesson();
    } else {
      toast.error("Ошибка сохранения");
    }
  }

  async function createTopic(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: id,
        title: topicTitle,
        slug: topicSlug || slugify(topicTitle),
        description: topicDesc,
        order: lesson?.topics.length || 0,
      }),
    });
    if (res.ok) {
      toast.success("Тема создана");
      setTopicDialogOpen(false);
      setTopicTitle(""); setTopicSlug(""); setTopicDesc("");
      loadLesson();
    } else {
      toast.error("Ошибка создания");
    }
  }

  async function deleteTopic(topicId: string) {
    if (!confirm("Удалить тему и все блоки теории?")) return;
    await fetch(`/api/topics/${topicId}`, { method: "DELETE" });
    toast.success("Тема удалена");
    loadLesson();
  }

  if (!lesson) return <p className="text-muted-foreground">Загрузка...</p>;

  return (
    <div>
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/admin/lessons")}>
        <ArrowLeft className="h-4 w-4 mr-2" />Назад к урокам
      </Button>

      <h1 className="text-2xl font-bold mb-6">Редактирование урока</h1>

      <form onSubmit={saveLesson} className="space-y-4 max-w-lg mb-8">
        <div>
          <Label>Название</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label>Slug</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
        <div>
          <Label>Описание</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <Label>Инструмент</Label>
          <Select value={instrument} onValueChange={(v) => v && setInstrument(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="GUITAR">Гитара</SelectItem>
              <SelectItem value="BASS">Бас-гитара</SelectItem>
              <SelectItem value="PIANO">Фортепиано</SelectItem>
              <SelectItem value="UKULELE">Укулеле</SelectItem>
              <SelectItem value="GENERAL">Общее</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={published} onCheckedChange={setPublished} />
          <Label>Опубликован</Label>
        </div>
        <Button type="submit">Сохранить</Button>
      </form>

      <Separator className="my-8" />

      {/* Topics */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Темы</h2>
        <Dialog open={topicDialogOpen} onOpenChange={setTopicDialogOpen}>
          <DialogTrigger render={<Button size="sm" />}>
            <Plus className="h-4 w-4 mr-2" />Добавить тему
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новая тема</DialogTitle>
            </DialogHeader>
            <form onSubmit={createTopic} className="space-y-4">
              <div>
                <Label>Название</Label>
                <Input value={topicTitle} onChange={(e) => { setTopicTitle(e.target.value); setTopicSlug(slugify(e.target.value)); }} required />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={topicSlug} onChange={(e) => setTopicSlug(e.target.value)} required />
              </div>
              <div>
                <Label>Описание</Label>
                <Textarea value={topicDesc} onChange={(e) => setTopicDesc(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">Создать</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {lesson.topics.map((topic) => (
          <Card key={topic.id}>
            <CardHeader className="flex-row items-center justify-between py-3">
              <CardTitle className="text-sm">{topic.title}</CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" render={<Link href={`/admin/topics/${topic.id}`} />}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteTopic(topic.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
        {lesson.topics.length === 0 && (
          <p className="text-muted-foreground text-center py-4">Тем пока нет</p>
        )}
      </div>
    </div>
  );
}
