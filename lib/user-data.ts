import { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";

export function useUserData() {
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();
    }, []);

    return user;
}

export default useUserData;