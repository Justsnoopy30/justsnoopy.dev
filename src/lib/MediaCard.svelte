<script>
  let { title, type, author = '', year = '', api = '', id = '' } = $props();

  let imageUrl = $state('');
  let loading = $state(true);
  let imageLoaded = $state(false);
  let imageError = $state(false);
  let error = $state(false);

  // Show shimmer until both the URL is fetched and the image is loaded
  const showSkeleton = $derived((loading || (imageUrl && !imageLoaded)) && !error && !imageError);

  async function fetchCover() {
    loading = true;
    error = false;
    imageError = false;
    imageUrl = '';
    imageLoaded = false;
    try {
      const response = await fetch(`/api/cover?title=${encodeURIComponent(title)}&type=${type}&author=${encodeURIComponent(author)}&year=${encodeURIComponent(year)}&api=${api}&id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch cover');
      const data = await response.json();
      imageUrl = data.url;
    } catch (e) {
      console.error(e);
      error = true;
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    if (title) {
      fetchCover();
    }
  });

  function handleImageLoad() {
    imageLoaded = true;
  }

  function handleImageError() {
    imageError = true;
  }
</script>


<div class="media-card" title={title}>
  {#if imageUrl && !imageError}
    <img 
      src={imageUrl} 
      alt={title} 
      loading="lazy" 
      onload={handleImageLoad} 
      onerror={handleImageError}
    />
  {/if}

  {#if showSkeleton}
    <div class="skeleton"></div>
  {/if}

  {#if error || imageError || (!loading && !imageUrl && !showSkeleton)}
    <div class="fallback">
      <span>{title}</span>
    </div>
  {/if}
</div>

<style>
  .media-card {
    aspect-ratio: 2 / 3;
    background: #2b2b2b;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s;
  }

  .media-card:hover {
    transform: scale(1.05);
    z-index: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    overflow-clip-margin: unset;
  }

  .skeleton {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #2b2b2b 25%, #3b3b3b 50%, #2b2b2b 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    z-index: 1;
  }

  .fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    text-align: center;
    font-size: 0.8rem;
    color: #888;
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
</style>
