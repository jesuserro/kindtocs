<script lang="ts">
  import SyncStats from './SyncStats.svelte';
  import KindtocsOptions from './KindtocsOptions.svelte';

  export let onClick: () => void;
</script>

<SyncStats />

<KindtocsOptions />

<div class="setting-item-control">
  <button class="mod-cta" on:click={onClick}>Sync...</button>
</div>
