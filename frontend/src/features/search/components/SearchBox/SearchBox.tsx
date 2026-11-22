import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Icon } from '@/components/ui/Icon';
import { paths } from '@/config/paths';

import styles from './SearchBox.module.css';

/** Compact search field for the top bar; opens the search page on submit. */
export function SearchBox() {
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  return (
    <form
      role="search"
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        const query = value.trim();
        if (!query) return;
        void navigate(paths.search(query));
        setValue('');
      }}
    >
      <Icon name="search" size="sm" className={styles.icon} />
      <input
        type="search"
        className={styles.input}
        placeholder="Search"
        aria-label="Quick search"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />
    </form>
  );
}
