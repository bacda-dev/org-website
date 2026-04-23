/**
 * Admin — New event page. Reuses the shared EventEditor component.
 */

import { EventEditor } from '@/components/admin/event-editor';
import { storageUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default function AdminEventNewPage() {
  return (
    <EventEditor
      event={null}
      photos={[]}
      videos={[]}
      storageUrlFor={(p) => storageUrl('gallery', p)}
    />
  );
}
