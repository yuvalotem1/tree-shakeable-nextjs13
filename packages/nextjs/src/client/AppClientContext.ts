import { createContext } from 'react';
import type { FronteggApp } from '@frontegg/js';

const AppClientContext = createContext<FronteggApp | null>(null);

export default AppClientContext;
