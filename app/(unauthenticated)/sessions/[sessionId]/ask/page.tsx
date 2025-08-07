'use client'

import { useParams } from 'next/navigation'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const AskPage = () => {
    const params = useParams()
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>Ask a Question</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            className="w-full mb-4"
                            rows={4}
                            placeholder="Type your question here..."
                        />
                        <div className="flex gap-4">
                            <Button variant="default">
                                Submit
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AskPage