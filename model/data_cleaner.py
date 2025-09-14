# ------------------------------------------------------------------------

## NOT NEEDED ANYMORE - we fixed the generation prompt to not produce these nested JSON blobs. ##

# import json
# import re

# def fix_references(obj):
#     """Recursively fix only the `references.point` values that contain JSON blobs."""
#     if isinstance(obj, dict):
#         new_obj = {}
#         for k, v in obj.items():
#             if k == "references" and isinstance(v, list):
#                 fixed_refs = []
#                 for ref in v:
#                     if isinstance(ref, dict) and "point" in ref and isinstance(ref["point"], str):
#                         cleaned = re.sub(r"^```json\s*|\s*```$", "", ref["point"].strip(), flags=re.IGNORECASE)
#                         try:
#                             parsed = json.loads(cleaned)
#                             if "references" in parsed:
#                                 # Replace "point" with the actual parsed list of references
#                                 for subref in parsed["references"]:
#                                     fixed_refs.append(subref)
#                             else:
#                                 fixed_refs.append(ref)  # keep as-is
#                         except json.JSONDecodeError:
#                             fixed_refs.append(ref)  # keep as-is if not valid JSON
#                     else:
#                         fixed_refs.append(ref)
#                 new_obj[k] = fixed_refs
#             else:
#                 new_obj[k] = fix_references(v)
#         return new_obj
#     elif isinstance(obj, list):
#         return [fix_references(i) for i in obj]
#     else:
#         return obj

# def main(input_file="results/cleaned_data.json", output_file="results/cleaned_data.json"):
#     with open(input_file, "r") as f:
#         data = json.load(f)

#     cleaned = fix_references(data)

#     with open(output_file, "w") as f:
#         json.dump(cleaned, f, indent=2)

#     print(f"✅ Cleaned references saved to {output_file}")

# if __name__ == "__main__":
#     main()



# ------------------------------------------------------------------------


# import json
# import re

# def fix_justification_points(obj):
#     """Recursively fix justification_points fields that contain JSON blobs."""
#     if isinstance(obj, dict):
#         new_obj = {}
#         for k, v in obj.items():
#             if k == "justification_points" and isinstance(v, list) and len(v) == 1 and isinstance(v[0], str):
#                 cleaned = re.sub(r"^```json\s*|\s*```$", "", v[0].strip(), flags=re.IGNORECASE)
#                 try:
#                     parsed = json.loads(cleaned)
#                     if "points" in parsed and isinstance(parsed["points"], list):
#                         new_obj[k] = parsed["points"]  # replace with flat list of strings
#                     else:
#                         new_obj[k] = v  # keep as-is
#                 except json.JSONDecodeError:
#                     new_obj[k] = v  # keep as-is if not valid JSON
#             else:
#                 new_obj[k] = fix_justification_points(v)
#         return new_obj
#     elif isinstance(obj, list):
#         return [fix_justification_points(i) for i in obj]
#     else:
#         return obj

# def main(input_file="results/enhanced_data.json", output_file="results/cleaned_data.json"):
#     with open(input_file, "r") as f:
#         data = json.load(f)

#     cleaned = fix_justification_points(data)

#     with open(output_file, "w") as f:
#         json.dump(cleaned, f, indent=2)

#     print(f"✅ Cleaned justification_points saved to {output_file}")

# if __name__ == "__main__":
#     main()
