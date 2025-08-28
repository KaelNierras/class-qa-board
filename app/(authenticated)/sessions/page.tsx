'use client';

import Table from '@/components/Table'
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'
import { Session } from '@/types/index';
import { createClient } from '@/utils/supabase/client';
import moments from 'moment';
import useUserData from '@/lib/user-data';
import { useRouter } from 'next/navigation';

const sort = "title"
const order = "asc"

const SessionsPage = () => {
  const supabase = createClient();
  const [sessions, setSessions] = useState<{ data: Session[] }>({ data: [] });
  const user = useUserData();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select()
        .eq('created_by', user.id);
      if (error) {
        console.error('Error fetching sessions:', error);
      } else {
        setSessions({ data: data as Session[] });
      }
    };

    const channel = supabase.channel('public:sessions')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sessions' },
        (payload) => {
          setSessions((prev) => ({
            data: [...prev.data, payload.new as Session],
          }));
        }
      )
      .subscribe();

    fetchSessions();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  const columns: { key: keyof Session; label: string; sortable?: boolean; render?: (value: any, row?: Session) => string | JSX.Element }[] = [
    { key: "title", label: "Title", sortable: false, render: (value) => <span className="font-semibold">{value}</span> },
    { key: "created_at", label: "Created At", sortable: false, render: (value) => <span className="text-xs text-gray-500">{moments(value).format('LLL')}</span> },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sessions</h1>
      <p className="text-gray-600">Manage your sessions here.</p>
      <Table<Session>
        columns={columns}
        data={sessions.data}
        sortColumn={sort as keyof Session}
        sortOrder={order as "asc" | "desc"}
        actions={
          (row: Session) => (
            <div className="flex space-x-2">
              <Button
                onClick={() => {
                  router.push(`/sessions/${row.id}`);
                }}>
                View
              </Button>
            </div>
          )
        }
      />
    </div>
  )
}

export default SessionsPage
