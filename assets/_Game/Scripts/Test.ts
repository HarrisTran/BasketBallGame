import { _decorator, CCFloat, Component, Enum, EventKeyboard, Input, input, KeyCode, Node, tween, TweenEasing } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {

    @property({ type: CCFloat, visible: true })
    private _moveTime: number = 0;
    @property({ type: Node, visible: true })
    private _targetPosition: Node = null;
    @property({ type: Enum, visible: true })
    private _easingType: TweenEasing = null;

    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.OnKeyDown, this);
    }
    private OnKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.SPACE:
                this.Play();
                break;
        }
    }
    Play() {
        let position = this._targetPosition.worldPosition;

        tween(this.node)
            .to(this._moveTime, { position }, {
                easing: 'elasticOut'
            }).start();
    }
}

