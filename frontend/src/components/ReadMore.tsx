import React, { useState } from 'react';

interface ReadMoreProps {
  text: string;
  wordLimit?: number; // how many words to show before 'Read More'
}

const ReadMore: React.FC<ReadMoreProps> = ({ text, wordLimit = 20 }) => {
  const [expanded, setExpanded] = useState(false);

  const words = text.trim().split(/\s+/);
  const isLong = words.length > wordLimit;

  const previewText = isLong ? words.slice(0, wordLimit).join(' ') : text;

  return (
    <span>
      {expanded || !isLong ? text : `${previewText}... `}
      {isLong && (
        <button onClick={() => setExpanded(!expanded)} className="text-blue-500 hover:underline">
          {expanded ? 'Show Less' : 'Read More'}
        </button>
      )}
    </span>
  );
};

export default ReadMore;
