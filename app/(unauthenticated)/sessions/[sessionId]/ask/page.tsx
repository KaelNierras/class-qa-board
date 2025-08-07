'use client'

import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/client'
import { Input } from '@/components/ui/input'

const AskPage = () => {
    const supabase = createClient();
    const params = useParams()
    const sessionId = params.sessionId
    const [name, setName] = React.useState('')
    const [question, setQuestion] = React.useState('')
    const [submitted, setSubmitted] = React.useState(false)

    // Load name from localStorage on mount
    useEffect(() => {
        const storedName = localStorage.getItem('askerName')
        if (storedName) setName(storedName)
    }, [])

    // Store name in localStorage on change
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
        localStorage.setItem('askerName', e.target.value)
    }

    const handleCreate = async () => {
        const { data, error } = await supabase
            .from('questions')
            .insert([{
                text: question,
                session_id: sessionId,
                created_by: name,
            }])
            .select()
            .single();

        if (error) {
            alert(error.message);
            return;
        }
        setQuestion('');
        setSubmitted(true);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>Ask a Question</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {submitted ? (
                            <div className="text-center py-8">
                                <div className="text-lg font-semibold mb-2">Your question has been submitted!</div>
                                <div className="text-gray-500">Thank you for your question.</div>
                            </div>
                        ) : (
                            <form
                                onSubmit={e => {
                                    e.preventDefault();
                                    handleCreate();
                                }}
                            >
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
                                    <Button variant="default" type="submit">
                                        Submit
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