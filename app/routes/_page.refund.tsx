import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router';
import { RefundModule } from '~/modules/RefundModule';
import { RefundAction } from '~/modules/RefundModule/action';
import { RefundLoader } from '~/modules/RefundModule/loader';

export async function loader(args: LoaderFunctionArgs) {
  return RefundLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return RefundAction(args);
}

export default function RefundPage() {
  return <RefundModule />;
}
