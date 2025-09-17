<!-- Based on https://uiverse.io/00Kubi/fat-moose-43 -->
<script>
  export let windowTitle
  export let redPressed = () => {};
  export let yellowPressed = () => {};
  export let greenPressed = () => {};
</script>

<div class="container">
  <div class="terminal_toolbar">
    <div class="buttons">
      <button class="btn btn-red" aria-label="Close" on:click={redPressed}></button>
      <button class="btn btn-yellow" aria-label="Minimize" on:click={yellowPressed}></button>
      <button class="btn btn-green" aria-label="Maximize" on:click={greenPressed}></button>
    </div>
    <p class="window_title">{windowTitle}</p>
    <div class="add_tab">+</div>
  </div>
  <div class="terminal_body">
    <!-- <div class="terminal_prompt">
      <span class="terminal_user">00Kubi@admin:</span>
      <span class="terminal_location">~</span>
      <span class="terminal_bling">$</span>
      <span class="terminal_cursor"></span>
    </div> -->
    <div class="terminal_output">
      <!-- <pre class="output_text">Welcome to Terminal</pre> -->
    </div>
    <!-- <div class="terminal_input">
      <input placeholder="Type a command..." class="input_text" type="text" />
    </div> -->
  </div>
</div>

<style>
  .container {
    /* width: 400px;
    height: 300px; */
    height: 533px;
    background: #1e1e1e;
    font-family: Menlo, Consolas, monospace;
    font-size: 14px;
    color: #e6e6e6;
    border-radius: 5px;
    overflow: hidden;
  }

  .terminal_toolbar {
    display: flex;
    height: 30px;
    align-items: center;
    padding: 0 8px;
    box-sizing: border-box;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background: #212121;
    justify-content: space-between;
  }

  .buttons {
    display: flex;
    align-items: center;
  }

  .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin-right: 5px;
    font-size: 8px;
    height: 12px;
    width: 12px;
    box-sizing: border-box;
    border: none;
    border-radius: 100%;
    background: linear-gradient(#7d7871 0%, #595953 100%);
    text-shadow: 0px 1px 0px rgba(255, 255, 255, 0.2);
    box-shadow: 0px 0px 1px 0px #41403a, 0px 1px 1px 0px #474642;
  }

  .btn-red {
    background: #ee411a;
  }

  .btn-yellow {
    background: #fcc22d;
  }

  .btn-green {
    background: #33c648;
  }

  .btn:hover {
    cursor: pointer;
  }

  .btn:focus {
    outline: none;
  }

  /* .buttons--exit {
    background: linear-gradient(#f37458 0%, #de4c12 100%);
  } */

  .add_tab {
    border: 1px solid #fff;
    color: #fff;
    padding: 0 6px;
    border-radius: 4px 4px 0 0;
    border-bottom: none;
    cursor: pointer;
  }

  .user {
    color: #d5d0ce;
    margin-left: 6px;
    font-size: 14px;
    line-height: 15px;
  }

  .terminal_body {
    background: rgba(0, 0, 0, 0.6);
    height: calc(100% - 30px);
    padding-top: 2px;
    margin-top: -1px;
    font-size: 12px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    display: flex;
    flex-direction: column;
  }

  .terminal_prompt {
    display: flex;
    align-items: center;
    padding: 4px;
  }

  .terminal_prompt span {
    margin-left: 4px;
  }

  .terminal_user {
    color: #1eff8e;
  }

  .terminal_location {
    color: #4878c0;
  }

  .terminal_bling {
    color: #dddddd;
  }

  .terminal_cursor {
    display: block;
    height: 14px;
    width: 5px;
    margin-left: 10px;
    animation: curbl 1200ms linear infinite;
  }

  .terminal_output {
    padding: 4px;
    flex-grow: 1;
    overflow-y: auto;

    scrollbar-color: #404040 rgba(0, 0, 0, 0);
    scrollbar-highlight-color: #575656;
  }

  .output_text {
    margin: 0;
  }

  .terminal_input {
    padding: 4px;
  }

  .input_text {
    width: 100%;
    padding: 6px;
    background: transparent;
    border: none;
    color: #e6e6e6;
    caret-color: #1eff8e;
  }

  @keyframes curbl {
    0% {
      background: #ffffff;
    }

    49% {
      background: #ffffff;
    }

    60% {
      background: transparent;
    }

    99% {
      background: transparent;
    }

    100% {
      background: #ffffff;
    }
  }
</style>
