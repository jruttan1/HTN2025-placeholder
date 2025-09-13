# Create Main Table
aws dynamodb create-table \
    --table-name main-table \
    --attribute-definitions \
        AttributeName=id,AttributeType=N \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST

# Create Guidelines Table  
aws dynamodb create-table \
    --table-name guidelines-table \
    --attribute-definitions \
        AttributeName=id,AttributeType=N \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST
