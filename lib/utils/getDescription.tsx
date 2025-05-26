// function to get 17 word description from body of the blog
export function getDescription(text: string): string {
  const words = text.trim().split(/\s+/);
  const sliced = words.slice(0, 17).join(" ");
  return words.length > 15 ? sliced + "..." : sliced;
}