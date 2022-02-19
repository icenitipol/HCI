import { getDT } from "./GameUpdate"

export class xy {
    x; y;
    constructor(x:number = 0, y:number = 0){
      this.x = x
      this.y = y
    }
    push(value:xy){ 
      let dt = getDT()
      this.x = this.x + (value.x * dt)
      this.y = this.y + (value.y * dt)
    }
  }
export let screen = new xy(window.innerWidth, window.innerHeight)
export const vw = (value: number) => value / 100 * screen.x
export const vh = (value: number) => value / 100 * screen.y

export const vector = (target = 1, x_ratio = 100, invx = true, invy = true) => {
    let invx_ = invx;
    let invy_ = invy;
    let target_ = target;
    let x_ratio_ = x_ratio;
    const getReturningData = () => ({
      x: (invx_?-1:1) * (Math.sqrt(Math.pow(target_, 2) * x_ratio_ / 100)),
      y: (invy_?-1:1) * (Math.sqrt(Math.pow(target_, 2) * (100 - x_ratio_) / 100)),
      inverseX: () => {invx_ = !invx_; return getReturningData()},
      inverseY: () => {invy_ = !invy_; return getReturningData()},
      addXRatio: (value:number) => {
        if(x_ratio_ + value < 0 || x_ratio_ + value > 100){
          if(x_ratio_ + value < 0){ x_ratio_ -= value; invy_ = true; }
          if(x_ratio_ + value > 100){ x_ratio_ -= value; invy_ = false; }
        }
        else x_ratio_ += value
        return getReturningData()
      }
    })
    return getReturningData()
  }

  export const vectorToXY = (vector) => new xy(vector.x, vector.y)