// ============================
// Enemy クラス
// ============================

import EnemyBullet from "./enemyBullet.js";
import EffectExplosion from "../gui/effectExplosion.js";

export default class Enemy 
{
    constructor(context, x, y, score, stage) 
    {
        this.context = context;
        this.score = score;
        this.stage = stage;

        //座標関係
        this.x = x;
        this.y = y;
        this.speed = 20; 
        this.speedInit = this.speed; //初期数値保存用

        //縦移動タイミングの時間設定
        this.verticalDuration = 0.0;
        this.verticalInterval = 5.0; 
        this.verticalIntervalInit = this.verticalInterval; //初期数値保存用
        //49 = 1.85

        //自身の削除フラグ
        this.isDead = false;

        //弾関係パラメータ群
        this.bulletIdRand = 0;
        if (this.stage.stage < 20) { this.bulletIdRandMax = 1; }
        else if (this.stage.stage < 30) { this.bulletIdRandMax = 2; }
        else if (this.stage.stage < 40) { this.bulletIdRandMax = 3; }
        else { this.bulletIdRandMax = 4; }

        this.isShot = false;
        this.isBaby = true;
        this.fireRand = 0;
        this.fireZone = 102 - this.stage.stage;
        // this.fireZone = 1; //確認用
        this.shotBeforeInterval = 0.0;

        //画像関係
        this.image = context.assets.get("slalin");
        const imageSize = 35;
        const imageSizeMargin = 10; //自然に見えるように少し横長にする
        this.imageWidth = imageSize + imageSizeMargin;
        this.imageHeight = imageSize;
        this.isImageRight = false;

        //タグ
        this.tag = "enemy";

    }

    //当たり判定のゲッター
    get hitBox()
    {
        const imageLeft = this.x - this.imageWidth / 2;
        const imageUp = this.y - this.imageHeight / 2;

        return {x: imageLeft, y: imageUp, w: this.imageWidth, h: this.imageHeight};
    }

    //球を撃つ処理
    shot()
    {
        //1ステージ目は撃たない
        if (this.stage.stage === 1) { return; }

        //生まれたては撃たない
        if (this.isBaby) { return; }

        //確率で外れたら撃たない(例：(rand < 90)であれば 10 / 100 がfalseとなり当選となる)
        if (this.fireRand < this.fireZone) { return; }

        //弾は連続で1回まで(連射防止)
        if (this.isShot === false)
        {
            this.context.enemyBullets.push(new EnemyBullet(this.context, this.x, this.y, this.bulletIdRand));
            this.isShot = true;
            this.context.audios.play("fire", 0.5);
        }
    }

    //球を撃つ確率処理
    calcRands()
    {
        //弾の種類を決める
        this.bulletIdRand = Math.floor(Math.random() * ((this.bulletIdRandMax + 1) - 1) + 1);

        //撃つかどうか
        this.fireRand = Math.floor(Math.random() * (101 - 1) + 1);

        //撃つまでの時間
        this.shotBeforeInterval = Math.random() * ((this.verticalInterval + 1.0) - 0.0) + 0.0;
    }

    move()
    {
        const canvas = this.context.screen.canvas;
        const deltaTime = this.context.time.delta;

        //自機画像の端
        const imageRight = this.x + this.imageWidth / 2;
        const imageLeft = this.x - this.imageWidth / 2;
        const imageDown = this.y + this.imageHeight / 2;
        const imageUp = this.y - this.imageHeight / 2;

        //画面端判定
        const isOverScreenRight = imageRight > canvas.width;
        const isOverScreenLeft = imageLeft < canvas.width - canvas.width;

        //移動処理
        if (this.isImageRight)
        {
            this.x += this.speed * deltaTime;
        }
        else
        {
            this.x -= this.speed * deltaTime;
        }
    }

    //縦移動タイミングの処理
    moveVertical()
    {
        const canvas = this.context.screen.canvas;
        const deltaTime = this.context.time.delta;

        const verticalLoopLine = canvas.height;
        const verticalResetPoint = -5;

        this.verticalDuration += 1.0 * deltaTime;

        //一定時間になったら下に少し移動
        if (this.verticalDuration >= this.verticalInterval)
        {
            //下画面に行ったらループ
            if (this.y >= verticalLoopLine)
            {
                this.y = verticalResetPoint;
            }

            //下に降りる
            this.y += 50;

            //折り返した時に撃てる条件が立つ
            this.isShot = false;
            this.calcRands(); //発射確率計算

            //一回下ったら生まれたて卒業
            if (this.isBaby) { this.isBaby = false; }

            if (this.isImageRight)
            {
                this.isImageRight = false;
            }
            else
            {
                this.isImageRight = true;
            }
            
            this.verticalDuration = 0.0;
        }

    }

    //速度を上げる
    addSpeed()
    {
        //補完用最大(最低)値
        const speedMax = 49;
        const verticalIntervalMin = 1.85; 

        const inclination = (verticalIntervalMin - this.verticalIntervalInit) / (speedMax - this.speedInit); //補完計算用の傾き
        const section = this.verticalIntervalInit - inclination * this.speedInit; //補完計算用の切片

        // console.log(inclination);
        // console.log(section);

        this.speed++; //スピードを増やす
        this.verticalInterval = inclination * this.speed + section; //それに合わせて縦移動のタイミング時間を補完
    }

    update() 
    {
        this.move();
        this.moveVertical();

        //時が来たら撃つ   
        if (this.verticalDuration >= this.shotBeforeInterval)
        {
            this.shot();
        }

    }

    onCollision(other)
    {

        if (other.tag === "playerBullet")
        {
            this.context.effects.push(new EffectExplosion(this.context, this.x, this.y));
            this.isDead = true;
            this.context.audios.play("enemyDead", 0.5);

            //基礎得点＋コンボ分のスコアを加点する
            this.score.addScore(1 + this.context.combo);

            const comboLimit = 99; //コンボ上限は99
            if (this.context.combo < comboLimit)
            {
                this.context.combo++; //スコア加算後にコンボを増やす
            }
        }

    }

    draw(ctx) 
    {
        //自機画像の端
        const imageRight = this.x + this.imageWidth / 2;
        const imageLeft = this.x - this.imageWidth / 2;
        const imageDown = this.y + this.imageHeight / 2;
        const imageUp = this.y - this.imageHeight / 2;

        if (this.image)
        {
            ctx.save();

            //自機画像の向きの描画
            if (this.isImageRight)
            {
                ctx.translate(imageRight, imageUp);
                ctx.scale(-1, 1);
                ctx.drawImage(this.image, 0, 0, this.imageWidth, this.imageHeight);
            }
            else
            {
                ctx.drawImage(this.image, imageLeft, imageUp, this.imageWidth, this.imageHeight);
            }

            ctx.restore();
            
            if (this.context.isDebug)
            {
                ctx.strokeStyle = "red";
                ctx.strokeRect(this.hitBox.x, this.hitBox.y, this.hitBox.w, this.hitBox.h);
            }

        }

    }
}
