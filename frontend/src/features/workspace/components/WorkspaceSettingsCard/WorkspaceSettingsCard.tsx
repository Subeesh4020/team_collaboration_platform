import { Button } from '@/components/ui/Button';
import { Can } from '@/lib/permissions';

import { useWorkspace } from '../../hooks/useWorkspace';
import { workspacePermissions } from '../../permissions';
import styles from './WorkspaceSettingsCard.module.css';

/** Owner-only workspace administration (skeleton). */
export function WorkspaceSettingsCard() {
  const workspace = useWorkspace();
  return (
    <Can permission={workspacePermissions.manage}>
      <section className={styles.card} aria-labelledby="workspace-settings-heading">
        <div>
          <h2 id="workspace-settings-heading" className={styles.title}>
            Workspace: {workspace.name}
          </h2>
          <p className={styles.text}>Billing, domain and data retention. Visible to owners only.</p>
        </div>
        <Button disabled>Manage workspace</Button>
      </section>
    </Can>
  );
}
