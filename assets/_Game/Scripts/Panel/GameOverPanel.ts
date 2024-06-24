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

    private _numberItemRowCanShow: number = 6;

    protected onLoad(): void {
        this.overlay.on('click',this.exitGame);
    }

    private exitGame(){
        //GameManager.Instance.APIManager.postScoreWebEvent();
        GameManager.Instance.APIManager.postScoreWebEvent();
    }

    protected onEnable(): void {
        const numTicket = GameManager.Instance.APIManager.getTicketCanBeMinus();
        this.ticketMinus.string = '-' + numTicket.toString();
        
        this.scheduleOnce(this.exitGame,60);
        this._updateLeaderBoard();
        
    }

    private async _updateLeaderBoard(){
        let index : number = 1;
        this.leaderBoardView.content.removeAllChildren();

        let participants = await GameManager.Instance.APIManager.postScoreToServer()

        
        let listTop = participants.slice(0,this._numberItemRowCanShow+1);
        let currentScore = GameManager.Instance.APIManager.getStagingScore();
        
        for(let info of listTop){
            console.log(info);
            
            let row = instantiate(this.itemRowPrefab);
            row.setParent(this.leaderBoardView.content);
            row.getComponent(ItemRow).createItemRow(index,info.sum);
            if(info.sum == currentScore){
                row.getComponent(ItemRow).createItemRow(index,info.sum,true);
            }
            row.active = true;
            index++;
        }

        let ranking = listTop.findIndex(i=>i.sum == currentScore) + 1;
        if(ranking <= 0) return;

        if(ranking > this._numberItemRowCanShow){
            this.mainItemRow.node.active = true;
            this.mainItemRow.createItemRow(ranking,currentScore);
        }
        else{
            this.mainItemRow.node.active = false;
        }
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


