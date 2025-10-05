'use client'

import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/client'
import { Input } from '@/components/ui/input'
import { Session } from '@/types'
import { BeatLoader } from 'react-spinners'

const AskPage = () => {
    const supabase = createClient();
    const params = useParams()
    const sessionId = params.sessionId
    const [name, setName] = React.useState('')
    const [question, setQuestion] = React.useState('')
    const [session, setSession] = React.useState<{ data: Session | null }>({ data: null });
    const [state, setState] = React.useState<'loading' | 'success' | 'idle' | 'error'>('idle');

    // Load name from localStorage on mount
    useEffect(() => {
        const storedName = localStorage.getItem('askerName')
        if (storedName) setName(storedName)
    }, []);

    // Fetch session data
    useEffect(() => {
        const fetchSession = async () => {
            const { data, error } = await supabase
                .from('sessions')
                .select()
                .eq('id', sessionId)
                .single();
            if (error) {
                console.error('Error fetching session:', error);
            } else {
                setSession({ data });
            }
        };

        fetchSession();

        const channel = supabase.channel('public:sessions')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'sessions' },
                (payload) => {
                    if (payload.new.id === sessionId) {
                        setSession({ data: payload.new as Session });
                    }
                }
            ).subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, []);

    // Store name in localStorage on change
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
        localStorage.setItem('askerName', e.target.value)
    }

    const handleCreate = async () => {
        if (state === 'loading') return;
        setState('loading');
        const { data, error } = await supabase
            .from('questions')
            .insert([{
                text: question,
                session_id: sessionId,
                created_by: name.trim(),
            }])
            .select()
            .single();

        if (error) {
            alert(error.message);
            setState('error');
            return;
        }
        setQuestion('');
        setState('success');
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>{session.data?.type === 'question' ? "Ask a Question" : "Provide an Answer"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!session.data ? (
                            <div className="text-center py-8">
                                <span className="flex justify-center items-center">
                                    <BeatLoader size={15} />
                                </span>
                            </div>
                        ) : !session.data.is_open ? (
                            <div className="text-center py-8">
                                <div className="text-lg font-semibold mb-2">This session is closed.</div>
                                <div className="text-gray-500 mb-5">{session.data?.type === 'question' ? "You can no longer submit questions." : "You can no longer submit answers."}</div>
                            </div>
                        ) : state === 'success' ? (
                            <div className="text-center py-8">
                                <div className="text-lg font-semibold mb-2">{session.data?.type === 'question' ? "Your question has been submitted!" : "Your answer has been submitted!"}</div>
                                <div className="text-gray-500 mb-5">Thank you for your {session.data?.type === 'question' ? "question." : "answer."}</div>
                                <Button variant="outline" onClick={() => setState('idle')}>
                                    Ask another {session.data?.type === 'question' ? "question" : "answer"}
                                </Button>
                            </div>
                        ) : (
                            <form
                                onSubmit={e => {
                                    e.preventDefault();
                                    handleCreate();
                                }}
                            >
                                <div className="mb-2 text-sm text-gray-600">
                                    {session.data.title
                                        ? <><span className="font-medium">{session.data.title}</span></>
                                        : "No topic set for this session."}
                                </div>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={handleNameChange}
                                    className="w-full mb-4"
                                    placeholder="Your name"
                                    required
                                />
                                <Textarea
                                    value={question}
                                    onChange={e => setQuestion(e.target.value)}
                                    className="w-full mb-4"
                                    rows={4}
                                    placeholder="Type your question here..."
                                    required
                                />
                                <div className="flex gap-4">
                                    <Button variant="default" type="submit" disabled={state === 'loading'}>
                                        {state === 'loading' ? "Submitting..." : "Submit"}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AskPage
