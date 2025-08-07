'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Question } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'

const SessionPage = () => {
    const supabase = createClient();
    const params = useParams()
    const sessionId = params.sessionId
    const [question, setQuestion] = React.useState<{ data: Question[] }>({ data: [] });

    useEffect(() => {
        if (!sessionId) return;

        const fetchQuestions = async () => {
            const { data, error } = await supabase
                .from('questions')
                .select()
                .eq('session_id', sessionId);
            if (error) {
                console.error('Error fetching questions:', error);
            } else {
                setQuestion({ data: data as Question[] });
            }
        };

        const channel = supabase.channel('public:questions')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'questions' },
                (payload) => {
                    setQuestion((prev) => ({
                        data: [...prev.data, payload.new as Question],
                    }));
                }
            )
            .subscribe();

        fetchQuestions();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [sessionId]);

    return (
        <>
            {question.data.length === 0 ? (
                <div className="text-center text-muted-foreground mt-8">
                    No questions have been asked yet.
                </div>
            ) : (
                question.data.map((q: Question) => (
                    <Card key={q.id} className="mb-6 rounded-2xl shadow-none border-0 bg-gradient-to-b from-[#e9e3fc] to-[#d6e6fa] p-0">
                        <CardHeader className="pb-0">
                            <div className="text-xs text-[#7c6fc7] font-medium mb-2">
                                Question {question.data.indexOf(q) + 1} of {question.data.length}
                            </div>
                            <div className="text-xs text-[#5c5470]">
                                Asked by: {q.created_by || 'Unknown'}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0 pb-6">
                            <div className="text-xl font-semibold text-[#22223b] leading-snug mb-2">
                                {q.text}
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </>
    )
}

export default SessionPage