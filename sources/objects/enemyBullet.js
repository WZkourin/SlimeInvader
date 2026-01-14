export default class PlayerBullet 
{
    constructor(context, x, y, id) 
    {
        this.context = context;

        //座標関係
        this.x = x;
        this.y = y;
        this.speed = 250;
        this.accelerationMagnification = 0.0;

        //cos波用パラメータ
        this.offset = x; //基準位置
        this.waveHeight = 30.0; //振幅
        this.frequency = 1.0; //周波数
        this.omega = 2.0 * Math.PI * this.frequency; //角周波数
        this.waveDuration = 0.0; //経過時間
        this.wavePeriod = 1.0 / this.frequency; //1周期

        //弾の種類を決めるパラメータ
        this.bulletId = id;

        //アニメーション速度関係
        this.animationDuration = 0.0;
        this.animationInterval = 0.01;
        this.isAnimate = false; //コマを映したかのフラグ
        this.isDead = false; //弾の削除フラグ
        this.animationRow = 0;
        this.animationCol = 0;

        //画像関係
        this.image = context.assets.get("fire");
        this.spriteCutSizeX = 8; //切り抜き時のスプライトサイズ
        this.spriteCutSizeY = 16; //切り抜き時のスプライトサイズ
        this.spriteSizeX = this.spriteCutSizeX * 2; //実際のスプライトサイズ
        this.spriteSizeY = this.spriteCutSizeY * 2; //実際のスプライトサイズ

        //タグ
        this.tag = "enemyBullet";

    }

    //当たり判定のゲッター
    get hitBox()
    {
        //画像の端
        const spriteLeft = this.x - this.spriteCutSizeX / 2;
        const spriteUp = this.y - this.spriteCutSizeY / 2;

        //当たり判定を優しくする
        const hitBoxHeightOffset = this.spriteCutSizeY; //下にずらす分
        const hitBoxHeightOffsizeRatio = 2; //当たり判定を半分にする

        return {x: spriteLeft, y: spriteUp + hitBoxHeightOffset,
             w: this.spriteSizeX, h: this.spriteSizeY / hitBoxHeightOffsizeRatio};
    }

    //下に進むだけ
    moveNormal()
    {
        const deltaTime = this.context.time.delta;
        this.y += this.speed * deltaTime;
    }

    //2倍の速度で進む
    moveFast()
    {
        const deltaTime = this.context.time.delta;
        this.y += (this.speed * 2) * deltaTime;
    }

    //加速的に進む
    moveAcceleration()
    {
        const deltaTime = this.context.time.delta;
        this.accelerationMagnification += 3.0 * deltaTime; //倍速的に加速倍率を増やしていく

        this.y += (this.speed * this.accelerationMagnification) * deltaTime;
    }

    //cos波を計算
    moveWave()
    {
        const deltaTime = this.context.time.delta;
        this.waveDuration += 1.0 * deltaTime;

        //数学の公式表示そのままでは動かないので注意
        this.x = this.waveHeight * Math.cos(this.omega * this.waveDuration) + this.offset;
        this.y += this.speed * deltaTime;

        //数値が大きくなりすぎないよう、1周期したら引いてリセット
        if (this.waveDuration >= this.wavePeriod)
        {
            this.waveDuration -= this.wavePeriod;
        }
    }

    update() 
    {
        const canvas = this.context.screen.canvas;

        //自機画像の端
        const spriteDown = this.y + this.spriteCutSizeY / 2;
        const spriteUp = this.y - this.spriteCutSizeY / 2;

        //最初に渡されたIDによって弾の種類(軌道)を変える
        switch (this.bulletId) 
        {
            case 1:
                
                this.moveNormal();

                break;

            case 2:
                
                this.moveFast();

                break;

            case 3:
                
                this.moveAcceleration();

                break;

            case 4:
                
                this.moveWave();

                break;
        
            default:

                //エラー表示
                console.log(this.bulletId);

                break;
        }

        //画面上下端判定
        const isScreenVerticalOut = (spriteUp > canvas.height) || (spriteUp < canvas.height - canvas.height);

        //画面上下外に行ったら削除フラグを立てる
        if (isScreenVerticalOut) { this.isDead = true; }

    }

    onCollision(other)
    {
        //現時点では何もないがこの関数が無いと判定時に参照できなくなる
    }

    draw(ctx) 
    {
        //画像の端
        const spriteRight = this.x + this.spriteCutSizeX / 2;
        const spriteLeft = this.x - this.spriteCutSizeX / 2;
        const spriteDown = this.y + this.spriteCutSizeY / 2;
        const spriteUp = this.y - this.spriteCutSizeY / 2;

        //切り抜きコマの指定用パラメータ
        const spriteColMax = 3;

        const deltaTime = this.context.time.delta;

        if (this.image)
        {
            //クールタイムを越したら次のコマへ
            if (this.animationDuration >= this.animationInterval) 
            { 
                this.animationDuration = 0.0;
                this.isAnimate = false; 

                //コマを進める(列)
                if (this.animationCol < spriteColMax)
                {
                    //コマが最後でなければコマを進める
                    this.animationCol++;
                }
                else
                {
                    //最後のコマまで行ったら最初のコマにしてループさせる
                    this.animationCol -= spriteColMax;
                }
            }

            //クールタイムのタイマー処理
            if (this.isAnimate)
            {
                this.animationDuration += 1.0 * deltaTime;
            }

            // drawImage(
            // 画像,
            // 切り抜きX, 切り抜きY, 切り抜き幅, 切り抜き高さ,
            // 描画X, 描画Y, 描画幅, 描画高さ
            // )

            ctx.drawImage(this.image, 
                this.animationCol * this.spriteCutSizeX, 0, this.spriteCutSizeX, this.spriteCutSizeY,
                spriteLeft, spriteUp, this.spriteSizeX, this.spriteSizeY);

            //コマを映したのでフラグを立てる
            this.isAnimate = true;

            if (this.context.isDebug)
            {
                ctx.strokeStyle = "green";
                ctx.strokeRect(this.hitBox.x, this.hitBox.y, this.hitBox.w, this.hitBox.h);
            }

        }

    }




}