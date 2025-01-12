"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MDEditor from "@uiw/react-md-editor";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarLoader } from "react-spinners";
import { ExternalLink } from "lucide-react";
import { redirect, usePathname, useRouter } from "next/navigation";

import { deleteIssue, updateIssue } from "@/actions/issues";
import { IssuePriorityType, IssueStatusType, IssueType } from "@/prisma/types";
import { toast } from "sonner";
import { statuses } from "@/prisma/statuses";
import UserAvatar from "./user-avatar";

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];

type IssueDetailsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  issue: IssueType;
  onDelete?: () => void;
  onUpdate?: (updatedIssue: IssueType) => void;
  borderCol?: string;
};

export default function IssueDetailsDialog({
  isOpen,
  onClose,
  issue,
  onDelete = () => {},
  onUpdate = () => {},
  borderCol = "",
}: IssueDetailsDialogProps) {
  const [status, setStatus] = useState(issue.status);
  const [priority, setPriority] = useState(issue.priority);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useUser();
  const { membership } = useOrganization();
  const router = useRouter();
  const pathname = usePathname();

  if (!user || !membership) {
    redirect("/sign-in");
  }

  const handleDelete = async () => {
    setLoading(true);
    if (window.confirm("Are you sure you want to delete this issue?")) {
      await deleteIssue(issue.id)
        .then((res) => {
          if (res.success) {
            setLoading(false);
            setError(null);
            toast.success(`Issue ${res.title} deleted successfully`);
            onClose();
            onDelete();
          }
        })
        .catch((err) => {
          setLoading(false);
          setError(err);
          toast.error(err.message);
        });
    }
  };

  const handleStatusChange = async (newStatus: IssueStatusType) => {
    setStatus(newStatus);
    setLoading(true);
    await updateIssue(issue.id, { status: newStatus, priority })
      .then((res) => {
        onUpdate(res);
        setLoading(false);
        setError(null);
        toast.success(`Issue status updated to: ${res.status}`);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
        toast.error(err.message);
      });
  };

  const handlePriorityChange = async (newPriority: IssuePriorityType) => {
    setPriority(newPriority);
    setLoading(true);
    await updateIssue(issue.id, { status, priority: newPriority })
      .then((res) => {
        onUpdate(res);
        setLoading(false);
        setError(null);
        toast.success(`Issue priority updated to: ${res.priority}`);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
        toast.error(err.message);
      });
  };

  const canChange =
    user.id === issue.reporter.clerkUserId || membership.role === "org:admin";

  const handleGoToProject = () => {
    router.push(`/project/${issue.projectId}?sprint=${issue.sprintId}`);
  };

  const isProjectPage = !pathname.startsWith("/project/");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-3xl">{issue.title}</DialogTitle>
            {isProjectPage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleGoToProject}
                title="Go to Project"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>
        {loading && <BarLoader width={"100%"} color="#36d7b7" />}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={priority}
              onValueChange={handlePriorityChange}
              disabled={!canChange}
            >
              <SelectTrigger className={`border ${borderCol} rounded`}>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <h4 className="font-semibold">Description</h4>
            <MDEditor.Markdown
              className="rounded px-2 py-1"
              source={issue.description ? issue.description : "--"}
            />
          </div>
          <div className="flex justify-between">
            {issue.assignee && (
              <div className="flex flex-col gap-2">
                <h4 className="font-semibold">Assignee</h4>
                <UserAvatar user={issue.assignee} />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold">Reporter</h4>
              <UserAvatar user={issue.reporter} />
            </div>
          </div>
          {canChange && (
            <Button
              onClick={handleDelete}
              disabled={loading}
              variant="destructive"
            >
              {loading ? "Deleting..." : "Delete Issue"}
            </Button>
          )}
          {error && <p className="text-red-500">{error.message}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
