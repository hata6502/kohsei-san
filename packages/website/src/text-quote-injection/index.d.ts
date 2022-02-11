import { TextQuoteSelector } from "@apache-annotator/selector";
export declare type CleanUpTextQuoteInjection = (props: unknown) => void;
export interface TextQuoteInjectionConfig {
    selector: TextQuoteSelector;
    inject: (match: Range) => unknown;
    cleanUp: CleanUpTextQuoteInjection;
}
export declare const injectByTextQuote: (configs: TextQuoteInjectionConfig[]) => Promise<void>;
