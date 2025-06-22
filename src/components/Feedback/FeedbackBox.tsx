import React, { useState } from 'react';
import { FiStar, FiX } from 'react-icons/fi';
import styles from './Feedback.module.scss';
import Button from '../Button/Button';

export interface FeedbackData {
    rating?: number;
    comment?: string;
}

export interface FeedbackBoxProps {
    showStars?: boolean;
    showComment?: boolean;
    title?: string;
    starRatingLabel?: string;
    commentLabel?: string;
    commentPlaceholder?: string;
    submitButtonText?: string;
    onSubmit: (feedback: FeedbackData) => void;
    onClose?: () => void;
    style?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    starContainerStyle?: React.CSSProperties;
    textareaStyle?: React.CSSProperties;
    buttonStyle?: React.CSSProperties;
    theme?: 'light' | 'dark';
    setIsOpen?: (isOpen: boolean) => void;
}

const FeedbackBox: React.FC<FeedbackBoxProps> = ({
    showStars = true,
    showComment = true,
    title = 'Share your feedback',
    starRatingLabel = 'How would you rate your experience?',
    commentLabel = 'Have any suggestions?',
    commentPlaceholder = 'Tell us how we can improve...',
    submitButtonText = 'Submit',
    onSubmit,
    onClose,
    style,
    titleStyle,
    labelStyle,
    starContainerStyle,
    textareaStyle,
    buttonStyle,
    theme = 'light',
    setIsOpen
}) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        const feedback: FeedbackData = {};
        if (showStars) feedback.rating = rating;
        if (showComment) feedback.comment = comment;
        onSubmit(feedback);
        onClose?.();
        setIsOpen?.(false);
    };

    return (
        <div className={`${styles.feedbackBox} ${styles[theme]}`} style={style}>
            <h3 className={styles.title} style={titleStyle}>{title}</h3>

            {showStars && (
                <div className={styles.starSection}>
                    <p style={labelStyle}>{starRatingLabel}</p>
                    <div className={styles.starsContainer} style={starContainerStyle}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar
                                key={star}
                                className={styles.star}
                                size={24}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                style={{
                                    fill: star <= (hoverRating || rating) ? 'var(--star-active-color)' : 'none',
                                    color: 'var(--star-active-color)',
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {showComment && (
                <div className={styles.commentSection}>
                    <label htmlFor="feedback-comment" style={labelStyle}>{commentLabel}</label>
                    <textarea
                        id="feedback-comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={commentPlaceholder}
                        rows={4}
                        style={textareaStyle}
                    />
                </div>
            )}

            <Button onClick={handleSubmit} variant="primary" style={buttonStyle}>
                {submitButtonText}
            </Button>
        </div>
    );
};

export default FeedbackBox; 