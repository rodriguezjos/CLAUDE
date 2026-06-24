import { Cala } from '../types';
import { CALAS_MIGJORN } from './migjorn';
import { CALAS_SANTANYI } from './santanyi';
import { CALAS_LLEVANT } from './llevant';
import { CALAS_TRAMUNTANA } from './tramuntana';
import { CALAS_PONENT } from './ponent';
import { CALAS_ALCUDIA } from './alcudia';

export const TOTES_LES_CALAS: Cala[] = [
  ...CALAS_MIGJORN,
  ...CALAS_SANTANYI,
  ...CALAS_LLEVANT,
  ...CALAS_TRAMUNTANA,
  ...CALAS_PONENT,
  ...CALAS_ALCUDIA,
];

export const calaById = Object.fromEntries(
  TOTES_LES_CALAS.map(c => [c.id, c])
) as Record<string, Cala>;
