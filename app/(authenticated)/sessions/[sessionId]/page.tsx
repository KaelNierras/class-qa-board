'use client';

import { Question } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { TimerIcon } from 'lucide-react';
import moment from 'moment';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { useState } from 'react';
import PreviewModal from './components/PreviewModal';
import QuestionCard from './components/QuestionCard';

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
                questions.data.map((q: Question, index: number) => (
                    <QuestionCard
                        key={q.id}
                        question={q}
                        setPreviewQuestion={setPreviewQuestion}
                        index={index}
                        total={questions.data.length}
                    />
                ))
            )}
        </>
    )
}

export default SessionPage