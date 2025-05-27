import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router';
import { CourseCreationModule } from '~/modules/CourseCreationModule';
import { CourseCreationAction } from '~/modules/CourseCreationModule/action';
import { CourseCreationLoader } from '~/modules/CourseCreationModule/loader';

export async function loader(args: LoaderFunctionArgs) {
  return CourseCreationLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return CourseCreationAction(args);
}

export default function CourseCreationPage() {
  return <CourseCreationModule />;
}
