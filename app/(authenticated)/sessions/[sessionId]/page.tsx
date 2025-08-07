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
            {question.data.map((q: Question) => (
                <Card key={q.id} className='space-y-2 mb-4'>
                    <CardHeader>
                        <CardTitle>{q.created_by}</CardTitle>
                        <CardDescription>{q.text}</CardDescription>
                    </CardHeader>
                </Card>
            ))}
        </>
    )
}

export default SessionPage