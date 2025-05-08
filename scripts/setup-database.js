import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSql(sql) {
  const response = await fetch(`${supabaseUrl}/rest/v1/sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Prefer': 'params=single-object'
    },
    body: JSON.stringify({
      query: sql
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to execute SQL');
  }

  return await response.json();
}

async function setupDatabase() {
  try {
    // Create customers table
    const { error: customersError } = await supabase
      .from('customers')
      .select('*')
      .limit(1)
      .then(() => ({ error: null }))
      .catch(async () => {
        return await executeSql(`
          create table if not exists public.customers (
            id uuid default uuid_generate_v4() primary key,
            email text unique not null,
            name text not null,
            phone text,
            created_at timestamp with time zone default timezone('utc'::text, now()) not null,
            updated_at timestamp with time zone default timezone('utc'::text, now()) not null
          );
        `);
      });

    if (customersError) throw customersError;
    console.log('Created customers table');

    // Create customer_addresses table
    const { error: addressesError } = await supabase
      .from('customer_addresses')
      .select('*')
      .limit(1)
      .then(() => ({ error: null }))
      .catch(async () => {
        return await executeSql(`
          create table if not exists public.customer_addresses (
            id uuid default uuid_generate_v4() primary key,
            customer_id uuid references public.customers(id) on delete cascade,
            address text not null,
            city text not null,
            state text not null,
            is_default boolean default false,
            created_at timestamp with time zone default timezone('utc'::text, now()) not null
          );
        `);
      });

    if (addressesError) throw addressesError;
    console.log('Created customer_addresses table');

    // Create admin_users table
    const { error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(1)
      .then(() => ({ error: null }))
      .catch(async () => {
        return await executeSql(`
          create table if not exists public.admin_users (
            id uuid primary key references auth.users(id) on delete cascade,
            email text unique not null,
            role text not null check (role in ('admin', 'super_admin')),
            created_at timestamp with time zone default timezone('utc'::text, now()) not null
          );
        `);
      });

    if (adminError) throw adminError;
    console.log('Created admin_users table');

    // Enable RLS for each table
    await executeSql('alter table public.customers enable row level security;');
    await executeSql('alter table public.customer_addresses enable row level security;');
    await executeSql('alter table public.admin_users enable row level security;');
    console.log('Enabled Row Level Security');

    // Drop existing policies
    const dropPolicies = [
      'drop policy if exists "Allow customers to view their own data" on public.customers;',
      'drop policy if exists "Allow customers to update their own data" on public.customers;',
      'drop policy if exists "Allow customers to view their own addresses" on public.customer_addresses;',
      'drop policy if exists "Allow customers to manage their own addresses" on public.customer_addresses;',
      'drop policy if exists "Allow admins to view all data" on public.customers;',
      'drop policy if exists "Allow admins to manage all data" on public.customers;',
      'drop policy if exists "Allow admins to view admin users" on public.admin_users;',
      'drop policy if exists "Allow super admins to manage admin users" on public.admin_users;'
    ];

    for (const policy of dropPolicies) {
      await executeSql(policy);
    }

    // Create new policies
    const createPolicies = [
      `create policy "Allow customers to view their own data"
        on public.customers for select
        to authenticated
        using (auth.uid() = id);`,

      `create policy "Allow customers to update their own data"
        on public.customers for update
        to authenticated
        using (auth.uid() = id);`,

      `create policy "Allow customers to view their own addresses"
        on public.customer_addresses for select
        to authenticated
        using (auth.uid() = customer_id);`,

      `create policy "Allow customers to manage their own addresses"
        on public.customer_addresses for all
        to authenticated
        using (auth.uid() = customer_id);`,

      `create policy "Allow admins to view all data"
        on public.customers for select
        to authenticated
        using (
          exists (
            select 1 from public.admin_users
            where admin_users.id = auth.uid()
          )
        );`,

      `create policy "Allow admins to manage all data"
        on public.customers for all
        to authenticated
        using (
          exists (
            select 1 from public.admin_users
            where admin_users.id = auth.uid()
            and admin_users.role = 'super_admin'
          )
        );`,

      `create policy "Allow admins to view admin users"
        on public.admin_users for select
        to authenticated
        using (
          exists (
            select 1 from public.admin_users
            where admin_users.id = auth.uid()
          )
        );`,

      `create policy "Allow super admins to manage admin users"
        on public.admin_users for all
        to authenticated
        using (
          exists (
            select 1 from public.admin_users
            where admin_users.id = auth.uid()
            and admin_users.role = 'super_admin'
          )
        );`
    ];

    for (const policy of createPolicies) {
      await executeSql(policy);
    }
    console.log('Created security policies');

    console.log('Database setup completed successfully!');
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    return false;
  }
}

setupDatabase()
  .then(success => {
    if (success) {
      console.log('Setup completed successfully!');
    } else {
      console.error('Setup failed!');
    }
    process.exit(success ? 0 : 1);
  }); 