import PlayerBullet from "./playerBullet.js";
import EffectExplosion from "../gui/effectExplosion.js";

export default class Player 
{
    constructor(context, x, y) 
    {
        this.context = context;

        //座標関係
        this.x = x;
        this.y = y;
        this.speed = 150;

        //死亡フラグ
        this.isDead = false;

        //弾の保持関係
        this.isShot = false;
        this.shotLimit = 1;
        this.shotDuration = 0.0;
        this.shotInterval = 0.15;

        //画像関係
        this.image = context.assets.get("reito");
        const imageSize = 60;
        this.imageWidth = imageSize;
        this.imageHeight = imageSize;
        this.isImageRight = false;

        //タグ
        this.tag = "player";

    }

    //当たり判定のゲッター
    get hitBox()
    {
        const imageLeft = this.x - this.imageWidth / 2;
        const imageUp = this.y - this.imageHeight / 2;

        //当たり判定を優しくする
        const hitBoxOffset = 16; //右にずらす分
        const hitBoxOffsizeRatio = 2; //当たり判定を半分にする

        return {x: imageLeft + hitBoxOffset, y: imageUp + hitBoxOffset, 
            w: this.imageWidth / hitBoxOffsizeRatio, h: this.imageHeight / hitBoxOffsizeRatio};
    }

    //リセット用の処理関数
    resetStatus(x, y)
    {
        this.x = x;
        this.y = y;

        this.isImageRight = false;
        this.isDead = false;
    }

    //移動処理
    move()
    {
        const canvas = this.context.screen.canvas;
        const pointer = this.context.input.pointer;
        const deltaTime = this.context.time.delta;


        //自機画像の端
        const imageRight = this.x + this.imageWidth / 2;
        const imageLeft = this.x - this.imageWidth / 2;
        const imageDown = this.y + this.imageHeight / 2;
        const imageUp = this.y - this.imageHeight / 2;


        //クリック判定
        const isMovePointRight = pointer.x > imageRight;
        const isMovePointLeft = pointer.x < imageLeft;
        const isMovePointDown = pointer.y > imageDown;
        const isMovePointUp = pointer.y < imageUp;
        const isImagePoint = (isMovePointLeft === false) && (isMovePointRight === false) && 
        (isMovePointDown === false) && (isMovePointUp === false); //自機画像クリック判定


        //画面端判定
        const isOverScreenRight = imageRight > canvas.width;
        const isOverScreenLeft = imageLeft < canvas.width - canvas.width;

        // タッチ/クリック
        if (pointer.down) 
        {
            //自機画像でない場所をクリックでその方向に移動
            if (isMovePointRight) 
            { 
                this.isImageRight = true;
                this.x += this.speed * deltaTime; 
            }
            if (isMovePointLeft) 
            { 
                this.isImageRight = false;
                this.x -= this.speed * deltaTime; 
            }

            //自機画像をクリックで弾発射
            if (isImagePoint) { this.shot(); }

        }

        //画面外に行こうとしていたらその分押し戻す
        if (isOverScreenRight) { this.x -= imageRight - canvas.width; }
        if (isOverScreenLeft) { this.x -= imageLeft; }

    }

    //弾をとばす処理
    shot()
    {
        //発射制限数以上は撃てない
        if (this.context.playerBullets.length >= this.shotLimit) { return; }

        //クールタイム中は撃てない
        if (this.isShot) { return; }

        this.context.playerBullets.push(new PlayerBullet(this.context, this.x, this.y));
        this.context.audios.play("shot", 0.5);

        //クールタイム用フラグを立てる
        this.isShot = true;
    }

    //弾を撃てる間隔の管理
    advanceShotTimer()
    {
        const deltaTime = this.context.time.delta;

        //クールタイムのタイマー処理
        if (this.isShot)
        {
            this.shotDuration += 1.0 * deltaTime;
        }

        //クールタイムを越したら再び撃てるように
        if (this.shotDuration >= this.shotInterval) 
        { 
            this.shotDuration = 0.0;
            this.isShot = false; 
        }
    }

    update() 
    {
        //死亡時には何もできなくする
        if (this.isDead) 
        {
            //ゲームオーバー状態にする(1回だけ呼ぶ)
            if (this.context.sceneCurrent === this.context.scenes.GameMain) 
            {
                this.context.canClick = false; //ゲームオーバー画面表示に余韻を持たせる
                this.context.sceneCurrent = this.context.scenes.Gameover;
            }
            return; 
        }

        this.move();

        this.advanceShotTimer();

    }

    onCollision(other)
    {
        //死亡時に触れても何も起こらない
        if (this.isDead) { return; }

        //ダメージオブジェクトに触れたら死ぬ
        const damageObjects = (other.tag === "enemy") || (other.tag === "enemyBullet");
        if (damageObjects)
        {
            this.context.effects.push(new EffectExplosion(this.context, this.x, this.y));
            this.isDead = true;
            this.context.audios.play("playerDead", 0.5);
        }

    }

    draw(ctx) 
    {
        //自機画像の端
        const imageRight = this.x + this.imageWidth / 2;
        const imageLeft = this.x - this.imageWidth / 2;
        const imageDown = this.y + this.imageHeight / 2;
        const imageUp = this.y - this.imageHeight / 2;

        //メインゲーム中以外は描画しない
        if (this.context.sceneCurrent !== this.context.scenes.GameMain) { return; }

        //死亡時には描画しない
        if (this.isDead) { return; }

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
                ctx.strokeStyle = "yellow";
                ctx.strokeRect(this.hitBox.x, this.hitBox.y, this.hitBox.w, this.hitBox.h);
            }

        }

    }
}
