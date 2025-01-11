import React from 'react'

type OrganizationPageProps = {
    params: Promise<{ orgId: string }>;
}

const OrganizationPage = async ({params}: OrganizationPageProps) => {
    const {orgId} = await params;
  return (
    <div>{orgId}</div>
  )
}

export default OrganizationPage