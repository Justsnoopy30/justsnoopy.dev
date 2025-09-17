<svelte:head>
  <title>Chat</title>
  <meta name="title" content="Chat" />
</svelte:head>

<script>
  import { socket } from '$lib/websocketConnection.js';
  import { onMount, onDestroy } from 'svelte';
  import { Input } from 'flowbite-svelte';

  let username;

  onMount(() => {
    socket.on('chat:message', (message) => {
      // messages = [...messages, message];
      const messageEl = document.createElement('p');
      messageEl.textContent = `${message.from}: ${message.message}`;
      document.querySelector('#messages').appendChild(messageEl);
    });

    socket.on('chat:name', (name) => {
      username = name;
    });

    document.querySelector("#message-input").focus();
  });

  onDestroy(() => {
    socket.off('chat:message');
    socket.off('chat:name');
  });

  function sendMessage(message) {
    socket.emit('chat:message', message);
  }
</script>

<div class="chat">
  <div id="messages"></div>
  <div id="message-input-box" class="mb-6">
    <!-- <Label for="large-input" class="block mb-2">Large input</Label> -->
    <Input id="message-input" size="lg" placeholder="Send message" on:change={(e) => {
      sendMessage(e.target.value);
      e.target.value = "";
    }} />
  </div>
</div>

<style>
  .chat {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 150%;
    flex-grow: 1;
    height: 80vh;
  }

  #messages {
    flex-grow: 1;
    overflow-y: auto;
  }

  #message-input-box {
    padding-top: 2rem;
    /* margin-top: auto; */
  }
</style>
