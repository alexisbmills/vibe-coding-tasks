import './styles/App.css'
import { BrowserRouter as Router, useRoutes } from 'react-router-dom'
import { Suspense } from 'react'
import {
  Box,
  Center,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react'
import ErrorBoundary from './components/ErrorBoundary'
import { routes } from './routes'

const LoadingFallback = () => (
  <Center h="100vh">
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
    />
  </Center>
)

const AppRoutes = () => {
  const element = useRoutes(routes)
  return element
}

function App() {
  const bgColor = useColorModeValue('gray.50', 'gray.900')

  return (
    <ErrorBoundary>
      <Box minH="100vh" bg={bgColor}>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <AppRoutes />
          </Suspense>
        </Router>
      </Box>
    </ErrorBoundary>
  )
}

export default App
