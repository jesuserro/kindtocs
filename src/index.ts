import { addIcon, Plugin } from 'obsidian';
import { get } from 'svelte/store';

import FileManager from '~/fileManager';
import SyncModal from '~/components/syncModal';
import { SettingsTab } from '~/settingsTab';
//import { StatusBar } from '~/components/statusBar';
import { initializeStores, settingsStore } from '~/store';
import { SyncAmazon, SyncClippings, SyncManager } from '~/sync';
import { registerNotifications } from '~/notifications';
import kindleIcon from '~/assets/kindleIcon.svg';
import { ee } from '~/eventEmitter';

import SyncModalKind from '~/components/syncModal/kindModal';
import type { SyncModeKind } from '~/models';

import '~/sentry';


addIcon('kindle', kindleIcon);

export default class KindlePlugin extends Plugin {
  private fileManager!: FileManager;
  private syncAmazon!: SyncAmazon;
  private syncClippings!: SyncClippings;

  public async onload(): Promise<void> {
    // console.log('Kindtocs: loading plugin', new Date().toLocaleString());

    this.fileManager = new FileManager(this.app.vault, this.app.metadataCache);
    const syncManager = new SyncManager(this.fileManager);

    await initializeStores(this, this.fileManager);

    this.syncAmazon = new SyncAmazon(syncManager);
    this.syncClippings = new SyncClippings(syncManager);

    // new StatusBar(this.addStatusBarItem(), () => {
    //   this.showSyncModal();
    // });

    const ribbonEl = this.addRibbonIcon('dice', 'Sync your Kindtocs highlights', () => {
      this.showSyncKindtocModal();
    });
    ribbonEl.addClass('kindtocs-ribbon');

    this.addCommand({
      id: 'kindle-sync',
      name: 'Sync highlights',
      callback: () => {
        this.showSyncModal();
      },
    });

    this.addSettingTab(new SettingsTab(this.app, this, this.fileManager));

    registerNotifications();
    this.registerEvents();

    if (get(settingsStore).syncOnBoot) {
      await this.startAmazonSync();
    }
  }

  private registerEvents(): void {
    this.registerEvent(
      this.app.workspace.on('file-menu', (menu, file) => {
        const kindleFile = this.fileManager.mapToKindleFile(file);
        if (kindleFile == null) {
          return;
        }

        menu.addItem((item) => {
          item
            .setTitle('Resync Kindle highlights')
            .setIcon('kindle')
            .setDisabled(kindleFile.book.asin == null)
            .onClick(async () => {
              await this.syncAmazon.resync(kindleFile);
            });
        });
      })
    );

    this.app.workspace.onLayoutReady(() => {
      ee.emit('obsidianReady');
    });
  }

  private showSyncKindtocModal(): void {
    new SyncModalKind(this.app, {
      onTocSync: (mode:SyncModeKind) => this.startKindtocs(mode)
    }).show();
  }

  private showSyncModal(): void {
    new SyncModal(this.app, {
      onOnlineSync: () => this.startAmazonSync(),
      onMyClippingsSync: () => this.syncClippings.startSync(),
    }).show();
  }

  private startAmazonSync(): void {
    this.syncAmazon.startSync();
  }

  /**
   * Clon de startAmazonSync()
   */
  private startKindtocs(mode: SyncModeKind): void {
    this.syncAmazon.startKindtocs(mode);
  }

  public async onunload(): Promise<void> {
    ee.removeAllListeners();

    // console.log('Kindle Highlights plugin: unloading plugin', new Date().toLocaleString());
  }
}
