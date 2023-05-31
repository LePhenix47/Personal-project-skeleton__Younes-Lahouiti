/**
 * Utility class that sets and clears intervals
 */
export class IntervalService {
  private static id: number;
  private static arrayOfIds: number[] = [];

  /**
   * Method that creates an interval
   *
   * @param milliseconds Duration of the timer in milliseconds before executing the callback function
   * @param {(...args: any) => any | void} callback Callback function that will be called after the timer runs out
   * @param {...functionArguments} functionArguments Arguments for the callback function
   *
   * @returns A number as an ID for the interval
   *
   * @example
   * let fct = (text) => {
   *   console.log(text);
   * };
   *
   * let intervalTrigger = Interval.set(2_500, fct, "Hello world!");
   *
   */
  static set(
    milliseconds: number,
    callback: (...functionArguments: any) => any,
    ...functionArguments: any[]
  ): number {
    this.id = setInterval(() => {
      callback(...functionArguments);
    }, milliseconds);

    this.arrayOfIds.push(this.id);

    return this.id;
  }

  /**
   * Method that clears an interval
   *
   * @param {number} id ID of the interval to clear (stored inside the trigger of the interval)
   *
   * @example
   *
   * let fct = (text) => {
   *   console.log(text);
   * };
   *
   * let intervalTrigger = Interval.set(2_500, fct, "Hello world!");
   *
   * // ...
   *
   * Interval.clear(intervalTrigger);
   *
   */
  static clear(id: number): void {
    const actualId: number = this.arrayOfIds.find((idNumber: number) => {
      return idNumber === id;
    });

    clearInterval(actualId);

    this.arrayOfIds = this.arrayOfIds.filter((idNumber: number) => {
      return idNumber !== actualId;
    });
  }
}
