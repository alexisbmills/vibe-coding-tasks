import { Input, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ onSearch, placeholder = 'Search tasks...' }: 
  SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 300),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <InputGroup size="md">
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search tasks"
        pr="4.5rem"
      />
      <InputRightElement width="4.5rem">
        {searchQuery ? (
          <IconButton
            aria-label="Clear search"
            icon={<CloseIcon />}
            size="sm"
            onClick={handleClear}
            variant="ghost"
          />
        ) : (
          <SearchIcon color="gray.400" />
        )}
      </InputRightElement>
    </InputGroup>
  );
}; 