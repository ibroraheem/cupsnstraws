import { supabase } from '../lib/supabase';

export const setupSupabase = async () => {
  try {
    // Create customers table
    const { error: customersError } = await supabase.rpc('create_customers_table', {
      sql: `
        create table if not exists customers (
          id uuid default uuid_generate_v4() primary key,
          email text unique not null,
          name text not null,
          phone text,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
      `
    });

    if (customersError) throw customersError;

    // Create customer_addresses table
    const { error: addressesError } = await supabase.rpc('create_customer_addresses_table', {
      sql: `
        create table if not exists customer_addresses (
          id uuid default uuid_generate_v4() primary key,
          customer_id uuid references customers(id) on delete cascade,
          address text not null,
          city text not null,
          state text not null,
          is_default boolean default false,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
      `
    });

    if (addressesError) throw addressesError;

    // Create admin_users table
    const { error: adminError } = await supabase.rpc('create_admin_users_table', {
      sql: `
        create table if not exists admin_users (
          id uuid primary key references auth.users(id) on delete cascade,
          email text unique not null,
          role text not null check (role in ('admin', 'super_admin')),
          created_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
      `
    });

    if (adminError) throw adminError;

    // Enable RLS
    const { error: rlsError } = await supabase.rpc('enable_rls', {
      sql: `
        alter table customers enable row level security;
        alter table customer_addresses enable row level security;
        alter table admin_users enable row level security;
      `
    });

    if (rlsError) throw rlsError;

    // Create policies
    const { error: policiesError } = await supabase.rpc('create_policies', {
      sql: `
        -- Customers policies
        create policy "Allow customers to view their own data"
          on customers for select
          to authenticated
          using (auth.uid() = id);

        create policy "Allow customers to update their own data"
          on customers for update
          to authenticated
          using (auth.uid() = id);

        -- Addresses policies
        create policy "Allow customers to view their own addresses"
          on customer_addresses for select
          to authenticated
          using (auth.uid() = customer_id);

        create policy "Allow customers to manage their own addresses"
          on customer_addresses for all
          to authenticated
          using (auth.uid() = customer_id);

        -- Admin policies
        create policy "Allow admins to view all data"
          on customers for select
          to authenticated
          using (
            exists (
              select 1 from admin_users
              where admin_users.id = auth.uid()
            )
          );

        create policy "Allow admins to manage all data"
          on customers for all
          to authenticated
          using (
            exists (
              select 1 from admin_users
              where admin_users.id = auth.uid()
              and admin_users.role = 'super_admin'
            )
          );

        create policy "Allow admins to view admin users"
          on admin_users for select
          to authenticated
          using (
            exists (
              select 1 from admin_users
              where admin_users.id = auth.uid()
            )
          );

        create policy "Allow super admins to manage admin users"
          on admin_users for all
          to authenticated
          using (
            exists (
              select 1 from admin_users
              where admin_users.id = auth.uid()
              and admin_users.role = 'super_admin'
            )
          );
      `
    });

    if (policiesError) throw policiesError;

    // Create function to handle new user signup
    const { error: functionError } = await supabase.rpc('create_signup_function', {
      sql: `
        create or replace function handle_new_user()
        returns trigger as $$
        begin
          insert into customers (id, email, name, phone)
          values (new.id, new.email, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'phone');
          return new;
        end;
        $$ language plpgsql security definer;
      `
    });

    if (functionError) throw functionError;

    // Create trigger for new user signup
    const { error: triggerError } = await supabase.rpc('create_signup_trigger', {
      sql: `
        drop trigger if exists on_auth_user_created on auth.users;
        create trigger on_auth_user_created
          after insert on auth.users
          for each row execute procedure handle_new_user();
      `
    });

    if (triggerError) throw triggerError;

    console.log('Supabase setup completed successfully!');
    return true;
  } catch (error) {
    console.error('Error setting up Supabase:', error);
    return false;
  }
}; 