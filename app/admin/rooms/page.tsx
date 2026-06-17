import req from "@/lib/req";

const RoomPage = async ({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const { data } = await req.get("/room");
  console.log("🚀 ~ RoomPage ~ data:", data);

  return <div>page</div>;
};

export default RoomPage;
