import { supabase } from '../lib/supabase';

export const createFirstAdmin = async (email: string, password: string) => {
  try {
    // First, create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user data returned');

    // Then, create the admin user record
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert([
        {
          id: authData.user.id,
          email: email,
          role: 'super_admin'
        }
      ]);

    if (adminError) throw adminError;

    console.log('First admin user created successfully!');
    return true;
  } catch (error) {
    console.error('Error creating first admin:', error);
    return false;
  }
}; 