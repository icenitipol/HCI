import { xy } from './units'

type gameElement = HTMLDivElement

export class GameObject {
    sprite: GameSprite
    pos: xy

    constructor() {
        // this.sprite = sprite
        this.pos = new xy()
    }

    push(value: xy){
        this.pos.push(value)
        this.pos = this.pos
        return this
    }

    isCollideWith(other: GameObject){
        const selfheight = this.sprite.elm.clientHeight
        const selfwidth = this.sprite.elm.clientWidth

        const otherheight = other.sprite.elm.clientHeight
        const otherwidth = other.sprite.elm.clientWidth

        const selfpos = {
            top: this.pos.y - (selfheight / 2),
            bottom: this.pos.y + (selfheight / 2),
            left: this.pos.x - (selfwidth / 2),
            right: this.pos.x + (selfwidth / 2),
        }

        const otherpos = {
            top: other.pos.y - (otherheight / 2),
            bottom: other.pos.y + (otherheight / 2),
            left: other.pos.x - (otherwidth / 2),
            right: other.pos.x + (otherwidth / 2),
        }

        const topdown = selfpos.top < otherpos.bottom && selfpos.top > otherpos.top
        const bottomup = selfpos.bottom > otherpos.top && selfpos.bottom < otherpos.bottom
        const leftright = selfpos.left < otherpos.right && selfpos.left > otherpos.left
        const rightleft = selfpos.right > otherpos.left && selfpos.right < otherpos.right

        if((topdown && (leftright || rightleft)) || (bottomup && (leftright || rightleft))) {
            // console.log("COLLIDED", this.pos, other.pos, {selfpos, otherpos, topdown, bottomup, leftright, rightleft})
            return true
        }
        return false
    }
}

export class GameSprite {
    elm: gameElement

    constructor(elm: gameElement) {
        this.elm = elm
    }

}