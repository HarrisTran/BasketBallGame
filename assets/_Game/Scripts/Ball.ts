import { _decorator, BoxCollider2D, clamp, Collider2D, Component, Contact2DType, ERigidBody2DType, EventTouch, game, geometry, Input, IPhysics2DContact, math, Node, NodeEventType, RealCurve, RigidBody2D, tween, UITransform, v3, Vec2, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { ENUM_COLLIDER_TAG, ENUM_GAME_EVENT } from './Enum';
import { delay } from './Utilities';
const { ccclass, property } = _decorator;

export enum BallStatus {
    NONE = 0,
    DOWN,
    FLY
}

@ccclass('Ball')
export class Ball extends Component {
    @property({type: RealCurve, visible: true})
    curveScale: RealCurve = new RealCurve();

    @property(RigidBody2D)
    private rigidBall : RigidBody2D = null;

    private _touchStartPos : Vec2;
    private _touchEndPos : Vec2;

    private _destroyable: boolean ;
    private _threw : boolean ;
    private _passed: boolean ;

    protected onLoad(): void {
        this.node.on(Input.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.on(Input.EventType.TOUCH_CANCEL,this.onTouchCancel,this);
        this.node.getComponent(Collider2D).on(Contact2DType.END_CONTACT,this.onEndContact,this);
        this.node.getComponent(Collider2D).on(Contact2DType.BEGIN_CONTACT,this.onBeginContact,this);
    } 

    start(){
        this._threw = false;
        this._destroyable = false;
        this._passed = false;
    }

    private onEndContact(self: Collider2D, other: Collider2D,contact: IPhysics2DContact){
        if(other.tag === ENUM_COLLIDER_TAG.BASKET_TRIGGER){
            setTimeout(() => {
                GameManager.Instance.basketSpaceTrigger(true)
            }, 10);
        }
        else if(other.tag === ENUM_COLLIDER_TAG.GROUND_TRIGGER){
            setTimeout(() => {
                GameManager.Instance.groundSpaceTrigger(true)
            }, 10);
        }
    }

    private onBeginContact(self: Collider2D, other: Collider2D,contact: IPhysics2DContact){
        if(other.tag === ENUM_COLLIDER_TAG.GROUND){
            setTimeout(() => {
                this._destroyable = true;
            }, 500);
        }
        else if(other.tag === ENUM_COLLIDER_TAG.SCORE && !this._passed){
            this._passed = true;
            game.emit(ENUM_GAME_EVENT.UPDATE_SCORE);
        }

    }

    private onTouchStart(event: EventTouch){
        if(this._threw) return;
        this._touchStartPos = event.getLocation()
    }

    private onTouchCancel(event: EventTouch){
        if(this._threw) return;
        this._touchEndPos = event.getLocation();
        let direction = this._touchEndPos.subtract(this._touchStartPos);
        
        if(direction.length() > 50 && this._touchStartPos.y < this._touchEndPos.y){
            this._threw = true;
            let linearImpulse = direction.multiplyScalar(2000);
            let angularImpulse = (Math.random() < 0.5 ? 1 : -1)*1440;
            
            this.rigidBall.gravityScale = 11;
            this.rigidBall.applyForceToCenter(linearImpulse,true);
            this.rigidBall.applyAngularImpulse(angularImpulse,true);
            
            // tween(this.node)
            // .to(0.9,{scale: new Vec3(0.7,0.7)},{easing: k => this.curveScale.evaluate(k)})
            // .start();

            tween(this.node)
            .to(0.6,{scale: new Vec3(0.7,0.7)},{easing: "sineIn"})
            .start();
            
        }
    }

    public set destroyable(isDestroy: boolean){
        this._destroyable = isDestroy;
    }

    protected update(dt: number): void {
        if(this.node.getWorldPosition().y < -50) this._destroyable = true;
    }

    protected lateUpdate(dt: number): void {
        let upscaleGravity : number = 0.1
        if(this.rigidBall.linearVelocity.y < 0){
            upscaleGravity = 0.2
        }
        if(this._threw) this.rigidBall.gravityScale += upscaleGravity;
        if(this._destroyable){
            this.node.destroy();
        }
    }


    protected onDestroy(): void {
        this.node.off(Input.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.off(Input.EventType.TOUCH_CANCEL,this.onTouchCancel,this);
        this.node.getComponent(Collider2D).off(Contact2DType.END_CONTACT,this.onEndContact,this);
        this.node.getComponent(Collider2D).off(Contact2DType.BEGIN_CONTACT,this.onBeginContact,this);
        game.emit(ENUM_GAME_EVENT.SPAWN_NEW_BALL);
    }

}


