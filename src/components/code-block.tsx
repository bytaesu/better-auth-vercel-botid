"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Check, Copy, File, FileCode, FileText } from "lucide-react";

const Icons = {
  check: Check,
  copy: Copy,
  file: File,
  javascript: FileCode,
  typescript: FileCode,
  css: FileText,
};

interface FileBlock {
  title: string;
  code: string;
  language?: string;
}

interface CodeBlockProps {
  files: FileBlock[];
  defaultTitle?: string;
  className?: string;
}

// Token colors come from CSS variables so the theme follows light/dark without reading the DOM.
const codeTheme = {
  ...nightOwl,
  'pre[class*="language-"]': {
    ...nightOwl['pre[class*="language-"]'],
    background: "transparent",
  },
  'code[class*="language-"]': {
    ...nightOwl['code[class*="language-"]'],
    color: "var(--foreground)",
    fontFamily: "var(--font-mono)",
  },
  comment: { color: "var(--muted-foreground)", fontStyle: "italic" },
  punctuation: { color: "var(--muted-foreground)" },
  operator: { color: "var(--muted-foreground)" },
  property: { color: "var(--code-property)" },
  string: { color: "var(--code-string)" },
  keyword: { color: "var(--code-keyword)" },
  function: { color: "var(--code-function)" },
  boolean: { color: "var(--code-keyword)" },
  number: { color: "var(--code-keyword)" },
  "class-name": { color: "var(--code-function)" },
  "maybe-class-name": { color: "var(--code-function)" },
};

export function CodeBlock({ files, defaultTitle, className }: CodeBlockProps) {
  const [activeTitle, setActiveTitle] = useState(
    defaultTitle || files[0]?.title,
  );
  const [copied, setCopied] = useState(false);

  const activeFile = files.find((file) => file.title === activeTitle);
  const code = activeFile?.code || "";
  const language =
    activeFile?.language || getLanguageFromFileName(activeTitle || "");

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-lg border bg-card text-card-foreground",
        "backdrop-blur-md",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex gap-2">
          {files.map(({ title }) => (
            <Button
              key={title}
              variant={title === activeTitle ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTitle(title)}
              className="gap-2"
            >
              <FileIcon fileName={title} />
              <span className="hidden sm:inline">{title}</span>
            </Button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => copyToClipboard(code)}
          className="h-8 w-8"
        >
          {copied ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Icons.check className="h-4 w-4" />
            </motion.div>
          ) : (
            <Icons.copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="max-h-[400px] overflow-auto">
        <SyntaxHighlighter
          language={language}
          style={codeTheme}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.8125rem",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

function getLanguageFromFileName(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase();
  const languageMap: Record<string, string> = {
    js: "javascript",
    jsx: "jsx",
    ts: "typescript",
    tsx: "typescript",
    html: "html",
    css: "css",
    json: "json",
  };
  return languageMap[ext || ""] || "javascript";
}

function FileIcon({ fileName }: { fileName: string }) {
  const ext = fileName.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "js":
    case "jsx":
      return <Icons.javascript className="h-4 w-4" />;
    case "ts":
    case "tsx":
      return <Icons.typescript className="h-4 w-4" />;
    case "css":
      return <Icons.css className="h-4 w-4" />;
    default:
      return <Icons.file className="h-4 w-4" />;
  }
}
