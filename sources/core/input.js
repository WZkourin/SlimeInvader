// core/Input.js
export default class Input {
    pointer = { x: 0, y: 0, down: false };

    init(canvas, screen) {
        const getPos = e => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = screen.canvas.width  / rect.width;
            const scaleY = screen.canvas.height / rect.height;

            const p = e.touches ? e.touches[0] : e;
            return {
                x: (p.clientX - rect.left) * scaleX,
                y: (p.clientY - rect.top) * scaleY
            };
        };

        canvas.addEventListener("mousedown", e => {
            this.pointer.down = true;
            Object.assign(this.pointer, getPos(e));
        });

        canvas.addEventListener("mousemove", e => {
            Object.assign(this.pointer, getPos(e));
        });

        canvas.addEventListener("mouseup", () => {
            this.pointer.down = false;
        });

        canvas.addEventListener("touchstart", e => {
            this.pointer.down = true;
            Object.assign(this.pointer, getPos(e));
        });

        canvas.addEventListener("touchmove", e => {
            Object.assign(this.pointer, getPos(e));
            e.preventDefault();
        });

        canvas.addEventListener("touchend", () => {
            this.pointer.down = false;
        });
    }
}
