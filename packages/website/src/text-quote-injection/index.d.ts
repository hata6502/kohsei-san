import { TextQuoteSelector } from "@apache-annotator/selector";
export declare type CleanUpTextQuoteInjection = (props: unknown) => void;
export interface TextQuoteInjectionConfig {
    cssSelector: string;
    textQuoteSelector: TextQuoteSelector;
    inject: (match: Range) => unknown;
    cleanUp: CleanUpTextQuoteInjection;
}
export declare const injectByTextQuote: (configs: TextQuoteInjectionConfig[]) => Promise<void>;
