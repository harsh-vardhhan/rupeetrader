/* tslint:disable */
/* eslint-disable */
/**
* @param {string} json_str
*/
export function print_instruments(json_str: string): void;
/**
*/
export class Instrument {
  free(): void;
}
/**
*/
export class MarketData {
  free(): void;
}
/**
*/
export class OptionData {
  free(): void;
}
/**
*/
export class OptionGreeks {
  free(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_marketdata_free: (a: number, b: number) => void;
  readonly __wbg_optiongreeks_free: (a: number, b: number) => void;
  readonly __wbg_optiondata_free: (a: number, b: number) => void;
  readonly __wbg_instrument_free: (a: number, b: number) => void;
  readonly print_instruments: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
