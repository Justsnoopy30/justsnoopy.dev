<script>
  import { clickOutside } from "flowbite-svelte";

  let { title, type, author = '', year = '', api = '', id = '', musicId = '', flippedCard } = $props();

  let imageUrl = $state('');
  let loading = $state(true);
  let imageLoaded = $state(false);
  let imageError = $state(false);
  let error = $state(false);

  let musicUrl = $state('');
  let musicFetching = $state(false);
  let audioElement = $state(null);
  let isHovering = $state(false);
  let isFlipped = $state(false);

  // Global audio instance for preventing multiple plays
  let currentAudio = null;

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

  async function fetchAndPlayMusic() {
    if ((type === 'book' && !musicUrl) || musicFetching) return;
    if (type === 'book') return; // Don't play music for books

    if (!musicUrl) {
      musicFetching = true;
      try {
        const response = await fetch(`/api/music?title=${encodeURIComponent(title)}&type=${type}&id=${encodeURIComponent(musicId)}`);
        if (!response.ok) throw new Error('Failed to fetch music');
        const data = await response.json();
        musicUrl = data.url;
      } catch (e) {
        console.error('Music fetch error:', e);
      } finally {
        musicFetching = false;
      }
    }

    // Only play if still flipped
    if (musicUrl && isFlipped) {
      // Stop any currently playing audio
      if (currentAudio && currentAudio !== audioElement) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      if (audioElement) {
        audioElement.src = musicUrl;
        audioElement.loop = true;
        audioElement.volume = 0.75;
        audioElement.currentTime = 0;
        audioElement.play().catch(err => console.error('Audio play error:', err));
        currentAudio = audioElement;
      }
    }
  }

  $effect(() => {
    if (title) {
      fetchCover();
    }
  });

  $effect(() => {
    if ($flippedCard !== title && isFlipped) {
      isFlipped = false;
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    }
  });

  function handleImageLoad() {
    imageLoaded = true;
  }

  function handleImageError() {
    imageError = true;
  }

  function handleClick() {
    if (type !== 'book') {
      if (!isFlipped) {
        // Flipping this card
        flippedCard.set(title);
        isFlipped = true;
        fetchAndPlayMusic();
      } else {
        // Unflipping this card
        flippedCard.set(null);
        isFlipped = false;
        if (audioElement) {
          audioElement.pause();
          audioElement.currentTime = 0;
        }
      }
    }
  }

  function handleMouseLeave() {
    // isHovering = false;
    // if (isFlipped) {
    //   isFlipped = false;
    //   if (audioElement) {
    //     audioElement.pause();
    //     audioElement.currentTime = 0;
    //   }
    // }
  }
</script>

<button class="media-card" title={title} onclick={handleClick}  onmouseleave={handleMouseLeave}>
  <audio bind:this={audioElement}></audio>
  
  <div class="card-inner" class:flipped={isFlipped}>
    <div class="card-face front">
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

    <div class="card-face back">
      {#if imageUrl && !imageError}
        <img 
          src={imageUrl} 
          alt={title} 
          loading="lazy"
        />
      {/if}
      
      <div class="equalizer-overlay">
        <div class="eq-line"></div>
        <div class="eq-line"></div>
        <div class="eq-line"></div>
        <div class="eq-line"></div>
        <div class="eq-line"></div>
      </div>
    </div>
  </div>
</button>

<style>
  .media-card {
    aspect-ratio: 2 / 3;
    border-radius: 8px;
    position: relative;
    cursor: pointer;
    perspective: 1000px;
    transition: transform 0.2s;
  }

  .media-card:hover {
    transform: scale(1.05);
    z-index: 1;
  }

  .card-inner {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.4s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
  }

  .card-inner.flipped {
    transform: rotateY(180deg);
  }

  .card-face {
    width: 100%;
    height: 100%;
    position: absolute;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: #2b2b2b;
    overflow: hidden;
  }

  .card-face.front {

  }

  .card-face.back {
    transform: rotateY(180deg);
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

  .equalizer-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 6px;
    padding: 16px;
  }

  .eq-line {
    width: 4px;
    /* background: linear-gradient(to top, #1db954, #1ed760); */
    background: linear-gradient(to top, #1db954, #1ed760);
    border-radius: 2px;
    animation: equalize 0.6s ease-in-out infinite;
  }

  .eq-line:nth-child(1) {
    height: 20%;
    animation-delay: 0s;
  }

  .eq-line:nth-child(2) {
    height: 40%;
    animation-delay: 0.1s;
  }

  .eq-line:nth-child(3) {
    height: 60%;
    animation-delay: 0.2s;
  }

  .eq-line:nth-child(4) {
    height: 40%;
    animation-delay: 0.3s;
  }

  .eq-line:nth-child(5) {
    height: 25%;
    animation-delay: 0.4s;
  }

  @keyframes equalize {
    0%, 100% {
      height: 20%;
    }
    50% {
      height: 80%;
    }
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
