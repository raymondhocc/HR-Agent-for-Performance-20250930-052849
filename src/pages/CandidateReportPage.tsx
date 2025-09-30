import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Briefcase, Star, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import type { Candidate } from '../../worker/types';
export function CandidateReportPage() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchCandidate = async () => {
      if (!candidateId) return;
      setIsLoading(true);
      try {
        const response = await fetch(`/api/candidates/${candidateId}`);
        if (!response.ok) {
          throw new Error('Candidate not found');
        }
        const result = await response.json();
        if (result.success) {
          setCandidate(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch candidate data');
        }
      } catch (error) {
        console.error(error);
        setCandidate(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCandidate();
  }, [candidateId]);
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-6 w-48" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  if (!candidate) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-semibold text-destructive">Candidate Not Found</h2>
        <p className="text-muted-foreground mt-2">The candidate you are looking for does not exist.</p>
        <Button asChild className="mt-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8 animate-fade-in">
        <div>
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Interview Report</h1>
        </div>
        <Card className="overflow-hidden shadow-lg border-slate-200 dark:border-slate-800">
          <CardHeader className="bg-slate-50 dark:bg-slate-900/50 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-800 shadow-md">
                <AvatarImage src={candidate.avatarUrl} alt={candidate.name} />
                <AvatarFallback className="text-3xl">{candidate.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-3xl font-bold">{candidate.name}</CardTitle>
                <CardDescription className="text-lg text-muted-foreground flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  {candidate.position}
                </CardDescription>
                <Badge className="mt-2" variant={candidate.status === 'Hired' ? 'default' : 'secondary'}>{candidate.status}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2"><Star className="h-5 w-5 text-[#FFC107]" /> Competency Score</h3>
                <p className="text-4xl font-bold text-center text-[#7554A3]">8.5<span className="text-2xl text-muted-foreground">/10</span></p>
                <p className="text-muted-foreground text-sm">Placeholder score based on mock analysis. Full AI analysis coming in Phase 3.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Strengths</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Strong communication skills</li>
                  <li>Good problem-solving examples</li>
                  <li>Positive attitude</li>
                </ul>
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" /> AI Summary</h3>
              <p className="text-muted-foreground italic">
                "This is a placeholder for the AI-generated summary. In Phase 3, this section will contain a detailed analysis of the candidate's performance, highlighting key competencies, cultural fit, and providing an overall recommendation based on the interview transcript."
              </p>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2"><XCircle className="h-5 w-5 text-red-500" /> Areas for Improvement</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Lacks specific examples for teamwork</li>
                  <li>Could be more knowledgeable about brand history</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}