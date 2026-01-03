import Time from "./time.js";
import Input from "./input.js";
import Screen from "./screen.js";
import Assets from "./assets.js";
import Audios from "./audios.js";

export default class GameContext 
{
    constructor() 
    {
        this.time = new Time();
        this.input = new Input();
        this.screen = new Screen();
        this.assets = new Assets();
        this.audios = new Audios();

        //gameEngineも他クラスからもアクセスするためにここに追加
        this.effects = [];
        this.playerBullets = [];
        this.enemyBullets = [];

        //スコアコンボ
        this.combo = 0;

        //ゲームシーン管理(Object.freeze()→読み取り専用)
        this.scenes = Object.freeze({
            title: 1,
            GameMain: 2,
            Gameover: 3,
        });
        this.sceneCurrent = this.scenes.title;

        //ゲーム進行用フラグ群
        this.canClick = true; 
        this.isReady = false;
        this.isClear = false;

        //デバッグフラグ
        this.isDebug = false;
    }
}
