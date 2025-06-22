import React from 'react';
import './ToggleButton.scss';

export default function ToggleButton({
    checked,
    onChange,
    disabled = false,
    variant = 'primary',
    style,
    trackStyle,
    thumbStyle,
}: {
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
    style?: React.CSSProperties;
    trackStyle?: React.CSSProperties;
    thumbStyle?: React.CSSProperties;
}) {
    return (
        <label style={style} className={`switch ${variant} ${disabled ? 'disabled' : ''}`}>
            <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
            <span className="slider" style={trackStyle}>
                <span className="thumb" style={thumbStyle} />
            </span>
        </label>
    );
}
