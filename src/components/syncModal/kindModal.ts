import { App, Modal, Notice } from 'obsidian';

import SyncModalContentKind from './SyncModalContentKind.svelte';
import { settingsStore } from '~/store';
import { SyncModalState, store } from './store';
import type { SyncModeKind } from '~/models';

const SyncModalTitle: Record<SyncModalState['status'], string> = {
  'upgrade-warning': 'Breaking change notice',
  'first-time': '',
  idle: 'Kindtocs - Kindle Table of Contents',
  'sync:fetching-books': 'Syncing data...',
  'sync:login': 'Syncing data...',
  'sync:syncing': 'Syncing data...',
  'choose-sync-method': 'Choose a sync method...',
};

type SyncModalPropsKind = {
  onTocSync: () => void;
};

export default class SyncModalKind extends Modal {
  private modalContent: SyncModalContentKind;

  // onSubmit: (result: string) => void;

  constructor(app: App, private props: SyncModalPropsKind) {
    super(app);
    // this.onSubmit = onSubmit;
  }

  public async show(): Promise<void> {
    // TODO: Remove after proliferation of v1.0.0
    const isLegacy = await settingsStore.isLegacy();
    const initialState: SyncModalState['status'] = isLegacy ? 'upgrade-warning' : 'idle';
    store.update((state) => ({ ...state, status: initialState }));

    this.modalContent = new SyncModalContentKind({
      target: this.contentEl,
      props: {
        onClick: (mode: SyncModeKind) => {
          new Notice('book: '+ mode.bookMetadata);
          new Notice('note: '+ mode.noteContext);
          // this.props.onTocSync(); // ejecuta la sincronización!!
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
