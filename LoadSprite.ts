const { ccclass, menu } = cc._decorator

@ccclass
@menu('Lib/LoadSprite')
export default class LoadSprite extends cc.Component {
    private sprite: cc.Sprite = null
    private currentState: State

    onLoad() {
        this.sprite = this.getComponent(cc.Sprite);
        const spriteFrame = this.sprite.spriteFrame;
        if (spriteFrame) {
            this.changeState(new DisplayingState(this, spriteFrame));
        } else {
            this.changeState(new NoSpriteState(this));
        }
    }
    onDestroy() {
        this.currentState.onDestroy()
    }
    setSpriteFrame(spriteFrame: cc.SpriteFrame) {
        this.sprite.spriteFrame = spriteFrame
    }
    public getCachedSpriteFrame(url: string): cc.SpriteFrame {
        const info = cc.resources.getInfoWithPath(url, cc.SpriteFrame)
        if (!info) {
            return null;
        }
        return cc.assetManager.assets.get(info.uuid) as cc.SpriteFrame
    }
    changeState(newState: State): void {
        if (this.currentState) {
            this.currentState.onExit()
            this.currentState.context = null
        }
        this.currentState = newState
        if (this.currentState) {
            this.currentState.onEnter()
        }
    }
    set url(url: string) {
        this.currentState.setUrl(url)
    }
}

abstract class State {
    context: LoadSprite
    constructor(context: LoadSprite) {
        this.context = context;
    }
    onEnter(): void { }
    onExit(): void { }
    setUrl(url: string): void { }
    onDestroy(): void { }
}

class NoSpriteState extends State {
    setUrl(url: string): void {
        let cachedSprite = this.context.getCachedSpriteFrame(url)
        if (cachedSprite) {
            this.context.changeState(new DisplayingState(this.context, cachedSprite))
        } else {
            this.context.changeState(new LoadingState(this.context, url))
        }
    }
    onDestroy(): void {
        this.context.changeState(new DestroyState(this.context));
    }
}

class DisplayingState extends State {
    spriteFrame: cc.SpriteFrame
    constructor(context: LoadSprite, spriteFrame: cc.SpriteFrame) {
        super(context)
        this.spriteFrame = spriteFrame
    }
    onEnter(): void {
        this.spriteFrame.addRef();
        this.context.setSpriteFrame(this.spriteFrame);
    }
    onExit(): void {
        this.spriteFrame.decRef();
        this.context.setSpriteFrame(null);
    }
    setUrl(url: string): void {
        let cachedSprite = this.context.getCachedSpriteFrame(url)
        if (cachedSprite) {
            this.context.changeState(new DisplayingState(this.context, cachedSprite))
        } else {
            this.context.changeState(new LoadingState(this.context, url))
        }
    }
    onDestroy(): void {
        this.context.changeState(new DestroyState(this.context));
    }
}

class LoadingState extends State {
    private url: string
    constructor(context: LoadSprite, url: string) {
        super(context)
        this.url = url
    }
    onEnter(): void {
        cc.resources.load(this.url, cc.SpriteFrame, (err, asset) => {
            if (err) {
                this.onLoadError(err);
            } else {
                this.onLoadComplete(asset);
            }
        })
    }
    onLoadError(err: Error) {
        setTimeout(() => {
            throw err;
        })
        this.context.changeState(new NoSpriteState(this.context))
    }
    onLoadComplete(asset: cc.SpriteFrame) {
        if (this.context) {
            this.context.changeState(new DisplayingState(this.context, asset))
        } else {
            asset.addRef();
            asset.decRef();
        }
    }
    onDestroy(): void {
        this.context.changeState(new DestroyState(this.context));
    }
    setUrl(url: string): void {
        if (this.url !== url) {
            this.context.changeState(new LoadingState(this.context, url))
        }
    }
}

class DestroyState extends State { }
