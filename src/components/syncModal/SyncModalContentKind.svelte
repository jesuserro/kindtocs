<script lang="ts">

  import type { SyncModeKind } from '~/models';

  export let onClick: (mode: SyncModeKind) => void;

  let selectedSyncType: SyncModeKind = {
    bookMetadata: true,
    noteContext: true
  };
</script>

<fieldset class="toc-chks">
  <legend>Create</legend>
  <label>
    <input type=checkbox bind:checked={selectedSyncType.bookMetadata}>
    Book Metadata e Índice Simple
  </label>
  <label>
    <input type=checkbox bind:checked={selectedSyncType.noteContext}>
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


