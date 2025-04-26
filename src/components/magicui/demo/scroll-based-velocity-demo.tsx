import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";

export function ScrollBasedVelocityDemo() {
  return (
    <VelocityScroll
     
        defaultVelocity={5}
        numRows={2}
      className="font-display text-center text-4xl font-bold tracking-[-0.02em] text-lochmara-500 drop-shadow-sm dark:text-white md:text-7xl md:leading-[5rem]"
    >
        Navix Growth Marketing Solutions
    </VelocityScroll>
  );
}