import { LinkedSubscription } from '@azure/ms-rest-nodeauth';
import { AddOptions, Logger } from '../shared/types';
export declare function selectSubscription(subs: LinkedSubscription[] | undefined, options: AddOptions, logger: Logger): Promise<string>;
