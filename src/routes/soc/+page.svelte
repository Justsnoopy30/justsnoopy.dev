<script>
  import TextCard from "$lib/TextCard.svelte";
  import { onDestroy, onMount } from "svelte";
  // Sound Effect by <a href="https://pixabay.com/users/dragon-studio-38165424/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=382712">DRAGON-STUDIO</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=382712">Pixabay</a>
  import switch1Sound from "$lib/sounds/switch1.mp3";
  // Sound Effect by <a href="https://pixabay.com/users/dragon-studio-38165424/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=382714">DRAGON-STUDIO</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=382714">Pixabay</a>
  import switch2Sound from "$lib/sounds/switch2.mp3";
  import { browser } from "$app/environment";
  import { soc1, soc2, soc3 } from "$lib/no-git/soc";

  let clientX = "-99px";
  let clientY = "-99px";
  let lastRawX = 0;
  let lastRawY = 0;
  let mouseMovedOnce = false;
  let lightSwitchStatus = false;
  let showSpotlight = false;
  let showCursor = false;

  let switch1Audio;
  let switch2Audio;
  onMount(() => {
    switch1Audio = new Audio(switch1Sound);
    switch2Audio = new Audio(switch2Sound);
  });
  onDestroy(() => {
    if (browser) document.body.style.cursor = "auto";
  });

  function updateSpotlight() {
    clientX = (lastRawX + window.scrollX) + "px";
    clientY = (lastRawY + window.scrollY) + "px";
  }

  function onPointerMove(event) {
    if (event.touches && event.touches.length > 0) {
      lastRawX = event.touches[0].clientX;
      lastRawY = event.touches[0].clientY;
    } else {
      lastRawX = event.clientX;
      lastRawY = event.clientY;
    }
    updateSpotlight();
    if (!mouseMovedOnce) { 
      switch1Audio.currentTime = 0.12;
      switch1Audio.play();
      document.body.style.cursor = "none";
      mouseMovedOnce = true;
      setTimeout(() => {
        if (!lightSwitchStatus) {
          showSpotlight = true;
        }
      }, 60);
    }
  }

  function onClickLightSwitch() {
    lightSwitchStatus = !lightSwitchStatus;
    switch2Audio = new Audio(switch2Sound);
    switch2Audio.play();
  }
</script>

<svelte:window on:scroll={updateSpotlight}></svelte:window>
<svelte:body on:mousemove={onPointerMove} ontouchmove={onPointerMove}></svelte:body>
<div class="bg"></div>
<div class="container">
  {#if showCursor}
    <div class="cursor" style="--x: {clientX}; --y: {clientY};">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <circle cx="12" cy="12" r="7" fill="rgba(0, 0, 0, 0.5)" /> 
      </svg>
    </div>
  {/if}
  <div class="spotlight" class:hidePage={!lightSwitchStatus} style="--x: {clientX}; --y: {clientY};">
  </div>
  <div class="mask" class:revealed={showSpotlight}></div>
  <TextCard align="left" color="rgba(43, 43, 43, 0.2)">
    <p>
      {soc1}
    </p>
  </TextCard>
  <TextCard align="left" color="rgba(43, 43, 43, 0.2)">
    <p>
      {soc2}
    </p>
  </TextCard>
  <TextCard align="left" color="rgba(43, 43, 43, 0.2)">
    <p>
      {soc3}
    </p>
  </TextCard>
  <button class="light-switch" class:lit={lightSwitchStatus} on:click={onClickLightSwitch} on:mouseenter={() => showCursor = true} 
    on:mouseleave={() => lightSwitchStatus == true ? showCursor = true : showCursor = false} aria-label="light switch">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512">
      <defs>
        <radialGradient id="bulbGradient" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#f9e79c"/>
          <stop offset="100%" stop-color="#f1c40f"/>
        </radialGradient>
      </defs>
      <path fill="url(#bulbGradient)" d="M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78 16.52 18.85 42.36 58.23 52.21 91.45.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78 9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176 352 78.61 272.91-.3 175.45 0 73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80 0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112 8.84 0 16 7.16 16 16s-7.16 16-16 16z"/>
    </svg>
  </button>
</div>

<style>
  .bg {
    position: fixed;
    inset: 0;
    z-index: -1;
    /* Dark gradient background */
    background: radial-gradient(circle at 50% 50%, #1a1a1a, #000000) !important;
  }

  .container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 10px;
    margin: 0 auto;
    /* display: flex;
    flex-direction: row; */
    font-family: 'Courier New', Courier, monospace;
  }

  .cursor {
    position: absolute; 
    left: var(--x); top: var(--y);
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 1;
  }

  /* Credit: https://frontendmasters.com/blog/css-spotlight-effect/ */
  .spotlight {
    z-index: 1;
    opacity: 0;
    transition: opacity 0.8s ease;
    position: fixed;
    inset: 0;
    /* height: 100%; */
    /* width: 100%; */
    background-image: radial-gradient(circle at var(--x, 50%) var(--y, 50%), transparent 6em, black 8em);
      /* background-image:
    radial-gradient(circle at var(--x, 50%) var(--y, 50%), transparent, black 20em),
    repeating-linear-gradient(45deg, black 0 0.4em, transparent 0 3em),
    repeating-linear-gradient(-45deg, black 0 0.4em, transparent 0 3em); */
    pointer-events: none;
    /* filter: blur(1em) contrast(100);
    mix-blend-mode: darken;
    background-color: white;
    outline: 2em solid white; */
  }

  .spotlight.hidePage {
    opacity: 1;
  }

  .mask {
    position: fixed;
    inset: 0;
    background: black;
    opacity: 1;
    z-index: 1;
    transition: opacity 0.8s ease;
    pointer-events: none;
  }

  .mask.revealed {
    opacity: 0;
  }

  .light-switch {
    position: absolute;
    z-index: 0;
    bottom: 1rem;
    right: 1rem;
    width: 2rem;
    height: auto;
    background: none;
    border: none;
    padding: 0;
    cursor: none;
    transition: filter 0.3s ease, opacity 0.3s ease;
    filter: none;
    opacity: 0.3;
  }

  .light-switch.lit {
    /* filter: drop-shadow(0 0 8px #f1c40f); */
    filter: drop-shadow(0 0 16px #f1c40f);
    opacity: 1;
  }

  /* .light-switch.lit:hover {
    filter: drop-shadow(0 0 16px #f1c40f);
  } */
</style>