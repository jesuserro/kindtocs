<script lang="ts">
  import type { SyncModeKind } from '~/models';

  export let yesBook = false;
  export let yesNote = true;
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


<style>
  .toc-chks {
    margin-bottom: 3%;
  }
  .toc-chks label {
    display: block;
  }
  </style>
