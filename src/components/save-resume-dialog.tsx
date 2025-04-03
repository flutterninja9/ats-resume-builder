// src/components/save-resume-dialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { SavedResume, saveResume } from "@/services/resume-service";
import { ResumeData } from "@/app/page";
import { ResumeTemplateType } from "@/lib/resume-templates";
import { Loader2, Save } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SaveResumeDialogProps {
  resumeData: ResumeData;
  templateId: ResumeTemplateType;
  existingResumeId?: string;
  existingName?: string;
  existingPublicStatus?: boolean;
  onClose: () => void;
  onSaved?: (savedResume: SavedResume) => void;
}

export function SaveResumeDialog({
  resumeData,
  templateId,
  existingResumeId,
  existingName = "",
  existingPublicStatus = false,
  onClose,
  onSaved
}: SaveResumeDialogProps) {
  const { user } = useAuth();
  const [name, setName] = useState(existingName || resumeData.contact.name ? `${resumeData.contact.name}'s Resume` : "My Resume");
  const [isPublic, setIsPublic] = useState(existingPublicStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(!user);

  const handleSave = async () => {
    if (!user) {
      setNeedsAuth(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await saveResume(
        resumeData,
        templateId,
        name,
        isPublic,
        existingResumeId
      );

      if (error) {
        setError(error.message);
      } else if (data && onSaved) {
        onSaved(data);
      }
    } catch {
      setError("Failed to save resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{existingResumeId ? "Update Resume" : "Save Resume"}</DialogTitle>
        </DialogHeader>

        {needsAuth ? (
          <div className="py-6">
            <Alert className="mb-4 bg-amber-50 border-amber-200 text-amber-800">
              <AlertDescription>
                You need to sign in to save resumes.
              </AlertDescription>
            </Alert>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={onClose} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Sign In
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="resume-name">Resume Name</Label>
                <Input
                  id="resume-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Professional Resume"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="public-resume"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
                <Label htmlFor="public-resume">Make resume publicly accessible</Label>
              </div>

              {error && <div className="text-sm text-destructive">{error}</div>}
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Resume
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}