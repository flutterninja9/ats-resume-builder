import { ResumeData } from '@/app/page';
import { ResumeTemplateType } from '@/lib/resume-templates';
import { supabase } from '@/lib/supabase';

export interface SavedResume {
  id: string;
  name: string;
  data: ResumeData;
  template_id: ResumeTemplateType;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Save a new resume or update an existing one
 */
export async function saveResume(
  resumeData: ResumeData, 
  templateId: ResumeTemplateType, 
  name: string = 'My Resume', 
  isPublic: boolean = false,
  resumeId?: string
): Promise<{ data: SavedResume | null; error: Error | null }> {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    // If resumeId is provided, update existing resume
    if (resumeId) {
      const { data, error } = await supabase
        .from('saved_resumes')
        .update({
          name,
          data: resumeData,
          template_id: templateId,
          is_public: isPublic,
          updated_at: new Date().toISOString()
        })
        .eq('id', resumeId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return { data: data as SavedResume, error: null };
    } 
    // Otherwise create a new resume
    else {
      const { data, error } = await supabase
        .from('saved_resumes')
        .insert({
          user_id: user.id,
          name,
          data: resumeData,
          template_id: templateId,
          is_public: isPublic
        })
        .select()
        .single();

      if (error) throw error;
      return { data: data as SavedResume, error: null };
    }
  } catch (error) {
    console.error('Error saving resume:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Get all resumes for the current user
 */
export async function getUserResumes(): Promise<{ data: SavedResume[] | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('saved_resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return { data: data as SavedResume[], error: null };
  } catch (error) {
    console.error('Error fetching user resumes:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Get a specific resume by ID
 */
export async function getResumeById(resumeId: string): Promise<{ data: SavedResume | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('saved_resumes')
      .select('*')
      .eq('id', resumeId)
      .single();

    if (error) throw error;
    return { data: data as SavedResume, error: null };
  } catch (error) {
    console.error('Error fetching resume:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Delete a resume by ID
 */
export async function deleteResume(resumeId: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: new Error('User not authenticated') };
    }

    const { error } = await supabase
      .from('saved_resumes')
      .delete()
      .eq('id', resumeId)
      .eq('user_id', user.id);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting resume:', error);
    return { success: false, error: error as Error };
  }
}

/**
 * Track a resume download for analytics
 */
export async function trackResumeDownload(templateId: ResumeTemplateType): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const isAuthenticated = !!user;
    
    // Call the stored procedure to track the download
    await supabase.rpc('track_resume_download', { 
      template_id: templateId,
      is_authenticated: isAuthenticated
    });
  } catch (error) {
    console.error('Error tracking resume download:', error);
    // Don't throw - analytics errors shouldn't block the user
  }
}

/**
 * Check if the user has a premium subscription
 */
export async function checkPremiumStatus(): Promise<{ isPremium: boolean; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { isPremium: false, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    
    // Check if the user has an active premium subscription
    const isPremium = data.status === 'active' && data.plan === 'premium';
    return { isPremium, error: null };
  } catch (error) {
    console.error('Error checking premium status:', error);
    return { isPremium: false, error: error as Error };
  }
}

/**
 * Get all available templates (both free and premium)
 */
export async function getAvailableTemplates(): Promise<{ 
  data: { id: string; name: string; description: string; isPremium: boolean; }[] | null; 
  error: Error | null 
}> {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('id, name, description, is_premium')
      .order('is_premium', { ascending: true });

    if (error) throw error;
    
    // Transform data to match the expected format
    const templates = data.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      isPremium: template.is_premium
    }));
    
    return { data: templates, error: null };
  } catch (error) {
    console.error('Error fetching templates:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Save Resume Dialog Component - To add to your UI when implementing the save feature
 * Example usage:
 * 
 * // In your component:
 * const [showSaveDialog, setShowSaveDialog] = useState(false);
 * 
 * // Add this button:
 * <Button onClick={() => setShowSaveDialog(true)}>Save Resume</Button>
 * 
 * // Add this at the end of your component:
 * {showSaveDialog && (
 *   <SaveResumeDialog
 *     resumeData={resumeData}
 *     templateId={selectedTemplate}
 *     onClose={() => setShowSaveDialog(false)}
 *     onSaved={(savedResume) => {
 *       setShowSaveDialog(false);
 *       // Handle successful save
 *     }}
 *   />
 * )}
 */

/*
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { SavedResume, saveResume } from "@/services/resume-service";
import { ResumeData } from "@/app/page";
import { ResumeTemplateType } from "@/lib/resume-templates";
import { Loader2 } from "lucide-react";

interface SaveResumeDialogProps {
  resumeData: ResumeData;
  templateId: ResumeTemplateType;
  existingResumeId?: string;
  existingName?: string;
  existingPublicStatus?: boolean;
  onClose: () => void;
  onSaved: (savedResume: SavedResume) => void;
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
  const [name, setName] = useState(existingName || resumeData.contact.name ? `${resumeData.contact.name}'s Resume` : "My Resume");
  const [isPublic, setIsPublic] = useState(existingPublicStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
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
      } else if (data) {
        onSaved(data);
      }
    } catch (err) {
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
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
              </>
            ) : (
              'Save Resume'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
*/