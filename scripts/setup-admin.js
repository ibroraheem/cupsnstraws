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

async function setupAdmin(email, password) {
  try {
    // First, check if the user exists in admin_users
    const { data: existingAdmin, error: getAdminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (getAdminError && getAdminError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw getAdminError;
    }

    if (existingAdmin) {
      console.log('User is already an admin');
      return true;
    }

    // Create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${supabaseUrl}/auth/callback`
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user data returned');

    const userId = authData.user.id;
    console.log('Created new auth user');

    // Create the admin user record
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert([
        {
          id: userId,
          email: email,
          role: 'super_admin'
        }
      ]);

    if (adminError) throw adminError;

    console.log('Admin user created successfully!');
    console.log('Email:', email);
    console.log('User ID:', userId);
    return true;
  } catch (error) {
    console.error('Error creating admin:', error);
    return false;
  }
}

// Get email and password from command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Please provide email and password as arguments:');
  console.error('node setup-admin.js <email> <password>');
  process.exit(1);
}

setupAdmin(email, password)
  .then(success => {
    if (success) {
      console.log('Setup completed successfully!');
    } else {
      console.error('Setup failed!');
    }
    process.exit(success ? 0 : 1);
  }); 