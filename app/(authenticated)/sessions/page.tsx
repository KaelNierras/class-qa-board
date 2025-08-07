'use client';

import Table from '@/components/Table'
import { Button } from '@/components/ui/button';
import React from 'react'
import { Session } from '@/types/index';

const sessions = {
  data: [
    {
      id: "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
      title: "Math Q&A Session",
      created_at: "2024-06-01T10:00:00Z",
      created_by: "user-1111-2222-3333-4444",
    },
    {
      id: "b2c3d4e5-f6a7-8901-bcde-2345678901bc",
      title: "Science Discussion",
      created_at: "2024-06-02T14:30:00Z",
      created_by: "user-5555-6666-7777-8888",
    },
    {
      id: "c3d4e5f6-a7b8-9012-cdef-3456789012cd",
      title: "History Review",
      created_at: "2024-06-03T09:15:00Z",
      created_by: "user-9999-aaaa-bbbb-cccc",
    },
  ],
}

const sort = "title"
const order = "asc"

const SessionsPage = () => {
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
