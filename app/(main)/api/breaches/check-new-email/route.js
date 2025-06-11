import axios from 'axios';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), {
      status: 400,
    });
  }

  try {
    const apiResponse = await axios.get(
      `https://api.xposedornot.com/v1/breach-analytics?email=${encodeURIComponent(email)}`
    );

    return new Response(JSON.stringify(apiResponse.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    const errorMessage = err.response?.data?.Error || err.message || "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}
