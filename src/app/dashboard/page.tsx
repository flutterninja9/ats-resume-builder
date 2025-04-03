'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { SavedResume, deleteResume, getUserResumes } from '@/services/resume-service';
import { Briefcase, Clock, Download, Edit, FileText, Loader2, Plus, Trash2, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!authLoading && !user) {
      router.push('/');
      return;
    }

    // Load resumes if authenticated
    if (user) {
      fetchResumes();
    }
  }, [user, authLoading, router]);

  const fetchResumes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await getUserResumes();
      if (error) {
        setError('Failed to fetch resumes');
      } else {
        setResumes(data || []);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    try {
      const { success } = await deleteResume(resumeId);
      if (success) {
        setResumes(resumes.filter(resume => resume.id !== resumeId));
      } else {
        setError('Failed to delete resume');
      }
    } catch {
      setError('An unexpected error occurred');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (authLoading) {
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

  return (
    <main className="container max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Resumes</h1>
          <p className="text-muted-foreground mt-1">Manage your saved resumes</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/">
              <Plus className="mr-2 h-4 w-4" /> Create New Resume
            </Link>
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid place-items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="mt-4 text-muted-foreground">Loading your resumes...</p>
        </div>
      ) : resumes.length === 0 ? (
        <Card className="mt-6 bg-muted/30">
          <CardContent className="pt-6 pb-8 flex flex-col items-center text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full grid place-items-center mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">No resumes yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              You haven&#39;t saved any resumes yet. Create a new resume to get started.
            </p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/">
                <Plus className="mr-2 h-4 w-4" /> Create Your First Resume
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <Card key={resume.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-start">
                  <span className="truncate">{resume.name}</span>
                  {resume.is_public && (
                    <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded font-normal">
                      Public
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="flex items-center text-xs">
                  <Clock className="h-3 w-3 mr-1" /> 
                  Updated {formatDate(resume.updated_at)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-sm text-muted-foreground mb-2 mt-2">
                  {resume.data.contact?.name && (
                    <div className="flex items-center mb-1">
                      <User className="h-3.5 w-3.5 mr-2 text-muted-foreground/70" />
                      <span>{resume.data.contact.name}</span>
                    </div>
                  )}
                  {resume.data.experience?.[0]?.role && (
                    <div className="flex items-center">
                      <Briefcase className="h-3.5 w-3.5 mr-2 text-muted-foreground/70" />
                      <span>{resume.data.experience[0].role}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center mt-4">
                  <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    Template: {resume.template_id}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href={`/?resume=${resume.id}`}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="flex-1 text-blue-600 hover:text-blue-700">
                  <Link href={`/preview/${resume.id}`}>
                    <Download className="h-4 w-4 mr-2" /> Download
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-none text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Resume</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete &quot;{resume.name}&quot;? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteResume(resume.id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}