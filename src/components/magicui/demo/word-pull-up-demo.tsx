import WordPullUp from "@/components/magicui/word-pull-up";

export function WordPullUpDemo({text}: {text?: string}) {
  return (
    <WordPullUp
    className="text-3xl md:text-5xl md:text-center font-medium"
      words={text || "Built from the ground up"}
    />
  );
}