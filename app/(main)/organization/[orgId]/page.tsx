import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrganization } from "@/actions/organizations";
import OrgSwitcher from "../../../../components/shared/orgnization-switcher";
import ProjectList from "./_components/project-list";

type OrganizationPageProps = {
  params: Promise<{ orgId: string }>;
};

const OrganizationPage = async ({ params }: OrganizationPageProps) => {
  const { orgId } = await params;
  const { userId } = await auth();

  console.log("userId", userId);

  if (!userId) {
    redirect("/sign-in");
  }

  const organization = await getOrganization(orgId);

  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
        <h1 className="text-5xl font-bold gradient-title pb-2">
          {organization.name}&rsquo;s Projects
        </h1>
        <OrgSwitcher />
      </div>
      <div className="mb-4">
        <ProjectList orgId={organization.id} />
      </div>
      <div className="mt-8"></div>
    </div>
  );
};

export default OrganizationPage;
