<script lang="ts">
    import { initializeApp } from "firebase/app";
    import { getDatabase, ref, onValue, set } from "firebase/database";
    import { firebaseConfig } from "./firebase";
    
    export let roomid;
    export let doTransition;
  
    initializeApp(firebaseConfig);
    const database = getDatabase();
    const dbRef = ref(database, `data/game/${roomid}`);



    let p1_name = ""
    let p2_name = ""

    let p1_score = 0
    let p2_score = 0

    let p1_win = false
    let p2_win = false

    let p1_c = null
    let p2_c = null

    onValue(dbRef, (value)=>{
        type userData = {
            charactor: number
            isReady: number
            isVibrate: number
            score: number,
            position: number,
            isWin? : number
        }
        const data = value.val();

        // if(data.)
        const userData: {[key:string]:userData} = data.users
        let userList: string[] = []

        if(userData){
            userList = Object.keys(userData)
            console.log(userList, userData)
            if(!userList[0]) return
            p1_c = userData[userList[0]].charactor
            p1_score = userData[userList[0]].score
            p1_name = userList[0]
            p1_win = userData[userList[0]].isWin == 1
            
            if(!userList[1]) return
            p2_c = userData[userList[1]].charactor
            p2_score = userData[userList[1]].score
            p2_name = userList[1]
            p2_win = userData[userList[1]].isWin == 1
        }
        console.log("onvalue", data, userData)
    })



    import bg_main from '../assets/Main/roomid_bg_2.png'
    import btn_play from '../assets/Main/start_btn.png'

    import c0 from '../assets/Character/c0.png'
    import c0f from '../assets/Character/c0f.png'
    import c1 from '../assets/Character/c1.png'
    import c2 from '../assets/Character/c2.png'
    import c3 from '../assets/Character/c3.png'
    import c4 from '../assets/Character/c4.png'
    import c5 from '../assets/Character/c5.png'

    import { navigate } from "svelte-routing";

    const charactors = [c1,c2,c3,c4,c5]
    const charractor_unchoose = [c0, c0f]

  </script>
  
  <main>
    <div class="background">
      <img src={bg_main} alt="background" width="100%" height="100%">
    </div>

    <!-- <div class="room-id">Room {roomid}</div> -->
    <!-- <div class="waiting">Waiting{dots}</div> -->

    <div class="cooldown">{p1_score}:{p2_score}</div>
    
    <div class="p1-name">{p1_name || "p1"}</div>
    <div class="p2-name">{p2_name || "p2"}</div>

    <div class="p1-charactor {p1_win?'win':'lose'}"><img src={charactors[p1_c ?? 1]} alt="player 1 charactor"></div>
    <div class="p2-charactor {p2_win?'win':'lose'}"><img src={charactors[p2_c ?? 1]} alt="player 1 charactor"></div>
  </main>
  
  <style lang="scss">
    @import url('https://fonts.googleapis.com/css2?family=Mali:wght@400;500;600;700&display=swap');

    $txt-outline-color-1: #94793f;
    $txt-outline-color-2: #5b462d;

    * {
        font-family: 'Mali', cursive;
    }

    .txt {
        position: fixed;
        font-size: 100px;
        font-weight: 700;
        color: white;
        -webkit-text-stroke: 5px $txt-outline-color-1;
        -webkit-text-fill-color: white;
    }

    .room-id {
        @extend .txt;
        top: 6.6vh;
        right: 10vw;
    }

    .waiting {
        @extend .txt;
        top: 6.6vh;
        left: 10vw;
    }

    .cooldown {
      @extend .txt;
      top: 10vh;
      left: 20vw;
      width: 60vw;
      // height: 60vh;
      font-size: 200px;
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
        display: flex;
        bottom: 9.7vh;
        left: 16vw;
        width: 30vw;
        height: 15vh;
        font-size: 8vh;
        align-items: center;
        justify-content: center;
        background-color: $txt-outline-color-2;
        overflow: hidden;
        border-radius: 20px;
        -webkit-text-stroke: 2px $txt-outline-color-1;
        border: rgb(43, 14, 2) 3px solid
    }

    .p2-name{
        @extend .p1-name;
        left: unset;
        right:  16vw;
    }

    .p1-charactor {
        position: fixed;
        background-color: rgba(255, 255, 255, 0.356);
        // 
        width: 24vw;
        height: 44vh;
        bottom: 27vh;
        left: 19vw;
        border-radius: 40%;
        border: rgb(252, 162, 120) 3px solid;

        display: flex;
        justify-content: center;
        align-items: center;

        img {
            height: 60%;
            animation: dukdik 1s infinite;
        }

        @keyframes dukdik {
            0% {
                transform: rotate(0);
            }
            25% {
                 transform: rotate(10deg);
            }
            50% {
                 transform: rotate(0deg);
            }
            75% {
                 transform: rotate(-10deg);
            }
        }
    }

    .p2-charactor {
        @extend .p1-charactor;
        left: unset;
        right: 19vw;
        transform: scaleX(-1);
    }

    .win {
        background-color: rgb(193, 249, 138);
    }
    .lose {
        background-color: rgb(249, 138, 138);
    }
  </style>
  