"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { signout } from "@/lib/auth-actions";
import { User } from "@/types/index";

const AuthButton = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user as User | null);
    };
    fetchUser();
  }, []);
  if (user) {
    return (
      <>
        <Button
          variant="outline"
          className="mr-2"
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          Dashboard
        </Button>
        <Button
          onClick={() => {
            signout();
            setUser(null);
          }}
        >
          Log out
        </Button>
      </>
    );
  }
  return (
    <Button
      variant="outline"
      onClick={() => {
        router.push("/login");
      }}
    >
      Login
    </Button>
  );
};

export default AuthButton;
