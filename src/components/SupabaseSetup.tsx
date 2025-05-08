import React, { useState } from 'react';
import { setupSupabase } from '../utils/setupSupabase';
import toast from 'react-hot-toast';

const SupabaseSetup: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    setLoading(true);
    try {
      const success = await setupSupabase();
      if (success) {
        toast.success('Supabase setup completed successfully!');
      } else {
        toast.error('Failed to set up Supabase. Check console for details.');
      }
    } catch (error) {
      console.error('Setup error:', error);
      toast.error('An error occurred during setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleSetup}
        disabled={loading}
        className={`px-4 py-2 rounded-md text-white ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700'
        }`}
      >
        {loading ? 'Setting up...' : 'Setup Supabase Database'}
      </button>
    </div>
  );
};

export default SupabaseSetup; 