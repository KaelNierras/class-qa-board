import React from 'react'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface TopParticipantsProps {
    counts: Record<string, number>;
}

const TopParticipants = ({ counts }: TopParticipantsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            {Object.entries(counts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([participant, count], idx) => (
                    <Card key={participant} className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-lg font-semibold text-secondary">
                                {idx + 1}
                            </div>
                            <div>
                                <CardTitle className="text-base font-semibold">{participant}</CardTitle>
                                <div className="text-xs text-gray-500">Participant</div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Questions Asked</span>
                                    <span className="font-bold text-lg">{count}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
        </div>
    )
}

export default TopParticipants