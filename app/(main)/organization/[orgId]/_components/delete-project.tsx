"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useOrganization } from "@clerk/nextjs";
import { deleteProject } from "@/actions/projects";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import "@/components/shared/CustomDialog";

type DeleteProjectProps = {
  projectId: string;
};

export default function DeleteProject({ projectId }: DeleteProjectProps) {
  const { membership } = useOrganization();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const isAdmin = membership?.role === "org:admin";

  const onDelete = async () => {
    deleteProject(projectId)
      .then((res) => {
        setLoading(true);
        if (res.success) {
          setLoading(false);
          setError(null);
          toast.success(`Project deleted successfully`);
          router.refresh();
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
        toast.error(err.message);
      });
  };

  const handleDelete = () => {
    setDeleteModal(true);
    const dialog = document.createElement("custom-dialog");
    dialog.innerHTML = `
      <span slot="title">Delete Project</span>
      <span slot="body">Are you sure you want to delete this project?</span>
    `;
    dialog.addEventListener("confirm", () => {
      onDelete();
    });
    dialog.addEventListener("cancel", () => {
      setDeleteModal(false);
    });
    document.body.appendChild(dialog);
  };

  if (!isAdmin) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={`${loading ? "animate-pulse" : ""}`}
        onClick={handleDelete}
        disabled={loading}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </>
  );
}
