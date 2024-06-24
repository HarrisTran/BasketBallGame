import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ItemRow')
export class ItemRow extends Component {
    @property(Sprite)
    private medalSprite: Sprite = null;

    @property(Label)
    private index : Label = null;

    @property(Label)
    private scoreLabel : Label = null;

    @property({ group: { name: "Medal Texture", id: "2" }, type: SpriteFrame })
	public goldMedal: SpriteFrame = null;

    @property({ group: { name: "Medal Texture", id: "2" }, type: SpriteFrame })
	public silverMedal: SpriteFrame = null;

    @property({ group: { name: "Medal Texture", id: "2" }, type: SpriteFrame })
	public bronzeMedal: SpriteFrame = null;

    @property({ group: { name: "Item Frame", id: "3" }, type: SpriteFrame })
    public yellowFrame: SpriteFrame = null;


    public createItemRow(rank: number, score: number, selfframe?: boolean){
        let spriteFrame : SpriteFrame = null;
        switch (rank) {
            case 1:
                spriteFrame = this.goldMedal;
                break;
            case 2:
                spriteFrame = this.silverMedal;
                break;
            case 3:
                spriteFrame = this.bronzeMedal;
                break;
            default:
                spriteFrame = null;
                break;
        }
        this.medalSprite.spriteFrame = spriteFrame;

        if(selfframe){
            this.node.getComponent(Sprite).spriteFrame = this.yellowFrame;
        }

        this.scoreLabel.string = score.toString();

        this.index.string = rank.toString();
    }
}


