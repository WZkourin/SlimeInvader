

export default class EffectExplosion 
{
    constructor(context, x, y) 
    {
        this.context = context;

        this.x = x;
        this.y = y;

        //アニメーション速度関係
        this.animationDuration = 0.0;
        this.animationInterval = 0.01;
        this.isAnimate = false; //コマを映したかのフラグ
        this.isDead = false;
        this.animationRow = 0;
        this.animationCol = 0;

        //画像関係
        this.image = context.assets.get("explosion");
        this.spriteCutSizeX = 71; //切り抜き時のスプライトサイズ
        this.spriteCutSizeY = 100; //切り抜き時のスプライトサイズ
        this.spriteSizeX = this.spriteCutSizeX; //実際のスプライトサイズ
        this.spriteSizeY = this.spriteCutSizeY; //実際のスプライトサイズ

    }

    draw(ctx)
    {
        //画像の端
        const spriteRight = this.x + this.spriteCutSizeX / 2;
        const spriteLeft = this.x - this.spriteCutSizeX / 2;
        const spriteDown = this.y + this.spriteCutSizeY / 2;
        const spriteUp = this.y - this.spriteCutSizeY / 2;

        //切り抜きコマの指定用パラメータ
        const spriteRowMax = 3;
        const spriteColMax = 6;

        const deltaTime = this.context.time.delta;

        if (this.image)
        {
            //クールタイムを越したら次のコマへ
            if (this.animationDuration >= this.animationInterval) 
            { 
                this.animationDuration = 0.0;
                this.isAnimate = false; 

                //コマを進める(列)
                this.animationCol++;

                //コマが元画像の右端まで行ったら行を一つ下にする
                if (this.animationCol >= spriteColMax) 
                {
                    //最後のコマまで行ったら終了
                    if (this.animationRow >= spriteRowMax) 
                    { 
                        this.isDead = true; 
                        return;
                    }

                    this.animationRow++;
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
                this.animationCol * this.spriteCutSizeX, this.animationRow * this.spriteCutSizeY, this.spriteCutSizeX, this.spriteCutSizeY,
                spriteLeft, spriteUp, this.spriteSizeX, this.spriteSizeY);

            //コマを映したのでフラグを立てる
            this.isAnimate = true;
        }
    }
}
