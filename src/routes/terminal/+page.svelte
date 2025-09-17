<svelte:head>
  <title>Terminal</title>
  <meta name="title" content="Terminal" />
  <link rel="stylesheet" href="/node_modules/@xterm/xterm/css/xterm.css">
</svelte:head>

<div class="terminal-page">
  <Terminal windowTitle={windowTitle} redPressed={redPressed} yellowPressed={yellowPressed} greenPressed={greenPressed}/>
</div>

<script>
  // let windowUsername = `user${Math.random().toString().substring(14)}`;
  import { socket } from "$lib/websocketConnection.js";
  import Terminal from "$lib/Terminal.svelte";
  import { onDestroy, onMount } from "svelte";
  import * as xterm from '@xterm/xterm';

  let webLinksAddon;
  let fitAddon;
  let windowTitle = "ubuntu@hyperhosted-demo: ~";

  function redPressed() {
    
  }

  async function yellowPressed() {
    if (!documentPictureInPicture) return; // Not supported

    const terminalContainer = document.querySelector(".terminal-page .container"); /* Hack - internal element of component */

    if (!documentPictureInPicture.window) {
      const pipWindow = await documentPictureInPicture.requestWindow({
        width: terminalContainer.clientWidth + 32,
        height: terminalContainer.clientHeight
      });

      // Source: https://developer.chrome.com/docs/web-platform/document-picture-in-picture
      // Copy style sheets over from the initial document
      // so that the player looks the same.
      [...document.styleSheets].forEach((styleSheet) => {
        try {
          const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
          const style = document.createElement('style');

          style.textContent = cssRules;
          pipWindow.document.head.appendChild(style);
        } catch (e) {
          const link = document.createElement('link');

          link.rel = 'stylesheet';
          link.type = styleSheet.type;
          link.media = styleSheet.media;
          link.href = styleSheet.href;
          pipWindow.document.head.appendChild(link);
        }
      });

      pipWindow.addEventListener("pagehide", (event) => {
        const terminalPageContainer = document.querySelector(".terminal-page");
        const pipPlayer = event.target.querySelector(".container"); /* Hack - internal element of component */
        terminalPageContainer.append(pipPlayer);
        fitTerminal();
      });

      pipWindow.document.body.append(terminalContainer);

      setTimeout(() => {
        fitTerminal();
      }, 0);
    } else {
      documentPictureInPicture.window.close();
    } 
  }

  function greenPressed() {
    if (!document.fullscreenElement) {
      document.querySelector(".terminal-page .container").requestFullscreen(); /* Hack - internal element of component */
    } else {
      document.exitFullscreen();
    }
    
    fitTerminal();
  }

  function fitTerminal() {
    if (fitAddon) {
      /* Hack */
      for (let i = 0; i < 50; i++) {
        fitAddon.fit();
      }
    }
  }

  onMount(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const terminalId = urlParams.get("terminalId");

    socket.emit("terminal:connect", terminalId != null ? terminalId : "default");

    const terminalOutputContainer = document.querySelector(".terminal_output"); /* Hack - internal element of component */

    let terminal = new xterm.Terminal({ cursorBlink: true, scrollback: 1000, theme: { background: "rgba(0, 0, 0, 0)" } });

    import('@xterm/addon-web-links').then(( { WebLinksAddon } ) => {
      webLinksAddon = new WebLinksAddon();
      terminal.loadAddon(webLinksAddon);
    });


    import('@xterm/addon-fit').then(( { FitAddon } ) => {
      fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);

      // Only open after addon is loaded to prevent layout shift
      terminal.open(terminalOutputContainer);
      terminal.focus();

      fitTerminal();
    });

    window.addEventListener("resize", () => {
      fitTerminal();
    });

    terminal.onData((key) => {
      // let hex = key.codePointAt(0).toString(16);
      // let result = "\\u" + "0000".substring(0, 4 - hex.length) + hex;
      // console.log(`Unicode Codepoint: ${result}`);
      socket.emit("terminal:input", key);
    });

    socket.on("terminal:output", (terminalOutput) => {
      terminal.write(terminalOutput);

      /* Find new path if present to update title */
      const cleanedOutput = cleanTerminalOutput(terminalOutput);

      // Regex from ChatGPT
      const matches = [...cleanedOutput.matchAll(/ubuntu@[\w.-]+:\s*([^\s$]+)/g)];
      const currentPath = matches.length ? matches[matches.length - 1][1] : null;

      if (currentPath) {
        windowTitle = `ubuntu@hyperhosted-demo: ${currentPath}`;
      }
    });

    socket.on("terminal:clear", () => {
      terminal.reset();
    });

    socket.on("disconnect", () => {
      terminal.reset();
      terminal.write("Reconnecting...");
    });

    socket.io.on("reconnect", () => {
      terminal.reset();
      socket.emit("terminal:connect", terminalId != null ? terminalId : "default");
    });

    // const rowHeight = document.querySelector(".xterm-rows > div")?.clientHeight;
    // if (rowHeight) {
    //   setTerminalRowHeight(rowHeight);
    // }

    // function resizeScreen() {
    //   // fitAddon.fit()
    //   socket.emit("resize terminal", {
    //     cols: terminal.cols,
    //     rows: terminal.rows,
    //   });
    //   console.log(`Cols: ${terminal.cols}`);
    //   console.log(`Rows: ${terminal.rows}`);
    // }
  });

  onDestroy(() => {
    socket.off("terminal:output");
    socket.off("terminal:clear");
    socket.off("disconnect");
    socket.io.off("reconnect");
  });

  // Generated from ChatGPT, works well enough
  function cleanTerminalOutput(terminalOutput) {
    // Remove ANSI escape codes (color, formatting, etc.)
    let cleanedOutput = terminalOutput.replace(/\x1b\[[0-9;]*[A-Za-z]/g, '');

    // Remove OSC sequences (window title changes, etc.)
    cleanedOutput = cleanedOutput.replace(/\x1b\].*?\x07/g, '');

    // Remove DEC private mode sequences (like `[?2004h`)
    cleanedOutput = cleanedOutput.replace(/\x1b\[\??[0-9;]*[hl]/g, '');

    // Remove other control characters like carriage return (\r) and bell (\a)
    cleanedOutput = cleanedOutput.replace(/[\x00-\x1F\x7F]/g, '');

    return cleanedOutput;
  }
</script>

<style>
  .terminal-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 150%;
    flex-grow: 1;
  }

  :global(.xterm-viewport) {
    overflow-y: auto !important;
  }
</style>
