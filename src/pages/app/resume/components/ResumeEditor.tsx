"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import type { ResumeRow } from "./../types";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import TextAlign from "@tiptap/extension-text-align";
import { PageCanvas } from "./PageCanvas";
import Small from "@/components/custom-extension/small";
import "@/styles/styles.scss";
import { supabase } from "@/lib/supabase-client";

interface ResumeEditorProps {
  resume: ResumeRow[];
  onSave: () => void;
}

export default function ResumeEditor({ resume, onSave }: ResumeEditorProps) {
  console.log(resume);

  return <div>resume editor</div>;
}
