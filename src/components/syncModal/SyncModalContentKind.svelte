<script lang="ts">

  import type { SyncModeKind } from '~/models';

  export let onClick: (mode: SyncModeKind) => void;

  export let yesBook = false;
  export let yesNote = false;

  let selectedSyncType: SyncModeKind = {
    bookMetadata: yesBook,
    noteContext: yesNote
  };
</script>

<fieldset class="toc-chks">
  <legend>Create</legend>
  <label>
    <input type=checkbox bind:checked={yesBook}>
    Book Metadata e Índice Simple
  </label>
  <label>
    <input type=checkbox bind:checked={yesNote}>
    Índice Completo para notas
  </label>
</fieldset>

<div class="setting-item-control">
  <button class="mod-cta" on:click={() => {
    onClick(selectedSyncType);
  }}>Sync...</button>
</div>

<style>
  .toc-chks {
    margin-bottom: 3%;
  }
  .toc-chks label {
    display: block;
  }
  </style>


