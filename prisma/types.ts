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
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type IssueType = {
    id: string;
    title: string;
    description?: string;
    status: IssueStatusType;
    order: number;
    priority: IssuePriorityType;
    assignee?: UserType;
    assigneeId?: string;
    reporter: UserType;
    reporterId: string;
    project: ProjectType;
    projectId: string;
    sprint?: SprintType;
    sprintId?: string;
    createdAt: Date;
    updatedAt: Date;
  };
  
  export enum SprintStatusType {
    PLANNED = 'PLANNED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    ACTIVE = "ACTIVE",
  }
  
  export enum IssueStatusType {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    IN_REVIEW = 'IN_REVIEW',
    DONE = 'DONE',
  }
  
  export enum IssuePriorityType {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
  }