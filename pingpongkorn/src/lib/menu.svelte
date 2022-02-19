<script lang="ts">
    import bg_main from '../assets/main_bg.png'
    import btn_play from '../assets/Main/start_btn.png'
    import { navigate } from "svelte-routing";

    export let doTransition;

    const play = () => {
        doTransition()
        setTimeout(() => {
          navigate('lobby')
        }, 600);
    }
  </script>
  
  <main>
    <div class="background">
      <img src={bg_main} alt="background" width="100%" height="100%">
    </div>
    <div class="flex">
      <img src={btn_play} alt="play" on:click="{play}">
    </div>
  </main>
  
  <style>

  </style>
  