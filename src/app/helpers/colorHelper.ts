export function interpolate(start: number, end: number, steps: number, count: number) {
    let s = start,
        e = end,
        final = s + (((e - s) / steps) * count);
    return Math.floor(final);
  }

export class Color {
    r: number = 0;
    g: number = 0;
    b: number = 0;
    constructor(_r: any, _g: any, _b: any) {
      this.setColors(_r, _g, _b);
    }

    setColors(_r: any, _g: any, _b: any) {
      this.r = _r;
      this.g = _g;
      this.b = _b;
    }
    
    getColors() {
        var colors = {
            r: this.r,
            g: this.g,
            b: this.b
        };
        return colors;
    };
}