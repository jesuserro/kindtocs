<script lang="ts">

  import type { SyncModeKind } from '~/models';

  export let onClick: (mode: SyncModeKind) => void;

  let selectedSyncType: SyncModeKind = {
    bookMetadata: false,
    noteContext: false,
    chapterContext: false,
    chapterNotesContext: false,
    specialNotes: true
  };
</script>

<fieldset class="toc-chks">
  <legend>Create</legend>
  <label>
    <input type=checkbox bind:checked={selectedSyncType.bookMetadata}>
    Book Metadata e Índice simple
  </label>
  <label>
    <input type=checkbox bind:checked={selectedSyncType.noteContext}>
    Índice personal
  </label>
  <label>
    <input type=checkbox bind:checked={selectedSyncType.chapterContext}>
    Índice por capítulos
  </label>
  <label>
    <input type=checkbox bind:checked={selectedSyncType.chapterNotesContext}>
    Índice capítulos con notas
  </label>
  <label>
    <input type=checkbox bind:checked={selectedSyncType.specialNotes}>
    Índice capítulos con TODAS las notas
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


