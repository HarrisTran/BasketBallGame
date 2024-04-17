import { _decorator, CCFloat, Node, Component, Label } from 'cc';
import { GameManager, GameState } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('UiController')
export class UiController extends Component {
   
    @property({ group: { name: 'Labels', displayOrder: 1 }, type: Label, visible: true })
    private _timeTxt: Label = null;
    @property({ group: { name: 'Labels', displayOrder: 1 }, type: Label, visible: true })
    private _scoreTxt: Label = null;
    @property({ group: { name: 'Labels', displayOrder: 1 }, type: Label, visible: true })
    private _endGameScoreTxt: Label = null;
   
    
    @property(Node)
    private _startGameUI: Node = null;
    @property(Node)
    private _gameplayUI: Node = null;
    @property(Node)
    private _endGameUI: Node = null;

    private _currentTime: number = 0;

    protected start(): void {
        this._currentTime = 60;
        // GameManager.Instance.EventScore.on("Score", this.UpdateScore, this);
    }
    protected update(dt: number): void {
        if (GameManager.Instance.CurrentGameState != GameState.Playing) return;

        this._currentTime -= dt;
        this._timeTxt.string = this.FormatTime(this._currentTime);

        if (this._currentTime <= 0) {
            this._timeTxt.string = "00:00";
            GameManager.Instance.EndGame();
            this.ShowEndGameUI();
        }
    }

    public StartGame(): void {
        this._startGameUI.active = false;
        this._gameplayUI.active = true;
        GameManager.Instance.ChangeState(GameState.Playing);
    }
    

    public UpdateScore(): void {
        this._scoreTxt.string = GameManager.Instance.Score.toString();
    }

    private FormatTime(time: number): string {
        var minute = 0;
        var second = 0;
        var minuteString = "";
        var secondString = "";

        minute = time / 60;
        second = time % 60;

        if (minute < 10)
            minuteString = "0" + Math.floor(minute).toFixed();
        else minuteString = Math.floor(minute).toFixed();

        if (second < 10)
            secondString = "0" + Math.floor(second).toFixed();
        else secondString = Math.floor(second).toFixed();

        return minuteString + ":" + secondString;
    }
    private ShowEndGameUI(): void {
        this._gameplayUI.active = false;
        this._endGameUI.active = true;
        this._endGameScoreTxt.string = "Your score: " + GameManager.Instance.Score.toString();
    }
}