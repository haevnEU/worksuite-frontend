import React from "react";
import { getCategoryBadgeStyle } from "./HttpStatusCard";
import { HttpStatusCode } from "../models/http.model.ts";
import { Drawer } from "../../../shared/components/Drawer";
import { JavaSnippetFooter } from "./JavaSnippetFooter.tsx";

interface HttpStatusDrawerProps {
  item: HttpStatusCode | null;
  onClose: () => void;
}

export const HttpStatusDrawer: React.FC<HttpStatusDrawerProps> = ({
  item,
  onClose,
}) => {
  if (!item) return null;

  return (
    <Drawer
      isOpen={Boolean(item)}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black font-mono text-white tracking-tight">
            {item.code}
          </span>
          <span
            className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded border ${getCategoryBadgeStyle(item.category)}`}
          >
            {item.category}
          </span>
        </div>
      }
      subtitle={
        <h2 className="text-sm font-bold text-slate-200">{item.phrase}</h2>
      }
      footer={<JavaSnippetFooter code={item.code} phrase={item.phrase} />}
    >
      <section className="space-y-1.5">
        <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">
          Specification
        </span>
        <p className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 leading-relaxed">
          {item.description}
        </p>
      </section>
      {/* Restlicher fachlicher Content */}
    </Drawer>
  );
};
