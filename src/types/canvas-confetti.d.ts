import "canvas-confetti";

declare module "canvas-confetti" {
  /** Runtime reset clears active confetti and does not return another function. */
  function reset(): void;
}
