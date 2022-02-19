<!-- App.svelte -->
<script>
  import { Router, Link, Route } from "svelte-routing";
  import Menu from "./lib/menu.svelte";
  import Game from "./lib/game.svelte";
  import Lobby from "./lib/lobby.svelte";
  import Endling from "./lib/endling.svelte";

  export let url = "";

  const generateRoomID = () => (""+Math.round(Math.random()*9999)).padStart(4,"0")

  let roomid = generateRoomID()

  let doingTransition = false

  const doTransition = () => {
    console.log('transition')
    doingTransition = true
    setTimeout(() => {
      doingTransition = false
    }, 3000);
  }
</script>

<div>
  <div class="transition {doingTransition?'do':''}" id="transition1">
		<div class="transition"></div>
		<div class="transition"></div>
	</div>
  <Router url="{url}">
    <Route path="/"><Menu doTransition={doTransition}/></Route>
    <Route path="/lobby"><Lobby doTransition={doTransition} roomid={roomid}/></Route>
    <Route path="/game"><Game doTransition={doTransition} roomid={roomid}/></Route>
    <Route path="/ending"><Endling doTransition={doTransition} roomid={roomid}/></Route>
  </Router>
</div>



<style>
  .transition {
  position: fixed;
  width: 0;
  height: 100vh;
  top: 0;
  left: 0;
  opacity: 1;
  z-index: 9999;
  background-color: rgb(255, 255, 255);
}
.transition.do {
  animation: transition1 2s ease-in-out;
}
.transition.do div:nth-of-type(1) {
  animation: transition1 1.2s .4s linear;
  background-color: #ffa8b4;
}
.transition.do div:nth-of-type(2) {
  animation: transition1 1.4s .6s linear;
  background-color: #c23044;
}
@keyframes transition1 {
  0% {
    left: -30vw;
    width: 30vw;
  }
  50% {
    left: 50vw;
    width: 100vw;
  }
  100% {
    left: 100vw;
    width: 30vw;
  }
}
  /* :global(.background) {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: -1;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  :global(.flex) {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 1;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  :global(.flex img) {
    height: 10%; 
    margin-bottom: 9%;
  }
  :global(.flex img:hover) {
    height: 10.5%; 
    margin-bottom: 8%;
    filter: brightness(80%);
  }
  :global(.flex img:active) {
    height: 10%; 
    margin-bottom: 9%;
    filter: brightness(50%);
  } */
</style>