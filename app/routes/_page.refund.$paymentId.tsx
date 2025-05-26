import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router';
import { RefundModule } from '~/modules/RefundModule';
import { RefundAction } from '~/modules/RefundModule/action';
import { RefundLoader } from '~/modules/RefundModule/loader';

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  // Create a new request with paymentId from URL params
  const url = new URL(request.url);
  url.searchParams.set('paymentId', params.paymentId || '');
  const newRequest = new Request(url, request);
  
  return RefundLoader({ params, request: newRequest, context });
}

export async function action(args: ActionFunctionArgs) {
  return RefundAction(args);
}

export default function RefundPage() {
  return <RefundModule />;
} 