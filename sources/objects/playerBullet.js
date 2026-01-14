export default class PlayerBullet 
{
    constructor(context, x, y) 
    {
        this.context = context;

        //座標関係
        this.x = x;
        this.y = y;
        this.speed = 500;

        //弾の削除フラグ
        this.isDead = false;

        //画像関係
        this.image = context.assets.get("thunder");
        const imageSize = 20;
        const imageSizeMargin = 10; //自然に見えるように少し横長にする
        this.imageWidth = imageSize;
        this.imageHeight = imageSize + imageSizeMargin;

        //タグ
        this.tag = "playerBullet";

    }

    //当たり判定のゲッター
    get hitBox()
    {
        const imageLeft = this.x - this.imageWidth / 2;
        const imageUp = this.y - this.imageHeight / 2;

        return {x: imageLeft, y: imageUp, w: this.imageWidth, h: this.imageHeight};
    }

    update() 
    {
        const canvas = this.context.screen.canvas;
        const deltaTime = this.context.time.delta;

        //自機画像の端
        const imageDown = this.y + this.imageHeight / 2;

        //画面端判定(見えなくなってから判定する)
        const isScreenOut = imageDown < canvas.height - canvas.height;

        //上に進むだけ
        this.y -= this.speed * deltaTime;

        //画面外に行ったら削除フラグを立てる
        if (isScreenOut) 
        { 
            this.context.combo = 0; //外したらコンボは消滅
            this.isDead = true;
        }
    }

    onCollision(other)
    {
        if (other.tag === "enemy")
        {
            this.isDead = true;
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
            ctx.drawImage(this.image, imageLeft, imageUp, this.imageWidth, this.imageHeight);

            if (this.context.isDebug)
            {
                ctx.strokeStyle = "orange";
                ctx.strokeRect(this.hitBox.x, this.hitBox.y, this.hitBox.w, this.hitBox.h);
            }

        }

    }
}
