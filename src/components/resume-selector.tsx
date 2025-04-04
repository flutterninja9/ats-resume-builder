'use client';

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ResumeTemplate, resumeTemplates, ResumeTemplateType } from '@/lib/resume-templates';
import { Check, Lock, Palette } from 'lucide-react';
import { useState, useEffect } from "react";
import { TemplateLock } from "@/components/template-lock";
import { getUserPurchasedTemplates } from "@/services/template-service";
import { useAuth } from "@/context/auth-context";
import { FREE_TEMPLATE_ID } from "@/lib/pricing";

interface TemplateSelectProps {
    selectedTemplate: ResumeTemplateType;
    onSelectTemplate: (templateId: ResumeTemplateType) => void;
}

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectProps) {
    const { user } = useAuth();
    const [purchasedTemplates, setPurchasedTemplates] = useState<string[]>([FREE_TEMPLATE_ID]);
    const [isLoading, setIsLoading] = useState(true);
    const [showPaymentPrompt, setShowPaymentPrompt] = useState(false);
    const [templateToUnlock, setTemplateToUnlock] = useState<ResumeTemplateType | null>(null);

    useEffect(() => {
        async function loadPurchasedTemplates() {
            if (user) {
                setIsLoading(true);
                try {
                    const templates = await getUserPurchasedTemplates();
                    setPurchasedTemplates(templates);
                } catch (error) {
                    console.error("Error loading purchased templates:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setPurchasedTemplates([FREE_TEMPLATE_ID]);
                setIsLoading(false);
            }
        }

        loadPurchasedTemplates();
    }, [user]);

    const hasAccessToTemplate = (templateId: string) => {
        return purchasedTemplates.includes(templateId);
    };

    const handleTemplateSelection = (templateId: ResumeTemplateType) => {
        if (templateId !== FREE_TEMPLATE_ID && !hasAccessToTemplate(templateId)) {
            // This is a premium template that hasn't been purchased
            setTemplateToUnlock(templateId);
            setShowPaymentPrompt(true);
        } else {
            // This is a free template or already purchased
            onSelectTemplate(templateId);
        }
    };

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 bg-background/80 backdrop-blur-sm"
                        aria-label="Change resume template"
                    >
                        <Palette className="h-4 w-4" />
                        <span>Change Template</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/30">
                    <div className="space-y-4">
                        <h4 className="font-medium leading-none text-center text-sm mb-4">Choose a Template</h4>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {resumeTemplates.map((template) => (
                                <TemplateCard
                                    key={template.id}
                                    template={template}
                                    isSelected={selectedTemplate === template.id}
                                    isLocked={!hasAccessToTemplate(template.id) && template.id !== FREE_TEMPLATE_ID}
                                    onSelect={() => handleTemplateSelection(template.id as ResumeTemplateType)}
                                />
                            ))}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            
            {showPaymentPrompt && templateToUnlock && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                    <TemplateLock
                        templateId={templateToUnlock}
                        templateName={resumeTemplates.find(t => t.id === templateToUnlock)?.name || 'Premium Template'}
                        onUnlocked={() => {
                            // Update the purchased templates list
                            setPurchasedTemplates([...purchasedTemplates, templateToUnlock]);
                            // Select the template
                            onSelectTemplate(templateToUnlock);
                            // Hide the payment prompt
                            setShowPaymentPrompt(false);
                            setTemplateToUnlock(null);
                        }}
                    />
                    <Button 
                        className="absolute top-4 right-4 bg-white text-black"
                        onClick={() => {
                            setShowPaymentPrompt(false);
                            setTemplateToUnlock(null);
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            )}
        </>
    );
}

interface TemplateCardProps {
    template: ResumeTemplate;
    isSelected: boolean;
    isLocked?: boolean;
    onSelect: () => void;
}

function TemplateCard({ template, isSelected, isLocked, onSelect }: TemplateCardProps) {
    return (
        <div
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            aria-label={`Select ${template.name} template${isLocked ? ' (locked)' : ''}`}
            className={`
                relative cursor-pointer rounded-md overflow-hidden border-2 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                ${isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-muted-foreground/50'}
            `}
            onClick={onSelect}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(); }}
        >
            {/* Lock overlay for premium templates */}
            {isLocked && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <div className="bg-background/80 rounded-full p-1.5">
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                </div>
            )}

            {/* Placeholder image / Color Preview */}
            <div
                className="h-32 w-full bg-card flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: template.colors.background }}
            >
                {/* Fallback Color Blocks (shown if image fails or isn't primary content) */}
                <div className="relative z-10 flex flex-col items-center justify-center space-y-1 p-2 w-3/4 h-3/4 bg-background/50 backdrop-blur-sm rounded">
                    <div
                        className="w-full h-2 rounded-sm shadow"
                        style={{ backgroundColor: template.colors.primary }}
                        title={`Primary: ${template.colors.primary}`}
                    />
                    <div
                        className="w-3/4 h-2 rounded-sm shadow"
                        style={{ backgroundColor: template.colors.secondary }}
                        title={`Secondary: ${template.colors.secondary}`}
                    />
                    <div className="flex items-center gap-1 pt-1 w-full">
                        <div
                            className="w-4 h-4 rounded-full shadow"
                            style={{ backgroundColor: template.colors.accent }}
                            title={`Accent: ${template.colors.accent}`}
                        />
                        <div
                            className="flex-1 h-1 rounded-sm shadow"
                            style={{ backgroundColor: template.colors.text }}
                            title={`Text: ${template.colors.text}`}
                        />
                    </div>
                </div>
            </div>

            <div className="p-2 bg-background">
                <div className="flex justify-between items-center">
                    <h4 className="font-medium text-xs truncate">{template.name}</h4>
                    {isSelected && (
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    )}
                </div>
            </div>
        </div>
    );
}