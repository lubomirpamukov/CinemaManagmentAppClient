import { useEffect, useState } from "react";

/**
 * Debounces a value. This hook returns a new value that only updates after the original
 * value has stopped changing for a specific amount of time.
 * 
 * Useful for delaying expensive operations like API calls based on user input.
 * 
 * @template T The type of the value to be debounced.
 * @param {T} value The value to debounce.
 * @param {number} [delay=500] The debounce delay in milliseconds.
 * @returns {T} The debounced value.
 */
export const useDebounce = <T>(value: T, delay = 500): T => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timeout = setTimeout (() => {
            setDebouncedValue(value);
        }, delay)

        return () => clearTimeout(timeout);
    }, [value, delay]);

    return debouncedValue;
};