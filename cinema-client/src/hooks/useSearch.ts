import { useEffect } from "react";

/**
 * Props for the useSearch hook.
 */
type UseSearchProps = {
  /** The debounced value that triggers the search effect. */
  debouncedValue: string;
  /** 
   * The callback function to execute when the debounced value changes.
   * IMPORTANT: This function should be memoized with `useCallback` in the
   * parent component to prevent unnecessary re-executions of the effect.
   */
  onSearch: () => void;
};

/**
 * Triggers a search action when a debounced value changes.
 *
 * @param {UseSearchProps} props The properties for the hook.
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * const handleSearch = useCallback(() => {
 *   // Perform API call or state update with debouncedSearchTerm
 *   console.log('Searching for:', debouncedSearchTerm);
 * }, [debouncedSearchTerm]); // Memoize the search function
 *
 * useSearch({
 *   debouncedValue: debouncedSearchTerm,
 *   onSearch: handleSearch,
 * });
 */
export const useSearch = ({
  debouncedValue,
  onSearch,
}: UseSearchProps) => {
  useEffect(() => {
    onSearch();
  }, [debouncedValue, onSearch]);
};
