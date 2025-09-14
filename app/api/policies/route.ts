import data from "../../../results/cleaned_data.json"

export async function GET() {
  return Response.json(data)
}
