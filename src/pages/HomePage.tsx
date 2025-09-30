import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, User, Briefcase, CheckCircle, Clock, PlayCircle, Search, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { Candidate, CandidateStatus } from '../../worker/types';
const statusConfig: Record<CandidateStatus, { icon: React.ElementType; color: string; textColor: string }> = {
  'Pending Interview': { icon: Clock, color: 'bg-yellow-500', textColor: 'text-yellow-500' },
  'Interviewing': { icon: PlayCircle, color: 'bg-blue-500', textColor: 'text-blue-500' },
  'Completed': { icon: FileText, color: 'bg-purple-500', textColor: 'text-purple-500' },
  'Hired': { icon: CheckCircle, color: 'bg-green-500', textColor: 'text-green-500' },
};
export function HomePage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidatePosition, setNewCandidatePosition] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchCandidates = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/candidates');
      if (!response.ok) throw new Error('Failed to fetch candidates');
      const result = await response.json();
      if (result.success) {
        setCandidates(result.data);
      } else {
        throw new Error(result.error || 'An unknown error occurred');
      }
    } catch (error) {
      toast.error('Could not load candidates.', { description: error instanceof Error ? error.message : 'Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);
  const handleCreateCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateName || !newCandidatePosition) {
      toast.warning('Please fill out all fields.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCandidateName, position: newCandidatePosition }),
      });
      if (!response.ok) throw new Error('Failed to create candidate');
      const result = await response.json();
      if (result.success) {
        toast.success(`Candidate ${result.data.name} created successfully!`);
        setCandidates(prev => [result.data, ...prev]);
        setIsDialogOpen(false);
        setNewCandidateName('');
        setNewCandidatePosition('');
      } else {
        throw new Error(result.error || 'An unknown error occurred');
      }
    } catch (error) {
      toast.error('Failed to create candidate.', { description: error instanceof Error ? error.message : 'Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  const renderSkeleton = () => (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <Skeleton className="h-6 w-28" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-16">
        <section className="animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Candidate Dashboard</h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Overview of all candidates in the hiring pipeline.
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-[#7554A3] hover:bg-[#7554A3]/90">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  New Interview Process
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleCreateCandidate}>
                  <DialogHeader>
                    <DialogTitle>Create New Interview</DialogTitle>
                    <DialogDescription>
                      Enter the candidate's details to start a new interview process.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Name</Label>
                      <Input id="name" value={newCandidateName} onChange={(e) => setNewCandidateName(e.target.value)} className="col-span-3" placeholder="e.g. Jane Doe" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="position" className="text-right">Position</Label>
                      <Input id="position" value={newCandidatePosition} onChange={(e) => setNewCandidatePosition(e.target.value)} className="col-span-3" placeholder="e.g. Beauty Host" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting} className="bg-[#7554A3] hover:bg-[#7554A3]/90">
                      {isSubmitting ? 'Creating...' : 'Create Candidate'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </section>
        <section className="animate-slide-up animation-delay-200">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => renderSkeleton())}
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">No candidates found</h3>
              <p className="mt-1 text-base text-gray-500">Get started by creating a new interview process.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {candidates.map((candidate) => {
                const statusInfo = statusConfig[candidate.status];
                const isActionable = candidate.status === 'Pending Interview' || candidate.status === 'Interviewing';
                const isReportReady = candidate.status === 'Completed' || candidate.status === 'Hired';
                return (
                  <Card key={candidate.id} className="flex flex-col transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1 border-slate-200 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={candidate.avatarUrl} alt={candidate.name} />
                        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl font-semibold">{candidate.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 pt-1">
                          <Briefcase className="h-4 w-4" />
                          {candidate.position}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex items-center gap-2">
                        <statusInfo.icon className={`h-4 w-4 ${statusInfo.textColor}`} />
                        <Badge variant="outline" className={`border-current ${statusInfo.textColor}`}>
                          {candidate.status}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full bg-[#FFC107] hover:bg-[#FFC107]/90 text-slate-900 focus:ring-2 focus:ring-offset-2 focus:ring-[#FFC107]">
                        <Link to={isReportReady ? `/report/${candidate.id}` : `/interview/${candidate.id}`}>
                          {isActionable ? 'Start Interview' : 'View Report'}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}