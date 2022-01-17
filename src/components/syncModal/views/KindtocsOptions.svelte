<script lang="ts">
  let selectedPlugin = 1;
  let yesBook = false;
  let yesNote = true;
</script>


<fieldset>
  <label>
    <input type=radio bind:group={selectedPlugin} value={0}>
    Default Plugin
  </label>

  <label>
    <input type=radio bind:group={selectedPlugin} value={1}>
    Kindtocs
  </label>
</fieldset>


<fieldset class="toc-chks" disabled={!selectedPlugin}>
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
