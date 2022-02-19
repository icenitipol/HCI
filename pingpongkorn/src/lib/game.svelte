<script lang="ts">

    //  todo
    /*
      - play again

      - ai2
    */

    import { initializeApp } from "firebase/app";
    import { getDatabase, ref, onValue, set } from "firebase/database";
    import { firebaseConfig } from "./firebase";
    import type { GameObject } from "./GameObj";
    import { setGameLoopFunction } from "./GameUpdate";
    import { uniqueLog } from "./uniqueLog";
    import { vw, vh, xy, vector, vectorToXY } from "./units";
    import GameObjectElement from './GameObjectElement.svelte'
    import { debounce } from "./debounce";
    import bg_main from '../assets/Main/playing_bg.png'
    import fish from '../assets/Main/fish.png'
    import blankImage from '../assets/blank.png'
    import {assets} from './assets'
    import { navigate } from "svelte-routing";
  
    

    export let roomid;
    export let doTransition;


    console.log("game room id", roomid)

    initializeApp(firebaseConfig);
    const database = getDatabase();
    const dbRef = ref(database, `data/game/${roomid}`);

    let countdown = 5
    
    const checkCountdown = () => {
      if(!gameStartState) gameStartState = countdown == 0
      cooldownState = countdown == 0
    }

    let gameStartState = false
    let cooldownState = false
    setInterval(()=>{
      if(countdown > 0){
        countdown--
        checkCountdown()
      }
      
    },1000)
  
    /*
      INIT GAME OBJECT
    */

    type userData = {
        charactor?: number
        isReady?: number
        isVibrate?: number
        score?: number,
        position?: number
    }


    let wall_top_obj: GameObject
    let wall_btm_obj: GameObject
    let p1_obj: GameObject
    let p2_obj: GameObject
    let ball_obj: GameObject
  
    let ball_velo = vector(1,100);
  
    let offsetVallue =  0

    let p1pos =  50
    let p2pos =  50

    let p1Data: userData = {}
    let p2Data: userData = {}

    let p1Name = ""
    let p2Name = ""

    let p1Score = 0
    let p2Score = 0

    let p1_charactor = 0
    let p2_charactor = 0

    let wallSprite1
    let wallSprite2

    let p1Sprite
    let p2Sprite
    let ballSprite

    let isPause 
    let isEnd = false

    let isAlreadyDoTransition = false;
  
    onValue(dbRef, (snapshot) => {
      // return 

      ballSprite.src = fish
      wallSprite1.src = blankImage
      wallSprite2.src = blankImage

      const data = snapshot.val();

      isPause = data.isPause == 1

      // console.log(data)
      let playerData = data.users;
  
      if(!p1_obj || !p2_obj) return

      // 33 - 85
      p1Name = Object.keys(playerData)[0]
      p2Name = Object.keys(playerData)[1] ?? p1Name

      p1Data = playerData[p1Name]
      p2Data = playerData[p2Name]

      p1_charactor = p1Data.charactor
      p2_charactor = p2Data.charactor

      p1Sprite.src=assets.charactors[parseInt(p1_charactor+"")]
      p2Sprite.src=assets.charactors[parseInt(p2_charactor+"")]
      
      p1Sprite = p1Sprite
      p2Sprite = p2Sprite
      ballSprite = ballSprite
  
      if(p1Data)  {
        p1pos = p1Data["position"]
        if(p1pos < 33) p1pos = 33
        if(p1pos > 85) p1pos = 85
        p1_obj.pos.y = vh(p1pos)
      }

      if(p2Data)  {
        p2pos = p2Data["position"]
        if(p2pos < 33) p2pos = 33
        if(p2pos > 85) p2pos = 85
        p2_obj.pos.y = vh(p2pos)
      }

      // console.log(p1pos)

    });
  
    const flipBallXVelo = debounce(()=>{
      ball_velo = ball_velo.inverseX()
    })
  
    const flipBallYVelo = debounce(()=>{
      ball_velo = ball_velo.inverseY()
    })
  
    const getOffsetValue = () => offsetVallue
    const addOffsetValue = debounce(()=>{
      ball_velo = ball_velo.addXRatio(getOffsetValue())
    })

    const checkWinResult = () => {
      if(p1Score < 150 && p2Score < 150) return
      set(ref(database, `data/game/${roomid}/state`), 2)
      set(ref(database, `data/game/${roomid}/users/${p1Name}/isWin`), p1Score > p2Score ? 1 : 0)
      set(ref(database, `data/game/${roomid}/users/${p2Name}/isWin`), p1Score < p2Score ? 1 : 0)

      if(isAlreadyDoTransition) return
      isAlreadyDoTransition = true;
      isPause = true;
      isEnd = true;
      setTimeout(() => {
        doTransition()
        setTimeout(() => {
            navigate('ending')
        }, 600);
      }, 1000);
    }

    const addP1Score = debounce(()=>{
      p1Score+=10
      set(ref(database, `data/game/${roomid}/users/${p1Name}/score`), p1Score)
      checkWinResult()
    })

    const addP2Score = debounce(()=>{
      p2Score+=10
      set(ref(database, `data/game/${roomid}/users/${p2Name}/score`), p2Score)
      checkWinResult()
    })

    const setP1Vibrate = debounce(()=>{
      set(ref(database, `data/game/${roomid}/users/${p1Name}/isVibrate`), 1)
    })

    const setP2Vibrate = debounce(()=>{
      set(ref(database, `data/game/${roomid}/users/${p2Name}/isVibrate`), 1)
    })

    const setP1VibrateLv2 = debounce(()=>{
      set(ref(database, `data/game/${roomid}/users/${p1Name}/isVibrate`), 2)
    })

    const setP2VibrateLv2 = debounce(()=>{
      set(ref(database, `data/game/${roomid}/users/${p2Name}/isVibrate`), 2)
    })

    
  
    let deg = 0
  
    setGameLoopFunction(() => {
      if(!ball_obj) return
      if(gameStartState && cooldownState && !isPause && !isEnd){


        ball_obj = ball_obj.push(vectorToXY(ball_velo));

    
        if (ball_obj.isCollideWith(p2_obj)) {
          setP2Vibrate()
          flipBallXVelo()
          offsetVallue = ((ball_obj.pos.y - p2_obj.pos.y) / (p2_obj.sprite.elm.clientHeight / 2)) * 20
          addOffsetValue()
        }
        if (ball_obj.isCollideWith(p1_obj)) {
          setP1Vibrate()
          flipBallXVelo()
          offsetVallue = ((ball_obj.pos.y - p1_obj.pos.y) / (p1_obj.sprite.elm.clientHeight / 2)) * 20
          addOffsetValue()
        }
    
        if(ball_obj.isCollideWith(wall_top_obj)) flipBallYVelo()
        if(ball_obj.isCollideWith(wall_btm_obj)) flipBallYVelo()

        if(ball_obj.pos.x > vw(100)){
          addP1Score()
          setP2VibrateLv2()

          ball_obj.pos = new xy(vw(50), vh(57.3))
          ball_velo = vector(1,100)
          ball_velo = ball_velo.inverseX()

          countdown = 4;
          checkCountdown()
        }

        if(ball_obj.pos.x < vw(0)){
          addP2Score()
          setP1VibrateLv2()

          ball_obj.pos = new xy(vw(50), vh(57.3))
          ball_velo = vector(1,100)

          countdown = 4;
          checkCountdown()
        }
    
      }
      

      deg+=.5
      ball_obj.sprite.elm.style.transform = `rotate(${deg}deg)`
      p2_obj.sprite.elm.style.transform = "scaleX(-1)"
    });
  
  </script>
  
  <main>
    <div class="background">
      <img src={bg_main} alt="bg" width="100%" height="100%">
    </div>
  
    <!-- <p style="top: 1rem">dt: {dt}</p> -->
    <!-- <p style="top: 2rem">ball pos: {Math.round(ball_obj?.pos.x)}, {Math.round(ball_obj?.pos.y)}</p> -->
    <!-- <p style="top: 3rem">velo: {ball_velo.x}, {ball_velo.y}</p> -->
  
    <div class="p1-name">{p1Name ?? "Player1"} </div>
    <div class="p2-name">{p2Name ?? "Player2"}</div>

    <div class="p1-score">score: {p1Score}</div>
    <div class="p2-score">score: {p2Score}</div>

    {#if countdown != 0}
      <div class="cooldown">{countdown}</div>
    {/if}

    {#if isPause}
      <div class="cooldown">PAUSE</div>
    {/if}
    

    {#if !gameStartState && countdown > 1}
      <div class="overlay">
        <p>-เตรียมพร้อม-</p>
        <br>
        <p style="font-size: 2.5rem;">ลองขยับโทรศัพท์ขึ้นลงดู</p>
      </div>
    {/if}
    

    <!-- <div class="overlay">
      <p style="font-size: 2.5rem;">เกมจะเริ่มใน</p>
      <p>5</p>
    </div> -->
  
    <GameObjectElement bind:gameObject={p1_obj} class="player" height={vh(26)} width={160} pos={new xy(vw(4), vh(50) + 50)} bind:imgSprite={p1Sprite}></GameObjectElement>
    <GameObjectElement bind:gameObject={p2_obj} class="player" height={vh(30)} width={160} pos={new xy(vw(95.2), vh(50))} bind:imgSprite={p2Sprite}></GameObjectElement>
  
    <GameObjectElement 
      bind:gameObject={ball_obj} 
      class="ball" 
      height={80} 
      width={100} 
      pos={new xy(vw(50), vh(57.3))}
      bind:imgSprite={ballSprite}
      >
      test
    </GameObjectElement>
  
    <GameObjectElement bind:gameObject={wall_top_obj} class="wall" height={100} width={vw(100)} pos={new xy(vw(50), vw(7.3))} bind:imgSprite={wallSprite1}></GameObjectElement>
    <GameObjectElement bind:gameObject={wall_btm_obj} class="wall" height={100} width={vw(100)} pos={new xy(vw(50), vh(100) + 30)} bind:imgSprite={wallSprite2}></GameObjectElement>
  </main>
  
  <style lang="scss">

    $txt-outline-color-1: #94793f;
    $txt-outline-color-2: #5b462d;

    * {
        font-family: 'Mali', cursive;
    }

    .txt {
        position: fixed;
        font-size: 3rem;
        font-weight: 700;
        color: white;
        -webkit-text-stroke: 2px $txt-outline-color-1;
        -webkit-text-fill-color: white;
    }

    .cooldown {
      @extend .txt;
      bottom: 0vh;
      left: 20vw;
      width: 60vw;
      // height: 60vh;
      font-size: 300px;
      -webkit-text-stroke: 5px $txt-outline-color-1;
      // background-color: red;
      display: flex;
      text-align: center;
      justify-content: center;
      align-items: center;
      margin: 0;
      z-index: 999;
    }

    .p1-name {
      @extend .txt;
      top: 3vh;
      left: 10vw;
    }

    .p2-name {
      @extend .txt;
      top: 3vh;
      right: 10vw;
    }

    .p1-score {
      @extend .p1-name;
      top: 8vh;
    }

    .p2-score {
      @extend .p2-name;
      top: 8vh;
    }

    .overlay {
        @extend .txt;
        display: flex;
        top: 25vh;
        left: 20vw;
        width: 60vw;
        height: 50vh;
        font-size: 8vh;
        align-items: center;
        justify-content: center;
        background-color: $txt-outline-color-2;
        // overflow: hidden;
        border-radius: 20px;
        -webkit-text-stroke: 2px $txt-outline-color-1;
        z-index: 99;
        flex-direction: column;
        
        p {
          margin: 0;
        }
        // border: rgb(43, 14, 2) 3px solid
    }

    :global(.background) {
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
      margin-bottom: 150px;
    }
    :global(.flex img:hover) {
      height: 10%; 
      margin-bottom: 150px;
      filter: brightness(80%);
    }
    :global(.flex img:active) {
      height: 10%; 
      margin-bottom: 150px;
      filter: brightness(50%);
    }

    :global(.player) {
      /* background-color: red; */
      transition: all 100ms;
      border-right: solid 15px white;
      /* border-left: solid 15px white; */
      border-radius: 20px;
    }
    /* :global(.ball) {
      border-radius: 0%;
      background-color: black;
      color: white;
    } */
    /* :global(.wall) {
      background-color: rgba(184, 144, 144, 0.404);
    } */
  </style>
  