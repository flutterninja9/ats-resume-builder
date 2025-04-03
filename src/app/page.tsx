"use client";

import { ProtectedDownloadButton } from "@/components/auth/protected-download-button";
import { UserProfileButton } from "@/components/auth/user-profile-button";
import { ResumeForm } from "@/components/resume-form";
import { ResumePreview } from "@/components/resume-preview";
import { TemplateSelector } from "@/components/resume-selector";
import { SaveResumeDialog } from "@/components/save-resume-dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { resumeTemplates, ResumeTemplateType } from "@/lib/resume-templates";
import { Book, FileText, Grid, PanelRight, Save } from "lucide-react";
import { useEffect, useState } from "react";

// Define your types (ensure these match types in other files)
interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolio: string;
}
interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
}
interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  details: string;
}
export interface ResumeData {
  contact: ContactInfo;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string;
} // Export if needed elsewhere

// Initial state with one empty entry for experience and education
const initialResumeData: ResumeData = {
  contact: { name: "", email: "", phone: "", linkedin: "", portfolio: "" },
  experience: [
    {
      id: crypto.randomUUID(),
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      responsibilities: "",
    },
  ],
  education: [
    {
      id: crypto.randomUUID(),
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
      details: "",
    },
  ],
  skills: "",
};

// Default template - use the ID of the first template in the array
const defaultTemplateId =
  (resumeTemplates[0]?.id as ResumeTemplateType) || "classic"; // Fallback ID

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplateType>(defaultTemplateId);
  
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [activeView, setActiveView] = useState("split"); // 'form', 'preview', or 'split'
  const { isLoading } = useAuth(); // Get loading state from auth context

  useEffect(() => {
    setIsClient(true);

    // Add event listener for keyboard shortcuts (keep existing logic)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to switch to split view
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        setActiveView("split");
      }
      // Ctrl/Cmd + F to switch to form view
      else if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        setActiveView("form");
      }
      // Ctrl/Cmd + P to switch to preview view
      else if ((e.ctrlKey || e.metaKey) && e.key === "p" && !e.shiftKey) {
        e.preventDefault();
        setActiveView("preview");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  

  // ViewToggle remains the same
  const ViewToggle = () => (
    <div className="inline-flex rounded-md shadow-sm bg-muted">
      <Button
        variant={activeView === "form" ? "default" : "outline"}
        size="sm"
        className={`rounded-l-md rounded-r-none ${
          activeView === "form" ? "bg-primary text-primary-foreground" : ""
        }`}
        onClick={() => setActiveView("form")}
      >
        <FileText className="h-4 w-4 mr-1" /> Form
      </Button>
      <Button
        variant={activeView === "split" ? "default" : "outline"}
        size="sm"
        className={`rounded-none border-x-0 ${
          activeView === "split" ? "bg-primary text-primary-foreground" : ""
        }`}
        onClick={() => setActiveView("split")}
      >
        <Grid className="h-4 w-4 mr-1" /> Split
      </Button>
      <Button
        variant={activeView === "preview" ? "default" : "outline"}
        size="sm"
        className={`rounded-r-md rounded-l-none ${
          activeView === "preview" ? "bg-primary text-primary-foreground" : ""
        }`}
        onClick={() => setActiveView("preview")}
      >
        <PanelRight className="h-4 w-4 mr-1" /> Preview
      </Button>
    </div>
  );

  // If auth is still loading, we could show a loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-muted rounded mb-4"></div>
          <div className="h-4 w-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12 bg-gradient-to-b from-background to-muted/60">
      <div className="w-full max-w-7xl mb-6">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              ATS-Friendly Resume Builder
            </h1>
            <p className="text-muted-foreground mt-1">
              Create a professional, recruiter-approved resume in minutes
            </p>
          </div>

          {/* User Profile Button - Move to top right corner */}
          <UserProfileButton />
        </div>

        {/* Control Panel in a Card for better organization */}
        <div className="bg-card mb-4 mt-4 border rounded-lg p-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-2 flex-wrap items-center">
              <ViewToggle />
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
              />
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <ProtectedDownloadButton
                resumeData={resumeData}
                selectedTemplate={selectedTemplate}
                pdfError={pdfError}
                setPdfError={setPdfError}
                isClient={isClient}
              />
              <Button
                onClick={() => setShowSaveDialog(true)}
                variant="outline"
                className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700"
              >
                <Save className="mr-2 h-4 w-4" /> Save Resume
              </Button>
            </div>
          </div>
        </div>

        {/* Tips Banner (remains the same) */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4 mb-6 text-sm">
          <h3 className="font-medium text-blue-800 dark:text-blue-400 flex items-center">
            <Book className="h-4 w-4 mr-2" /> Pro Tips for an ATS-Friendly
            Resume
          </h3>
          <ul className="mt-2 space-y-1 text-muted-foreground ml-6 list-disc">
            <li>
              Use standard headings like &quot;Experience,&quot;
              &quot;Education,&quot; and &quot;Skills&quot;
            </li>
            <li>
              Avoid tables, graphics, and complex formatting (especially for
              PDF)
            </li>
            <li>Include keywords from the job description</li>
            <li>
              Use bullet points (start lines with &apos;-&apos;) to highlight
              achievements
            </li>
            <li>Choose simpler templates for maximum ATS compatibility</li>
          </ul>
        </div>
      </div>

      {/* Main Content Area (Form/Preview) */}
      <div
        className={`w-full max-w-7xl flex-grow ${
          activeView === "split"
            ? "grid grid-cols-1 lg:grid-cols-2 gap-8"
            : "flex"
        }`}
      >
        {/* Form Section */}
        {(activeView === "form" || activeView === "split") && (
          <div
            className={`${
              activeView === "split"
                ? "h-[calc(100vh-250px)] lg:h-auto overflow-y-auto pr-2"
                : "w-full" // Adjusted height and added padding for scrollbar
            } scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-muted/30`}
          >
            {" "}
            {/* Added scrollbar styling */}
            <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
          </div>
        )}

        {/* Preview Section */}
        {(activeView === "preview" || activeView === "split") && (
          <div
            className={`${
              activeView === "split"
                ? "h-[calc(100vh-250px)] lg:h-auto overflow-y-auto relative pl-2"
                : "w-full relative" // Adjusted height, added relative, added padding
            } scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-muted/30`}
          >
            {" "}
            {/* Added scrollbar styling */}
            <ResumePreview
              data={resumeData}
              selectedTemplateId={selectedTemplate}
            />
          </div>
        )}
      </div>

      {/* Footer (remains the same) */}
      <div className="w-full max-w-7xl mt-8 pt-6 border-t border-muted">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div>ATS-Friendly Resume Builder MVP</div>
          <div>
            <span className="text-xs">Keyboard shortcuts: </span>
            <kbd className="px-1.5 py-0.5 text-xs rounded border bg-muted">
              Ctrl+F
            </kbd>
            <span className="mx-1 text-xs">Form</span>
            <kbd className="px-1.5 py-0.5 text-xs rounded border bg-muted">
              Ctrl+S
            </kbd>
            <span className="mx-1 text-xs">Split</span>
            <kbd className="px-1.5 py-0.5 text-xs rounded border bg-muted">
              Ctrl+P
            </kbd>
            <span className="mx-1 text-xs">Preview</span>
          </div>
        </div>
      </div>
      {showSaveDialog && (
        <SaveResumeDialog
          resumeData={resumeData}
          templateId={selectedTemplate}
          onClose={() => setShowSaveDialog(false)}
          onSaved={() => {
            setShowSaveDialog(false);
            // You could add a success notification here
          }}
        />
      )}
    </main>
  );
}
