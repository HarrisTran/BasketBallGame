import { _decorator, Animation, Component, Enum, EventTarget, Game, game, instantiate, Node, randomRangeInt, Sprite, UI, Vec2, Vec3 } from 'cc';
import { UiController } from './UiController';
import PoolManager from './PoolManager';
import ResourceManager from './ResourceManager';
const { ccclass, property } = _decorator;

export enum GameState {
    MainMenu,
    Playing,
    EndGame
}
Enum(GameState);
@ccclass('GameManager')
export class GameManager extends Component {
    private static _instance: GameManager = null;
    public static get Instance(): GameManager {
        return GameManager._instance;
    }

    @property({ type: GameState })
    public CurrentGameState: GameState = GameState.MainMenu;

    @property([Node])
    public SpawnBallPositions: Node[] = [];
    
    @property(UiController)
    public UiController: UiController = null;

    @property(Node)
    public collisionSpace: Node = null;

    public Score: number = 0;

    public IsThrowable: boolean = false;

    public EventHit = new EventTarget();
    public EventScore = new EventTarget();
    public EventGameEnd = new EventTarget();

    ////////////////////////////////////////////

    protected onLoad(): void {
        GameManager._instance = this;
        this.initializeAllManagers();
        this.initializeGameEvent();
    }

    private initializeAllManagers() : void {
        ResourceManager.instance.loadResource();
    }

    private initializeGameEvent(){
        game.on("spawn-ball",this.SpawnBall,this);
    }

    protected start(): void {
        this.EventScore.on("Score", this.PlayScoreAnimation, this);
    }

    public async ChangeState(newState: GameState) {
        if (this.CurrentGameState == newState) return;

        this.CurrentGameState = newState;
        switch (this.CurrentGameState) {
            case GameState.MainMenu:
                break;
            case GameState.Playing:
                await GameManager.delay(1.5);
                this.SpawnBall();
                break;
            case GameState.EndGame:
                break;
        }
    }
    public EndGame(): void {
        this.ChangeState(GameState.EndGame);
    }

    private SpawnBall(): void {
        setTimeout(() => {
            this.collisionSpace.active = false;
        }, 100);
        PoolManager.instance.getNode("Ball",this.node.getChildByName("BallPool"),new Vec3(0,-1000));
    }

    private async PlayScoreAnimation(winRate: number) {
        // await GameManager.delay(0.25);
        // if (winRate == 100) {
        //     //this.animation?.play(this.animation.clips[0].name);
        //     this.Score++;
        // }
        // else if (winRate == 50) {
        //     //this.animation?.play(this.animation.clips[1].name);
        // }
        // else if (winRate == -50) {
        //     //this.animation?.play(this.animation.clips[2].name);
        // }

        // this.UiController.UpdateScore();
        // await GameManager.delay(this.Ball.MoveTime);
        // this.SpawnBall();

        // this.IsThrowable = true;
    }

    public static delay(time: number): Promise<any> {
        return new Promise((resolve) => setTimeout(resolve, time * 1000));
    }

}