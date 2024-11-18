import ExecuteQuery from "../../lib/pgDB"; // Ensure path is correct

export async function GET(request) {
  try {
    // Extract the query parameter using URL API
    const url = new URL(request.url);
    const WO_NUMBER = url.searchParams.get("WO_NUMBER");

    if (!WO_NUMBER) {
      return new Response(JSON.stringify({ error: "WO_NUMBER is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Query the database using the provided WO_NUMBER
    const query = `
      SELECT * FROM "bb_wo_history"
      WHERE "WO_NUMBER" = $1
    `;
    const params = [WO_NUMBER];
    const result = await ExecuteQuery(query, params);

    console.log("What is the resuly of BB_WO_HISTORY?", result);

    // Return the query result
    return new Response(JSON.stringify({ wo: result }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET API:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch work order history" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
