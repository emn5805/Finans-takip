import React, { useState, useEffect, ChangeEvent } from 'react';

interface CurrencyInputProps {
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
    autoFocus?: boolean;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
    value,
    onChange,
    placeholder,
    className,
    required,
    autoFocus,
}) => {
    const [displayValue, setDisplayValue] = useState('');

    // Format number to Turkish currency format (1.250,50)
    const formatNumber = (val: string) => {
        if (!val) return '';

        // Remove all non-digit characters except comma
        const cleanVal = val.replace(/[^\d,]/g, '');

        // Split integer and decimal parts
        const parts = cleanVal.split(',');
        let integerPart = parts[0];
        const decimalPart = parts.length > 1 ? ',' + parts[1].slice(0, 2) : '';

        // Add thousand separators to integer part
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        return integerPart + decimalPart;
    };

    // Convert formatted string back to number string for parent (1250.50)
    const parseNumber = (val: string) => {
        // Remove dots, replace comma with dot
        return val.replace(/\./g, '').replace(',', '.');
    };

    useEffect(() => {
        // When external value changes, update display value
        if (value !== undefined && value !== null) {
            // If value is a number or string number like "1250.50", format it to "1.250,50"
            const stringValue = value.toString();
            const formatted = formatNumber(stringValue.replace('.', ','));
            setDisplayValue(formatted);
        } else {
            setDisplayValue('');
        }
    }, [value]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Allow only digits and comma
        if (!/^[\d.,]*$/.test(inputValue)) return;

        // Handle backspace/delete on formatted value - just let it happen, then reformat
        // But we need to be careful not to block user from typing comma

        // Simple approach: clean input, format it, update display
        // But we need to handle the cursor position ideally, or just simple format at end

        // Let's try a simpler approach for the input handling:
        // 1. Get raw input
        // 2. Clean it (keep digits and ONE comma)
        // 3. Format it for display
        // 4. Parse it for parent

        // Remove all non-digits except last comma if multiple
        let cleanInput = inputValue.replace(/[^\d,]/g, '');
        const commaCount = (cleanInput.match(/,/g) || []).length;
        if (commaCount > 1) {
            const parts = cleanInput.split(',');
            cleanInput = parts[0] + ',' + parts.slice(1).join('');
        }

        const formatted = formatNumber(cleanInput);
        setDisplayValue(formatted);

        const parsed = parseNumber(formatted);
        onChange(parsed);
    };

    return (
        <input
            type="text"
            inputMode="decimal"
            value={displayValue}
            onChange={handleChange}
            placeholder={placeholder}
            className={className}
            required={required}
            autoFocus={autoFocus}
        />
    );
};

export default CurrencyInput;
