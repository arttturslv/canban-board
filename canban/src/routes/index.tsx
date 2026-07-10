/** @format */

import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { useState } from "react";
import { ArrowRight, Layers, Tag, Brain } from "lucide-react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [hovered, setHovered] = useState<number | null>(null);
  const navigate = useNavigate();

  const goToBoard = () => {
    navigate({ to: "/kanban" });
  };

  return (
    <div
      className="min-h-screen bg-[#211E21] text-zinc-100"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Nav boardRedirect={goToBoard} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pb-24 pt-36">
        {/* Ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
          style={{
            width: 900,
            height: 600,
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3.5 py-1.5 text-xs font-medium text-violet-400">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            Gratuito para usar
          </div>

          {/* Headline */}
          <h1
            className="mx-auto mb-6 max-w-3xl text-5xl font-extrabold leading-[1.08] tracking-tight text-foreground md:text-6xl lg:text-7xl"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Gerencie suas tarefas{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #4f46e5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              visualmente.
            </span>{" "}
            Zero atrito.{" "}
          </h1>

          {/* Sub-headline */}
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Vá além das listas de tarefas tradicionais. Organize projetos em
            colunas, defina prioridades instantaneamente e acompanhe o progresso
            do início ao fim.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={goToBoard}
              className="group flex items-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-900/40 transition-all hover:bg-violet-500 hover:shadow-violet-900/60 active:scale-95"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Comece a organizar — É gratis
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Veja como funciona{" "}
            </a>
          </div>
        </div>

        {/* Kanban mockup */}
        <div className="mx-auto mt-16 max-w-5xl px-6">
          <KanbanMockup />
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-28">
        <div className="mx-auto max-w-5xl px-6">
          {/* Section header */}
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
              Por que Canban
            </p>
            <h2
              className="text-4xl font-bold tracking-tight text-foreground md:text-5xl"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Criado para trabalho focado{" "}
            </h2>
          </div>

          {/* Cards */}
          <div className="grid gap-5 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className={`group relative cursor-default rounded-2xl border border-white/[0.07] bg-card p-7 transition-all duration-300 hover:border-white/13 ${f.glow} hover:shadow-2xl`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  transform:
                    hovered === i ? "translateY(-3px)" : "translateY(0)",
                  transition:
                    "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                }}
              >
                <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/8">
                  {f.icon}
                </div>
                <h3
                  className="mb-3 text-lg font-semibold text-foreground"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof strip ── */}
      <section className="border-y border-white/6 bg-white/2 py-14">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {[
              { num: "12k+", label: "Active teams" },
              { num: "480k", label: "Tasks completed" },
              { num: "4.9 ★", label: "Average rating" },
              { num: "< 1s", label: "Load time" },
            ].map(({ num, label }) => (
              <div key={label}>
                <p
                  className="text-3xl font-bold tracking-tight text-foreground"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  {num}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden py-36">
        {/* Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 700,
            height: 500,
            background:
              "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(124,58,237,0.15) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
            Comece hoje mesmo
          </p>
          <h2
            className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Pronto para dominar sua rotina?
          </h2>
          <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
            Crie seu primeiro quadro em menos de 60 segundos. Sem configuração.
            Sem ruído. Apenas clareza.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={goToBoard}
              className="group flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-violet-950/60 transition-all hover:bg-violet-500 active:scale-95"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Crie seu primeiro quadro
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
            {/* <button className="rounded-xl border border-white/[0.1] bg-white/[0.04] px-8 py-4 text-base font-medium text-muted-foreground transition-all hover:border-white/[0.18] hover:text-foreground">
              Sign in
            </button> */}
          </div>

          <p className="mt-6 text-xs text-muted-foreground/50">
            Gratis para sempre.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <img
              src="https://i.imgur.com/jBbbWDt.png"
              className="flex h-7 w-7 items-center justify-center rounded "
            ></img>
            <span className="font-medium text-foreground/60">Canban</span>
          </div>
          <div className="flex gap-6">
            {[
              { title: "Privacidade", url: "/" },
              { title: "Changelog", url: "/" },
              { title: "Contato", url: "https:artttur.com" },
            ].map((l) => (
              <a
                key={l.title}
                target={l.url !== "/" ? "_blank" : "_self"}
                href={l.url}
                className="transition-colors hover:text-foreground"
              >
                {l.title}
              </a>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/40">
            © 2026 Canban. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

function KanbanMockup() {
  return (
    <img
      className="relative w-full overflow-hidden rounded-2xl border border-white/8 bg-[#141318]"
      style={{
        boxShadow:
          "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
      }}
      src="https://i.imgur.com/SSpUlCZ.png"
    />
  );
}

const FEATURES = [
  {
    icon: <Layers size={20} className="text-violet-400" />,
    title: "Fluxo de Trabalho Visual",
    desc: "Arraste e solte tarefas entre colunas. Veja seu progresso rapidamente, sem abrir nenhum menu.",
    glow: "group-hover:shadow-violet-500/10",
  },
  {
    icon: <Tag size={20} className="text-emerald-400" />,
    title: "Prioridades claras",
    desc: "Use etiquetas de prioridade — Baixa, Média, Alta, Urgente — para saber sempre exatamente por onde começar todas as manhãs.",
    glow: "group-hover:shadow-emerald-500/10",
  },
  {
    icon: <Brain size={20} className="text-sky-400" />,
    title: "Organize sua mente",
    desc: "Reduza a ansiedade diária. Centralize tudo em um ambiente limpo e focado, projetado para o trabalho profundo.",
    glow: "group-hover:shadow-sky-500/10",
  },
];

interface NavProps {
  boardRedirect: () => void;
}
function Nav({ boardRedirect }: NavProps) {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/6 bg-[#121212]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <img
            className="flex h-7 w-7 items-center justify-center rounded-lg "
            src="https://i.imgur.com/jBbbWDt.png"
          ></img>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Canban
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* <a
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in
          </a> */}
          <button
            onClick={boardRedirect}
            className="rounded-lg bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-violet-500 active:scale-95"
          >
            Comece agora{" "}
          </button>
        </div>
      </div>
    </nav>
  );
}
