import { client } from "@/app/sanity/lib/client";

// function to generate unique username
export async function generateUniqueUsername(fullName: string): Promise<string> {
  const names = fullName.trim().toLowerCase().split(" ");
  const firstName = names[0];
  const lastInitial = names[1]?.slice(0,2) ?? "";

  // Try up to 10 random variations
  for (let i = 0; i < 10; i++) {
    const randomDigits = Math.floor(100 + Math.random() * 900);
    const username = `${firstName}${lastInitial}${randomDigits}`;

    const isTaken = await isUsernameTaken(username);
    if (!isTaken) return username;
  }

  throw new Error("Could not generate unique username");
}

async function isUsernameTaken(username: string): Promise<boolean> {
  const result = await client.fetch(
    `count(*[_type == "user" && username == $username]) > 0`,
    { username }
  );
  return result;
}