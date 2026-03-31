import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, MessageCircle, BarChart3 } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { getSession } from "@/lib/auth-guard";

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

export default async function HomePage() {
  const session = await getSession();
  if (session?.user) redirect("/lessons");
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative py-24 md:py-40 overflow-hidden">
        {/* Radial gradient spotlight */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-primary/8 blur-3xl" />
        </div>

        {/* Decorative staff lines */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          {[0, 12, 24, 36, 48].map((offset) => (
            <div
              key={offset}
              className="absolute left-0 right-0 h-px bg-foreground/4"
              style={{ top: `calc(42% + ${offset}px)` }}
            />
          ))}
        </div>

        <div className="container relative mx-auto px-4 text-center">
          {/* Logo mark */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-2xl bg-primary/25 scale-[2]" />
              <div className="relative rounded-full bg-primary/10 border border-primary/20 p-5">
                <Logo className="h-14 w-14 text-primary" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
            <span className="text-primary">Diabolus</span>
            {" "}
            <span className="text-foreground/80">in Musica</span>
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-3">
            Теория музыки для гитаристов
          </p>
          <p className="text-sm text-muted-foreground/70 max-w-lg mx-auto mb-10">
            От нот и интервалов до сложных гармонических концепций —
            с интерактивными уроками и AI-ассистентом.
          </p>

          {/* CTA */}
          <div className="flex gap-3 justify-center flex-wrap">
            <Button size="lg" render={<Link href="/lessons" />}>
              Начать обучение
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/register" />}>
              Создать аккаунт
            </Button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-4">
        <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-xs font-semibold text-center text-muted-foreground mb-10 tracking-widest uppercase">
            Возможности
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/60 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-3">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
