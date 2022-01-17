import { App, Modal } from 'obsidian';

import SyncModalContent from './SyncModalContent.svelte';
import { settingsStore } from '~/store';
import { SyncModalState, store } from './store';
import type { SyncMode } from '~/models';

const SyncModalTitle: Record<SyncModalState['status'], string> = {
  'upgrade-warning': 'Breaking change notice',
  'first-time': '',
  idle: 'Kindtocs - Kindle Table of Contents',
  'sync:fetching-books': 'Syncing data...',
  'sync:login': 'Syncing data...',
  'sync:syncing': 'Syncing data...',
  'choose-sync-method': 'Choose a sync method...',
};

type SyncModalProps = {
  onOnlineSync: () => void;
  onMyClippingsSync: () => void;
};
type SyncModalPropsKind = {
  onTocSync: () => void;
};

export default class SyncModalKind extends Modal {
  private modalContent: SyncModalContent;

  constructor(app: App, private props: SyncModalPropsKind) {
    super(app);
  }

  public async show(): Promise<void> {
    // TODO: Remove after proliferation of v1.0.0
    const isLegacy = await settingsStore.isLegacy();
    const initialState: SyncModalState['status'] = isLegacy ? 'upgrade-warning' : 'idle';
    store.update((state) => ({ ...state, status: initialState }));

    this.modalContent = new SyncModalContent({
      target: this.contentEl,
      props: {
        onDone: () => {
          this.close();
        },
        onClick: (mode: SyncMode) => {
          this.props.onTocSync();
        },
        onUpgrade: async () => {
          await settingsStore.actions.upgradeStoreState();
          store.update((state) => ({ ...state, status: 'idle' }));
        },
      },
    });

    store.subscribe((state) => {
      this.titleEl.innerText = SyncModalTitle[state.status];
    });

    this.open();
  }

  onClose(): void {
    super.onClose();
    this.modalContent.$destroy();
  }
}
