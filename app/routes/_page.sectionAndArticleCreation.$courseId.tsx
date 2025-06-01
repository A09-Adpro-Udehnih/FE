import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router';
import { SectionAndArticleCreationModule } from '~/modules/SectionAndArticleCreationModule';
import { SectionAndArticleCreationAction } from '~/modules/SectionAndArticleCreationModule/action.server';
import { SectionAndArticleCreationLoader } from '~/modules/SectionAndArticleCreationModule/loader.server';

export async function loader(args: LoaderFunctionArgs) {
  return SectionAndArticleCreationLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return SectionAndArticleCreationAction(args);
}

export default function SectionAndArticleCreationPage() {
  return <SectionAndArticleCreationModule />;
}
