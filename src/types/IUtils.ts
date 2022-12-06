/**
 * common.ts
 */

export interface IChangeNavStyle<T> {
  (curNav: string, navlist: Array<T>): void
}

export interface INavItem {
  navName: string,
  isActive: boolean,
  path?: string,
  type?: number
}

export interface IScrollTo {
  (top: number, left: number, behavior: ScrollBehavior): void
}

/**
 * cryption.ts
 */

export interface IEncrypt {
  (key: string, iv: string, data: any): string
}

export interface IDecrypt {
  (key: string, iv: string, encryptedVal: string): any
}

/**
 * http.ts
 */

export interface IHttp {
  (status: number, other: any): void
}