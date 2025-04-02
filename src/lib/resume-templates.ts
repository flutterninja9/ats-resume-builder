// src/lib/resume-templates.ts
import { StyleSheet } from '@react-pdf/renderer';

// Define common base styles to avoid repetition
export const baseStyles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
    backgroundColor: '#ffffff',
    color: '#111827',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
    color: '#111827',
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    fontSize: 9,
    color: '#4b5563',
    marginBottom: 2,
  },
  contactItem: {
    marginHorizontal: 5,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    borderBottomWidth: 1,
    borderBottomColor: '#9ca3af',
    paddingBottom: 3,
    marginBottom: 8,
    textTransform: 'uppercase',
    color: '#111827',
  },
  entry: {
    marginBottom: 10,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    alignItems: 'baseline',
  },
  title: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    marginBottom: 3,
    color: '#374151',
  },
  dates: {
    fontSize: 9,
    color: '#6b7280',
    fontFamily: 'Helvetica-Oblique',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
  },
  listItemText: {
    flex: 1,
    fontSize: 10,
    color: '#374151',
  },
  skillsText: {
    fontSize: 10,
    color: '#374151',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
  },
});

// Define the types for template structure
export interface ResumeTemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

// Use @react-pdf/renderer specific types for styles
type Style = import('@react-pdf/types').Style;

// Allow any style key from baseStyles to be overridden
export type TemplateSpecificStyles = {
  [K in keyof typeof baseStyles]?: Style;
} & {
  [key: string]: Style;
};

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  colors: ResumeTemplateColors;
  styles?: TemplateSpecificStyles;
}

export type ResumeTemplateType = 
  | 'classic' 
  | 'modern' 
  | 'minimal' 
  | 'creative' 
  | 'executive' 
  | 'technical' 
  | 'academic' 
  | 'elegant' 
  | 'bold' 
  | 'funky';

// Define the actual templates
export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'A timeless, traditional format suitable for conservative industries',
    previewImage: '/previews/classic.png',
    colors: {
      primary: '#2563eb', // Blue-600
      secondary: '#4b5563', // Gray-600
      accent: '#10b981', // Emerald-500
      background: '#ffffff', // White
      text: '#111827', // Gray-900
    },
    styles: {
      name: {
        ...baseStyles.name,
        color: '#111827',
        textAlign: 'center',
        fontSize: 22,
      },
      header: {
        ...baseStyles.header,
        textAlign: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#374151',
        marginBottom: 15,
        paddingBottom: 5,
      },
      contactInfo: {
        ...baseStyles.contactInfo,
        justifyContent: 'center',
        marginBottom: 15,
      },
      sectionTitle: {
        ...baseStyles.sectionTitle,
        color: '#111827',
        borderBottomColor: '#6b7280',
        fontSize: 14,
        textTransform: 'uppercase',
      },
      title: {
        ...baseStyles.title,
        fontSize: 11,
      },
    },
  },
  {
    id: 'modern',
    name: 'Modern Minimalist',
    description: 'A sleek, contemporary design with emphasis on clarity',
    previewImage: '/previews/modern.png',
    colors: {
      primary: '#0ea5e9', // Sky-500
      secondary: '#64748b', // Slate-500 
      accent: '#f97316', // Orange-500
      background: '#f8fafc', // Slate-50
      text: '#0f172a', // Slate-900
    },
    styles: {
      page: {
        ...baseStyles.page,
        backgroundColor: '#f8fafc',
        color: '#0f172a',
      },
      name: {
        ...baseStyles.name,
        color: '#0ea5e9',
        fontSize: 24,
        marginBottom: 8,
      },
      header: {
        ...baseStyles.header,
        borderBottomColor: '#e2e8f0',
        paddingBottom: 15,
      },
      contactInfo: {
        ...baseStyles.contactInfo,
        color: '#64748b',
      },
      sectionTitle: {
        ...baseStyles.sectionTitle,
        fontSize: 13,
        color: '#0ea5e9',
        borderBottomWidth: 0,
        paddingBottom: 0,
        marginBottom: 10,
        textTransform: 'none',
      },
      entry: {
        ...baseStyles.entry,
        borderLeftWidth: 2,
        borderLeftColor: '#e2e8f0',
        paddingLeft: 10,
        marginBottom: 12,
      },
      title: {
        ...baseStyles.title,
        color: '#1e293b',
      },
      subtitle: {
        ...baseStyles.subtitle,
        color: '#475569',
      },
      listItemText: {
        ...baseStyles.listItemText,
        color: '#334155',
      },
      link: {
        ...baseStyles.link,
        color: '#0ea5e9',
      }
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'An ultra-clean, minimalist design with maximum simplicity',
    previewImage: '/previews/minimal.png',
    colors: {
      primary: '#000000', // Black
      secondary: '#525252', // Neutral-600
      accent: '#a3a3a3', // Neutral-400
      background: '#ffffff', // White
      text: '#171717', // Neutral-900
    },
    styles: {
      page: {
        ...baseStyles.page,
        backgroundColor: '#ffffff',
        paddingHorizontal: 45,
      },
      name: {
        ...baseStyles.name,
        color: '#000000',
        fontSize: 18,
        textTransform: 'uppercase',
        letterSpacing: 1,
        textAlign: 'left',
        marginBottom: 8,
      },
      header: {
        ...baseStyles.header,
        textAlign: 'left',
        borderBottomWidth: 0.5,
        borderBottomColor: '#d4d4d4',
        paddingBottom: 8,
      },
      contactInfo: {
        ...baseStyles.contactInfo,
        justifyContent: 'flex-start',
        color: '#525252',
        fontSize: 8,
      },
      contactItem: {
        ...baseStyles.contactItem,
        marginLeft: 0,
        marginRight: 10,
      },
      sectionTitle: {
        ...baseStyles.sectionTitle,
        fontSize: 11,
        letterSpacing: 1,
        color: '#000000',
        borderBottomWidth: 0,
        textTransform: 'uppercase',
        marginBottom: 6,
      },
      title: {
        ...baseStyles.title,
        letterSpacing: 0.5,
      },
      subtitle: {
        ...baseStyles.subtitle,
        fontSize: 9,
      },
      dates: {
        ...baseStyles.dates,
        fontSize: 8,
      },
      listItemText: {
        ...baseStyles.listItemText,
        fontSize: 9,
      },
      bulletPoint: {
        ...baseStyles.bulletPoint,
        fontSize: 8, 
        width: 8,
      },
      link: {
        ...baseStyles.link,
        color: '#525252',
        textDecoration: 'none',
      }
    },
  },
  {
    id: 'creative',
    name: 'Creative Colorful',
    description: 'A bold, colorful design for creative industries',
    previewImage: '/previews/creative.png',
    colors: {
      primary: '#8b5cf6', // Violet-500
      secondary: '#ec4899', // Pink-500
      accent: '#06b6d4', // Cyan-500
      background: '#ffffff', // White
      text: '#18181b', // Zinc-900
    },
    styles: {
      page: {
        ...baseStyles.page,
        backgroundColor: '#ffffff',
      },
      name: {
        ...baseStyles.name,
        color: '#8b5cf6',
        fontSize: 26,
        marginBottom: 10,
      },
      header: {
        ...baseStyles.header,
        borderBottomWidth: 6,
        borderBottomColor: '#fce7f3', // Pink-100 
        paddingBottom: 12,
        marginBottom: 20,
      },
      contactInfo: {
        ...baseStyles.contactInfo,
        color: '#6b7280',
      },
      section: {
        ...baseStyles.section,
        marginBottom: 20,
      },
      sectionTitle: {
        ...baseStyles.sectionTitle,
        color: '#ec4899',
        fontSize: 16,
        borderBottomWidth: 3,
        borderBottomColor: '#f3f4f6', // Gray-100
        paddingBottom: 4,
        marginBottom: 12,
      },
      title: {
        ...baseStyles.title,
        color: '#8b5cf6',
        fontSize: 12,
      },
      subtitle: {
        ...baseStyles.subtitle,
        color: '#6d28d9', // Violet-700
        fontSize: 10,
      },
      bulletPoint: {
        ...baseStyles.bulletPoint,
        color: '#ec4899',
      },
      dates: {
        ...baseStyles.dates,
        color: '#9ca3af', // Gray-400
      },
      link: {
        ...baseStyles.link,
        color: '#06b6d4',
      }
    },
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'A formal, sophisticated template for senior positions',
    previewImage: '/previews/executive.png',
    colors: {
      primary: '#1e3a8a', // Blue-900
      secondary: '#475569', // Slate-600
      accent: '#b91c1c', // Red-700
      background: '#f8fafc', // Slate-50
      text: '#0f172a', // Slate-900
    },
    styles: {
      page: {
        ...baseStyles.page,
        backgroundColor: '#f8fafc',
        paddingHorizontal: 40,
      },
      name: {
        ...baseStyles.name,
        fontSize: 22,
        color: '#1e3a8a',
        marginBottom: 6,
        fontFamily: 'Times-Bold',
      },
      header: {
        ...baseStyles.header,
        borderBottomWidth: 1.5,
        borderBottomColor: '#1e3a8a',
        paddingBottom: 12,
      },
      contactInfo: {
        ...baseStyles.contactInfo,
        fontSize: 10,
        color: '#475569',
        fontFamily: 'Times-Roman',
      },
      contactItem: {
        ...baseStyles.contactItem,
        marginHorizontal: 6,
      },
      section: {
        ...baseStyles.section,
        marginBottom: 18,
      },
      sectionTitle: {
        ...baseStyles.sectionTitle,
        fontFamily: 'Times-Bold',
        color: '#1e3a8a',
        borderBottomWidth: 1,
        borderBottomColor: '#94a3b8', // Slate-400
        fontSize: 14,
        marginBottom: 10,
      },
      title: {
        ...baseStyles.title,
        fontFamily: 'Times-Bold',
        fontSize: 11,
      },
      subtitle: {
        ...baseStyles.subtitle,
        fontFamily: 'Times-Roman',
        color: '#1e3a8a',
        fontSize: 10,
      },
      dates: {
        ...baseStyles.dates,
        fontFamily: 'Times-Italic',
        fontSize: 9,
      },
      listItem: {
        ...baseStyles.listItem,
        marginBottom: 4,
      },
      listItemText: {
        ...baseStyles.listItemText,
        fontFamily: 'Times-Roman',
        fontSize: 10,
      },
      skillsText: {
        ...baseStyles.skillsText,
        fontFamily: 'Times-Roman',
        fontSize: 10,
      },
      link: {
        ...baseStyles.link,
        color: '#1e3a8a',
        fontFamily: 'Times-Roman',
      }
    },
  },
  {
    id: 'technical',
    name: 'Technical Coder',
    description: 'A code-inspired design for technical and developer roles',
    previewImage: '/previews/technical.png',
    colors: {
      primary: '#16a34a', // Green-600
      secondary: '#3f3f46', // Zinc-700
      accent: '#2563eb', // Blue-600
      background: '#f4f4f5', // Zinc-100
      text: '#18181b', // Zinc-900
    },
    styles: {
      page: {
        ...baseStyles.page,
        backgroundColor: '#f4f4f5',
        fontFamily: 'Courier',
        paddingHorizontal: 40,
      },
      name: {
        ...baseStyles.name,
        fontFamily: 'Courier-Bold',
        color: '#16a34a',
        textAlign: 'left',
        fontSize: 18,
      },
      header: {
        ...baseStyles.header,
        textAlign: 'left',
        borderBottomWidth: 0,
        borderBottomColor: '#e4e4e7', // Zinc-200
        paddingBottom: 5,
      },
      contactInfo: {
        ...baseStyles.contactInfo,
        fontFamily: 'Courier',
        justifyContent: 'flex-start',
        color: '#52525b', // Zinc-600
        fontSize: 9,
      },
      contactItem: {
        ...baseStyles.contactItem,
        marginLeft: 0,
        marginRight: 12,
      },
      section: {
        ...baseStyles.section,
        marginBottom: 18,
        borderLeftWidth: 2,
        borderLeftColor: '#e4e4e7', // Zinc-200
        paddingLeft: 10,
      },
      sectionTitle: {
        ...baseStyles.sectionTitle,
        fontFamily: 'Courier-Bold',
        fontSize: 12,
        color: '#16a34a',
        borderBottomWidth: 0,
        marginBottom: 8,
        textTransform: 'lowercase',
      },
      entry: {
        ...baseStyles.entry,
        marginBottom: 12,
      },
      title: {
        ...baseStyles.title,
        fontFamily: 'Courier-Bold',
        color: '#3f3f46',
        fontSize: 10,
      },
      subtitle: {
        ...baseStyles.subtitle,
        fontFamily: 'Courier',
        color: '#71717a', // Zinc-500
      },
      dates: {
        ...baseStyles.dates,
        fontFamily: 'Courier-Oblique',
        color: '#71717a', // Zinc-500
      },
      listItemText: {
        ...baseStyles.listItemText,
        fontFamily: 'Courier',
        color: '#3f3f46',
      },
      bulletPoint: {
        ...baseStyles.bulletPoint,
        fontFamily: 'Courier',
        color: '#16a34a',
      },
      skillsText: {
        ...baseStyles.skillsText,
        fontFamily: 'Courier',
        color: '#3f3f46',
      },
      link: {
        ...baseStyles.link,
        fontFamily: 'Courier',
        color: '#2563eb',
      }
    },
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'A LaTeX-inspired design for academic and research positions',
    previewImage: '/previews/academic.png',
    colors: {
      primary: '#111827', // Gray-900
      secondary: '#374151', // Gray-700
      accent: '#6b7280', // Gray-500
      background: '#ffffff', // White
      text: '#1f2937', // Gray-800
    },
    styles: {
      page: {
        ...baseStyles.page,
        backgroundColor: '#ffffff',
        fontFamily: 'Times-Roman',
        paddingHorizontal: 50,
      },
      name: {
        ...baseStyles.name,
        fontFamily: 'Times-Bold',
        fontSize: 18,
        color: '#111827',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 8,
      },
      header: {
        ...baseStyles.header,
        borderBottomWidth: 0,
        paddingBottom: 5,
      },
      contactInfo: {
        ...baseStyles.contactInfo,
        fontFamily: 'Times-Roman',
        fontSize: 10,
        color: '#374151',
      },
      section: {
        ...baseStyles.section,
        marginBottom: 20,
      },
      sectionTitle: {
        ...baseStyles.sectionTitle,
        fontFamily: 'Times-Bold',
        fontSize: 12,
        color: '#111827',
        textAlign: 'center',
        textTransform: 'uppercase',
        borderBottomWidth: 0,
        letterSpacing: 1,
        marginBottom: 12,
      },
      entry: {
        ...baseStyles.entry,
        marginBottom: 12,
      },
      entryHeader: {
        ...baseStyles.entryHeader,
        marginBottom: 3,
      },
      title: {
        ...baseStyles.title,
        fontFamily: 'Times-Bold',
        fontSize: 11,
        color: '#111827',
      },
      subtitle: {
        ...baseStyles.subtitle,
        fontFamily: 'Times-Italic',
        color: '#374151',
        fontSize: 10,
      },
      dates: {
        ...baseStyles.dates,
        fontFamily: 'Times-Roman',
        color: '#374151',
        fontSize: 10,
      },
      listItem: {
        ...baseStyles.listItem,
        marginBottom: 4,
      },
      listItemText: {
        ...baseStyles.listItemText,
        fontFamily: 'Times-Roman',
        color: '#1f2937',
        fontSize: 10,
        textAlign: 'justify', // LaTeX-inspired
      },
      skillsText: {
        ...baseStyles.skillsText,
        fontFamily: 'Times-Roman',
        color: '#1f2937',
        fontSize: 10,
        textAlign: 'justify',
      },
      link: {
        ...baseStyles.link,
        fontFamily: 'Times-Roman',
        color: '#1f2937',
        textDecoration: 'underline',
      }
    },
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'A refined, sophisticated design with graceful typography',
    previewImage: '/previews/elegant.png',
    colors: {
      primary: '#4f46e5', // Indigo-600
      secondary: '#4338ca', // Indigo-700
      accent: '#8b5cf6', // Violet-500
      background: '#f9fafb', // Gray-50
      text: '#111827', // Gray-900
    },
    styles: {
      page: {
        ...baseStyles.page,
        backgroundColor: '#f9fafb',
        paddingHorizontal: 45,
      },
      name: {
        ...baseStyles.name,
        fontSize: 24,
        color: '#4f46e5',
        fontFamily: 'Helvetica-Bold',
        marginBottom: 8,
      },
      header: {
        ...baseStyles.header,
        borderBottomWidth: 0.5,
        borderBottomColor: '#4f46e5',
        paddingBottom: 14,
      },
      contactInfo: {
        ...baseStyles.contactInfo,
        fontSize: 9,
        color: '#6b7280', // Gray-500
      },
      section: {
        ...baseStyles.section,
        marginBottom: 18,
      },
      sectionTitle: {
        ...baseStyles.sectionTitle,
        fontSize: 12,
        color: '#4f46e5',
        borderBottomWidth: 0.5,
        borderBottomColor: '#e5e7eb', // Gray-200
        paddingBottom: 4,
        marginBottom: 10,
      },
      title: {
        ...baseStyles.title,
        fontSize: 11,
        color: '#111827',
      },
      subtitle: {
        ...baseStyles.subtitle,
        fontSize: 10,
        color: '#4338ca',
      },
      dates: {
        ...baseStyles.dates,
        fontSize: 9,
        color: '#6b7280', // Gray-500
      },
      listItemText: {
        ...baseStyles.listItemText,
        fontSize: 9.5,
        color: '#374151', // Gray-700
        lineHeight: 1.5,
      },
      bulletPoint: {
        ...baseStyles.bulletPoint,
        fontSize: 9.5,
        color: '#8b5cf6',
      },
      link: {
        ...baseStyles.link,
        color: '#4f46e5',
      }
    },
  },
  {
    id: 'bold',
    name: 'Bold Impact',
    description: 'A high-contrast design with strong visual impact',
    previewImage: '/previews/bold.png',
    colors: {
      primary: '#000000', // Black
      secondary: '#dc2626', // Red-600
      accent: '#f59e0b', // Amber-500
      background: '#ffffff', // White
      text: '#111827', // Gray-900
    },
    styles: {
      page: {
        ...baseStyles.page,
        backgroundColor: '#ffffff',
        paddingHorizontal: 35,
      },
      name: {
        ...baseStyles.name,
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'left',
        marginBottom: 6,
      },
      header: {
        ...baseStyles.header,
        textAlign: 'left',
        borderBottomWidth: 3,
        borderBottomColor: '#dc2626',
        paddingBottom: 10,
      },
      contactInfo: {
        ...baseStyles.contactInfo,
        justifyContent: 'flex-start',
        fontSize: 9,
        color: '#4b5563', // Gray-600
      },
      contactItem: {
        ...baseStyles.contactItem,
        marginLeft: 0,
        marginRight: 10,
      },
      section: {
        ...baseStyles.section,
        marginBottom: 16,
      },
      sectionTitle: {
        ...baseStyles.sectionTitle,
        fontSize: 16,
        textTransform: 'uppercase',
        color: '#000000',
        letterSpacing: 1,
        borderBottomWidth: 2,
        borderBottomColor: '#dc2626',
        paddingBottom: 3,
        marginBottom: 10,
      },
      title: {
        ...baseStyles.title,
        fontSize: 12,
        color: '#000000',
      },
      subtitle: {
        ...baseStyles.subtitle,
        fontSize: 10,
        color: '#dc2626',
        fontFamily: 'Helvetica-Bold',
      },
      dates: {
        ...baseStyles.dates,
        fontSize: 9,
        color: '#4b5563', // Gray-600
      },
      listItem: {
        ...baseStyles.listItem,
        marginBottom: 4,
      },
      bulletPoint: {
        ...baseStyles.bulletPoint,
        color: '#dc2626',
      },
      link: {
        ...baseStyles.link,
        color: '#dc2626',
      }
    },
  },
  {
    id: 'funky',
    name: 'Funky Fresh',
    description: 'A playful, energetic design for creative personalities',
    previewImage: '/previews/funky.png',
    colors: {
      primary: '#7c3aed', // Violet-600  
      secondary: '#ec4899', // Pink-500
      accent: '#06b6d4', // Cyan-500
      background: '#fffbeb', // Amber-50
      text: '#18181b', // Zinc-900
    },
    styles: {
      page: {
        ...baseStyles.page,
        backgroundColor: '#fffbeb',
        paddingHorizontal: 35,
      },
      name: {
        ...baseStyles.name,
        fontSize: 26,
        color: '#7c3aed',
        textAlign: 'center',
        marginBottom: 8,
        textTransform: 'lowercase',
        letterSpacing: 1,
      },
      header: {
        ...baseStyles.header,
        borderBottomWidth: 4,
        borderBottomStyle: 'dashed',
        borderBottomColor: '#ec4899',
        paddingBottom: 12,
      },
      contactInfo: {
        ...baseStyles.contactInfo,
        fontSize: 10,
        color: '#7c3aed',
      },
      section: {
        ...baseStyles.section,
        marginBottom: 20,
      },
      sectionTitle: {
        ...baseStyles.sectionTitle,
        fontSize: 15,
        color: '#ec4899',
        textTransform: 'lowercase',
        letterSpacing: 1,
        borderBottomWidth: 0,
        textAlign: 'center',
        marginBottom: 12,
      },
      title: {
        ...baseStyles.title,
        fontSize: 12,
        color: '#7c3aed',
        textTransform: 'lowercase',
      },
      subtitle: {
        ...baseStyles.subtitle,
        fontSize: 10,
        color: '#06b6d4',
        fontFamily: 'Helvetica-Bold',
      },
      dates: {
        ...baseStyles.dates,
        fontSize: 9,
        color: '#ec4899',
      },
      listItem: {
        ...baseStyles.listItem,
        marginBottom: 4,
      },
      bulletPoint: {
        ...baseStyles.bulletPoint,
        fontSize: 12,
        color: '#06b6d4',
      },
      listItemText: {
        ...baseStyles.listItemText,
        fontSize: 10,
      },
      link: {
        ...baseStyles.link,
        color: '#06b6d4',
      }
    },
  },
];

// Helper function to get a template by ID
export function getTemplateById(id: ResumeTemplateType): ResumeTemplate {
  return resumeTemplates.find(template => template.id === id) || resumeTemplates[0];
}

// Helper function to merge base styles with template-specific styles
export function getMergedStyles(templateId: ResumeTemplateType) {
  const template = getTemplateById(templateId);
  return {
    ...baseStyles,
    ...template.styles,
  };
}