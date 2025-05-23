import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const roleEnum = z.enum(["student", "teacher"]);

const profileSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  role: roleEnum,
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfileModule = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: "john.doe@example.com", // This would come from your auth context
      fullName: "John Doe", // This would come from your auth context
      role: "student", // This would come from your auth context
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement API call here
      // const response = await updateProfile(data);
      // if (response.success) {
      //   setIsEditing(false);
      // }
      console.log("Profile update data:", data);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container flex h-fit py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            View and edit your profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  aria-label="Full name"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  aria-label="Email address"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("role", value as "student" | "teacher")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-500">{errors.role.message}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <p className="text-sm">{watch("fullName")}</p>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <p className="text-sm">{watch("email")}</p>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <p className="text-sm capitalize">{watch("role")}</p>
              </div>
              <Button onClick={() => setIsEditing(true)} className="w-full">
                Edit Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};
