import { _decorator, Component, instantiate, Label, Node, Prefab, ScrollView } from 'cc';
import BEConnector, { ParticipantInfo } from '../BEConnector';
import { GameManager } from '../GameManager';
import { ItemRow } from '../ItemRow';
import { ENUM_AUDIO_CLIP, GameState } from '../Enum';
import { delay } from '../Utilities';
const { ccclass, property } = _decorator;

@ccclass('GameOverPanel')
export class GameOverPanel extends Component {
    @property(Node)
    private overlay : Node = null;

    @property(Label)
    private ticketMinus : Label = null;

    @property(ScrollView)
    private leaderBoardView : ScrollView = null;

    @property(Node)
    private continueButton : Node = null;

    @property(ItemRow)
    private mainItemRow: ItemRow = null;

    @property(Prefab)
    private itemRowPrefab : Prefab = null;

    private _clickedContinueButton : boolean = false;

    protected onLoad(): void {
        this.overlay.on('click',this.exitGame);
    }

    private exitGame(){
        //GameManager.Instance.APIManager.postScoreWebEvent();
        GameManager.Instance.APIManager.postScoreToServer();
    }

    protected onEnable(): void {
        const numTicket = GameManager.Instance.APIManager.getTicketCanBeMinus();
        this.ticketMinus.string = '-' + numTicket.toString();
        
        this.scheduleOnce(this.exitGame,60);
        this._updateLeaderBoard();
        
    }

    private _updateLeaderBoard(){
        let index : number = 1;
        this.leaderBoardView.content.removeAllChildren();
        for(let info of GameManager.Instance.APIManager.allScoreInfo.slice(0,5)){
            let row = instantiate(this.itemRowPrefab);
            row.setParent(this.leaderBoardView.content);
            row.getComponent(ItemRow).createItemRow(index,info.totalScore);
            row.active = true;
            index++;
        }
        let test : ParticipantInfo = {id: "Khoa", totalScore: GameManager.Instance.score} ;
        this.mainItemRow.createItemRow(1,test.totalScore);
    }

    private onClickContinue(){
        if(this._clickedContinueButton) return;
        this._clickedContinueButton = true;
        if(GameManager.Instance.APIManager.canRelive()){
            GameManager.Instance.APIManager
                .checkGameScoreTicket()
                .then(() => {
                    this._clickedContinueButton = false;
                    GameManager.Instance.ChangeState(GameState.Replay);
                    this.continueButton.active = false;
                }) 
                .catch(()=>{
                    this._clickedContinueButton = false;
                    GameManager.Instance.ChangeState(GameState.EndGame);
                })
        }else{
            this._clickedContinueButton = false;
            GameManager.Instance.APIManager.postMessage();
        }

    }

    protected onDisable(): void {
        this.unschedule(this.exitGame);
    }


}


