"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
type Block = {
  id: string;
  type: "TEXT" | "IMAGE" | "NOTATION" | "CODE_EXAMPLE";
  content: string;
  metadata: unknown;
};

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto my-4 rounded-lg border border-border">
      {children}
    </div>
  );
}

export function TheoryBlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "TEXT":
      return (
        <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-xl prose-h3:text-lg prose-h2:mt-8 prose-h2:mb-3 prose-h3:mt-6 prose-h3:mb-2 prose-p:leading-7 prose-li:leading-7 prose-table:text-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ children }) => (
                <TableWrapper>
                  <table>{children}</table>
                </TableWrapper>
              ),
            }}
          >
            {block.content}
          </ReactMarkdown>
        </div>
      );

    case "IMAGE": {
      const meta = block.metadata as { alt?: string; width?: number; height?: number } | null | undefined;
      return (
        <figure className="my-4">
          <Image
            src={block.content}
            alt={meta?.alt || "Иллюстрация"}
            width={meta?.width || 600}
            height={meta?.height || 400}
            className="rounded-lg border"
          />
          {meta?.alt && (
            <figcaption className="text-sm text-muted-foreground mt-2 text-center">
              {meta.alt}
            </figcaption>
          )}
        </figure>
      );
    }

    case "NOTATION":
      return (
        <div className="my-4 p-4 bg-muted rounded-lg font-mono text-sm whitespace-pre-wrap overflow-x-auto">
          {block.content}
        </div>
      );

    case "CODE_EXAMPLE":
      return (
        <pre className="my-4 p-4 bg-muted rounded-lg overflow-x-auto">
          <code className="text-sm">{block.content}</code>
        </pre>
      );

    default:
      return null;
  }
}
