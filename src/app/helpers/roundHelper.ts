export class RoundHelper {
  static twoDecimals(num: number) {
    return Math.round((num + Number.EPSILON) * 100) / 100
  }
}