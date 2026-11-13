import { StrictMode } from 'react';

import { ApiProvider } from './components/ApiProvider';
import { Results } from './components/Results';
import { Search } from './components/Search';
import { useSearchQuery } from './useSearchQuery';
import { useSearchTransition } from './useSearchTransition';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import { NotificationProvider } from '@shared/components/NotificationProvider';
import { useTheme } from '@shared/theme/useTheme';

import type { SearchPageProps } from './components/Search';
import type { PropsWithChildren } from 'react';

import '@shared/styles/base.css';


export function App({ children }: PropsWithChildren) {
  const { theme, toggle } = useTheme();
  return (
    <StrictMode>
      <NotificationProvider>
        <ErrorBoundary>
          {(restored) => (
            <ApiProvider>
              {children}
              <SearchPage restored={restored} theme={theme} onToggleTheme={toggle} />
            </ApiProvider>
          )}
        </ErrorBoundary>
      </NotificationProvider>
    </StrictMode>
  );
}

function SearchPage({ restored, theme, onToggleTheme }: SearchPageProps) {
  const { value, term, committedQuery, phase, finishEntrance, onChange, onSubmit } =
    useSearchQuery();

  const { headerRef, inputRef, resultsRef } = useSearchTransition(phase !== 'idle', finishEntrance);

  return (
    <>
      <Search
        headerRef={headerRef}
        inputRef={inputRef}
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        restored={restored}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />
      <main ref={resultsRef}>
        {phase !== 'idle' && (
          <Results key={term} query={committedQuery} entering={phase === 'entering'} />
        )}
      </main>
    </>
  );
}
