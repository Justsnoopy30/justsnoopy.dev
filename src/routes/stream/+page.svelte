<svelte:head>
  <title>Stream</title>
  <meta name="title" content="Stream" />
  <!-- <script defer id="oven-script" src="https://cdn.jsdelivr.net/npm/ovenplayer@0.10.39/dist/ovenplayer.js"></script> -->
  <script defer id="oven-script" src="/node_modules/ovenplayer/dist/ovenplayer.js"></script>
</svelte:head>

<div id="playerContainer">
  <div class="mb-6">
    <Input id="stream-input" size="lg" placeholder="Stream Name" onchange={(e) => {
      window.location.hash = `#name=${e.target.value}`;
      loadOvenPlayer(e.target.value);
      e.target.value = "";
    }} />
  </div>
  <div id="ovenplayer"></div>
  <!-- SVG Source: https://www.svgrepo.com/svg/347276/picture-in-picture -->
  <div class="pip-holder op-navigators op-clear" style="display: none;">
    <button class="op-button op-pip-button" aria-label="Toggle Picture-in-Picture">
      <i class="op-con op-pip-enter" style="display: block;">
        <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path fill="none" d="M0 0h24v24H0z"/>
                <path fill-rule="nonzero" d="M21 3a1 1 0 0 1 1 1v7h-2V5H4v14h6v2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm0 10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h8zm-1 2h-6v4h6v-4z"/>
            </g>
        </svg>
      </i>
    </button>
  </div>
</div>


<script>
  import { onMount } from 'svelte';
  import { onDestroy } from 'svelte';
  import { Label, Input } from 'flowbite-svelte';
  import { once } from 'svelte/legacy';
  
  // let isFullscreen = false;
  let ovenPlayer = null;
  let reconnectTimer = null;

  // function waitForElement(selector, onElementCreation, options = { fireOnRecreation: false }) {
  //     if (document.querySelector(selector)) {
  //         onElementCreation(document.querySelector(selector));
  //         if (!options.fireOnRecreation) return;
  //     }

  //     const observer = new MutationObserver(mutations => {
  //         if (document.querySelector(selector)) {
  //             onElementCreation(document.querySelector(selector));
  //             if (!options.fireOnRecreation) observer.disconnect();
  //         }
  //     });

  //     observer.observe(document.body, {
  //         childList: true,
  //         subtree: true
  //     });
  // }

  function loadOvenPlayer(streamName) {
    if (reconnectTimer) clearTimeout(reconnectTimer);

    const ovenContainer = document.querySelector('#ovenplayer');
    const settings = {
        sources: [
            {
                label: 'webrtc-source',
                type: 'webrtc',
                file: `wss://hypercubemc.net:3334/app/${streamName}`
            }
        ]
    };

    if (!ovenPlayer) {
      ovenPlayer = OvenPlayer.create(ovenContainer, settings);

      ovenPlayer.on('error', function () {
        if (reconnectTimer) clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(function () {
          loadOvenPlayer(window.location.hash.split('=')[1]);
        }, 3000);
      });

      ovenPlayer.on('ready', function () {
        ovenPlayer.getConfig().systemText.api.error[501].message = 'This stream is offline... trying to connect';

        // Fix bug
        document.querySelector('.op-caption-text-container').remove();

        const pipButtonContainer = document.querySelector('.pip-holder');
        document.querySelector('.op-right-controls').prepend(pipButtonContainer);
        pipButtonContainer.style.display = 'block';

        pipButtonContainer.querySelector('button').addEventListener('click', () => {
          if (ovenPlayer.getMediaElement().readyState >= HTMLMediaElement.HAVE_METADATA) {
            ovenPlayer.getMediaElement().requestPictureInPicture();
          }
        });
      });
    } else {
      ovenPlayer.load(settings);
      
      setTimeout(() => {
        if (ovenPlayer) ovenPlayer.play();
      }, 0);
    }

    // document.querySelector(".op-fullscreen-button").addEventListener("click", element => {
    //     isFullscreen = !isFullscreen;
    //     window.parent.postMessage({
    //         ovenPlayerEvent: { type: "toggleFullscreen", data: { isFullscreen: isFullscreen } }
    //     }, "*");
    // });

    // const closeButtonHolder = document.createElement("div");
    // closeButtonHolder.classList.add("close-holder", "op-navigators", "op-clear");
    // closeButtonHolder.innerHTML = `<button class="op-button op-close-button"><i class="op-con op-close">X</i></button>`;
    // document.querySelector(".op-right-controls").appendChild(closeButtonHolder);

    // document.querySelector(".op-close-button").addEventListener("click", element => {
    //     window.parent.postMessage({
    //         ovenPlayerEvent: { type: "closeStream", data: null }
    //     }, "*");
    // });
  }

  onMount(() => {
    if (!window.location.hash) window.location.hash = "#name=justsnoopy";

    if (window.OvenPlayer != null) {
      loadOvenPlayer(window.location.hash.split('=')[1]);
    } else {
      document.querySelector("#oven-script").addEventListener('load', () => {
        loadOvenPlayer(window.location.hash.split('=')[1]);
      }, { once: true });
    }
  });

  onDestroy(() => {
    if (ovenPlayer) {
      ovenPlayer.remove();
      ovenPlayer = null;
    }
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
    }
  });
</script>

<style>
  #playerContainer {
    margin-top: auto;
    margin-bottom: auto;
  }

  .op-pip-button {
    width: 30px;
    height: 30px;
  }

  .op-pip-button {
    margin-right: 12px;
  }

  /* .op-close-button {
      position: relative;
      margin-right: 12px;
  } */
</style>