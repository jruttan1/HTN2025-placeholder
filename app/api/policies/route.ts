import data from "../../../results/enhanced_data.json"

export async function GET() {
  return Response.json(data)
}
