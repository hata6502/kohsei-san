import { TextlintResult } from '@textlint/kernel';

const score = ({ result, text }: { result: TextlintResult; text: string }): number =>
  text.length === 0 ? 0 : result.messages.length / text.length;

export default score;
