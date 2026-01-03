export default class Audios 
{
    constructor() 
    {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.buffers = {};
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
    }

    async loadSound(name, src) 
    {
        const res = await fetch(src);
        const arrayBuffer = await res.arrayBuffer();
        this.buffers[name] = await this.ctx.decodeAudioData(arrayBuffer);
    }

    async loadAll() 
    {
        await this.loadSound("shot", "assets/audios/shot.mp3");
        await this.loadSound("fire", "assets/audios/fire.mp3");
        await this.loadSound("flash", "assets/audios/flash.mp3");
        await this.loadSound("playerDead", "assets/audios/playerDead.mp3");
        await this.loadSound("enemyDead", "assets/audios/enemyDead.mp3");
        await this.loadSound("start", "assets/audios/start.mp3");
    }

    play(name, volume = 1.0) 
    {
        const source = this.ctx.createBufferSource();
        source.buffer = this.buffers[name];

        const gain = this.ctx.createGain();
        gain.gain.value = volume;

        source.connect(gain);
        gain.connect(this.masterGain);

        source.start();
    }

    resume() 
    {
        if (this.ctx.state === "suspended") 
        {
            this.ctx.resume();
        }
    }


}


