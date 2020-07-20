import eTrace from '../models/eTrace.ts';

interface CallBacks {
  [key: string]: (...args: any) => Promise<void>
}

// Register callbacks here
export const CALLBACKS: CallBacks = {
  ADD_ERR_TRACE: eTrace.add
}