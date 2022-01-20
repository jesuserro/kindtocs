<script lang="ts">
  import IdleViewKind from './views/IdleViewKind.svelte';

  export let onClick: () => void;
</script>

<IdleViewKind />

<div class="setting-item-control">
  <button class="mod-cta" on:click={onClick}>Sync...</button>
</div>


