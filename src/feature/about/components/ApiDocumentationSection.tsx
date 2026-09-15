import React from "react";
import { BookOpen, Shield, Server, ArrowRight } from "lucide-react";

export const ApiDocumentationSection: React.FC = () => {
    return (
        <section className="py-8 space-y-6">
            {/* Sektions-Header */}
            <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    API Documentation
                </h2>
                <p className="text-sm text-slate-400">
                    Entdecke unsere REST-APIs über die interaktive OpenAPI (Swagger UI) Dokumentation.
                </p>
            </div>

            {/* Grid für die Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">

                {/* Card 1: Auth & Identity API */}
                <a
                    href="/doc/auth"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50 transition-all"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                                    Identity API
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Authentifizierung, JWT, Benutzer & Lizenzen.
                                </p>
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
                    </div>
                </a>

                {/* Card 2: Main Service API */}
                <a
                    href="/doc/service"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50 transition-all"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                                <Server className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                                    Core Service API
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Hauptgeschäftslogik, Ressourcen & Workspaces.
                                </p>
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
                    </div>
                </a>

            </div>
        </section>
    );
};