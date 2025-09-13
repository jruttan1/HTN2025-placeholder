import json

# -------------------
# Load data
# -------------------
with open("model/data.json", "r") as f:
    data = json.load(f)

# Get policies list
policies = data["output"][0]["data"]

# -------------------
# Basic Filter Function
# -------------------
def filter_in_appetite(policies):
    in_appetite = []
    out_appetite = []

    for p in policies:
        try:
            # Only Commercial Property is considered
            if p.get("line_of_business") != "COMMERCIAL PROPERTY":
                out_appetite.append(p)
                continue

            # Must have valid dates
            if not (p.get("effective_date") and p.get("expiration_date")):
                out_appetite.append(p)
                continue

            # TIV must be >= 10M
            if p.get("tiv", 0) < 10_000_000:
                out_appetite.append(p)
                continue

            # Exclude Frame construction (higher risk)
            if p.get("construction_type") == "Frame":
                out_appetite.append(p)
                continue

            # Building must be >= 1950
            if p.get("oldest_building", 2100) < 1950:
                out_appetite.append(p)
                continue

            # Loss ratio < 0.7
            try:
                loss_ratio = float(p.get("loss_value", 0)) / float(p.get("total_premium", 1))
            except Exception:
                loss_ratio = 1.0
            if loss_ratio >= 0.7:
                out_appetite.append(p)
                continue

            # If passed all checks → in appetite
            in_appetite.append(p)

        except Exception:
            out_appetite.append(p)

    return in_appetite, out_appetite

# -------------------
# Advanced Appetite Score
# -------------------
def appetite_score(policy):
    score = 0
    weights = {
        "line_of_business": 20,
        "tiv": 15,
        "construction_type": 15,
        "building_year": 10,
        "loss_ratio": 20,
        "winnability": 20,
    }

    # Line of business
    if policy.get("line_of_business") == "COMMERCIAL PROPERTY":
        score += weights["line_of_business"]

    # TIV scaling
    tiv = policy.get("tiv", 0)
    score += min(weights["tiv"], (tiv / 100_000_000) * weights["tiv"])

    # Construction type ranking
    ct = policy.get("construction_type", "").lower()
    if "fire resistive" in ct:
        score += weights["construction_type"]
    elif "non-combustible" in ct:
        score += weights["construction_type"] * 0.8
    elif "masonry" in ct:
        score += weights["construction_type"] * 0.6
    elif "frame" in ct:
        score += weights["construction_type"] * 0.3

    # Building age
    year = policy.get("oldest_building", 1900)
    if year >= 2000:
        score += weights["building_year"]
    elif year >= 1980:
        score += weights["building_year"] * 0.7
    elif year >= 1950:
        score += weights["building_year"] * 0.5

    # Loss ratio (lower is better)
    try:
        loss_ratio = float(policy.get("loss_value", 0)) / float(policy.get("total_premium", 1))
    except Exception:
        loss_ratio = 1.0
    if loss_ratio < 0.3:
        score += weights["loss_ratio"]
    elif loss_ratio < 0.5:
        score += weights["loss_ratio"] * 0.7
    elif loss_ratio < 0.7:
        score += weights["loss_ratio"] * 0.4

    # Winnability (already 0–1 range for most records)
    try:
        winnability = float(policy.get("winnability", 0))
        if winnability > 1:  # some records use 0–100 scale
            winnability /= 100
    except Exception:
        winnability = 0
    score += winnability * weights["winnability"]

    return round(score, 2)

# -------------------
# Apply Filters & Scoring
# -------------------
in_appetite, out_appetite = filter_in_appetite(policies)

# Add appetite scores to all policies
for p in policies:
    p["appetite_score"] = appetite_score(p)

# Sort in-appetite by score
in_appetite_sorted = sorted(in_appetite, key=lambda x: x["appetite_score"], reverse=True)

# -------------------
# Example Outputs
# -------------------
print("In-Appetite Policies (Top 5 by score):")
for p in in_appetite_sorted[:5]:
    print(f"- ID {p['id']} | Score {p['appetite_score']} | {p['account_name']}")

print("\nOut-of-Appetite Policies (sample):")
for p in out_appetite[:5]:
    print(f"- ID {p['id']} | {p['account_name']}")
