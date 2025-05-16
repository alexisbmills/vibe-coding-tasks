import {
  Button,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  RepeatIcon as ArchiveIcon,
  ViewIcon as InboxIcon 
} from '@chakra-ui/icons';

interface FilterBarProps {
  showArchived: boolean;
  onToggleArchived: () => void;
}

export const FilterBar = ({ showArchived, onToggleArchived }: FilterBarProps) => {
  const activeBg = useColorModeValue('blue.500', 'blue.200');
  const activeColor = useColorModeValue('white', 'gray.800');
  const inactiveBg = useColorModeValue('gray.100', 'gray.700');
  const inactiveColor = useColorModeValue('gray.800', 'white');

  return (
    <Tooltip label={showArchived ? 'Show active tasks' : 'Show archived tasks'}>
      <Button
        size="sm"
        leftIcon={showArchived ? <InboxIcon /> : <ArchiveIcon />}
        onClick={onToggleArchived}
        bg={showArchived ? activeBg : inactiveBg}
        color={showArchived ? activeColor : inactiveColor}
        _hover={{
          bg: showArchived ? 'blue.600' : 'gray.200',
        }}
        aria-pressed={showArchived}
      >
        {showArchived ? 'Show Active' : 'Show Archived'}
      </Button>
    </Tooltip>
  );
}; 