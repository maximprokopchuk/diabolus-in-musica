"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

type Lesson = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  instrument: string;
  order: number;
  published: boolean;
  topics: { id: string }[];
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

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [instrument, setInstrument] = useState("GUITAR");

  async function loadLessons() {
    const res = await fetch("/api/lessons?all=true");
    if (res.ok) setLessons(await res.json());
  }

  useEffect(() => { loadLessons(); }, []);

  async function createLesson(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug: slug || slugify(title),
        description,
        instrument,
        order: lessons.length,
      }),
    });
    if (res.ok) {
      toast.success("Урок создан");
      setDialogOpen(false);
      setTitle(""); setSlug(""); setDescription("");
      loadLessons();
    } else {
      toast.error("Ошибка создания");
    }
  }

  async function togglePublished(id: string, published: boolean) {
    await fetch(`/api/lessons/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    loadLessons();
  }

  async function deleteLesson(id: string) {
    if (!confirm("Удалить урок и все его темы?")) return;
    await fetch(`/api/lessons/${id}`, { method: "DELETE" });
    toast.success("Урок удалён");
    loadLessons();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Уроки</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="h-4 w-4 mr-2" />Новый урок
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать урок</DialogTitle>
            </DialogHeader>
            <form onSubmit={createLesson} className="space-y-4">
              <div>
                <Label>Название</Label>
                <Input value={title} onChange={(e) => { setTitle(e.target.value); setSlug(slugify(e.target.value)); }} required />
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
              <Button type="submit" className="w-full">Создать</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson) => (
          <Card key={lesson.id}>
            <CardHeader className="flex-row items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <CardTitle className="text-base">{lesson.title}</CardTitle>
                <Badge variant="secondary">{lesson.instrument}</Badge>
                {lesson.published ? (
                  <Badge>Опубликован</Badge>
                ) : (
                  <Badge variant="outline">Черновик</Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {lesson.topics.length} тем
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => togglePublished(lesson.id, lesson.published)} title={lesson.published ? "Скрыть" : "Опубликовать"}>
                  {lesson.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" render={<Link href={`/admin/lessons/${lesson.id}`} />}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteLesson(lesson.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
        {lessons.length === 0 && (
          <p className="text-muted-foreground text-center py-8">Уроков пока нет</p>
        )}
      </div>
    </div>
  );
}
