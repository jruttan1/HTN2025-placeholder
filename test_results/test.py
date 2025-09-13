import cohere, yaml, json
from collections import defaultdict
import math

co = cohere.ClientV2("AL4ANky2zDeuC29JhuMCrgfdxj175R1nBA9MzqEK")

guidelines = """
Carrier appetite:
- Commercial Property
- TIV > $10M
- Loss ratio < 0.7
- Construction: Fire Resistive or Non-Combustible preferred
- Built after 1950
- States: CA or TX prioritized
"""

# ---------------------------
# Step 1: Load data
# ---------------------------
with open("test_results/test_data.json", "r") as f:
    data = json.load(f)

policies = data["output"][0]["data"]

# ---------------------------
# Step 2: Prepare YAML docs
# ---------------------------
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

# ---------------------------
# Step 3: Cohere rerank (policy-level)
# ---------------------------
results = co.rerank(
    model="rerank-v3.5",
    query=guidelines,
    documents=yaml_docs,
    top_n=len(yaml_docs)
)

for r in results.results:
    policies[r.index]["cohere_relevance"] = r.relevance_score

ranked_policies = sorted(policies, key=lambda x: x["cohere_relevance"], reverse=True)

# ---------------------------
# Risk Score Calculation
# ---------------------------
def calculate_risk_score(policy):
    premium = policy.get("total_premium", 0) or 1
    loss_value = policy.get("loss_value", 0) or 0
    tiv = policy.get("tiv", 0) or 0
    year = policy.get("oldest_building", 2025) or 2025
    construction = (policy.get("construction_type") or "").lower()
    state = policy.get("primary_risk_state", "")
    winnability = policy.get("winnability", 0.5) or 0.5

    premium = float(policy.get("total_premium", 0) or 0)
    loss_value = float(policy.get("loss_value", 0) or 0)

    # Loss ratio normalization
    loss_ratio = loss_value / premium if premium > 0 else 1
    loss_ratio_norm = min(1, loss_ratio / 0.7)
    loss_component = 1 - loss_ratio_norm

    # TIV normalization (log scale up to 50M)
    tiv_norm = min(1, math.log(max(tiv, 1)) / math.log(50_000_000))

    # Construction score
    if "fire resistive" in construction or "non-combustible" in construction:
        construction_score = 1
    elif "masonry" in construction or "mixed" in construction:
        construction_score = 0.5
    elif construction:
        construction_score = 0.2
    else:
        construction_score = 0.3  # unknown

    # Age score
    age_score = max(0, 1 - (2025 - int(year)) / 100)

    # State score
    if state in ["CA", "TX"]:
        state_score = 1
    else:
        state_score = 0.5

    # Winnability (normalize if percentage)
    if isinstance(winnability, (int, float)):
        if winnability > 1:
            winnability = min(1, winnability / 100)
    else:
        winnability = 0.5

    # Weighted risk score
    risk_score = (
        0.35 * loss_component +
        0.25 * tiv_norm +
        0.15 * construction_score +
        0.10 * age_score +
        0.10 * state_score +
        0.05 * winnability
    )

    return round(risk_score * 100, 2)  # scale to 0–100


# ---------------------------
# Step 4: Generate justification points + references
# ---------------------------
for p in ranked_policies:
    # Justifications
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

Return a JSON object with key "points" containing an array of short bullet points explaining alignment with guidelines.
"""
    resp = co.chat(
        model="command-r-plus",
        messages=[
            {"role": "system", "content": "You are an underwriting assistant."},
            {"role": "user", "content": explanation_prompt}
        ],
        temperature=0.2
    )
    txt = resp.message.content[0].text.strip()
    try:
        jus = json.loads(txt)
    except:
        jus = {"points": [txt]}
    p["justification_points"] = jus["points"]

    # References
    reference_prompt = f"""
You are an underwriting assistant.
Given the following guidelines and policy details, generate 2-3 short reference-style objects
to support underwriting trust. Each object must have:
- "point": short explanation
- "link": a plausible reference URL (industry report, gov site, or insurance article)

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

Return a JSON object with key "references" containing an array of objects with keys "point" and "link".
"""
    resp_refs = co.chat(
        model="command-r-plus",
        messages=[
            {"role": "system", "content": "You provide concise external-style references with links to support underwriting judgment."},
            {"role": "user", "content": reference_prompt}
        ],
        temperature=0.2
    )
    txt_refs = resp_refs.message.content[0].text.strip()
    try:
        refs = json.loads(txt_refs)
    except:
        refs = {"references": [{"point": txt_refs, "link": "https://example.com"}]}
    p["references"] = refs["references"]

# ---------------------------
# Step 5: Aggregate by account
# ---------------------------
accounts = defaultdict(list)
for p in ranked_policies:
    accounts[p["account_name"]].append(p)

account_data = {}
for acc, plist in accounts.items():
    scores = [p["cohere_relevance"] for p in plist]
    premiums = [p.get("total_premium", 1) for p in plist]
    avg = sum(scores) / len(scores)
    mx = max(scores)
    wavg = sum(s * pr for s, pr in zip(scores, premiums)) / sum(premiums)

    # Compute policy-level scores + risk scores
    policies_obj = {}
    policy_risk_scores = []
    weighted_risk_sum = 0
    total_premium = sum(premiums)

    for p in plist:
        indiv_score = (p["cohere_relevance"] + wavg) / 2
        risk_score = calculate_risk_score(p)
        policy_risk_scores.append(risk_score)
        weighted_risk_sum += risk_score * (p.get("total_premium", 1) or 1)

        policies_obj[p["id"]] = {
            **p,
            "cohere_relevance": p["cohere_relevance"],
            "score": round(indiv_score, 3),
            "risk_score": risk_score,
            "justification_points": p.get("justification_points", []),
            "references": p.get("references", [])
        }

    # Account-level aggregated risk scores
    avg_risk_score = sum(policy_risk_scores) / len(policy_risk_scores)
    weighted_risk_score = weighted_risk_sum / total_premium if total_premium > 0 else avg_risk_score

    account_data[acc] = {
        "avg_score": round(avg, 3),
        "max_score": round(mx, 3),
        "weighted_score": round(wavg, 3),
        "avg_risk_score": round(avg_risk_score, 2),
        "weighted_risk_score": round(weighted_risk_score, 2),
        "policies": policies_obj
    }

# ---------------------------
# Step 6: Save to enhanced JSON
# ---------------------------
output = {
    "accounts": account_data
}

with open("test_results/enhanced_data.json", "w") as f:
    json.dump(output, f, indent=4)

print("Saved enhanced_data.json successfully with account + policy structure and risk scores.")
