import { Link } from 'react-router';

import { paths } from '@/config/paths';

import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  return (
    <div className={styles.root}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.message}>
        The page you&apos;re looking for doesn&apos;t exist or was moved.
      </p>
      <Link to={paths.home()}>Go to home</Link>
    </div>
  );
}
