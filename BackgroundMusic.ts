// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

/**
 * 启用时播放背景音乐
 */
@ccclass
export default class BackgroundMusic extends cc.Component {

    @property(cc.AudioClip)
    music: cc.AudioClip = null

    audioID: number

    onEnable() {
        this.audioID = cc.audioEngine.playMusic(this.music, true)
    }
}
