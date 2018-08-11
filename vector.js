class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(that) {
    return new Vector(this.x + that.x, this.y + that.y);
  }

  scalarMult(c) {
    return new Vector(c * this.x, c * this.y);
  }

  static fromPolar(r, phi) {
    const x = r * Math.cos(phi);
    const y = r * Math.sin(phi);
    return new Vector(x, y);
  }
}
