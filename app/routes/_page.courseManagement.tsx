import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router';
import { CourseManagementModule } from '~/modules/CourseManagementModule';
import { CourseManagementAction } from '~/modules/CourseManagementModule/action';
import { CourseManagementLoader } from '~/modules/CourseManagementModule/loader';

export async function loader(args: LoaderFunctionArgs) {
  return CourseManagementLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return CourseManagementAction(args);
}

export default function CourseManagementPage() {
  return <CourseManagementModule />;
}
