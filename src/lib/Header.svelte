<!-- Based on Svelte Kit example header -->
<script>
	import { page } from '$app/state';
	import suiriMusic from '$lib/music/suiri.opus';
	import memories from '$lib/music/memories.opus';
	import jjkAkari from '$lib/music/jjk-akari.opus';
  	import { onMount } from 'svelte';

	let tracks = [
		{ title: "Suiri", file: suiriMusic, volume: 0.2, audio: undefined },
		{ title: "Memories", file: memories, volume: 0.3,audio: undefined },
		{ title: "Akari", file: jjkAkari, volume: 0.2, audio: undefined }
	];
	let currentTrackIndex = 0;

	let isPlayingTrack = false;

	let suiriAudio;
	onMount(() => {
		for (const track of tracks) {
			track.audio = new Audio(track.file);
			track.audio.volume = track.volume;
			track.audio.loop = true;
		}
	});

	function toggleBgm() {
		if (isPlayingTrack) {
			tracks[currentTrackIndex].audio.pause();
		} else {
			tracks[currentTrackIndex].audio.play();
		}
		isPlayingTrack = !isPlayingTrack;
	}

	function nextTrack() {
		if (isPlayingTrack) {
			tracks[currentTrackIndex].audio.pause();
		}
		currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
		if (isPlayingTrack) {
			tracks[currentTrackIndex].audio.currentTime = 0;
			tracks[currentTrackIndex].audio.play();
		}
	}
</script>

<header>
	<div class="corner">
		<!-- {#if isPlayingTrack}
			<span class="currentTrack">{tracks[currentTrackIndex].title}</span>
		{/if} -->
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">About</a>
			</li>
			<li aria-current={page.url.pathname === '/projects' ? 'page' : undefined}>
				<a href="/projects">Projects</a>
			</li>
			<li aria-current={page.url.pathname === '/contact' ? 'page' : undefined}>
				<a href="/contact">Contact</a>
			</li>
			<li aria-current={page.url.pathname === '/stream' ? 'page' : undefined}>
				<a href="/stream">Stream</a>
			</li>
<!--			<li aria-current={page.url.pathname === '/chat' ? 'page' : undefined}>
				<a href="/chat">Chat</a>
			</li> -->
			<li aria-current={page.url.pathname === '/terminal' ? 'page' : undefined}>
				<a href="/terminal">Terminal</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
		<button on:click={nextTrack} aria-label="Next track">
			<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M403.7 107.1C392.1 96 375 92.9 360.3 99.2C345.6 105.5 336 120 336 136L336 272.3L163.7 107.2C152.1 96 135 92.9 120.3 99.2C105.6 105.5 96 120 96 136L96 504C96 520 105.6 534.5 120.3 540.8C135 547.1 152.1 544 163.7 532.9L336 367.7L336 504C336 520 345.6 534.5 360.3 540.8C375 547.1 392.1 544 403.7 532.9L595.7 348.9C603.6 341.4 608 330.9 608 320C608 309.1 603.5 298.7 595.7 291.1L403.7 107.1z"/></svg>
		</button>
		<button on:click={toggleBgm} aria-label="Play music">
			{#if isPlayingTrack}
				<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M176 96C149.5 96 128 117.5 128 144L128 496C128 522.5 149.5 544 176 544L240 544C266.5 544 288 522.5 288 496L288 144C288 117.5 266.5 96 240 96L176 96zM400 96C373.5 96 352 117.5 352 144L352 496C352 522.5 373.5 544 400 544L464 544C490.5 544 512 522.5 512 496L512 144C512 117.5 490.5 96 464 96L400 96z"/></svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z"/></svg>
			{/if}
		</button>
		
		<!-- <a href="https://github.com/sveltejs/kit">
			<img src={github} alt="GitHub" />
		</a> -->
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;

		/* Prevent shifting with scrollbar - needs overflow-x: hidden on body */
		width: 100vw; 
	}

	.currentTrack {
		padding: 0.3em;
		padding-left: 0.4em;
		font-size: 1.3rem;
		color: var(--color-gray-600);
	}

	.corner {
		display: flex;
		width: 4.5em;
		height: 3em;
		padding-left: 3px;
	}

	.corner:has(button) {
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
		border-bottom-left-radius: 0.5em;
	}

	.corner button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		color: color-mix(in srgb, var(--color-gray-800) 60%, black);
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		/* --background: rgba(255, 255, 255, 0.7); */
		--background: rgba(0, 0, 0, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);

		/* View transition */
		view-transition-name: indicator;
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
