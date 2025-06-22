import React, { useState } from 'react';
import { FiMessageSquare, FiX } from 'react-icons/fi';
import styles from './Feedback.module.scss';
import FeedbackBox from './FeedbackBox';
import type { FeedbackBoxProps } from './FeedbackBox';

interface FeedbackProps extends FeedbackBoxProps {
    mode?: 'global' | 'inline';
    globalLabel?: string;
    position?: 'left' | 'right';
}

const Feedback: React.FC<FeedbackProps> = ({
    mode = 'inline',
    globalLabel = 'Feedback',
    position = 'right',
    ...boxProps
}) => {
    const [isOpen, setIsOpen] = useState(false);

    if (mode === 'inline') {
        return <FeedbackBox {...boxProps} />;
    }

    return (
        <div
            className={`${styles.globalContainer} ${styles[position]} ${isOpen ? styles.open : ''}`}
        >
            {isOpen && (
                <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
                    <FiX />
                </button>
            )}
            <div className={styles.globalTrigger} onClick={() => setIsOpen(!isOpen)}>
                <FiMessageSquare />
                <span>{globalLabel}</span>
            </div>
            <div className={styles.feedbackContent}>
                <FeedbackBox {...boxProps} />
            </div>
        </div>
    );
};

export default Feedback;
