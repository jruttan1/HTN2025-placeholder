import cohere, yaml, json

co = cohere.ClientV2("AL4ANky2zDeuC29JhuMCrgfdxj175R1nBA9MzqEK")

# Appetite guidelines = query
guidelines = """
Carrier appetite:
- Commercial Property
- TIV > $10M
- Loss ratio < 0.7
- Construction: Fire Resistive or Non-Combustible preferred
- Built after 1950
- States: CA or TX prioritized
"""

# Load data
with open("results/data.json", "r") as f:
    data = json.load(f)

# Get policies
policies = data["output"][0]["data"]

# Convert policies into YAML
yaml_docs = []
for p in policies:
    doc = {
        "PolicyID": p["id"],
        "LineOfBusiness": p.get("line_of_business"),
        "State": p.get("primary_risk_state"),
        "TIV": p.get("tiv"),
        "Premium": p.get("total_premium"),
        "LossValue": p.get("loss_value"),
        "Construction": p.get("construction_type"),
        "BuildingYear": p.get("oldest_building"),
        "Winnability": p.get("winnability"),
    }
    yaml_docs.append(yaml.dump(doc, sort_keys=False))

# Step 1: Rank with Cohere
results = co.rerank(
    model="rerank-v3.5",
    query=guidelines,
    documents=yaml_docs,
    top_n=10
)

# Attach scores back
for r in results.results:
    idx = r.index
    policies[idx]["cohere_relevance"] = r.relevance_score

ranked = sorted(policies, key=lambda x: x.get("cohere_relevance", 0), reverse=True)

# Step 2: Get justification points with Cohere Chat
for p in ranked[:5]:
    explanation_prompt = f"""
    Guidelines:
    {guidelines}

    Policy:
    {yaml.dump({
        "PolicyID": p["id"],
        "LineOfBusiness": p.get("line_of_business"),
        "State": p.get("primary_risk_state"),
        "TIV": p.get("tiv"),
        "Premium": p.get("total_premium"),
        "LossValue": p.get("loss_value"),
        "Construction": p.get("construction_type"),
        "BuildingYear": p.get("oldest_building"),
        "Winnability": p.get("winnability"),
    }, sort_keys=False)}

    Return a JSON object with key "points" containing an array of short bullet points 
    explaining why this policy aligns or does not align with the guidelines.
    """

    resp = co.chat(
        model="command-r-plus",
        messages=[
            {"role": "system", "content": "You are an underwriting assistant."},
            {"role": "user", "content": explanation_prompt}
        ],
        temperature=0.2
    )
    print(f"Explanation response for Policy ID {p['id']}: {resp}")

    assistant_text = resp.message.content[0].text.strip()

    # Try to parse model output as JSON
    try:
        justifications = json.loads(assistant_text)
    except:
        justifications = {"points": [assistant_text]}

    p["justification_points"] = justifications["points"]

# Print top 5 with reasons
for p in ranked[:5]:
    print(f"\nID {p['id']} | Score {p['cohere_relevance']:.3f} | {p['account_name']}")
    for pt in p["justification_points"]:
        print(f"- {pt}")