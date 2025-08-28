'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import { Label } from '@radix-ui/react-label';
import React, { useEffect, useState } from 'react'
import TopParticipants from './components/TopParticipants';

const INITIAL_VISIBLE = 5;

const ParticipantsPage = () => {
    const supabase = createClient();
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchParticipants = async () => {
            let query = supabase
                .from('questions')
                .select('created_by,created_at');

            if (startDate) {
                query = query.gte('created_at', startDate);
            }
            if (endDate) {
                query = query.lte('created_at', endDate);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching participants:', error);
            } else if (data) {
                const newCounts: Record<string, number> = {};
                data.forEach((item: { created_by: string }) => {
                    if (item.created_by) {
                        newCounts[item.created_by] = (newCounts[item.created_by] || 0) + 1;
                    }
                });
                setCounts(newCounts);
            }
        };

        fetchParticipants();
    }, [startDate, endDate]);

    // CSV export feature
    const handleExportCSV = () => {
        const rows = [
            ['Participant', 'Questions Asked'],
            ...Object.entries(counts)
                .sort((a, b) => b[1] - a[1])
                .map(([participant, count]) => [participant, count.toString()])
        ];
        const csvContent = rows.map(e => e.map(field => `"${field.replace(/"/g, '""')}"`).join(',')).join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        const today = new Date();
        const formattedDate = today.toISOString().slice(0, 10);
        link.setAttribute('download', `export_${formattedDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Sorted participants after top 3
    const sortedEntries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const restEntries = sortedEntries.slice(3);
    const visibleEntries = showAll ? restEntries : restEntries.slice(0, INITIAL_VISIBLE);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Participants</h1>
            <p className="text-gray-600 mb-4">
                See how many questions each participant has asked.
            </p>

            <div className="mb-4 flex gap-4 items-center justify-between">
                <div className='flex gap-4'>
                    <div>
                        <Label>
                            Start
                        </Label>
                        <input
                            id="start-date"
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            className="h-10 w-full rounded-md border px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <Label>
                            End
                        </Label>
                        <input
                            id="end-date"
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            className="h-10 w-full rounded-md border px-3 py-2 text-sm"
                        />
                    </div>
                </div>
                <Button
                    onClick={handleExportCSV}
                    disabled={Object.keys(counts).length === 0}
                    type="button"
                >
                    Export
                </Button>
            </div>

            <div className='mt-10'>
                <h2 className="font-semibold mb-2">Top Participants</h2>
                {/* Top 3 participants in a row */}
                <TopParticipants counts={counts} />

                {/* The rest in a single column */}
                <div className="flex flex-col gap-3">
                    {visibleEntries.map(([participant, count], idx) => (
                        <Card key={participant} className="border border-gray-200 shadow-sm">
                            <CardHeader className="flex flex-row items-center gap-3">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-lg font-semibold text-secondary">
                                    {idx + 4}
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
                    {restEntries.length > INITIAL_VISIBLE && !showAll && (
                        <Button
                            variant="outline"
                            className="mt-2"
                            onClick={() => setShowAll(true)}
                        >
                            Show All
                        </Button>
                    )}
                    {showAll && restEntries.length > INITIAL_VISIBLE && (
                        <Button
                            variant="outline"
                            className="mt-2"
                            onClick={() => setShowAll(false)}
                        >
                            Show Less
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ParticipantsPage