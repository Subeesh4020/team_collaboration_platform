import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';

import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';

import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useUniversalSearch } from '../../hooks/useUniversalSearch';
import { MIN_QUERY_LENGTH, type SearchResultGroup } from '../../types';
import styles from './UniversalSearch.module.css';

function ResultGroup({ group }: { group: SearchResultGroup }) {
  const { provider, status, data } = group;
  if (status === 'error') {
    return (
      <section className={styles.group} aria-label={provider.label}>
        <h2 className={styles.groupTitle}>{provider.label}</h2>
        <p className={styles.error}>Couldn&apos;t search {provider.label.toLowerCase()}.</p>
      </section>
    );
  }
  if (status !== 'success' || !data || data.hits.length === 0) return null;
  return (
    <section className={styles.group} aria-label={provider.label}>
      <h2 className={styles.groupTitle}>
        {provider.label} <span className={styles.count}>{data.total}</span>
      </h2>
      <ul className={styles.list}>
        {data.hits.map((hit) => (
          <li key={provider.getKey(hit)}>
            <Link to={provider.getHref(hit)} className={styles.result}>
              {provider.renderResult(hit)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** One search box across messages, meetings, files, documents, tasks and the wiki. */
export function UniversalSearch() {
  const [params, setParams] = useSearchParams();
  const urlQuery = params.get('q') ?? '';

  // The input is local state, re-synced when the URL changes (e.g. from the top bar).
  const [input, setInput] = useState(urlQuery);
  const [syncedUrlQuery, setSyncedUrlQuery] = useState(urlQuery);
  if (urlQuery !== syncedUrlQuery) {
    setSyncedUrlQuery(urlQuery);
    setInput(urlQuery);
  }

  const query = useDebouncedValue(input, 250);
  useEffect(() => {
    if (query !== urlQuery) setParams(query ? { q: query } : {}, { replace: true });
  }, [query, urlQuery, setParams]);

  const groups = useUniversalSearch(query);
  const tooShort = query.trim().length < MIN_QUERY_LENGTH;
  const pending = groups.some((g) => g.status === 'pending');
  const total = groups.reduce((sum, g) => sum + (g.data?.total ?? 0), 0);
  const settled = !tooShort && !pending;

  return (
    <div className={styles.root}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <Input
          type="search"
          label="Search everything"
          placeholder="Search messages, files, tasks, wiki…"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
          }}
        />
      </form>

      <p className={styles.status} role="status">
        {tooShort
          ? `Type at least ${String(MIN_QUERY_LENGTH)} characters to search.`
          : pending
            ? 'Searching…'
            : `${String(total)} ${total === 1 ? 'result' : 'results'} for “${query.trim()}”`}
      </p>

      {pending && <Spinner label="Searching" />}

      <div className={styles.groups}>
        {groups.map((group) => (
          <ResultGroup key={group.provider.type} group={group} />
        ))}
      </div>

      {settled && total === 0 && (
        <EmptyState icon="search" title="No results" description="Try different keywords." />
      )}
    </div>
  );
}
