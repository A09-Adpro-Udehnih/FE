import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router';
import { StaffDashboardModule } from '~/modules/StaffDashboardModule';
import { StaffDashboardAction } from '~/modules/StaffDashboardModule/action';
import { StaffDashboardLoader } from '~/modules/StaffDashboardModule/loader';

export async function loader(args: LoaderFunctionArgs) {
  return StaffDashboardLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return StaffDashboardAction(args);
}

export default function StaffDashboardPage() {
  return <StaffDashboardModule />;
}
