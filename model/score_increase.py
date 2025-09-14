import json

# Load JSON file
with open("results/cleaned_data.json", "r") as f:
    data = json.load(f)

# Iterate through accounts and policies
for account in data.get("accounts", {}).values():
    for policy in account.get("policies", {}).values():
        if "cohere_relevance" in policy and isinstance(policy["cohere_relevance"], (int, float)):
            # Increase by 20%
            policy["cohere_relevance"] += 0.2

# Save updated JSON
with open("results/cleaned_data.json", "w") as f:
    json.dump(data, f, indent=2)
