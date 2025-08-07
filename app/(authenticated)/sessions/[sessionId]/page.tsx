'use client';

import { Question } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { TimerIcon } from 'lucide-react';
import moment from 'moment';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { useState } from 'react';
import QuestionPreviewModal from './components/QuestionPreviewModal';
import QuestionCard from './components/QuestionCard';
import QRCode from "react-qr-code";

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
            <QuestionPreviewModal
                previewQuestion={previewQuestion}
                setPreviewQuestion={setPreviewQuestion}
            />
            {questions.data.length === 0 ? (
                <div className="text-center text-muted-foreground mt-8">
                    No questions have been asked yet.
                </div>
            ) : (
                <div className='grid grid-cols-1 lg:grid-cols-5 gap-5'>
                    <div className='col-span-2'>
                        <div className="mb-8 flex items-center justify-center">
                            {questions.data[0]?.created_at && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-secondary font-medium shadow-sm">
                                    <TimerIcon className="h-4 w-4" />
                                    {moment(questions.data[0].created_at).format('dddd, MMMM Do YYYY • h:mm a')}
                                </div>
                            )}
                        </div>

                        {
                            questions.data.length > 0 && (
                                <div className="flex justify-center my-6">
                                    <QRCode
                                        value={process.env.NEXT_PUBLIC_BASE_URL + 'sessions/' + sessionId + '/ask'}

                                        bgColor="#ffffff"
                                        fgColor="#000000"
                                        level="Q"
                                    />
                                </div>
                            )
                        }
                    </div>

                    <div className="flex flex-col gap-4 col-span-3 h-full lg:h-[calc(100vh-130px)] overflow-y-auto">
                        {questions.data.map((q: Question, index: number) => (
                            <QuestionCard
                                key={q.id}
                                question={q}
                                setPreviewQuestion={setPreviewQuestion}
                                index={index}
                                total={questions.data.length}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default SessionPage