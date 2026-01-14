export default class Time 
{
    delta = 0;

    //デルタタイム計算用
    update(deltaTime) 
    {
        this.delta = deltaTime;
    }
}
