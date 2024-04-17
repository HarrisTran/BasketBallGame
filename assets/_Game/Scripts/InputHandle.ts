
import { _decorator, CCFloat, Component, ERaycast2DType, EventMouse, EventTouch, Input, input, log, misc, Node, PhysicsSystem2D, Vec2, Vec3 } from 'cc';
import { GameManager, GameState } from './GameManager';
const { radiansToDegrees, degreesToRadians } = misc;
const { ccclass, property } = _decorator;
export enum ForceType {
    Low,
    Normal,
    High
}
@ccclass('InputHandle')
export class InputHandle extends Component {
    /// If game is in throwing state, and throwable => then throw
    // @property({ type: CCFloat, visible: true })
    // private _hightForce: number = 72;
    // @property({ type: CCFloat, visible: true })
    // private _lowForce: number = 36;

    // private _touchStartPos: Vec2 = new Vec2();
    // private _touchEndPos: Vec2 = new Vec2();

    // protected start(): void {
    //     input.on(Input.EventType.TOUCH_START, this.OnTouchStart, this);
    //     input.on(Input.EventType.TOUCH_END, this.OnTouchEnd, this);
    // }

    // private OnTouchStart(e: EventTouch): void {
    //     if (GameManager.Instance.CurrentGameState != GameState.Playing) return;
    //     if (!GameManager.Instance.IsThrowable) return;
    //     this._touchStartPos = e.getLocation();
    //     GameManager.Instance.IsThrowable = false;
    // }
    
    // private OnTouchEnd(e: EventTouch): void {
    //     if (GameManager.Instance.CurrentGameState != GameState.Playing) return;
    //     this._touchEndPos = e.getLocation();

    //     let force = Vec2.distance(this._touchStartPos, this._touchEndPos);

    //     this.CalculateThrow(this.Vec3ToVec2(GameManager.Instance.BallNode.worldPosition), force);
    // }

    // private CalculateThrow(throwPosition: Vec2, throwForce: number): Node {
    //     if (throwForce >= this._hightForce)
    //         GameManager.Instance.Ball.CurrentForce = ForceType.High;
    //     else if (throwForce <= this._lowForce)
    //         GameManager.Instance.Ball.CurrentForce = ForceType.Low;
    //     else GameManager.Instance.Ball.CurrentForce = ForceType.Normal;

    //     let throwVec = this._touchEndPos.subtract(this._touchStartPos);

    //     let angle = radiansToDegrees(Math.atan2(throwVec.y, throwVec.x));
    //     let newPos = this.CreatePointOnLineFromPointWithAngle(throwPosition, angle, 1560);

    //     const results = PhysicsSystem2D.instance.raycast(throwPosition, newPos);

    //     if (results.length <= 0) {
    //         GameManager.Instance.EventHit.emit("Hit", null);
    //         GameManager.Instance.Ball.ThrowBallTween(newPos);
    //         console.log("New pos: " + newPos);
    //         return null;
    //     }
    //     else {
    //         GameManager.Instance.EventHit.emit("Hit", results[0].collider.node);
    //         GameManager.Instance.Ball.ThrowBallTween(new Vec2(results[0].collider.node.worldPosition.x, results[0].collider.node.worldPosition.y));
    //         console.log("Hit pos: " + results[0].collider.node.worldPosition);

    //         return results[0].collider.node;
    //     }
    // }
    // private CreatePointOnLineFromPointWithAngle(startPoint: Vec2, angle: number, distance: number): Vec2 {
    //     // Chuyển đổi góc từ độ sang radian
    //     let angleInRadians = degreesToRadians(angle);

    //     // Tính toán tọa độ của điểm mới
    //     let newX = startPoint.x + distance * Math.cos(angleInRadians);
    //     let newY = startPoint.y + distance * Math.sin(angleInRadians);

    //     let returnValue = new Vec2(newX, newY);

    //     return returnValue;
    // }
    // private Vec3ToVec2(converter: Vec3): Vec2 {
    //     return new Vec2(converter.x, converter.y);
    // }
}

