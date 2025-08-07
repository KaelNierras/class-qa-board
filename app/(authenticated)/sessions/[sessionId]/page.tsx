'use client';

import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'

const SessionPage = () => {
    const params = useParams()
    return (
        <div>{params.sessionId}</div>
    )
}

export default SessionPage