/** Compatibility facade. Previous GAS actions are now served from Neon.
 * Only binary file transfers use Apps Script through lib/drive.ts.
 */
import {runNeon} from './neon-actions';
export async function callGas<T>(action:string,payload:Record<string,unknown>={},_admin=false):Promise<T>{
  return runNeon<T>(action,payload);
}
