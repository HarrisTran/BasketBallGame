import { _decorator, Component, Node } from 'cc';
import { GameManager } from '../GameManager';
const { ccclass, property } = _decorator;

@ccclass('MainMenuPanel')
export class MainMenuPanel extends Component {
    
    protected start(): void {
        GameManager.Instance.audioManager.playBGM();
    }

}


