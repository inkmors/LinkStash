import { useState } from 'react';

export const Tooltip = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-10 bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-gray-800 border-solid"></div>
        </div>
      )}
    </div>
  );
};