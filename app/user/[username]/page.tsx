import { use } from "react";
import UserPortfolio from "@/components/UserPortfolio";

export default function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
    const { username } = use(params);

    return (
    <UserPortfolio username = {username} />
    );
}
