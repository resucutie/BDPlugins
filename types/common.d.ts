// @ts-nocheck

import { ReactFragment } from "react";

declare type ValueOf<T> = T[keyof T];

declare type UnknownFunction = (...args: any) => any;

export type ReactValidElements = string | boolean | ReactComponent | ReactFragment
