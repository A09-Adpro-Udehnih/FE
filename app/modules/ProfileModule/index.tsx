import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { ProfileLoader } from "./loader";
import { useLoaderData } from "react-router";

export const ProfileModule = () => {
  const { user } = useLoaderData<typeof ProfileLoader>();

  return (
    <main className="container flex h-fit py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <p className="text-sm">{user.fullName}</p>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <p className="text-sm">{user.email}</p>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <p className="text-sm capitalize">{user.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};
