import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router';
import { ReviewRatingModuleModule } from '~/modules/ReviewRatingModuleModule';
import { ReviewRatingModuleAction } from '~/modules/ReviewRatingModuleModule/action';
import { ReviewRatingModuleLoader } from '~/modules/ReviewRatingModuleModule/loader';

export async function loader(args: LoaderFunctionArgs) {
  return ReviewRatingModuleLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return ReviewRatingModuleAction(args);
}

export default function ReviewRatingModulePage() {
  return <ReviewRatingModuleModule />;
}
