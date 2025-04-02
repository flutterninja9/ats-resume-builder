'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Globe, GraduationCap, Linkedin, Mail, Phone, Palette } from "lucide-react"; // Added Palette icon
import { JSX } from "react";
import { ResumeData } from '@/app/page'; // Import ResumeData type from page.tsx
import { resumeTemplates, ResumeTemplateType } from "@/lib/resume-templates"; // Import templates and type

interface ResumePreviewProps {
    data: ResumeData;
    selectedTemplateId: ResumeTemplateType; // Add prop for template ID
}

// Helper to split text into paragraphs or list items based on newlines/bullets (remains the same)
const formatMultilineText = (text: string): JSX.Element[] => {
    if (!text) return [];

    return text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map((line, index) => {
            if (line.startsWith('-') || line.startsWith('*')) {
                return <li key={index} className="ml-4 list-disc mb-1 text-sm">{line.substring(1).trim()}</li>;
            }
            return <p key={index} className="mb-1 text-sm">{line}</p>;
        });
};

export function ResumePreview({ data, selectedTemplateId }: ResumePreviewProps) {
    const { contact, experience, education, skills } = data;

    // Find the selected template object
    const selectedTemplate = resumeTemplates.find(t => t.id === selectedTemplateId) || resumeTemplates[0]; // Fallback to default

    // Format skills for display (remains the same)
    const formattedSkills = skills
        ? skills
            .split(/,|\n/)
            .map(s => s.trim())
            .filter(Boolean)
            .join(', ')
        : '';

    // Get primary color from selected template for potential use
    const primaryColor = selectedTemplate.colors.primary || '#000000'; // Fallback color

    return (
        <Card className="w-full h-full overflow-y-auto shadow-md border"> {/* Added border */}
            <CardHeader className="pb-2 pt-6 px-8 border-b">
                <CardTitle className="flex justify-between items-center">
                    <span>Resume Preview</span>
                    {/* Display selected template name */}
                    <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded flex items-center gap-1">
                       <Palette className="h-3 w-3" style={{ color: primaryColor }} /> {/* Use template color */}
                       {selectedTemplate.name}
                    </span>
                </CardTitle>
            </CardHeader>
            {/* Apply a base font, specific template might override in PDF */}
            <CardContent className="space-y-6 p-8 font-sans text-sm">
                {/* Header Section */}
                <header className="text-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                    {contact.name && (
                        <h1
                           className="text-2xl font-bold mb-2"
                           style={{ color: primaryColor }} // Use primary color for name in preview
                        >
                           {contact.name}
                        </h1>
                    )}

                    <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-400 mt-2"> {/* Improved gap */}
                        {contact.phone && (
                            <div className="flex items-center">
                                <Phone className="h-3 w-3 mr-1.5" />
                                <span>{contact.phone}</span>
                            </div>
                        )}
                        {contact.email && (
                            <div className="flex items-center">
                                <Mail className="h-3 w-3 mr-1.5" />
                                <span>{contact.email}</span>
                            </div>
                        )}
                        {contact.linkedin && (
                            <div className="flex items-center">
                                <Linkedin className="h-3 w-3 mr-1.5" />
                                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400 break-all">{contact.linkedin}</a> {/* Added break-all */}
                            </div>
                        )}
                        {contact.portfolio && (
                            <div className="flex items-center">
                                <Globe className="h-3 w-3 mr-1.5" />
                                <a href={contact.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400 break-all">{contact.portfolio}</a> {/* Added break-all */}
                            </div>
                        )}
                    </div>
                </header>

                {/* Experience Section */}
                {experience.some(exp => exp.company || exp.role) && (
                    <section className="mb-6">
                        <h2 className="text-lg font-semibold border-b pb-1 mb-4 flex items-center" style={{ borderColor: primaryColor, color: primaryColor }}> {/* Use primary color for section heading */}
                            <Briefcase className="h-4 w-4 mr-2" /> {/* Icon color inherits */}
                            PROFESSIONAL EXPERIENCE
                        </h2>
                        {experience.map((exp) => (exp.company || exp.role) && (
                            <div key={exp.id} className="mb-5 last:mb-0">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                                    <h3 className="font-semibold text-base">{exp.role || 'Role'}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                                        {exp.startDate || 'Start Date'} – {exp.endDate || 'Present'} {/* Default to Present */}
                                    </p>
                                </div>
                                <p className="text-sm font-medium mb-2">{exp.company || 'Company Name'}</p>
                                {exp.responsibilities && (
                                    <ul className="space-y-1 mt-2 text-gray-700 dark:text-gray-300"> {/* Adjusted text color */}
                                        {formatMultilineText(exp.responsibilities)}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {/* Education Section */}
                {education.some(edu => edu.institution || edu.degree) && (
                    <section className="mb-6">
                        <h2 className="text-lg font-semibold border-b pb-1 mb-4 flex items-center" style={{ borderColor: primaryColor, color: primaryColor }}> {/* Use primary color */}
                            <GraduationCap className="h-4 w-4 mr-2" />
                            EDUCATION
                        </h2>
                        {education.map((edu) => (edu.institution || edu.degree) && (
                            <div key={edu.id} className="mb-5 last:mb-0">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                                    <h3 className="font-semibold text-base">{edu.degree || 'Degree/Field'}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                                        {edu.startDate || 'Start Date'} – {edu.endDate || 'End Date'}
                                    </p>
                                </div>
                                <p className="text-sm font-medium mb-2">{edu.institution || 'Institution Name'}</p>
                                {edu.details && (
                                    <div className="mt-2 text-gray-700 dark:text-gray-300"> {/* Adjusted text color */}
                                        {formatMultilineText(edu.details)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {/* Skills Section */}
                {formattedSkills && (
                    <section>
                        <h2 className="text-lg font-semibold border-b pb-1 mb-4" style={{ borderColor: primaryColor, color: primaryColor }}> {/* Use primary color */}
                           SKILLS
                        </h2>
                        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{formattedSkills}</p> {/* Adjusted text color */}
                    </section>
                )}

                {/* Empty State (remains the same) */}
                {!contact.name && !experience.some(exp => exp.company || exp.role) &&
                 !education.some(edu => edu.institution || edu.degree) && !skills && (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                        <div className="border-2 border-dashed rounded-full p-6 mb-4">
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                                 <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                                 <polyline points="14 2 14 8 20 8"/>
                             </svg>
                        </div>
                        <h3 className="font-medium mb-1">Your resume preview will appear here</h3>
                        <p className="text-sm">Fill out the form to see your resume take shape</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}