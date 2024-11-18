import { getServerSession } from "next-auth";
import ExecuteQuery from "../../lib/pgDB";
import authOptions from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    // Get the session
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const userEmail = session.user.email;

    // Get page and limit parameters from the query string
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page")) || 1; // Default to page 1 if no page is specified
    const limit = parseInt(url.searchParams.get("limit")) || 12; // Default to 12 items per page if no limit is specified

    // Calculate the offset for the query
    const offset = (page - 1) * limit;

    // Query to fetch the work orders with pagination
    const dashQuery = `
      SELECT  
        WO."PROJECT",
        WO."WO_TYPE", 
        WO."WO_NUMBER", 
        WO."WO_STATUS",
        WO."CRE_BY",
        WO."CRE_DT",
        WO."WO_DUEDATE",
        WO."ASSIGNED_TO", 
        WO."WO_TITLE", 
        WO."WO_SPECIFICLOCATION", 
        WO."WO_ADDITIONAL_NOTE"
      FROM 
        "bb_wo" AS WO
      JOIN 
        "bb_user_projects" AS UP
        ON WO."PROJECT" = UP."PROJECT"
      WHERE 
        UP."USER_NAME" = $1
      ORDER BY 
        WO."WO_STATUS" DESC
      LIMIT $2 OFFSET $3`;

    const params = [userEmail, limit, offset];
    const dashRes = await ExecuteQuery(dashQuery, params);

    // Get the total number of work orders for pagination
    const countQuery = `
      SELECT COUNT(*) 
      FROM "bb_wo" AS WO
      JOIN "bb_user_projects" AS UP
      ON WO."PROJECT" = UP."PROJECT"
      WHERE 
        UP."USER_NAME" = $1`;

    const countRes = await ExecuteQuery(countQuery, [userEmail]);
    const totalWorkOrders = parseInt(countRes[0].count, 10);

    return new Response(
      JSON.stringify({
        wo: dashRes,
        totalWorkOrders, // Total number of work orders for pagination
        totalPages: Math.ceil(totalWorkOrders / limit), // Total pages based on limit
        currentPage: page, // Current page
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching work orders:", error);
    return new Response("Error fetching work orders", { status: 500 });
  }
}
