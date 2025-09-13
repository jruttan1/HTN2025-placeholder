import json
from collections import defaultdict

# Load data
with open("test_results/test_data.json", "r") as f:
    data = json.load(f)

# Extract policies
policies = data["output"][0]["data"]

# Group by account_name
grouped = defaultdict(list)
for policy in policies:
    grouped[policy["account_name"]].append(policy)

# Convert back to JSON structure
grouped_data = {"grouped_accounts": []}
for account, records in grouped.items():
    grouped_data["grouped_accounts"].append({
        "account_name": account,
        "records": records
    })

# Save to file
with open("test_results/test_grouped_policies.json", "w") as f:
    json.dump(grouped_data, f, indent=4)

print("Grouped data saved to test_results/test_grouped_policies.json")
