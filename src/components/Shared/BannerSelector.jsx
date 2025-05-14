import React from 'react';
import { FiCheck } from 'react-icons/fi';
import { BANNER_OPTIONS } from '../../hooks/banners';

export const BannerSelector = ({ currentBanner, onSelect }) => {
  return (
    <div className="gap-3 md:gap-4 p-3 flex items-center justify-center">
      {BANNER_OPTIONS.map((banner) => (
        <div 
          key={banner.id}
          onClick={() => onSelect(banner.id)}
          className={`
            h-5 w-4 md:h-6 md:w-5  rounded-lg cursor-pointer transition-all
            ${banner.bgClass}
            ${currentBanner === banner.id ? 'ring-4 ring-offset-2 ring-purple-500 scale-105' : ''}
          `}
        >
          {currentBanner === banner.id && (
            <div className="h-full flex items-center justify-center">
              <FiCheck className={`text-2xl ${banner.textClass}`} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};