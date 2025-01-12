"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format, addDays } from "date-fns";

import { sprintSchema } from "@/app/lib/validators";
import { Sprint } from "@prisma/client";
import { toast } from "sonner";
import { createSprint } from "@/actions/sprint";

interface SprintCreationFormProps {
  projectTitle: string;
  projectKey: string;
  projectId: string;
  sprintKey: number;
}
export default function SprintCreationForm({
  projectTitle,
  projectKey,
  projectId,
  sprintKey,
}: SprintCreationFormProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 14),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Sprint>({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: `${projectKey}-${sprintKey}`,
      startDate: dateRange.from,
      endDate: dateRange.to,
    },
  });

  const onSubmit = async (data: Sprint) => {
    await createSprint(projectId, {
      ...data,
      startDate: dateRange.from,
      endDate: dateRange.to,
    })
      .then((res) => {
        setLoading(true);
        if (res) {
          setLoading(false);
          setError(null);
          toast.success(`Sprint ${res.name} created successfully`);
          setShowForm(false);
          router.refresh();
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
        toast.error(err.message);
      });
  };

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-5xl font-bold mb-8 gradient-title">
          {projectTitle}
        </h1>
        <Button
          className="mt-2"
          onClick={() => setShowForm(!showForm)}
          variant={!showForm ? "default" : "destructive"}
        >
          {!showForm ? "Create New Sprint" : "Cancel"}
        </Button>
      </div>
      {showForm && (
        <Card className="pt-4 mb-4">
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex gap-4 items-end"
            >
              <div className="flex-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Sprint Name
                </label>
                <Input
                  id="name"
                  {...register("name")}
                  readOnly
                  className="bg-slate-950"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Sprint Duration
                </label>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal bg-slate-950 ${
                            !dateRange && "text-muted-foreground"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from && dateRange.to ? (
                            format(dateRange.from, "LLL dd, y") +
                            " - " +
                            format(dateRange.to, "LLL dd, y")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto bg-slate-900"
                        align="start"
                      >
                        <DayPicker
                          classNames={{
                            chevron: "fill-blue-500",
                            range_start: "bg-blue-700",
                            range_end: "bg-blue-700",
                            range_middle: "bg-blue-400",
                            day_button: "border-none",
                            today: "border-2 border-blue-700",
                          }}
                          mode="range"
                          disabled={[{ before: new Date() }]}
                          selected={dateRange}
                          onSelect={(range) => {
                            if (range?.from && range?.to) {
                              if (range.from && range.to) {
                                setDateRange({
                                  from: range.from,
                                  to: range.to,
                                });
                              }
                              field.onChange(range);
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Sprint"}
              </Button>

              {error && <p className="text-red-500 mt-2">{error.message}</p>}
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
