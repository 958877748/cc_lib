const { ccclass, property } = cc._decorator

/**
 * The running order of game engine
 * 
 * 0.touch events are called outside the engine loop
 * 
 * 1.component update from script
 * 
 * 2.action manager update from tween
 * 
 * 3.animation manager update from Cocos animation
 * 
 * 4.physics system update Check Collision. 
 * If a collision occurs, a callback will be triggered.
 * 
 * 5.component lateUpdate from script
 * 
 * The hitbox added in steps 0-3 will be checked for collision 
 * in step 4, and a callback will be triggered if a collision occurs.
 * 
 * The hitbox is the area of the character's body 
 * that can deal damage to an opponent
 */
@ccclass
export default class HitBox extends cc.Component {

    private list: Array<cc.PhysicsCollider> = []

    onBeginContact(contact: any, self: any, other: cc.PhysicsCollider) {
        this.list.push(other)
    }

    onEndContact(contact: any, self: any, other: cc.PhysicsCollider) {
        let index = this.list.indexOf(other)
        if (index > - 1) {
            this.list.splice(index, 1)
        }
    }

    lateUpdate() {
        if (this.list.length === 0) {
            return
        }
        for (let i = 0; i < this.list.length; i++) {
            this.node.emit('Hit', this.list[i])
        }
        this.list.length = 0
    }
}