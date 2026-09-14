import React from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Code2,
  Cpu,
  FileCode,
  KeyRound,
  Layers,
  ShieldCheck,
  Trash2,
} from "lucide-react";

export const ReviewHelpTab: React.FC = () => {
  const guideSections = [
    {
      title: "Funktionalität & Qualität",
      items: [
        {
          name: "Styleguide ist eingehalten",
          icon: <FileCode className="w-4 h-4 text-blue-400" />,
          desc: "Einheitliche Einrückungen, saubere Bezeichner (CamelCase/kebab-case), Projektkonventionen und keine Formatierungsbrüche.",
        },
        {
          name: "Unit Tests sind vorhanden",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          desc: "Tests decken die wesentliche Geschäftslogik und Randfälle ab. Keine Fake-Tests ohne Assertions.",
        },
        {
          name: "Akzeptanzkriterien wiederfindbar & überprüft",
          icon: <ShieldCheck className="w-4 h-4 text-rose-400" />,
          desc: "Harter Blocker. Jedes Kriterium aus der Anforderung/User Story muss sich in Testfällen oder im Code eindeutig nachweisen lassen.",
        },
        {
          name: "Klare & verständliche Dokumentation",
          icon: <BookOpen className="w-4 h-4 text-purple-400" />,
          desc: "JavaDoc / JSDoc für öffentliche Schnittstellen, Endpunkte und komplexe Domänenlogik. Keine redundanten Kommentare, die nur den Methodennamen wiederholen.",
        },
      ],
    },
    {
      title: "Code-Hygiene & Standards",
      items: [
        {
          name: "Moderne Sprach-Features",
          icon: <Code2 className="w-4 h-4 text-cyan-400" />,
          desc: "Nutzung moderner Idiome (z. B. Java Records für DTOs, Pattern Matching, Stream-API oder React Hooks) statt veralteter Patterns.",
        },
        {
          name: "Keine premature Optimizations / Over-Engineering",
          icon: <Layers className="w-4 h-4 text-indigo-400" />,
          desc: "Pragmatismus vor übertriebenen Entwurfsmustern. Keine unnötigen Abstraktionsschichten, Generics oder Caches für hypothetische Anforderungen.",
        },
        {
          name: "Keine Hardcoded Secrets / Credentials",
          icon: <KeyRound className="w-4 h-4 text-amber-400" />,
          desc: "Keine API-Keys, Passwörter, Tokens oder sensitive Produktions-URLs im Code oder in Test-Dateien.",
        },
        {
          name: "Keine toten Codefragmente & Debug-Überbleibsel",
          icon: <Trash2 className="w-4 h-4 text-slate-400" />,
          desc: "Kein auskommentierter Code, ungenutzte Imports oder vergessene Debugging-Statements (z. B. console.log, System.out.println).",
        },
        {
          name: "Resource Leak Hygiene (AutoCloseable / Streams)",
          icon: <Cpu className="w-4 h-4 text-rose-400" />,
          desc: "Externe Verbindungen, RESTEasy-Responses, DB-Queries oder IO-Streams müssen zwingend per try-with-resources geschlossen werden.",
        },
      ],
    },
    {
      title: "CI/CD & Integrationstests",
      items: [
        {
          name: "Pipeline erfolgreich / Override",
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          desc: "Ein grüner Build ist Pflicht. Sollte ein bekannter Flaky-Test oder Infrastrukturfehler vorliegen, darf mit expliziter Begründung übersteuert werden.",
        },
      ],
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Review-Kriterien & Prüfpunkte
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Leitfaden und Erläuterungen für die Durchführung eines gründlichen
          Code-Reviews.
        </p>
      </div>

      <div className="space-y-6">
        {guideSections.map((sec, secIdx) => (
          <div key={secIdx} className="space-y-3">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
              {sec.title}
            </span>

            <div className="space-y-2.5">
              {sec.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="p-3 bg-[#0b111e] border border-slate-800/80 rounded-xl space-y-1"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-xs font-bold text-slate-200">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pl-6">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
