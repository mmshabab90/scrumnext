import { getProject } from "@/actions/projects";
import { notFound } from "next/navigation";

type ProjectPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const project = await getProject(projectId);



  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto">
      Create Sprint
      {project.sprints.length > 0 ? (
        <div>SprintBoard</div>
      ) : (
        <div>Create a Sprint from button above</div>
      )}
    </div>
  );
}
