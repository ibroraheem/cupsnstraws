import React from 'react';
import { GlassWater } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <GlassWater className="w-8 h-8 text-primary-600 mr-2" />
      <span className="text-xl font-display font-bold text-primary-600">
        Cups <span className="text-yellow-500">N</span> Straws
      </span>
    </div>
  );
};

export default Logo;