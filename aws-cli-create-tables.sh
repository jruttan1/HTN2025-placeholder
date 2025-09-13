# Create Users Table
aws dynamodb create-table \
    --table-name optimate-users \
    --attribute-definitions \
        AttributeName=userId,AttributeType=S \
    --key-schema \
        AttributeName=userId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST

# Create User Submissions Table (with composite key for user isolation)
aws dynamodb create-table \
    --table-name optimate-user-submissions \
    --attribute-definitions \
        AttributeName=userId,AttributeType=S \
        AttributeName=submissionId,AttributeType=S \
    --key-schema \
        AttributeName=userId,KeyType=HASH \
        AttributeName=submissionId,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST

# Create User Guidelines Table (with composite key for user isolation)  
aws dynamodb create-table \
    --table-name optimate-user-guidelines \
    --attribute-definitions \
        AttributeName=userId,AttributeType=S \
        AttributeName=guidelineId,AttributeType=S \
    --key-schema \
        AttributeName=userId,KeyType=HASH \
        AttributeName=guidelineId,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST
