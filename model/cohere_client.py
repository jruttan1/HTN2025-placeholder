import cohere, yaml

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

import json

with open("model/data.json", "r") as f:
    data = json.load(f)


# Get policies
policies = data["output"][0]["data"]

# Convert policies into YAML for better structured matching
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

# Call Cohere rerank
results = co.rerank(
    model="rerank-v3.5",   # multilingual, best accuracy
    query=guidelines,
    documents=yaml_docs,
    top_n=10
)

# Attach scores back to policies
for r in results.results:
    idx = r.index
    policies[idx]["cohere_relevance"] = r.relevance_score

# Sort policies by Cohere relevance
ranked = sorted(policies, key=lambda x: x.get("cohere_relevance", 0), reverse=True)

print("Top 5 Policies (by Cohere Rerank):")
for p in ranked[:5]:
    print(f"ID {p['id']} | Score {p['cohere_relevance']:.3f} | {p['account_name']}")
