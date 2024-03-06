import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  return json({ userId: params.userId });
}
export default function Page() {
  const { userId } = useLoaderData<typeof loader>();
  return (
    <div>
      <Link to={".."}>Back</Link>
      <p>user id: {userId}</p>
    </div>
  );
}
