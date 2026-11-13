/// <reference types="astro/client" />

import type { SupabaseClient, User } from '@supabase/supabase-js';

interface ImportMetaEnv {
  readonly SUPABASE_URL?: string;
  readonly SUPABASE_ANON_KEY?: string;
}

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient;
      user: User | null;
    }
  }
}

export {};
