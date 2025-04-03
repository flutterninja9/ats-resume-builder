import { ResumeData } from '@/app/page';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { ResumeTemplateType } from '@/lib/resume-templates';
import { saveResume } from '@/services/resume-service';
import { Download, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthModal } from './auth-modal';

interface ProtectedDownloadButtonProps {
  resumeData: ResumeData;
  selectedTemplate: ResumeTemplateType;
  pdfError: boolean;
  setPdfError: (error: boolean) => void;
  isClient: boolean;
}

export function ProtectedDownloadButton({
  resumeData,
  selectedTemplate,
  pdfError,
  setPdfError,
  isClient
}: ProtectedDownloadButtonProps) {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // Check if resumeData has enough content to generate a PDF
  const hasContent =
    resumeData.contact.name ||
    resumeData.experience.some(e => e.company || e.role) ||
    resumeData.education.some(e => e.institution || e.degree) ||
    resumeData.skills;

  // Function to handle PDF download manually if the PDFDownloadLink fails
  const handleManualDownload = () => {
    alert("PDF generation is currently experiencing issues. Please try again later or fill in more information.");
    setPdfError(false);
  };

  // New function to save resume and redirect to preview page
  const handleSaveAndPreview = async () => {
    if (!user || !hasContent) return;
    
    setIsSaving(true);
    try {
      const { data, error } = await saveResume(
        resumeData,
        selectedTemplate,
        resumeData.contact.name ? `${resumeData.contact.name}'s Resume` : "Untitled Resume",
        false // Not public by default
      );
      
      if (data) {
        // Redirect to the preview page for this resume
        router.push(`/preview/${data.id}`);
      } else if (error) {
        console.error("Error saving resume:", error);
        setPdfError(true);
      }
    } catch (err) {
      console.error("Error in save and preview process:", err);
      setPdfError(true);
    } finally {
      setIsSaving(false);
    }
  };

  // If the user is not logged in, show a button that opens the auth modal
  if (!user) {
    return (
      <>
        <Button 
          onClick={() => setShowAuthModal(true)} 
          variant="default" 
          className="shadow-md bg-green-600 hover:bg-green-700 text-white"
        >
          <Download className="mr-2 h-4 w-4" /> Sign In to Download
        </Button>

        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultTab="login"
          onSuccess={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  // If saving or not on client, show loading state
  if (isSaving || !isClient) {
    return (
      <Button disabled variant="default" className="shadow-md">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {isSaving ? "Saving..." : "Loading..."}
      </Button>
    );
  }

  // If there's an error or not enough content, use the basic button
  if (pdfError || !hasContent) {
    return (
      <Button 
        onClick={hasContent ? handleSaveAndPreview : handleManualDownload} 
        variant="default" 
        className="shadow-md"
      >
        <Download className="mr-2 h-4 w-4" /> Download PDF
      </Button>
    );
  }

//   // Option 1: Direct download with PDFDownloadLink
//   if (false) { // Always skip this now since we're using the save and preview approach
//     try {
//       return (
//         <PDFDownloadLink
//           document={<ResumePDF data={resumeData} templateId={selectedTemplate} />}
//           fileName={`resume-${resumeData.contact.name.toLowerCase().replace(/\s+/g, '-') || 'untitled'}-${selectedTemplate}.pdf`}
//           onError={() => setPdfError(true)}
//           style={{ textDecoration: 'none' }}
//         >
//           {({ loading, error }) => {
//             if (error) {
//               console.error("PDF Generation Error:", error);
//               if (!pdfError) setPdfError(true);
//               return (
//                 <Button onClick={handleManualDownload} variant="destructive" className="shadow-md">
//                   <AlertCircle className="mr-2 h-4 w-4" /> Error - Retry
//                 </Button>
//               );
//             }

//             return loading ? (
//               <Button disabled variant="default" className="shadow-md">
//                 <Download className="mr-2 h-4 w-4 animate-spin" /> Generating...
//               </Button>
//             ) : (
//               <Button variant="default" className="shadow-md bg-green-600 hover:bg-green-700 text-white">
//                 <Download className="mr-2 h-4 w-4" /> Download PDF
//               </Button>
//             );
//           }}
//         </PDFDownloadLink>
//       );
//     } catch (e) {
//       console.error("Error initializing PDFDownloadLink:", e);
//       if (!pdfError) setPdfError(true);
//       return (
//         <Button onClick={handleManualDownload} variant="destructive" className="shadow-md">
//           <AlertCircle className="mr-2 h-4 w-4" /> Error - Try Again
//         </Button>
//       );
//     }
//   }

  // Option 2: Save and then redirect to preview page (this is what we're using now)
  return (
    <Button 
      onClick={handleSaveAndPreview} 
      variant="default" 
      className="shadow-md bg-green-600 hover:bg-green-700 text-white"
    >
      <Download className="mr-2 h-4 w-4" /> Download PDF
    </Button>
  );
}