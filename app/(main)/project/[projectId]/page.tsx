import { getProject } from "@/actions/projects";
import { notFound } from "next/navigation";
import SprintCreationForm from "../_components/create-sprint";

type ProjectPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const project = await getProject(projectId);

  console.log(project);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto">
      <SprintCreationForm
        projectTitle={project.name}
        projectId={projectId}
        projectKey={project.key}
        sprintKey={project.sprints?.length + 1}
      />
      {project.sprints.length > 0 ? (
        <div>SprintBoard</div>
      ) : (
        <div>Create a Sprint from button above</div>
      )}
    </div>
  );
}
