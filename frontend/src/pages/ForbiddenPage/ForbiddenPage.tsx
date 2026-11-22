import { Link } from 'react-router';

import { Icon } from '@/components/ui/Icon';
import { paths } from '@/config/paths';

import styles from './ForbiddenPage.module.css';

export function ForbiddenPage() {
  return (
    <div className={styles.root}>
      <Icon name="lock" />
      <h1 className={styles.title}>You don&apos;t have access to this page</h1>
      <p className={styles.message}>Ask a workspace admin if you think you should.</p>
      <Link to={paths.home()}>Go to home</Link>
    </div>
  );
}
