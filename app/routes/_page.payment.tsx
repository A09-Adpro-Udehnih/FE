import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router';
import { PaymentModule } from '~/modules/PaymentModule';
import { PaymentAction } from '~/modules/PaymentModule/action';
import { PaymentLoader } from '~/modules/PaymentModule/loader';

export async function loader(args: LoaderFunctionArgs) {
  return PaymentLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return PaymentAction(args);
}

export default function PaymentPage() {
  return <PaymentModule />;
}