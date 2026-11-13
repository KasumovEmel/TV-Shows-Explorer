import { StrictMode } from 'react';

import { SWRConfig } from 'swr';

import { Results } from './components/Results';
import { Search } from './components/Search';
import { useSearchQuery } from './useSearchQuery';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import { NotificationProvider } from '@shared/components/NotificationProvider';
import { useTheme } from '@shared/theme/useTheme';

import type { SearchPageProps } from './components/Search';
import type { PropsWithChildren } from 'react';

import '@shared/styles/base.css';


const searchCache = { provider: () => new Map() };

export function App({ children }: PropsWithChildren) {
  const { theme, toggle } = useTheme();
  return (
    <StrictMode>
      <NotificationProvider>
        <ErrorBoundary>
          {(restored) => (
            <SWRConfig value={searchCache}>
              {children}
              <SearchPage restored={restored} theme={theme} onToggleTheme={toggle} />
            </SWRConfig>
          )}
        </ErrorBoundary>
      </NotificationProvider>
    </StrictMode>
  );
}

function SearchPage({ restored, theme, onToggleTheme }: SearchPageProps) {
  const { value, term, committedQuery, onChange, onSubmit } = useSearchQuery();
  return (
    <main>
      <Search
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        restored={restored}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />
      {term && <Results key={term} query={committedQuery} />}
    </main>
  );
}
