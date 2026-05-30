"use client";

import { useState, type ReactNode } from "react";

interface AccordionItem {
  title: string;
  content: ReactNode;
  defaultOpen?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(
    new Set(items.map((_, i) => (items[i].defaultOpen ? i : -1)).filter((i) => i >= 0))
  );

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        if (!allowMultiple) {
          next.clear();
        }
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
      {items.map((item, index) => {
        const isOpen = openItems.has(index);
        return (
          <div key={index}>
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between py-4 text-left transition-colors hover:text-[var(--accent)]"
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${index}`}
            >
              <span className="font-serif font-semibold text-base">
                {item.title}
              </span>
              <svg
                className={`w-4 h-4 transition-transform duration-[var(--transition-base)] ${
                  isOpen ? "rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div
              id={`accordion-content-${index}`}
              className={`overflow-hidden transition-all duration-[var(--transition-slow)] ${
                isOpen ? "max-h-[500px] pb-4" : "max-h-0"
              }`}
              role="region"
              aria-hidden={!isOpen}
            >
              <div className="text-sm text-[var(--muted)] leading-relaxed">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
