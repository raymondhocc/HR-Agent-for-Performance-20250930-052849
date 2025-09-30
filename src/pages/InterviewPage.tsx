import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Bot, User, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatService, formatTime } from '@/lib/chat';
import type { ChatState, Candidate } from '../../worker/types';
import { toast } from 'sonner';
export function InterviewPage() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    sessionId: chatService.getSessionId(),
    isProcessing: false,
    model: 'openai/gpt-4o',
    streamingMessage: ''
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fetchCandidateAndStart = async () => {
      if (!candidateId) {
        navigate('/');
        return;
      }
      try {
        const response = await fetch(`/api/candidates/${candidateId}`);
        if (!response.ok) throw new Error('Candidate not found');
        const result = await response.json();
        if (result.success) {
          const foundCandidate = result.data;
          setCandidate(foundCandidate);
          chatService.newSession();
          const welcomeMessage = {
            id: crypto.randomUUID(),
            role: 'assistant' as const,
            content: `Hello ${foundCandidate.name}, welcome to your interview with L'Occitane. I am Aura, your AI interviewer for today. We will go through a series of questions to understand your skills and experience. Please take your time to answer. Are you ready to begin?`,
            timestamp: Date.now()
          };
          setChatState({
            messages: [welcomeMessage],
            sessionId: chatService.getSessionId(),
            isProcessing: false,
            model: 'openai/gpt-4o',
            streamingMessage: ''
          });
        } else {
          throw new Error(result.error || 'Failed to load candidate');
        }
      } catch (error) {
        toast.error('Failed to load interview session.', { description: error instanceof Error ? error.message : 'Please try again.' });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCandidateAndStart();
  }, [candidateId, navigate]);
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [chatState.messages, chatState.streamingMessage]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatState.isProcessing) return;
    const message = input.trim();
    setInput('');
    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: message,
      timestamp: Date.now()
    };
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      streamingMessage: '',
      isProcessing: true,
    }));
    await chatService.sendMessage(message, chatState.model, (chunk) => {
      setChatState(prev => ({
        ...prev,
        streamingMessage: (prev.streamingMessage || '') + chunk
      }));
    });
    const response = await chatService.getMessages();
    if (response.success && response.data) {
        setChatState(prev => ({
            ...prev,
            messages: response.data?.messages || prev.messages,
            isProcessing: false,
            streamingMessage: ''
        }));
    } else {
        toast.error('Failed to get response from AI.');
        setChatState(prev => ({ ...prev, isProcessing: false, streamingMessage: '' }));
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };
  if (isLoading || !candidate) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      <Card className="w-full shadow-lg border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center gap-4 p-4 border-b">
          <Avatar className="h-12 w-12">
            <AvatarImage src={candidate.avatarUrl} alt={candidate.name} />
            <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl font-semibold">{candidate.name}</CardTitle>
            <CardDescription>Interview for {candidate.position}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[50vh]" ref={scrollAreaRef}>
            <div className="p-4 space-y-6">
              {chatState.messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && <Bot className="h-6 w-6 text-slate-500 flex-shrink-0" />}
                  <div className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-[#7554A3] text-primary-foreground rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-foreground rounded-bl-none'
                  }`}>
                    <p className="text-base whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-xs opacity-60 mt-2 text-right">{formatTime(msg.timestamp)}</p>
                  </div>
                  {msg.role === 'user' && <User className="h-6 w-6 text-slate-500 flex-shrink-0" />}
                </motion.div>
              ))}
              {chatState.streamingMessage && (
                <div className="flex items-end gap-2 justify-start">
                  <Bot className="h-6 w-6 text-slate-500 flex-shrink-0" />
                  <div className="max-w-[85%] p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-foreground rounded-bl-none">
                    <p className="text-base whitespace-pre-wrap">{chatState.streamingMessage}<span className="animate-pulse">|</span></p>
                  </div>
                </div>
              )}
              {chatState.isProcessing && !chatState.streamingMessage && (
                <div className="flex items-end gap-2 justify-start">
                  <Bot className="h-6 w-6 text-slate-500 flex-shrink-0" />
                  <div className="max-w-[85%] p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-foreground rounded-bl-none">
                    <div className="flex space-x-1.5">
                      <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                      <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                      <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2 items-start">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer..."
                className="flex-1 min-h-[44px] max-h-40 resize-none"
                rows={1}
                disabled={chatState.isProcessing}
              />
              <Button
                type="submit"
                size="icon"
                className="h-11 w-11 flex-shrink-0 bg-[#FFC107] hover:bg-[#FFC107]/90 text-slate-900"
                disabled={!input.trim() || chatState.isProcessing}
              >
                {chatState.isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}