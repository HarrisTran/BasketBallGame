import { Prefab } from 'cc';
import PoolManager from './PoolManager';
import { resources } from 'cc';

export default class ResourceManager {

    private static _instance: any = null

    private static readonly FRAGMENT_PREFAB_PATH : string = "Prefab";

    static getInstance<T>(): T {
        if (this._instance === null) {
            this._instance = new this()
        }

        return this._instance
    }

    static get instance() {
        return this.getInstance<ResourceManager>()
    }


    public async loadResource(){
        //load prefab
        const loadPrefab = new Promise<void>((resolve,reject)=>{
            resources.loadDir(ResourceManager.FRAGMENT_PREFAB_PATH, Prefab, (err, assets)=>{
                if(err) reject && reject()
                let asset: any
                for (let i = 0; i < assets.length; i++) {
                    asset = assets[i];
                    PoolManager.instance.setPrefab(asset.data.name, asset)
                }
                resolve && resolve()
            })
        })
    }

}
