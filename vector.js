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

  toPolar() {
    return { r: Math.hypot(this.x, this.y), phi: Math.atan2(this.y, this.x) };
  }

  unit() {
    const phi = this.toPolar().phi;
    return Vector.fromPolar(1, phi);
  }
}
