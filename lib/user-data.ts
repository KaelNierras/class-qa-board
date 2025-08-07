import { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import { User } from '@/types';

export function useUserData() {
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user as User);
        };
        fetchUser();
    }, []);

    return user;
}

export default useUserData;