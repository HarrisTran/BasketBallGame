import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, EventTouch, game, Input, IPhysics2DContact, Node, NodeEventType, RigidBody2D, tween, UITransform, Vec2, Vec3 } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

export enum BallStatus {
    NONE = 0,
    DOWN,
    FLY
}

export enum TouchStatus {
    NONE = 0,
    BEGIN = 1,
    CANCEL,
}

@ccclass('Ball')
export class Ball extends Component {
    @property(RigidBody2D)
    private rigidBall : RigidBody2D = null;

    private _touchStatus : TouchStatus = TouchStatus.NONE;

    private _touchStartPos : Vec2;
    private _touchEndPos : Vec2;

    private _threw : boolean = false;
    private _destroyable: boolean = false;

    protected onLoad(): void {
        this.node.on(Input.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.on(Input.EventType.TOUCH_CANCEL,this.onTouchCancel,this);
        this.node.getComponent(Collider2D).on(Contact2DType.END_CONTACT,this.onEndContact,this);
    } 

    start(){
        this._threw = false;
        this._destroyable = false;
    }

    private onEndContact(self: Collider2D, other: Collider2D,contact: IPhysics2DContact){
        if(other.tag === 1){
            console.log(123123213);
            
            setTimeout(() => {
                GameManager.Instance.collisionSpace.active = true;
            }, 100);
        }
    }

    private onTouchStart(event: EventTouch){
        if(this._threw) return;
        this._touchStatus = TouchStatus.BEGIN
        this._touchStartPos = event.getLocation()
    }

    private onTouchCancel(event: EventTouch){
        if(this._threw) return;
        this._touchEndPos = event.getLocation();
        let direction = this._touchEndPos.subtract(this._touchStartPos);
        
        if(direction.length() > 50 && this._touchStartPos.y < this._touchEndPos.y){
            this._threw = true;
            this._touchStatus = TouchStatus.CANCEL;

            let linearImpulse = direction.multiplyScalar(20);
            
            this.rigidBall.gravityScale = 7;
            this.rigidBall.applyLinearImpulseToCenter(linearImpulse,true);
            tween(this.node)
            .to(1.25,{scale: new Vec3(0.8,0.8)},{easing: "sineIn"})
            .start();
        }else{
            this._touchStatus = TouchStatus.NONE;
        }
    }

    public set destroyable(isDestroy: boolean){
        this._destroyable = isDestroy;
    }



    protected update(dt: number): void {
        if(this.node.getWorldPosition().y < -200) this._destroyable = true;
    }

    protected lateUpdate(dt: number): void {
        if(this._destroyable){
            game.emit("spawn-ball");
            this.node.destroy();
        }
    }

}


