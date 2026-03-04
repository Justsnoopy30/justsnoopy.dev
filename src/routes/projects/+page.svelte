<svelte:head>
  <title>Justsnoopy30's Projects</title>
  <meta name="title" content="Justsnoopy30's Projects" />
</svelte:head>

<script>
  import { Card, Button } from 'flowbite-svelte';
</script>

<div class="projects">
  <Card class="card">
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">HyperChat</h5>
    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">A fast, lightweight, and open-source chatting application</p>
    <Button color="blue" class="w-fit" onclick={() => window.open("https://hyperchat.dev")}>
      Visit <svg xmlns="http://www.w3.org/2000/svg" fill="none" color="currentColor" class="shrink-0 w-6 h-6 ms-2 text-white" role="img" aria-label="arrow right outline" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"></path></svg>
    </Button>
  </Card>
  <Card class="card">
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">HyperCat</h5>
    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">A Discord bot that plays music</p>
    <Button color="blue" class="w-fit" onclick={() => window.open("https://hypercubemc.net/discordbot")}>
      Invite <svg xmlns="http://www.w3.org/2000/svg" fill="none" color="currentColor" class="shrink-0 w-6 h-6 ms-2 text-white" role="img" aria-label="arrow right outline" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"></path></svg>
    </Button>
  </Card>
  <Card class="card">
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Iris Shaders (Contributor)</h5>
    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">A modern shaderpack loader for Minecraft</p>
    <Button color="blue" class="w-fit" onclick={() => window.open("https://irisshaders.dev")}>
      Visit <svg xmlns="http://www.w3.org/2000/svg" fill="none" color="currentColor" class="shrink-0 w-6 h-6 ms-2 text-white" role="img" aria-label="arrow right outline" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"></path></svg>
    </Button>
  </Card>
</div>

<style>
  .projects {
    display: flex;
    flex-direction: column;
    justify-content: center;
		font-size: 150%;
    flex-grow: 1;
    gap: 2rem;
    margin-left: auto;
    margin-right: auto;
  }
  
  :global(.card) {
    padding: 15px;
  }

  :global(.card button) {
    background-color: #2d53a6 !important;
    transition: background-color 0.2s ease-in;
  }

  :global(.card button:hover) {
    background-color: #1e3a75 !important;
  }
</style>
