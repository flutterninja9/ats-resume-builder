'use client';

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Import Popover components
import { ResumeTemplate, resumeTemplates, ResumeTemplateType } from '@/lib/resume-templates';
import { Check, Palette } from 'lucide-react';
// Removed useState as Popover handles its own state
// Removed ChevronLeft, ChevronRight as pagination is removed

interface TemplateSelectProps {
    selectedTemplate: ResumeTemplateType;
    onSelectTemplate: (templateId: ResumeTemplateType) => void;
}

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectProps) {
    // Removed all pagination state and logic: isOpen, activePage, itemsPerPage, totalPages, handleNextPage, handlePrevPage, visibleTemplates

    return (
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
            <PopoverContent className="w-auto p-4 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/30"> {/* Adjust width, padding, add scroll if many templates */}
                <div className="space-y-4">
                    <h4 className="font-medium leading-none text-center text-sm mb-4">Choose a Template</h4>
                    {/* Removed Close button - Popover closes on clicking outside or trigger */}

                    {/* Display all templates in a grid, adjusting columns as needed */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {resumeTemplates.map((template) => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                isSelected={selectedTemplate === template.id}
                                // Selecting a template calls the handler and the Popover will close automatically
                                onSelect={() => {
                                    onSelectTemplate(template.id as ResumeTemplateType); // Use Option 2 fix (interface modification) assumed
                                    // Or: onSelectTemplate(template.id as ResumeTemplateType); // If using Option 1 fix
                                    // No need to manually set isOpen(false)
                                }}
                            />
                        ))}
                    </div>

                    {/* Removed pagination controls */}
                </div>
            </PopoverContent>
        </Popover>
    );
}

// --- TemplateCard Component (Mostly the same, minor style tweaks possible) ---

interface TemplateCardProps {
    template: ResumeTemplate;
    isSelected: boolean;
    onSelect: () => void;
}

function TemplateCard({ template, isSelected, onSelect }: TemplateCardProps) {
    return (
        <div
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            aria-label={`Select ${template.name} template`}
            className={`
                relative cursor-pointer rounded-md overflow-hidden border-2 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                ${isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-muted-foreground/50'}
            `}
            onClick={onSelect}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(); }} // Basic keyboard accessibility
        >
            {/* Placeholder image / Color Preview */}
            <div
                className="h-32 w-full bg-card flex items-center justify-center relative overflow-hidden" // Use bg-card for fallback
                 style={{ backgroundColor: template.colors.background }} // Use template background
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

            <div className="p-2 bg-background"> {/* Ensure text bg matches popover */}
                <div className="flex justify-between items-center">
                    <h4 className="font-medium text-xs truncate">{template.name}</h4>
                    {isSelected && (
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    )}
                </div>
                {/* Optional: Keep description if space allows, otherwise remove */}
                {/* <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p> */}
            </div>
        </div>
    );
}