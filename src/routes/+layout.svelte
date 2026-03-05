<script>
	import Header from '../lib/Header.svelte';
	import '../app.css';

	let { children } = $props();
	
	/* View transitions */
	/* See https://svelte.dev/blog/view-transitions */
	import { onNavigate } from '$app/navigation';
	
	onNavigate((navigation) => {
	    if (!document.startViewTransition) return;
	
	    return new Promise((resolve) => {
	        document.startViewTransition(async () => {
	            resolve();
	            await navigation.complete;
	        });
	    });
	});
	
	/* Moving gradient background */
	import { onMount } from 'svelte';
	onMount(() => {
	  const interBubble = document.querySelector('.interactive');
	  const gradientBg = document.querySelector('.gradient-bg');
	  let curX = 0;
	  let curY = 0;
	  let tgX = 0;
	  let tgY = 0;
	  let mouseTimeout;
	
	  function handleActivity() {
	      if (gradientBg) {
	          gradientBg.classList.remove('visible');
	      }

	      clearTimeout(mouseTimeout);
	      mouseTimeout = setTimeout(() => {
	          if (gradientBg) {
	              gradientBg.classList.add('visible');
	          }
	      }, 3000); // Wait for 3 seconds of inactivity
	  }

	  function move() {
	      curX += (tgX - curX) / 20;
	      curY += (tgY - curY) / 20;
	      if (interBubble) {
	          interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
	      }
	      requestAnimationFrame(() => {
	          move();
	      });
	  }
	
	  window.addEventListener('mousemove', (event) => {
	      tgX = event.clientX;
	      tgY = event.clientY;
	      handleActivity();
	  });

	  window.addEventListener('scroll', handleActivity, { passive: true });
	  window.addEventListener('touchmove', handleActivity, { passive: true });
	  window.addEventListener('wheel', handleActivity, { passive: true });
	
	  // Start the timer on mount so it appears if the user starts idle
	  mouseTimeout = setTimeout(() => {
	      if (gradientBg) {
	          gradientBg.classList.add('visible');
	      }
	  }, 2000);

	  move();
	});
</script>

<div>
	<div class="gradient-bg">
		<svg xmlns="http://www.w3.org/2000/svg">
			<defs>
				<filter id="goo">
					<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
					<feColorMatrix in="blur" mode="matrix" values="
						1 0 0 0 0
						0 1 0 0 0
						0 0 1 0 0
						0 0 0 18 -8" result="goo" />
					<feBlend in="SourceGraphic" in2="goo" />
				</filter>
			</defs>
		</svg>
		<div class="gradients-container">
			<div class="g1"></div>
			<div class="g2"></div>
			<div class="g3"></div>
			<div class="g4"></div>
			<div class="g5"></div>
			<div class="interactive"></div>
		</div>
	</div>
</div>

<div class="app">
	<Header />

	<main>
		{@render children()}
	</main>

	<!-- <footer>
		<p>
			Made with Svelte <a href="https://svelte.dev"><img src={logo} alt="Svelte" /></a>
		</p>
	</footer> -->
</div>


<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		width: 100%;

		/* Combines with width: 100vh on header to prevent shifting between pages */
		overflow-x: hidden;

		position: relative;
		z-index: 1;

		background: rgba(27, 27, 27, 0.4);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer p {
		display: flex;
    	align-items: center;
	}

	footer a {
		font-weight: bold;
	}

	/* .svelte-logo {
		width: 3em;
		height: 3em;
	}

	.svelte-logo a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	} */

	img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
