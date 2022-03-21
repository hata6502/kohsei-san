export declare type CleanUpTextQuoteInjection = (props: unknown) => void;
export interface TextQuoteSelector {
  prefix?: string;
  exact: string;
  suffix?: string;
}
export interface TextQuoteInjectionConfig {
  textQuoteSelector: TextQuoteSelector;
  inject: (match: Range) => unknown;
  cleanUp: CleanUpTextQuoteInjection;
}
export declare const injectByTextQuote: (configs: TextQuoteInjectionConfig[]) => void;
