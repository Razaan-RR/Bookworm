export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "userId is required" }), {
      status: 400,
    });
  }

  // Now safe to query
  const readBooks = await Shelf.find({ userId, shelf: "read" }).populate("bookId");
  // ...
}
