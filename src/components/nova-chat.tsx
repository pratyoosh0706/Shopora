'use client';

import { Bot, Loader, Send, User, X } from 'lucide-react';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetFooter,
} from './ui/sheet';
import { Textarea } from './ui/textarea';
import { useState, useRef, useEffect, useTransition } from 'react';
import { askNova } from '@/app/actions';
import type { ChatMessage } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useToast } from '@/hooks/use-toast';

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: 'assistant',
    content: "Hi! I'm Nova, your AI shopping assistant. How can I help you find the perfect product today?",
  },
];

export function NovaChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
    };
    const loadingMessage: ChatMessage = {
      id: Date.now() + 1,
      role: 'loading',
      content: 'Nova is thinking...',
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    const currentInput = input;
    setInput('');

    startTransition(async () => {
      const result = await askNova(currentInput);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Oh no! Something went wrong.",
          description: result.error,
        });
        setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessage.id));
        return;
      }

      const assistantMessage: ChatMessage = {
        id: Date.now(),
        role: 'assistant',
        content: result.response,
      };

      setMessages((prev) => {
        const newMessages = prev.filter((msg) => msg.id !== loadingMessage.id);
        return [...newMessages, assistantMessage];
      });
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        >
          <Bot className="h-7 w-7" />
          <span className="sr-only">Open AI Chat</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bot /> Nova Assistant
          </SheetTitle>
          <SheetDescription>
            Your AI-powered shopping companion. Ask me anything!
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 my-4 -mx-6" ref={scrollAreaRef}>
          <div className="px-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-start gap-3',
                  message.role === 'user' && 'justify-end'
                )}
              >
                {message.role !== 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'rounded-lg p-3 max-w-[80%] text-sm',
                    message.role === 'assistant' && 'bg-primary/10',
                    message.role === 'user' &&
                      'bg-primary text-primary-foreground',
                    message.role === 'loading' &&
                      'bg-muted text-muted-foreground animate-pulse'
                  )}
                >
                  {message.role === 'loading' ? (
                    <div className="flex items-center gap-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Nova is thinking...</span>
                    </div>
                  ) : (
                    message.content
                  )}
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <SheetFooter>
          <form onSubmit={handleSendMessage} className="flex w-full gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., 'Find affordable gaming headphones under ₹2000'"
              className="flex-1 resize-none"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e as any);
                }
              }}
              disabled={isPending}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isPending}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
