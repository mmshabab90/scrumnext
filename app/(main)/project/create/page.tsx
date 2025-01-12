"use client";

import React, { useState, useEffect } from "react";
import OrgSwitcher from "@/components/shared/orgnization-switcher";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "@/app/lib/validators";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BarLoader, PacmanLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createProject, ProjectData } from "@/actions/projects";
import { toast } from "sonner";

const admin = "org:admin";

export default function CreateProjectPage() {
  const router = useRouter();
  const { isLoaded: isOrgLoaded, membership } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectData>({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    if (isOrgLoaded && isUserLoaded && membership) {
      setIsAdmin(membership.role === admin);
    }
  }, [isOrgLoaded, isUserLoaded, membership]);

  const onSubmit = async (data: ProjectData) => {
    if (!isAdmin) {
      alert("Only organization admins can create projects");
      return;
    }

    setLoading(true);

    createProject(data)
      .then((res) => {
        router.push(`/project/${res.id}`);
        setLoading(false);
        setError(null);
        toast.success(`Project: ${res.name} created successfully`);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
        toast.error(err.message);
      });
  };

  if (!isOrgLoaded || !isUserLoaded || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <PacmanLoader size={85} className="mb-4" color="#36d7b7" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col gap-2 items-center">
        <span className="text-2xl gradient-title">
          SORRY! Only Admins can create projects.
        </span>
        <OrgSwitcher />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-6xl text-center font-bold mb-8 gradient-title">
        Create New Project
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <div>
          <Input
            id="name"
            {...register("name")}
            className="bg-slate-950"
            placeholder="Project Name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {String(errors.name.message)}
            </p>
          )}
        </div>
        <div>
          <Input
            id="key"
            {...register("key")}
            placeholder="Project Key (Ex: RCYT)"
          />
          {errors.key && (
            <p className="text-red-500 text-sm mt-1">
              {String(errors.key.message)}
            </p>
          )}
        </div>
        <div>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Project Description"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {String(errors.description.message)}
            </p>
          )}
        </div>
        {loading && (
          <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
        )}
        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="bg-blue-500 text-white"
        >
          {loading ? "Creating..." : "Create Project"}
        </Button>
        {error && <p className="text-red-500 mt-2">{error.message}</p>}
      </form>
    </div>
  );
}
