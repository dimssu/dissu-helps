import './ToggleButton.scss';

export default function ToggleButton({
    checked,
    onChange,
    disabled = false,
    variant = 'default',
}: {
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
    variant?: 'default' | 'success' | 'primary' | 'aica';
}) {
    return (
        <label className={`switch ${variant} ${disabled ? 'disabled' : ''}`}>
            <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
            <span className="slider"></span>
        </label>
    );
}
