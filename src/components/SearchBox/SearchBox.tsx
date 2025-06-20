import { useEffect, useState, useRef } from 'react';
import styles from './SearchBox.module.scss';
import clsx from 'clsx';
import { FiSearch, FiX } from 'react-icons/fi';

interface SearchBoxProps {
    onSearch?: (query: string) => void;
    placeholder?: string;
    containerStyle?: React.CSSProperties;
    wrapperStyle?: React.CSSProperties;
    expandedWrapperStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    searchIconStyle?: React.CSSProperties;
    cancelIconStyle?: React.CSSProperties;
}

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const SearchBox: React.FC<SearchBoxProps> = ({
    onSearch,
    placeholder = 'Search...',
    containerStyle,
    wrapperStyle,
    expandedWrapperStyle,
    inputStyle,
    searchIconStyle,
    cancelIconStyle,
}) => {
    const [queryText, setQueryText] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const searchBoxRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
                if (queryText.length === 0) {
                    setIsExpanded(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [queryText]);

    const debouncedQueryText = useDebounce(queryText.trim(), 300);

    useEffect(() => {
        if (debouncedQueryText.length >= 3) {
            onSearch?.(debouncedQueryText);
            setHasSearched(true);
        } else if (debouncedQueryText.length === 0 && hasSearched) {
            onSearch?.('');
            setHasSearched(false);
        }
    }, [debouncedQueryText]);

    const handleTextSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQueryText(value);
    };

    const handleExpandSearch = () => {
        setIsExpanded(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 300);
    };

    const handleCollapseSearch = () => {
        setIsExpanded(false);
        if (hasSearched) {
            setQueryText('');
            onSearch?.('');
            setHasSearched(false);
        } else {
            setQueryText('');
        }
    };

    return (
        <div
            className={clsx(styles.searchBox, { [styles.expanded!]: isExpanded })}
            ref={searchBoxRef}
            style={containerStyle}
        >
            <div
                className={clsx(styles.boxWrapper, { [styles.expanded!]: isExpanded })}
                onClick={!isExpanded ? handleExpandSearch : undefined}
                style={isExpanded ? { ...wrapperStyle, ...expandedWrapperStyle } : wrapperStyle}
            >
                <input
                    ref={inputRef}
                    className={clsx(
                        styles.searchInput,
                        {
                            [styles.HasData!]: !!queryText,
                            [styles.collapsed!]: !isExpanded,
                        },
                    )}
                    type="text"
                    onChange={handleTextSearch}
                    value={queryText}
                    placeholder={isExpanded ? placeholder : ''}
                    disabled={!isExpanded}
                    style={inputStyle}
                />
                {isExpanded ? (
                    <FiX
                        className={clsx(styles.cancelIcon)}
                        onClick={handleCollapseSearch}
                        style={cancelIconStyle}
                    />
                ) : (
                    <FiSearch
                        className={clsx(styles.searchIcon, { [styles.iconBadge!]: !isExpanded })}
                        onClick={!isExpanded ? handleExpandSearch : undefined}
                        style={searchIconStyle}
                    />
                )}
            </div>
        </div>
    );
};

export default SearchBox;
