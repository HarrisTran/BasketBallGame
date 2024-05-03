import { _decorator, Animation, Component, game, Label, Node, Toggle } from 'cc';
import { GameManager } from '../GameManager';
import { ENUM_AUDIO_CLIP, ENUM_GAME_EVENT, GameState } from '../Enum';
import { delay, FormatTime } from '../Utilities';
const { ccclass, property } = _decorator;

@ccclass('GameplayPanel')
export class GameplayPanel extends Component {
    @property(Label)
    private timeTxt: Label = null;

    @property(Label)
    private scoreTxt: Label = null;

    @property(Node)
    private soundButton: Node = null;

    @property(Animation)
    private floatScoreAnimation: Animation = null;

    @property(Label)
    private countDownTimer: Label = null;

    private _currentTime: number;
    private _isReady: boolean;


    protected onLoad(): void {
        this.soundButton.on('click', this._onCheckAudio);
    }

    protected async onEnable() {
        this._currentTime = 60;
        this._isReady = false;
        this.countDownTimer.node.active = true;
        this.countDownTimer.string = '3'
        await delay(1);
        this.countDownTimer.string = '2'
        await delay(1);
        this.countDownTimer.string = '1'
        await delay(1);
        this._whenTimerCompleted();
    }

    private _whenTimerCompleted() {
        this._isReady = true;
        this.countDownTimer.node.active = false;
        game.emit(ENUM_GAME_EVENT.SPAWN_NEW_BALL);
        GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.SFX_START);
        this.scheduleOnce(() => {
            GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.SFX_TIMEUP);
        }, this._currentTime - 4)
    }

    private _onCheckAudio() {
        GameManager.Instance.audioManager.toggleMute();
    }

    public updateScore() {
        this.floatScoreAnimation.node.active = true;
        this.floatScoreAnimation.play();

        this.scoreTxt.string = GameManager.Instance.score.toString();
    }


    protected update(deltaTime: number) 
    {
        if ((GameManager.Instance.CurrentGameState === GameState.Playing || GameManager.Instance.CurrentGameState === GameState.Replay) && this._isReady) {
            this._currentTime -= deltaTime;
            this.timeTxt.string = FormatTime(this._currentTime);

            if (this._currentTime <= 0) {
                this.timeTxt.string = FormatTime(0);
                GameManager.Instance.ChangeState(GameState.EndGame);
            }
        }

    }
}


