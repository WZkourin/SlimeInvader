// core/Game.js
import GameContext from "./gameContext.js";
import Player from "../objects/player.js";
import Enemy from "../objects/enemy.js";
import GuiScore from "../gui/guiScore.js";
import GuiStage from "../gui/guiStage.js";
import GuiStart from "../gui/guiStart.js";
import GuiGameover from "../gui/guiGameover.js";
import BackgroundFlash from "../gui/backgroundFlash.js";

export default class GameEngine 
{
    constructor(canvasId) 
    {
        this.context = new GameContext();

        //canvas初期化
        const canvas = document.getElementById(canvasId);
        this.context.screen.init(canvas);
        this.context.input.init(canvas, this.context.screen);

        //オブジェクト初期化
        this.player  = null;
        this.playerInitPosX = this.context.screen.baseWidth / 2;
        this.playerInitPosY = 800;

        this.enemies = [];
        this.guiStart = null;
        this.guiGameover = null;
        this.guiScore = null;
        this.guiStage = null;
        this.backgroundFlash = null;

        //敵スポーンフラグ
        this.isSpawnedEnemies = false;

        //フレーム前後での敵総数比較用パラメータ
        this.enemyPopulationPrev = 0;

        //deltaTime計算用パラメータ
        this.lastTime = 0;

        //ワンクリックで複数回反応しないようにするためのクールダウンパラメータ
        this.clickCooldownDuration = 0.0;
        this.clickCooldownInterval = 1.5;

        //readyタイムパラメータ
        this.readyTimeDuration = 0.0;
        this.readyTimeInterval = 3.0;

        //クリア時のタイムパラメータ
        this.clearedTimeDuration = 0.0;
        this.clearedTimeInterval = 3.0;

    }

    isHit(a, b)
    {
        //getterと同じ「.引数名」でないと上手く動かない
        const toucheRight = a.x < b.x + b.w;
        const toucheLeft = a.x + a.w > b.x;
        const toucheUp = a.y < b.y + b.h;
        const toucheDown = a.y + a.h > b.y;

        return(toucheRight && toucheLeft && toucheUp && toucheDown);
    }

    //配列オブジェクトに正規化する処理
    toArray(object)
    {
        //三項演算子の偽の時の記法が分からない・・・(JS勉強部分)
        return Array.isArray(object) ? object : [object];
    }

    //当たり判定の計算処理
    calcCollisions(objectA, objectB)
    {
        const listA = this.toArray(objectA);
        const listB = this.toArray(objectB);

        for (const a of listA) 
        {
            for (const b of listB) 
            {
                if (!a.hitBox || !b.hitBox) { continue; }

                if (this.isHit(a.hitBox, b.hitBox)) 
                {
                    a.onCollision(b); 
                    b.onCollision(a);
                }
            }
        }

    }

    //敵の配置処理
    spawnEnemies()
    {
        //スポーン処理は一度に一回(連続で繰り返さない)
        if (this.isSpawnedEnemies) { return; }

        //敵の配置数
        const enemiesRow = 3; //行
        const enemiesCol = 10; //列

        //敵の配置間の間隔
        const enemiesMarginHorizon = 120;
        const enemiesMarginVertical = 50;

        //敵の配置開始場所
        const enemySpawnStartHorizon = 130;
        const enemySpawnStartVertical = 45;

        //敵の配置
        for (let indexCol = 0; indexCol < enemiesCol; indexCol++) 
        {
            for (let indexRow = 0; indexRow < enemiesRow; indexRow++) 
            {
                this.enemies.push(new Enemy(this.context, 
                    (enemiesMarginHorizon * indexRow) + enemySpawnStartHorizon, 
                    (enemiesMarginVertical * indexCol) + enemySpawnStartVertical,
                    this.guiScore, this.guiStage));

            }
            
        }

        //一回やったらフラグを立てて連続スポーンを防止
        this.isSpawnedEnemies = true;
    }

    //ゲームオーバー後のゲームリセット処理
    resetGame()
    {
        //配列の中身を全て空にする
        this.enemies.length = 0;
        //弾も
        this.context.playerBullets.length = 0; 
        this.context.enemyBullets.length = 0; 
        //コンボも
        this.context.combo = 0;

        //スポーンフラグを元に戻して再プレイの時に湧かせられるようにする
        this.isSpawnedEnemies = false;

        //プレイヤーを初期状態に戻す
        this.player.resetStatus(this.playerInitPosX, this.playerInitPosY);

        //ワンクリックによる連続反応防止
        this.context.canClick = false;
    }

    //クリッククールダウンのタイマーを進める
    advanceClickCooldownTimer()
    {
        //クリック許可済みならば処理しない
        if (this.context.canClick) { return; }

        //タイマーを進める
        const deltaTime = this.context.time.delta;
        this.clickCooldownDuration += 1.0 * deltaTime;

        //クールタイムをクリック許可
        if (this.clickCooldownDuration >= this.clickCooldownInterval) 
        { 
            this.clickCooldownDuration = 0.0;
            this.context.canClick = true; 
        }
    }

    //readyタイマーを進める
    advanceReadyTimer()
    {
        if (this.context.isReady === false) { return; }

        //タイマーを進める
        const deltaTime = this.context.time.delta;
        this.readyTimeDuration += 1.0 * deltaTime;

        //クールタイムが終わったらゲーム開始
        if (this.readyTimeDuration >= this.readyTimeInterval) 
        { 
            this.readyTimeDuration = 0.0;
            this.context.isReady = false; 
        }

    }

    //クリア時の余韻のタイマーを進める
    advanceInClearedTimer()
    {
        if (this.context.isClear === false) { return; }

        //タイマーを進める
        const deltaTime = this.context.time.delta;
        this.clearedTimeDuration += 1.0 * deltaTime;

        //クールタイムが終わったら次のステージに進む処理をする
        if (this.clearedTimeDuration >= this.clearedTimeInterval) 
        { 
            this.clearedTimeDuration = 0.0;

            //次のステージに進めてreadyフラグを立てる
            this.guiStage.advanceStage();
            this.context.isReady = true;

            //プレイヤーを初期位置に戻す
            this.player.resetStatus(this.playerInitPosX, this.playerInitPosY);

            //敵をもう一度湧かせる
            this.isSpawnedEnemies = false;
            this.context.enemyBullets.length = 0; //弾は決しておく

            //フラッシュ用画像が残っていたら退ける
            this.backgroundFlash.removeFlash();

            //準備できたらクリアフラグを折る
            this.context.isClear = false; 
        }

    }

    async start() 
    {
        await this.context.assets.loadAll();
        await this.context.audios.loadAll();

        //スマホで効果音を鳴らすための設定(Iphoneでは何故か鳴らなかった)
        const unlockAudio = () => {
            const ctx = this.context.sound.ctx;

            if (ctx.state === "suspended") 
            {
                ctx.resume();
            }

            console.log("Audio state:", ctx.state);
        };
        this.context.screen.canvas.addEventListener("touchstart", unlockAudio, { passive: true });

        this.player = new Player(this.context, this.playerInitPosX, this.playerInitPosY);
        this.guiStart = new GuiStart(this.context);
        this.guiGameover = new GuiGameover(this.context);
        this.guiScore = new GuiScore(this.context);
        this.guiStage = new GuiStage(this.context);
        this.backgroundFlash = new BackgroundFlash(this.context);

        requestAnimationFrame(t => this.loop(t));
    }

    loop(timestamp) 
    {
        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.context.time.delta = deltaTime;

        this.update();
        this.draw();

        requestAnimationFrame(t => this.loop(t));
    }

    update() 
    {
        console.log(this.context.audios.ctx.state);
        //シーンによって処理を変える
        switch (this.context.sceneCurrent) 
        {
            case this.context.scenes.title:
                
                //クリッククールダウンのタイマーを進める
                this.advanceClickCooldownTimer();

                this.guiStart.update();

                //ゲームオーバーからワンクリックで連続反応しないようにするためのストッパー
                if (this.context.canClick === false) { return; }

                //クリックでゲームスタート
                if (this.context.input.pointer.down)
                {
                    //スコアリセット
                    this.guiScore.resetScore();
                    //ステージリセット
                    this.guiStage.resetStage();

                    //readyフラグを立ててゲーム開始時に余韻を持たせる
                    this.context.isReady = true;
                    this.context.sceneCurrent = this.context.scenes.GameMain;

                    //効果音を鳴らす
                    this.context.audios.play("start", 0.5);
                }

                break;

            case this.context.scenes.GameMain:
                
                //最初に敵を湧かせる
                this.spawnEnemies();

                //ゲーム開始時に余韻を持たせる
                if (this.context.isReady)
                {
                    this.guiStage.update();

                    this.advanceReadyTimer();
                    return;
                }

                //クリア時に演出させて余韻を持たせる
                if (this.context.isClear)
                {
                    //フラッシュ演出
                    this.backgroundFlash.update();

                    this.advanceInClearedTimer();
                    return;
                }

                //前フレームを保存
                const framePrev = this.enemyPopulationPrev;

                this.player.update();
                this.context.playerBullets.forEach(e => e.update());
                this.enemies.forEach(e => e.update());
                this.context.enemyBullets.forEach(e => e.update());

                //エフェクト管理
                this.context.effects = this.context.effects.filter(e => e.isDead === false);
                //弾管理
                this.context.playerBullets = this.context.playerBullets.filter(e => e.isDead === false);
                this.context.enemyBullets = this.context.enemyBullets.filter(e => e.isDead === false);

                //スコア管理
                this.guiScore.update();

                //ステージ管理
                this.guiStage.update();

                this.calcCollisions(this.player, this.enemies);
                this.calcCollisions(this.context.playerBullets, this.enemies);
                this.calcCollisions(this.context.enemyBullets, this.player);

                //敵を全滅すればクリア
                if (this.enemies.length <= 0) { this.context.isClear = true; }

                //死亡フラグが立っていたらその配列は空にして処理落ち回避
                this.enemies = this.enemies.filter(e => e.isDead === false);

                //現在の敵数を保存
                const enemyPopulationCurrent = this.enemies.length;

                //1体減ったらスピードが上がる
                if (enemyPopulationCurrent === framePrev - 1)
                {
                    for (let index = 0; index < this.enemies.length; index++) 
                    {
                        this.enemies[index].addSpeed();
                    }
                }

                //次フレーム用に保存
                this.enemyPopulationPrev = enemyPopulationCurrent;

                break;
        
            case this.context.scenes.Gameover:

                this.guiGameover.update();

                //クリッククールダウンのタイマーを進める
                this.advanceClickCooldownTimer();

                //少し余韻を持たせる
                if (this.context.canClick === false) { return; }

                //クリックでタイトルに戻る
                if (this.context.input.pointer.down)
                {
                    this.resetGame(); //ゲームリセットで元に戻す
                    this.context.sceneCurrent = this.context.scenes.title;
                }

                break;

        }
    }

    draw() 
    {
        const ctx = this.context.screen.ctx;
        const canvas = this.context.screen.canvas;

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //下に行くほど上に重なって描画される
        this.player.draw(ctx);
        this.context.playerBullets.forEach(e => e.draw(ctx));
        this.enemies.forEach(e => e.draw(ctx));
        this.context.enemyBullets.forEach(e => e.draw(ctx));
        this.guiStart.draw(ctx);
        this.guiGameover.draw(ctx);
        this.guiScore.draw(ctx);
        this.guiStage.draw(ctx);
        this.backgroundFlash.draw(ctx);
        this.context.effects.forEach(e => e.draw(ctx));

    }
}
