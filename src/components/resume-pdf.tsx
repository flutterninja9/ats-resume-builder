// components/resume-pdf.tsx
import { ResumeData } from '@/app/page'; // Import ResumeData type
import { baseStyles, resumeTemplates, ResumeTemplateType } from '@/lib/resume-templates'; // Import templates, type, and baseStyles
import { Document, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer'; // Added Link
import type { Style } from '@react-pdf/types';
import React from 'react';

interface ResumePDFProps {
    data: ResumeData;
    templateId: ResumeTemplateType; // Add prop for template ID
}

// Helper function to create text content with bullet points (remains the same)
const createBulletPoints = (text = '', listItemStyle: Style, bulletPointStyle: Style) => { // Changed any to Style
    if (!text || typeof text !== 'string') return [];

    return text
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map((line, idx) => {
            const isBullet = line.startsWith('-') || line.startsWith('*');
            const content = isBullet ? line.substring(1).trim() : line;

            // Apply styles passed as arguments
            return (
                <View key={idx} style={listItemStyle}>
                    {isBullet && <Text style={bulletPointStyle}>• </Text>}
                    {/* Apply the text styling directly here if needed, or rely on inheritance */}
                    <Text style={{ flex: 1 }}>{content}</Text>
                </View>
            );
        });
};
// Main PDF component
export const ResumePDF = ({ data, templateId }: ResumePDFProps) => {
    // Find the selected template, falling back to the first one
    const selectedTemplate = resumeTemplates.find(t => t.id === templateId) || resumeTemplates[0];

    // --- Create final styles by merging base with template-specific styles ---
    const styles = StyleSheet.create({
        ...baseStyles, // Start with base styles
        ...(selectedTemplate.styles || {}), // Override with template styles
         // Ensure list item styles are merged correctly if overridden
        listItem: {
            ...baseStyles.listItem,
            ...(selectedTemplate.styles?.listItem || {}),
        },
        bulletPoint: {
            ...baseStyles.bulletPoint,
            ...(selectedTemplate.styles?.bulletPoint || {}),
        },
        // Ensure listItemText style is available if needed separately (though flex: 1 is applied directly now)
        listItemText: {
            ...baseStyles.listItemText,
            ...(selectedTemplate.styles?.listItemText || {}),
        }
    });
    // --- End Style Merging ---

     // Create default/empty data to prevent errors (remains the same)
     const safeData = {
         contact: {
             name: data?.contact?.name || 'Your Name', // Add default text
             email: data?.contact?.email || '',
             phone: data?.contact?.phone || '',
             linkedin: data?.contact?.linkedin || '',
             portfolio: data?.contact?.portfolio || '',
         },
         experience: Array.isArray(data?.experience) ? data.experience.filter(exp => exp.company || exp.role) : [], // Filter empty entries
         education: Array.isArray(data?.education) ? data.education.filter(edu => edu.institution || edu.degree) : [], // Filter empty entries
         skills: data?.skills || '',
     };

    // Build contact items array conditionally
    const contactItems = [
        safeData.contact.phone && { type: 'phone', value: safeData.contact.phone },
        safeData.contact.email && { type: 'email', value: safeData.contact.email },
        safeData.contact.linkedin && { type: 'linkedin', value: safeData.contact.linkedin },
        safeData.contact.portfolio && { type: 'portfolio', value: safeData.contact.portfolio },
    ].filter(Boolean) as { type: string; value: string }[]; // Filter out null/undefined and assert type


    // Format skills
    const formattedSkills = safeData.skills
        .split(/,|\n/)
        .map(skill => skill.trim())
        .filter(Boolean)
        .join(', ');

    return (
        <Document title={safeData.contact.name ? `${safeData.contact.name} - Resume` : 'Resume'}>
            <Page size="A4" style={styles.page}>
                {/* Header/Contact Section */}
                <View style={styles.header} fixed> {/* Added fixed prop for potential multi-page headers */}
                    {safeData.contact.name && <Text style={styles.name}>{safeData.contact.name}</Text>}

                    {contactItems.length > 0 && (
                        <View style={styles.contactInfo}>
                            {contactItems.map((item, index) => (
                                <React.Fragment key={index}>
                                    {index > 0 && <Text style={styles.contactItem}> | </Text>}
                                    {item.type === 'linkedin' || item.type === 'portfolio' ? (
                                        <Link src={item.value} style={[styles.contactItem, styles.link]}> {/* Apply link style */}
                                            {item.value}
                                        </Link>
                                    ) : (
                                        <Text style={styles.contactItem}>{item.value}</Text>
                                    )}
                                </React.Fragment>
                            ))}
                        </View>
                    )}
                </View>

                {/* Experience Section */}
                {safeData.experience.length > 0 && (
                    <View style={styles.section} wrap={false}> {/* Prevent section title breaking alone */}
                        <Text style={styles.sectionTitle}>Work Experience</Text>
                        {safeData.experience.map((exp, index) => (
                            <View key={exp.id || `exp-${index}`} style={styles.entry} wrap={false}> {/* Prevent single entry breaking */}
                                <View style={styles.entryHeader}>
                                    <Text style={styles.title}>{exp.role || 'Role'}</Text>
                                    <Text style={styles.dates}>
                                        {exp.startDate || 'Start'} – {exp.endDate || 'Present'} {/* Default to Present */}
                                    </Text>
                                </View>
                                <Text style={styles.subtitle}>{exp.company || 'Company'}</Text>
                                {exp.responsibilities && createBulletPoints(exp.responsibilities, styles.listItem, styles.bulletPoint)}
                            </View>
                        ))}
                    </View>
                )}

                {/* Education Section */}
                {safeData.education.length > 0 && (
                     <View style={styles.section} wrap={false}>
                        <Text style={styles.sectionTitle}>Education</Text>
                        {safeData.education.map((edu, index) => (
                            <View key={edu.id || `edu-${index}`} style={styles.entry} wrap={false}>
                                <View style={styles.entryHeader}>
                                    <Text style={styles.title}>{edu.degree || 'Degree'}</Text>
                                    <Text style={styles.dates}>
                                        {edu.startDate || 'Start'} – {edu.endDate || 'End'}
                                    </Text>
                                </View>
                                <Text style={styles.subtitle}>{edu.institution || 'Institution'}</Text>
                                {edu.details && createBulletPoints(edu.details, styles.listItem, styles.bulletPoint)}
                            </View>
                        ))}
                    </View>
                )}

                {/* Skills Section */}
                {formattedSkills && (
                     <View style={styles.section} wrap={false}>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        <Text style={styles.skillsText}>
                            {formattedSkills}
                        </Text>
                    </View>
                )}

                 {/* Fallback if no content - useful for empty PDF generation testing */}
                 {safeData.experience.length === 0 && safeData.education.length === 0 && !formattedSkills && (
                     <View style={styles.section}>
                         <Text style={{ textAlign: 'center', color: '#9ca3af', marginTop: 50 }}>
                             No content provided. Please fill the form.
                         </Text>
                     </View>
                 )}

            </Page>
        </Document>
    );
};