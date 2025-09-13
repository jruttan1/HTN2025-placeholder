import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

// Table names
const USERS_TABLE = process.env.DYNAMODB_USERS_TABLE || 'optimate-users';
const SUBMISSIONS_TABLE = process.env.DYNAMODB_SUBMISSIONS_TABLE || 'optimate-user-submissions';
const GUIDELINES_TABLE = process.env.DYNAMODB_GUIDELINES_TABLE || 'optimate-user-guidelines';

export interface User {
  userId: string;
  name: string;
  email: string;
  preferences?: any;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  userId: string;
  submissionId: string;
  client: string;
  broker: string;
  premium: string;
  appetiteScore: number;
  appetiteStatus: 'good' | 'missing' | 'poor';
  slaTimer: string;
  slaProgress: number;
  status: string;
  company: string;
  product: string;
  coverage: string;
  whySurfaced: string[];
  missingInfo: string[];
  recommendation: string;
  createdAt: string;
  updatedAt: string;
}

export interface Guideline {
  userId: string;
  guidelineId: string;
  title: string;
  rules: any;
  preferences: any;
  createdAt: string;
  updatedAt: string;
}

// User operations
export async function createUser(user: Omit<User, 'createdAt' | 'updatedAt'>): Promise<User> {
  const now = new Date().toISOString();
  const newUser: User = {
    ...user,
    createdAt: now,
    updatedAt: now,
  };

  await docClient.send(new PutCommand({
    TableName: USERS_TABLE,
    Item: newUser,
    ConditionExpression: 'attribute_not_exists(userId)', // Only create if doesn't exist
  }));

  return newUser;
}

export async function getUser(userId: string): Promise<User | null> {
  const result = await docClient.send(new GetCommand({
    TableName: USERS_TABLE,
    Key: { userId },
  }));

  return result.Item as User || null;
}

export async function updateUser(userId: string, updates: Partial<Omit<User, 'userId' | 'createdAt'>>): Promise<User> {
  const now = new Date().toISOString();
  
  const result = await docClient.send(new UpdateCommand({
    TableName: USERS_TABLE,
    Key: { userId },
    UpdateExpression: 'SET #name = :name, email = :email, preferences = :preferences, updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':name': updates.name,
      ':email': updates.email,
      ':preferences': updates.preferences,
      ':updatedAt': now,
    },
    ReturnValues: 'ALL_NEW',
  }));

  return result.Attributes as User;
}

// Submission operations
export async function createSubmission(submission: Omit<Submission, 'createdAt' | 'updatedAt'>): Promise<Submission> {
  const now = new Date().toISOString();
  const newSubmission: Submission = {
    ...submission,
    createdAt: now,
    updatedAt: now,
  };

  await docClient.send(new PutCommand({
    TableName: SUBMISSIONS_TABLE,
    Item: newSubmission,
  }));

  return newSubmission;
}

export async function getUserSubmissions(userId: string): Promise<Submission[]> {
  const result = await docClient.send(new QueryCommand({
    TableName: SUBMISSIONS_TABLE,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  }));

  return result.Items as Submission[] || [];
}

export async function getSubmission(userId: string, submissionId: string): Promise<Submission | null> {
  const result = await docClient.send(new GetCommand({
    TableName: SUBMISSIONS_TABLE,
    Key: { userId, submissionId },
  }));

  return result.Item as Submission || null;
}

export async function updateSubmission(
  userId: string, 
  submissionId: string, 
  updates: Partial<Omit<Submission, 'userId' | 'submissionId' | 'createdAt'>>
): Promise<Submission> {
  const now = new Date().toISOString();
  
  const result = await docClient.send(new UpdateCommand({
    TableName: SUBMISSIONS_TABLE,
    Key: { userId, submissionId },
    UpdateExpression: 'SET appetiteScore = :appetiteScore, appetiteStatus = :appetiteStatus, #status = :status, updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#status': 'status'
    },
    ExpressionAttributeValues: {
      ':appetiteScore': updates.appetiteScore,
      ':appetiteStatus': updates.appetiteStatus,
      ':status': updates.status,
      ':updatedAt': now,
    },
    ReturnValues: 'ALL_NEW',
  }));

  return result.Attributes as Submission;
}

// Guideline operations
export async function createGuideline(guideline: Omit<Guideline, 'createdAt' | 'updatedAt'>): Promise<Guideline> {
  const now = new Date().toISOString();
  const newGuideline: Guideline = {
    ...guideline,
    createdAt: now,
    updatedAt: now,
  };

  await docClient.send(new PutCommand({
    TableName: GUIDELINES_TABLE,
    Item: newGuideline,
  }));

  return newGuideline;
}

export async function getUserGuidelines(userId: string): Promise<Guideline[]> {
  const result = await docClient.send(new QueryCommand({
    TableName: GUIDELINES_TABLE,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  }));

  return result.Items as Guideline[] || [];
}
