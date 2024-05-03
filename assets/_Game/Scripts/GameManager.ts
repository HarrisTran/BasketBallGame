import { _decorator, Animation, Component, Enum, EventTarget, Game, game, instantiate, math, Node, PhysicsSystem2D, randomRangeInt, Sprite, UI, UITransform, Vec2, Vec3 } from 'cc';
import { UiController } from './UiController';
import PoolManager from './PoolManager';
import ResourceManager from './ResourceManager';
import { ENUM_AUDIO_CLIP, ENUM_GAME_EVENT, GameState } from './Enum';
import { delay } from './Utilities';
import { IManager } from './IManager';
import BEConnector from './BEConnector';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;
window.addEventListener('message', (data) => {
    const { data: res } = data;
    const objectRes = JSON.parse(res);
    if (objectRes) {
        const { type, value } = objectRes;
        if (type === 'newTicket') {
            GameManager.Instance.APIManager.numberTicket += value;
            GameManager.Instance.ChangeState(GameState.Replay);
        }
    }
});
@ccclass('GameManager')
export class GameManager extends Component {
    private static _instance: GameManager = null;
    public static get Instance(): GameManager {
        return GameManager._instance;
    }

    @property({ type: Enum(GameState) , visible : false})
    public CurrentGameState: GameState = GameState.MainMenu;

    @property([Node]) public SpawnBallPositions: Node[] = [];
    @property(UiController) public UiController: UiController = null;
    @property(SoundManager) public audioManager: SoundManager = null;
    @property(Node) private ballContainer: Node = null;
    @property(Node) private basketSpace: Node = null;
    @property(Node) private groundSpace: Node = null;

    private _score: number = 0;
    public replayed: boolean = false;

    // all managers
    private _allManagers : IManager[] = [];
    public APIManager: BEConnector;
    public resouceManager : ResourceManager;

    ////////////////////////////////////////////

    protected onLoad(): void {
        GameManager._instance = this;
        this._initializeGameEvent();
        this.ChangeState(GameState.Loading)
    }


    private _initializeAllManagers(): void {
        this._allManagers = [];

        this.APIManager = new BEConnector();
        this.resouceManager = new ResourceManager();


        this._allManagers.push(this.APIManager);
        this._allManagers.push(this.resouceManager);
        this._allManagers.push(this.audioManager);

        this.APIManager.initialize();

        this.resouceManager.initialize();
        this.audioManager.initialize();
    }

    private _initializeGameEvent() {
        game.on(ENUM_GAME_EVENT.SPAWN_NEW_BALL, this.SpawnBall, this);
        game.on(ENUM_GAME_EVENT.START_GAME, this.StartGame, this);
        game.on(ENUM_GAME_EVENT.UPDATE_SCORE, this.updateScore, this);
    }
    
    public basketSpaceTrigger(isActive: boolean) {
        this.basketSpace.active = isActive;
    }

    public groundSpaceTrigger(isActive: boolean){
        this.groundSpace.active = isActive;
    }

    public get score(){
        return this._score;
    }
    
    public ChangeState(newState: GameState) {
        if (this.CurrentGameState == newState) return;

        this.CurrentGameState = newState;  
        switch (this.CurrentGameState) {
            case GameState.Loading:
                this._initializeAllManagers();
                break;
            case GameState.MainMenu:
                this.UiController.LoadingDone();
                break;
            case GameState.Playing:
                //this.APIManager.ticketMinus("auth");
                this.UiController.StartGame();
                break;
            case GameState.Replay:
                this.ballContainer.removeAllChildren();
                this.APIManager.ticketMinus("revive");
                this.UiController.StartGame();
                break;
            case GameState.EndGame:
                this.UiController.ShowEndGameUI();
                this.audioManager.playSfx(ENUM_AUDIO_CLIP.SFX_ENDGAME);
                break;
        }
    }

    public EndGame(): void {
        this.ChangeState(GameState.EndGame);
    }

    private StartGame(): void {
        this.ChangeState(GameState.Playing);
    }


    private SpawnBall(): void {
        
        this.basketSpaceTrigger(false);
        this.groundSpaceTrigger(false);

        let randomPositionIndex = math.randomRangeInt(0,this.SpawnBallPositions.length);
        let getRandomPosition = this.SpawnBallPositions[randomPositionIndex].getWorldPosition();

        PoolManager.instance.getNode("Ball",this.ballContainer,getRandomPosition.clone());
    }

    private updateScore() {
        this._score += 10;
        this.UiController.updateScore();
        this.APIManager.score = this._score;
        this.audioManager.playSfx(ENUM_AUDIO_CLIP.SFX_SCORE);
    }

    protected update(dt: number): void {
        if(this.CurrentGameState === GameState.Loading){
            let total = this._allManagers.reduce((acc, manager) =>{
                return acc + manager.progress();
            },0)
            this.UiController.loadingUI.setProgressBar(total/this._allManagers.length);
            if(this._allManagers.every(manager => manager.initializationCompleted()) && this.CurrentGameState === GameState.Loading){
                this.ChangeState(GameState.MainMenu);
            }
        }
    }
}