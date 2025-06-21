import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { getLlmConfig } from '../llmConfigs';
import './Summarizer.scss';
import { FaMagic } from 'react-icons/fa';

const useTypewriter = (text: string, speed: number = 20) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (text) {
      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
        }
      }, speed);

      return () => {
        clearInterval(timer);
      };
    } else {
      setDisplayText('');
    }
  }, [text, speed]);

  return displayText;
};

const SummarizeIcon = () => (
//   <svg
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       d="M4 6H20M4 12H20M4 18H12"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//   </svg>
    <FaMagic />
);

const ErrorIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Summarizer: React.FC = () => {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null
  );
  const [summary, setSummary] = useState<string | null>(null);
  const displayText = useTypewriter(summary || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const hidePopup = useCallback(() => {
    setPosition(null);
    setSummary(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleSelection = useCallback(() => {
    const currentSelection = window.getSelection();
    if (
      currentSelection &&
      currentSelection.toString().trim().length > 10 &&
      !popupRef.current?.contains(currentSelection.anchorNode)
    ) {
      const range = currentSelection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      setPosition({
        top: rect.bottom + scrollY + 5,
        left: rect.left + scrollX + rect.width / 2
      });
      setSummary(null);
      setError(null);
    }
  }, []);

  useEffect(() => {
    const handleMouseUp = (event: MouseEvent) => {
      // Do not trigger selection if we are clicking inside the popup
      if (popupRef.current && popupRef.current.contains(event.target as Node)) {
        return;
      }
      setTimeout(() => handleSelection(), 0);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        hidePopup();
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleSelection, hidePopup]);

  const handleSummarize = async () => {
    const selection = window.getSelection();
    if (!selection) return;

    const textToSummarize = selection.toString();
    setIsLoading(true);
    setSummary(null);
    setError(null);

    try {
      const llmConfig = getLlmConfig();
      const { apiEndpoint, headers, formatMessages, parseResponse } = llmConfig;

      const context = 'Summarize the following text in one sentence:';
      const body = formatMessages([], textToSummarize, context);

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.error?.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const result = parseResponse(data);
      if (!result) {
        throw new Error('Empty response from the summarizer.');
      }
      setSummary(result);
    } catch (e: any) {
      setError(e.message || 'Failed to summarize.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!position) {
    return null;
  }

  const popupContent = (
    <div
      className="summarizer-popup"
      ref={popupRef}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {isLoading ? (
        <div className="summarizer-loader"></div>
      ) : error ? (
        <div className="summarizer-error">
          <ErrorIcon />
          <span>{error}</span>
        </div>
      ) : summary ? (
        <div className="summarizer-content">
          {displayText}
          <span className="summarizer-cursor"></span>
        </div>
      ) : (
        <button
          onClick={handleSummarize}
          className="summarizer-icon-button"
          title="Summarize"
        >
          <SummarizeIcon />
        </button>
      )}
    </div>
  );

  return ReactDOM.createPortal(popupContent, document.body);
};

export default Summarizer;
