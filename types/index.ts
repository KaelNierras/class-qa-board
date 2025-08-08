export interface UserIdentityData {
    avatar_url: string;
    email: string;
    email_verified: boolean;
    full_name: string;
    iss: string;
    name: string;
    phone_verified: boolean;
    picture: string;
    provider_id: string;
    sub: string;
}

export interface UserIdentity {
    identity_id: string;
    id: string;
    user_id: string;
    identity_data: UserIdentityData;
    provider: string;
    last_sign_in_at: string;
    created_at: string;
    updated_at: string;
    email: string;
}

export interface UserAppMetadata {
    provider: string;
    providers: string[];
}

export interface UserMetadata extends UserIdentityData {}

export interface User {
    id: string;
    aud: string;
    role: string;
    email: string;
    email_confirmed_at: string;
    phone: string;
    confirmed_at: string;
    last_sign_in_at: string;
    app_metadata: UserAppMetadata;
    user_metadata: UserMetadata;
    identities: UserIdentity[];
    created_at: string;
    updated_at: string;
    is_anonymous: boolean;
}

export interface Session {
  id: string
  title: string
  created_at: string
  created_by: string
  is_open: boolean
}

export interface Question {
    id: string
    text: string
    session_id: string
    created_by: string
    created_at: string
}