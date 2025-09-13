def is_in_appetite(policy):
    """
    Check if a single policy record is In-Appetite or Out-of-Appetite
    based on underwriting guidelines.
    """
    # --- Critical rules ---
    if policy.get("renewal_or_new_business") != "NEW_BUSINESS":
        return False  # Renewal = Out-of-Appetite

    # Assuming all data is Commercial Property; if field exists, check it
    if policy.get("line_of_business") and policy["line_of_business"] != "COMMERCIAL PROPERTY":
        return False  # Non-property line = Out-of-Appetite

    # --- Primary Risk State ---
    acceptable_states = {"OH", "PA", "MD", "CO", "CA", "FL", "NC", "SC", "GA", "VA", "UT"}
    if policy.get("primary_risk_state") not in acceptable_states:
        return False

    # --- TIV (Total Insured Value) ---
    tiv = policy.get("tiv", 0)
    if tiv > 150_000_000:
        return False

    # --- Premium ---
    premium = policy.get("total_premium", 0)
    if premium < 50_000 or premium > 175_000:
        return False

    # --- Building Age ---
    building_year = policy.get("oldest_building", 0)
    if building_year < 1990:
        return False

    # --- Loss Value ---
    try:
        loss_value = float(policy.get("loss_value", "0"))
    except ValueError:
        loss_value = 0.0
    if loss_value > 100_000:
        return False

    # --- Construction Type ---
    # Not in schema → optional; assume acceptable for now
    # Add logic if field exists in your dataset

    return True  # Passed all rules


def filter_policies(policies):
    """
    Split policies into In-Appetite and Out-of-Appetite lists.
    """
    in_appetite = []
    out_appetite = []

    for policy in policies:
        if is_in_appetite(policy):
            in_appetite.append(policy)
        else:
            out_appetite.append(policy)

    return in_appetite, out_appetite



def appetite_score(policy):
    """
    Compute an Appetite Score (0–100) for a policy record
    based on underwriting guidelines.
    Higher = closer to target appetite.
    Score of 0 means Out-of-Appetite.
    """

    score = 0

    # --- Submission Type ---
    if policy.get("renewal_or_new_business") != "NEW_BUSINESS":
        return 0  # Renewal = Out-of-Appetite
    score += 10


    # --- Line of Business ---
    if policy.get("line_of_business") != "COMMERCIAL PROPERTY":
        return 0  # Only property acceptable
    score += 10


    # --- Primary Risk State ---
    acceptable_states = {"OH", "PA", "MD", "CO", "CA", "FL", "NC", "SC", "GA", "VA", "UT"}
    target_states = {"OH", "PA", "MD", "CO", "CA", "FL"}
    state = policy.get("primary_risk_state")
    if state not in acceptable_states:
        return 0
    score += 10
    if state in target_states:
        score += 5  # target bonus


    # --- TIV (Total Insured Value) ---
    tiv = policy.get("tiv", 0)
    if tiv > 150_000_000:
        return 0
    elif 50_000_000 <= tiv <= 100_000_000:
        score += 15  # target
    else:
        score += 10  # acceptable

    # --- Premium ---
    premium = policy.get("total_premium", 0)
    # premium with commas as in 1,000,000
    print(f"Premium: {premium:,}")
    if premium < 50_000 or premium > 1_705_000:
        return 0
    elif 75_000 <= premium <= 1_000_000:
        score += 15  # target
    else:
        score += 10  # acceptable

    # --- Building Age ---
    building_year = policy.get("oldest_building", 0)
    if building_year < 1990:
        return 0
    elif building_year >= 2010:
        score += 15  # target
    else:
        score += 10  # acceptable

    # --- Loss Value ---
    try:
        loss_value = float(policy.get("loss_value", "0"))
    except ValueError:
        loss_value = 0.0
    if loss_value > 100_000:
        return 0
    score += 10

    # --- Construction Type ---
    ct = policy.get("construction_type", "").upper()
    preferred_types = {"JM", "Joisted Masonry", "Non-Combustible", "Masonry Non-Combustible"}
    if any(t in ct for t in preferred_types):
        score += 10
    else:
        return 0

    # Cap score at 100
    return min(score, 100)


def is_in_appetite(policy):
    """Boolean helper using appetite_score"""
    return appetite_score(policy) > 0



# import json
# import requests

# access_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjRRdnRWRktRdno5VUtSUTd5S0p1SiJ9.eyJpc3MiOiJodHRwczovL3Byb2R1Y3QtZmVkZXJhdG8udXMuYXV0aDAuY29tLyIsInN1YiI6IjdJamhyZVc5T1FMS3FZdzVQT2ZWQVl2YnVJb01kMDhTQGNsaWVudHMiLCJhdWQiOiJodHRwczovL3Byb2R1Y3QuZmVkZXJhdG8uYWkvY29yZS1hcGkiLCJpYXQiOjE3NTc3NTIxMjgsImV4cCI6MTc1Nzc2NjUyOCwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIiwiYXpwIjoiN0lqaHJlVzlPUUxLcVl3NVBPZlZBWXZidUlvTWQwOFMiLCJwZXJtaXNzaW9ucyI6W119.xhmObP_uiEfLJkNpGH3mZXqs6J2A2hSNc0JFtojAdsZHz7CLRI23rhHbTkvOgSRASgdTnJmcDbU8FH1ll9Wx4Qwd7WaDb_PNt9u4MscI1wutWO3fC7t0-Gb2cqnfTykwdSCgYbtIPOuyh8w0fPUwslZHXmHeCg2ktEnqg8qBjQ1aEYaKCS-UOoBr22YyIyeHC1vXS3pgY5rV5SWB9IsTjxjVHrPRNg-jyjbE6838E_bGSswKqmDgZSk_6Q-BphOlDIEiOB1I0ym3dY3Hg-EJ4k8k0h4pU4hQjzAz9rAM9UTa9xqQ8MWPCwMItw2QQBAbYr8IEGbQifVxYPls8iz1Ag"

# api_url = "https://product.federato.ai/integrations-api/handlers/all-policies?outputOnly=true"

# headers = {
#     "Authorization": f"Bearer {access_token}",
#     "Content-Type": "application/json"
# }

# try:
#     response = requests.post(api_url, headers=headers)
#     response.raise_for_status()
#     data = response.json()
#     print(json.dumps(data, indent=2))

# except requests.exceptions.HTTPError as err:
#     print(f"HTTP Error: {err}")
#     print(f"Response Text: {err.response.text}")

import json

with open("model/data.json", "r") as f:
    data = json.load(f)


# Get policies
policies = data["output"][0]["data"]

# Filter them
in_appetite, out_appetite = filter_policies(policies)

print(f"In-Appetite: {len(in_appetite)} policies")
print(f"Out-of-Appetite: {len(out_appetite)} policies")
