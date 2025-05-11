
import React from 'react';

const Logo = ({ className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="bg-orange p-2 rounded-md mr-2">
        <i className="ri-file-copy-line text-navy text-xl"></i>
      </div>
      <span className="text-orange font-bold text-xl">MesclaPDF</span>
    </div>
  );
};

export default Logo;
