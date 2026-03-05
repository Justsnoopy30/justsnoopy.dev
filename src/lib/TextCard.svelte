<script>
  let { children, align = "center", color = "var(--color-gray-800)", shrinkable = true } = $props();
</script>

<div class="card" style="--align: {align}; --color: {color}" class:shrinkable={shrinkable}>
  {@render children()}
</div>

<style>
  .card {
    position: relative;
    /* background: rgba(43, 43, 43, 0.2); */
    background: var(--color);
    border-radius: 8px;
    padding: 1.5rem;
    /* backdrop-filter: blur(2px); */
    /* max-width: 650px; */
    max-height: max-content;
    width: max-content;
    /* margin: 0 auto; */
    margin-top: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    text-align: var(--align);
    /* background: linear-gradient(circle at center, rgba(var(--color1), 0.8) 0, rgba(var(--color1), 0) 50%) no-repeat; */
  }

  .card.shrinkable {
    width: auto;
    max-width: max-content;
  }

  :global(.card p) {
    white-space: pre-wrap;
    /* margin: 0; */
    /* font-size: 1.1rem; */
    /* line-height: 1.4; */
  }

</style>