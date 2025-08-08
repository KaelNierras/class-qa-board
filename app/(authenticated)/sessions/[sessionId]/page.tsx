'use client';

import { Question, Session } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { TimerIcon, Trash2 } from 'lucide-react';
import moment from 'moment';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useState } from 'react';
import QuestionPreviewModal from './components/QuestionPreviewModal';
import QuestionCard from './components/QuestionCard';
import QRCode from "react-qr-code";
import { Button } from '@/components/ui/button';
import { BeatLoader } from 'react-spinners';
import DeleteSessionModal from './components/DeleteSessionModal';

const SessionPage = () => {
    const supabase = createClient();
    const params = useParams()
    const router = useRouter();
    const sessionId = params.sessionId
    const [questions, setQuestions] = React.useState<{ data: Question[] }>({ data: [] });
    const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

        const fetchSession = async () => {
            const { data, error } = await supabase
                .from('sessions')
                .select()
                .eq('id', sessionId)
                .single();
            if (error) {
                console.error('Error fetching session:', error);
            } else {
                setSession(data as Session);
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

        fetchSession();
        fetchQuestions();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [sessionId]);

    const handleCloseSession = async () => {
        if (!sessionId || !session) return;
        const newIsOpen = !session.is_open;

        // Only update if the current state is different
        const currentIsOpen = session.is_open;
        if (currentIsOpen !== newIsOpen) {
            const { error } = await supabase
                .from('sessions')
                .update({
                    is_open: newIsOpen,
                    created_by: session.created_by,
                })
                .eq('id', sessionId)
                .select();
            if (error) {
                console.error('Error updating session:', error);
                return;
            }
        }

        setSession((prev) => prev ? { ...prev, is_open: newIsOpen } : null);

    };

    const handleDeleteSession = async () => {
        if (!sessionId) return;

        const { error } = await supabase
            .from('sessions')
            .delete()
            .eq('id', sessionId);
        if (error) {
            console.error('Error deleting session:', error);
        } else {
            router.push('/sessions');
        }
    };

    return (
        <>
            <QuestionPreviewModal
                previewQuestion={previewQuestion}
                setPreviewQuestion={setPreviewQuestion}
            />

            <DeleteSessionModal
                open={isDeleteModalOpen}
                onConfirm={handleDeleteSession}
                onCancel={() => setIsDeleteModalOpen(false)}
            />

            {/* Loading Screen */}
            {!session ? (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <BeatLoader size={15} />
                    </div>
                </div>
            ) : (
                <div className='grid grid-cols-1 lg:grid-cols-5 gap-5'>
                    <div className='col-span-2'>
                        <div className="mb-8 flex flex-col items-center justify-center gap-4">
                            {session?.title && (
                                <div className="text-xl font-bold text-center">
                                    {session.title}
                                </div>
                            )}
                            {session?.created_at && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-secondary font-medium shadow-sm">
                                    <TimerIcon className="h-4 w-4" />
                                    {moment(session.created_at).format('dddd, MMMM Do YYYY • h:mm a')}
                                </div>
                            )}
                        </div>

                        {
                            sessionId && (
                                <div className="flex justify-center my-6">
                                    <QRCode
                                        value={process.env.NEXT_PUBLIC_BASE_URL + 'sessions/' + sessionId + '/ask'}
                                        title="Scan to Ask a Question"
                                        bgColor="#ffffff"
                                        fgColor="#000000"
                                        level="Q"
                                    />
                                </div>
                            )
                        }
                    </div>
                    {questions.data.length === 0 ? (
                        <div className="col-span-3 flex items-center justify-center h-full text-primary/70">
                            No questions have been asked yet.
                        </div>
                    ) : (
                        <div className='col-span-3 h-full lg:h-[calc(100vh-150px)] overflow-y-auto pr-2'>
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
                    )}

                    <div className="fixed bottom-4 right-4 z-50 flex gap-2">
                        <Button
                            onClick={handleCloseSession}
                            variant={session?.is_open ? "destructive" : "default"}
                        
                        >
                            {session?.is_open ? 'Close Session' : 'Open Session'}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteModalOpen(true)}
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete Session
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}

export default SessionPage