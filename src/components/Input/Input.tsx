import clsx from 'clsx';
import React from 'react';

import styles from './Input.module.scss';

type InputProps = {
    readonly placeholder?: string;
    readonly type?: string;
    readonly pattern?: string;
    readonly isValid?: boolean;
    readonly errorMessage?: string;
    readonly convertedText?: string;
    readonly value: string | number;
    readonly style?: React.CSSProperties;
    readonly inputStyle?: React.CSSProperties;
    readonly labelStyle?: React.CSSProperties;
    readonly unitContainer?: React.CSSProperties;
    readonly unitStyle?: React.CSSProperties;
    readonly onChange: Function;
    readonly name?: string;
    readonly onEnter?: Function;
    readonly disabled?: boolean;
    readonly readOnly?: boolean;
    readonly maxLength?: number;
    readonly unit?: string | React.ReactNode;
    readonly textAreaRows?: number;
    readonly allowNegative?: boolean;
    readonly allowDecimal?: boolean;
    readonly numberOfDecimals?: number;
    readonly allowZero?: boolean;
    readonly onClick?: () => void;
    readonly isActive?: boolean;
    readonly showFloatingLabel?: boolean;
    readonly containerClassName?: string;
    readonly inputClassName?: string;
    readonly labelClassName?: string;
    readonly unitContainerClassName?: string;
    readonly unitClassName?: string;
    readonly errorClassName?: string;
    readonly convertedTextClassName?: string;
};

const isEmpty = (value: any): boolean => {
    return (
        value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0) ||
        (typeof value === 'number' && isNaN(Number(value)))
    );
};

const sanitizeValue = (
    val: string | number,
    type: string,
    allowDecimal: boolean,
    allowNegative: boolean,
    allowZero: boolean,
): string | number => {
    if (type !== 'number') return val;

    let sanitized = val?.toString?.() ?? '';
    sanitized = sanitized.replace(/[^\d.-]/g, '');

    if (!allowNegative) sanitized = sanitized.replace(/-/g, '');
    if (!allowDecimal) sanitized = sanitized.split('.')[0] ?? '';

    const numericVal = sanitized.replace('-', '');
    if (!allowZero && numericVal === '0') sanitized = '';

    return sanitized;
};

function Input({
    type = 'text',
    placeholder = '',
    pattern = '',
    isValid = true,
    errorMessage = '',
    convertedText = '',
    value = '',
    onChange,
    name,
    onEnter,
    style,
    inputStyle,
    labelStyle,
    unitContainer,
    unitStyle,
    disabled = false,
    readOnly = false,
    maxLength,
    unit,
    textAreaRows = 4,
    allowNegative = false,
    allowDecimal = false,
    numberOfDecimals = 4,
    allowZero = true,
    onClick,
    isActive = false,
    showFloatingLabel = true,
    containerClassName,
    inputClassName,
    labelClassName,
    unitContainerClassName,
    unitClassName,
    errorClassName,
    convertedTextClassName,
}: InputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let newValue: string | number = e.target.value;
        if (pattern && !e.target.validity.valid) return;
        if (maxLength && newValue?.length > maxLength) return;
        if (type === 'number' && allowDecimal) {
            const decimalParts = (newValue as string).split('.');
            if (decimalParts[1] && decimalParts[1].length > numberOfDecimals) {
                newValue = `${decimalParts[0]}.${decimalParts[1].slice(0, numberOfDecimals)}`;
            }
        }
        onChange(newValue);
    };

    const renderInput = () => {
        const commonProps = {
            name,
            value: sanitizeValue(value, type, allowDecimal, allowNegative, allowZero),
            onChange: handleChange,
            onKeyUp: (e: React.KeyboardEvent) => {
                if (onEnter && e.key === 'Enter') onEnter();
            },
            disabled,
            readOnly,
            style: inputStyle,
            onWheel: (e: any) => e.target?.blur?.(),
            placeholder: !showFloatingLabel ? placeholder : undefined,
        };

        if (type === 'textarea') {
            return (
                <textarea
                    {...commonProps}
                    className={clsx(
                        styles.FormInput,
                        {
                            [styles.Invalid!]: !isValid,
                            [styles.HasData!]: !isEmpty(value),
                            [styles.WithUnit!]: !!unit,
                            [styles.ReadOnly!]: readOnly,
                        },
                        inputClassName,
                    )}
                    rows={textAreaRows}
                />
            );
        }
        return (
            <input
                {...commonProps}
                className={clsx(
                    styles.FormInput,
                    {
                        [styles.Invalid!]: !isValid,
                        [styles.HasData!]: !isEmpty(value),
                        [styles.WithUnit!]: !!unit,
                        [styles.ReadOnly!]: readOnly,
                        [styles.Active!]: isActive,
                    },
                    inputClassName,
                )}
                type={type}
                pattern={pattern}
                onKeyDown={(e) => {
                    if (type === 'number') {
                        ['e', 'E', '+'].includes(e.key) && e.preventDefault();
                        if (!allowNegative && e.key === '-') e.preventDefault();
                        if (!allowDecimal && e.key === '.') e.preventDefault();
                        if (!allowZero && e.key === '0' && value === '') e.preventDefault();
                    }
                }}
                onPaste={(e) => {
                    if (type === 'number') {
                        e.preventDefault();
                        let pasteData = e.clipboardData.getData('text');
                        let sanitized = pasteData.replace(/[^\d.-]/g, '');
                        if (!allowNegative) sanitized = sanitized.replace('-', '');
                        if (!allowDecimal) sanitized = sanitized.split('.')[0] ?? '';
                        if (!allowZero && sanitized.replace('-', '') === '0') sanitized = '';
                        onChange(sanitized);
                    }
                }}
            />
        );
    };

    return (
        <div
            className={clsx(
                styles.InputContainer,
                {
                    [styles.ContainerWithErrorMsg!]: !!errorMessage,
                    [styles.TextareaContainer!]: type === 'textarea',
                },
                containerClassName,
            )}
            style={style}
            onClick={onClick}
        >
            {renderInput()}
            {showFloatingLabel && (
                <label
                    className={clsx(
                        styles.FormLabel,
                        {
                            [styles.FormLabelInputHasValue!]: !isEmpty(value),
                        },
                        labelClassName,
                    )}
                    style={labelStyle}
                >
                    {placeholder}
                </label>
            )}
            {unit && (
                <div
                    className={clsx(
                        {
                            [styles.UnitWrap!]: true,
                            [styles.UnitWithData!]: !isEmpty(value),
                            [styles.Invalid!]: !isValid,
                            [styles.Active!]: isActive,
                        },
                        unitContainerClassName,
                    )}
                    style={unitContainer}
                >
                    <div style={unitStyle} className={clsx(styles.Unit, unitClassName)}>
                        {unit}
                    </div>
                </div>
            )}
            {!!(!isValid && errorMessage) && <div className={clsx(styles.Error, errorClassName)}>{errorMessage}</div>}
            {!!(isValid && convertedText) && (
                <div className={clsx(styles.ConvertedText, convertedTextClassName)}>{convertedText}</div>
            )}
        </div>
    );
}

export default Input;
