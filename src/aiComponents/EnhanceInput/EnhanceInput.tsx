import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { getLlmConfig } from '../llmConfigs';
import styles from './EnhanceInput.module.scss';
import { FaMagic } from 'react-icons/fa';

interface EnhanceInputProps {
  prompt?: string;
}

const EnhanceInput: React.FC<EnhanceInputProps> = ({
  prompt = 'Fix the grammar in the following text:'
}) => {
  const [activeInput, setActiveInput] =
    useState<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const hideIcon = useCallback(() => {
    setPosition(null);
    setActiveInput(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const showIcon = useCallback(
    (input: HTMLInputElement | HTMLTextAreaElement) => {
      if (input.value.trim().length > 0) {
        setActiveInput(input);
        const rect = input.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY + 5,
          left: rect.right + window.scrollX - 28
        });
      } else if (activeInput === input) {
        hideIcon();
      }
    },
    [activeInput, hideIcon]
  );

  useEffect(() => {
    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        showIcon(target);
      }
    };

    const handleInput = (event: Event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        showIcon(target);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        iconRef.current &&
        !iconRef.current.contains(target) &&
        target !== activeInput
      ) {
        hideIcon();
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('input', handleInput);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('input', handleInput);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showIcon, hideIcon, activeInput]);

  const handleEnhance = async () => {
    if (!activeInput) return;

    const textToEnhance = activeInput.value;
    setIsLoading(true);
    setError(null);

    try {
      const llmConfig = getLlmConfig();
      const { apiEndpoint, headers, formatMessages, parseResponse } = llmConfig;
      const body = formatMessages([], textToEnhance, prompt);
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error?.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      const result = parseResponse(data);
      if (!result) {
        throw new Error('Empty response from the LLM.');
      }

      const valueSetter = Object.getOwnPropertyDescriptor(
        activeInput instanceof HTMLInputElement
          ? window.HTMLInputElement.prototype
          : window.HTMLTextAreaElement.prototype,
        'value'
      )?.set;
      valueSetter?.call(activeInput, result);

      const event = new Event('input', { bubbles: true });
      activeInput.dispatchEvent(event);
      hideIcon();
    } catch (e: any) {
      setError(e.message || 'Failed to enhance text.');
      console.error(e);
      // Hide error after 3 seconds
      setTimeout(() => {
        hideIcon();
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  if (!position || !activeInput) {
    return null;
  }

  const iconContent = (
    <div
      className={styles.enhanceIcon}
      ref={iconRef}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {isLoading ? (
        <div className={styles.loader}></div>
      ) : error ? (
        <div className={styles.error} title={error}>
          !
        </div>
      ) : (
        <button onClick={handleEnhance} title={prompt}>
          <FaMagic />
        </button>
      )}
    </div>
  );

  return ReactDOM.createPortal(iconContent, document.body);
};

export default EnhanceInput;
