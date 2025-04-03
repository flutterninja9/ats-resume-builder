'use client';

import { ResumeData } from '@/app/page';
import { ResumePDF } from '@/components/resume-pdf';
import { ResumePreview } from '@/components/resume-preview';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { ResumeTemplateType } from '@/lib/resume-templates';
import { SavedResume, getResumeById, trackResumeDownload } from '@/services/resume-service';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { AlertCircle, ArrowLeft, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

export default function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, isLoading: authLoading } = useAuth();
  const [resume, setResume] = useState<SavedResume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) return;

    // Redirect to login if not authenticated
    if (!user) {
      router.push(`/?auth=login&returnTo=/preview/${id}`);
      return;
    }

    // Load resume data
    loadResumeData();
  }, [id, user, authLoading, router]);

  const loadResumeData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await getResumeById(id);
      if (error) {
        setError('Failed to load resume');
      } else if (data) {
        setResume(data);
      } else {
        setError('Resume not found');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle PDF download manually if the PDFDownloadLink fails
  const handleManualDownload = () => {
    alert("PDF generation is currently experiencing issues. Please try again later.");
    setPdfError(false);
  };

  // Function to handle successful download
  const handleDownload = () => {
    // Track the download for analytics
    if (resume) {
      trackResumeDownload(resume.template_id as ResumeTemplateType);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
          <h2 className="mt-4 text-xl font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (error || !resume) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-12">
        <Alert className="bg-red-50 text-red-800 border-red-200 mb-6">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error || 'Resume not found'}</AlertDescription>
        </Alert>
        
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="container max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{resume.name}</h1>
          <p className="text-muted-foreground mt-1">
            Template: <span className="font-medium">{resume.template_id}</span>
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Link>
          </Button>
          
          {pdfError ? (
            <Button onClick={handleManualDownload} variant="destructive" className="shadow-md">
              <AlertCircle className="mr-2 h-4 w-4" /> Error - Retry
            </Button>
          ) : (
            <PDFDownloadLink
              document={<ResumePDF data={resume.data as ResumeData} templateId={resume.template_id as ResumeTemplateType} />}
              fileName={`resume-${resume.name.toLowerCase().replace(/\s+/g, '-')}.pdf`}
              onError={() => setPdfError(true)}
              onClick={handleDownload}
              style={{ textDecoration: 'none' }}
            >
              {({ loading, error }) => {
                if (error) {
                  console.error("PDF Generation Error:", error);
                  if (!pdfError) setPdfError(true);
                  return (
                    <Button onClick={handleManualDownload} variant="destructive" className="shadow-md">
                      <AlertCircle className="mr-2 h-4 w-4" /> Error - Retry
                    </Button>
                  );
                }

                return loading ? (
                  <Button disabled variant="default" className="shadow-md">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                  </Button>
                ) : (
                  <Button variant="default" className="shadow-md bg-green-600 hover:bg-green-700 text-white">
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                  </Button>
                );
              }}
            </PDFDownloadLink>
          )}
        </div>
      </div>
      
      <Card className="w-full overflow-hidden shadow-md border p-0">
        <div className="h-[calc(100vh-200px)] overflow-auto p-0">
          <ResumePreview 
            data={resume.data as ResumeData} 
            selectedTemplateId={resume.template_id as ResumeTemplateType} 
          />
        </div>
      </Card>
    </main>
  );
}