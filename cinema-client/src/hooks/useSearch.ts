import { useEffect } from "react";

type UserSearchComponentProps = {
  debouncedValue: string;
  onSearch: () => void;
};

export const useSearch = ({
  debouncedValue,
  onSearch,
}: UserSearchComponentProps) => {
  useEffect(() => {
    onSearch();
  }, [debouncedValue, onSearch]);
};
