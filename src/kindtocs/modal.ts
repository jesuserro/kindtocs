import { App, Modal, Setting } from "obsidian";
import type KindlePlugin from '~/.';

export class TocModal extends Modal {
  plugin: KindlePlugin;
  result: string;
  onSubmit: (result: string) => void;

  constructor(app: App, plugin:KindlePlugin, onSubmit: (result: string) => void) {
    super(app);
    this.plugin = plugin;
    this.onSubmit = onSubmit;
  }

  onOpen() {
		const { contentEl } = this;

    contentEl.createEl("h1", { text: "Kindtocs Modal" });
		contentEl.setText('Mi formulario');

    new Setting(contentEl)
      .setName("Name")
      .addText((text) =>
        text.onChange((value) => {
          this.result = value
        }));

    new Setting(contentEl)
      .addButton((btn) =>
        btn
          .setButtonText("Submit")
          .setCta()
          .onClick(() => {
            this.close();
            this.onSubmit(this.result);
          }));

    new Setting(contentEl)
      .setName('Setting #1')
      .setDesc('It\'s a secret')
      .addText(text => text
        .setPlaceholder('Enter your secret')
        .setValue(this.plugin.settings.mySetting)
        .onChange(async (value) => {
          console.log('Secret: ' + value);
          this.plugin.settings.mySetting = value;
          await this.plugin.saveData( this.settings );
        })
      );

	}

  onClose(): void {
    super.onClose();
    const { contentEl } = this;
		contentEl.empty();
  }
}
