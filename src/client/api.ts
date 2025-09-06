// Eden Treaty API root for client usage
import { treaty } from '@elysiajs/eden';
import type { App } from '@server/app';

export const api = treaty<App>('https://consumer.decentragri.com');
