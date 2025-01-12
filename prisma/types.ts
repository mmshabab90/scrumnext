export type UserType = {
    id: string;
    clerkUserId: string;
    email: string;
    name?: string;
    imageUrl?: string;
    createdIssues: IssueType[];
    assignedIssues: IssueType[];
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type ProjectType = {
    id: string;
    name: string;
    key: string;
    description?: string;
    organizationId: string;
    sprints: SprintType[];
    issues: IssueType[];
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type SprintType = {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    status: SprintStatusType;
    project: ProjectType;
    projectId: string;
    issues: IssueType[];
  };
  
  export type IssueType = {
    id: string;
    title: string;
    description?: string;
    status: IssueStatusType;
    priority: IssuePriorityType;
    reporter: UserType;
    assignee?: UserType;
    sprint?: SprintType;
    project: ProjectType;
    createdAt: Date;
    updatedAt: Date;
  };
  
  export enum SprintStatusType {
    PLANNED = 'PLANNED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
  }
  
  export enum IssueStatusType {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    CLOSED = 'CLOSED',
  }
  
  export enum IssuePriorityType {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
  }