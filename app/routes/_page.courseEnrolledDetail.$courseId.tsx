import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { CourseEnrolledDetailModule } from "~/modules/CourseEnrolledDetailModule";
import { CourseEnrolledDetailAction } from "~/modules/CourseEnrolledDetailModule/action";
import { CourseEnrolledDetailLoader } from "~/modules/CourseEnrolledDetailModule/loader";
import { ReviewRatingModuleModule } from "~/modules/CourseEnrolledDetailModule/sections/ReviewRatingModuleModule";

export async function loader(args: LoaderFunctionArgs) {
  return CourseEnrolledDetailLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return CourseEnrolledDetailAction(args);
}

export default function CourseEnrolledDetailPage() {
  return (
    <main className="min-w-[90vw]">
      <CourseEnrolledDetailModule />
      <ReviewRatingModuleModule />
    </main>
  );
}
