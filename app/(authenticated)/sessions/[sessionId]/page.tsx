'use client';

import { Card, CardContent,CardHeader } from '@/components/ui/card';
import { Question } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { TimerIcon } from 'lucide-react';
import moment from 'moment';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { useState } from 'react';
import PreviewModal from './components/PreviewModal';

const SessionPage = () => {
    const supabase = createClient();
    const params = useParams()
    const sessionId = params.sessionId
    const [questions, setQuestions] = React.useState<{ data: Question[] }>({ data: [] });
    const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);


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
                setQuestions({ data: data as Question[] });
            }
        };

        const channel = supabase.channel('public:questions')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'questions' },
                (payload) => {
                    setQuestions((prev) => ({
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
            <PreviewModal
                previewQuestion={previewQuestion}
                setPreviewQuestion={setPreviewQuestion}
            />
            <div className="mb-8 flex items-center justify-center">
                {questions.data[0]?.created_at && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-secondary font-medium shadow-sm">
                        <TimerIcon className="h-4 w-4" />
                        {moment(questions.data[0].created_at).format('dddd, MMMM Do YYYY • h:mm a')}
                    </div>
                )}
            </div>
            {questions.data.length === 0 ? (
                <div className="text-center text-muted-foreground mt-8">
                    No questions have been asked yet.
                </div>
            ) : (
                questions.data.map((q: Question) => (
                    <Card
                        onClick={() => setPreviewQuestion(q)}
                        key={q.id}
                        className="mb-6 rounded-2xl shadow-none border-0 bg-gradient-to-b from-secondary/10 to-primary/10 p-0"
                    >
                        <CardHeader className="pb-0">
                            <div className="text-xs text-primary font-medium mb-2">
                                Question {questions.data.indexOf(q) + 1} of {questions.data.length}
                            </div>
                            <div className="text-xs text-primary/70 mb-2">
                                Asked by: {q.created_by || 'Unknown'}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0 pb-6">
                            <div className="text-xl font-semibold text-primary leading-snug mb-2">
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