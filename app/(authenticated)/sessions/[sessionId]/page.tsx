'use client';

import { Entry, Session } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { TimerIcon, Trash2 } from 'lucide-react';
import moment from 'moment';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useState } from 'react';
import EntryPreviewModal from './_components/EntryPreviewModal';
import EntryCard from './_components/EntryCard';
import QRCode from "react-qr-code";
import { Button } from '@/components/ui/button';
import { BeatLoader } from 'react-spinners';
import DeleteSessionModal from './_components/DeleteSessionModal';

const SessionPage = () => {
    const supabase = createClient();
    const params = useParams()
    const router = useRouter();
    const sessionId = params.sessionId
    const [entries, setEntries] = React.useState<{ data: Entry[] }>({ data: [] });
    const [previewEntry, setPreviewEntry] = useState<Entry | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (!sessionId) return;

        const fetchEntries = async () => {
            const { data, error } = await supabase
            .from('entries')
            .select()
            .eq('session_id', sessionId)
            .order('created_at', { ascending: false });
            if (error) {
            console.error('Error fetching entries:', error);
            } else {
            setEntries({ data: data as Entry[] });
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

        const channel = supabase.channel('public:entries')
            .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'entries' },
            (payload) => {
                setEntries((prev) => ({
                data: [...prev.data, payload.new as Entry].sort(
                    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                ),
                }));
            }
            )
            .subscribe();

        fetchSession();
        fetchEntries();

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
            <EntryPreviewModal
                previewEntry={previewEntry}
                entryType={session?.type ?? "question"}
                setPreviewEntry={setPreviewEntry}
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
                    {entries.data.length === 0 ? (
                        <div className="col-span-3 flex items-center justify-center h-full text-primary/70">
                            {session?.type === 'question' ? 'No questions have been asked yet.' : 'No answers have been given yet.'}
                        </div>
                    ) : (
                        <div className='col-span-3 h-full lg:h-[calc(100vh-150px)] overflow-y-auto pr-2'>
                            {entries.data.map((q: Entry, index: number) => (
                                <EntryCard
                                    entryType={session?.type ?? "question"}
                                    key={q.id}
                                    entry={q}
                                    setPreviewEntry={setPreviewEntry}
                                    index={index}
                                    total={entries.data.length}
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