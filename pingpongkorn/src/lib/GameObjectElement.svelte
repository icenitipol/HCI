<script lang="ts">
    import { onMount } from "svelte";
    import { GameObject, GameSprite } from "./GameObj";
    import { vh, vw, xy } from "./units";

    export let gameObject = new GameObject()
    // export let classname: string
    let elm: HTMLDivElement
    export let width:number = vw(10)
    export let height:number = vw(10)
    export let pos: xy = new xy(vw(50), vh(50))
    export let imgSprite: HTMLImageElement | undefined 

    onMount(()=>{
        gameObject.sprite = new GameSprite(elm)
        gameObject.pos = pos
    })
</script>

<div 
    bind:this="{elm}" 
    class="{$$props.class} gameobj" 
    style="
    top: calc({gameObject.pos.y}px - {height/2}px); 
    left: calc({gameObject.pos.x}px - {width/2}px); 
    width:{width}px; 
    height: {height}px" 
>
    <!-- {#if imgSprite} -->
    <img bind:this={imgSprite} alt="gameobject" class="{imgSprite?'':'hide'}">
    <!-- {/if} -->
    
</div>

<style lang="scss">
    .gameobj {
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
            max-height: 100%;
            width: 100%;
            
        }
        img.hide {
            display: none;
        }
    }
</style>
