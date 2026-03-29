import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, BookOpen, MessageCircle, BarChart3 } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Структурированные уроки",
    description: "От основ до продвинутых тем — пошаговые уроки с теорией и примерами",
  },
  {
    icon: MessageCircle,
    title: "AI-ассистент",
    description: "Задавайте вопросы по теме урока и получайте мгновенные объяснения",
  },
  {
    icon: BarChart3,
    title: "Отслеживание прогресса",
    description: "Отмечайте пройденные темы и следите за своим развитием",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-primary/10 p-4">
              <Music className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Diabolus in Musica
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Изучайте теорию музыки для гитары с интерактивными уроками и AI-ассистентом.
            От нот и интервалов до сложных гармонических концепций.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" render={<Link href="/lessons" />}>
              Начать обучение
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/register" />}>
              Создать аккаунт
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">Возможности</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
