'use client';

import Table from '@/components/Table'
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'
import { Session } from '@/types/index';
import { createClient } from '@/utils/supabase/client';

const sort = "title"
const order = "asc"

const SessionsPage = () => {
  const supabase = createClient();
  const [sessions, setSessions] = useState<{ data: Session[] }>({ data: [] });

  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase.from('sessions').select('*');
      if (error) {
        console.error('Error fetching sessions:', error);
      } else {
        setSessions({ data: data as Session[] });
      }
    };

    fetchSessions();
  }, []);
  const columns: { key: keyof Session; label: string; sortable?: boolean; render?: (value: any, row?: Session) => string | JSX.Element }[] = [
    { key: "title", label: "Title", sortable: false },
    { key: "created_at", label: "Created At", sortable: false },
    { key: "created_by", label: "Created By", sortable: false },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sessions</h1>
      <p className="text-gray-600">This is the sessions page where you can manage your sessions.</p>
      <Table<Session>
        columns={columns}
        data={sessions.data}
        sortColumn={sort as keyof Session}
        sortOrder={order as "asc" | "desc"}
        onSort={(key: keyof Session, order: "asc" | "desc") => {
          // Handle sorting logic here
          console.log(`Sorting by ${key} in ${order} order`);
        }}
        actions={
          (row: Session) => (
            <div className="flex space-x-2">
              <Button
                onClick={() => {
                  // Handle view action
                  console.log(`Viewing session with ID: ${row.id}`);
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
