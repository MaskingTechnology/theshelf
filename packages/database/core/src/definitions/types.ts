
import type { QueryOperators, SortDirections } from './constants.js';

type ValueOf<T> = T[keyof T];

export type RecordType = string;
export type RecordId = string;

export type RecordField = string;
export type RecordValue = unknown;
export type RecordData = Record<RecordField, RecordValue>;

export type QueryOperator = keyof typeof QueryOperators;
export type QueryExpression<T> = Partial<Record<QueryOperator, ValueOf<T> | ValueOf<T>[]>>;
export type QuerySingleExpressionStatement<T> = Partial<Record<keyof T, QueryExpression<T>>>;
export type QueryMultiExpressionStatement<T> = Partial<Record<'AND' | 'OR', QuerySingleExpressionStatement<T>[]>>;
export type QuerySingleStatement<T> = QuerySingleExpressionStatement<T> | QueryMultiExpressionStatement<T>;
export type QueryMultiStatement<T> = Partial<Record<'AND' | 'OR', QuerySingleStatement<T>[]>>;
export type QueryStatement<T> = QuerySingleStatement<T> | QueryMultiStatement<T>;
export type RecordQuery<T> = QueryStatement<T>;

export type RecordDirection = keyof typeof SortDirections;
export type RecordSort<T> = Partial<Record<keyof T, RecordDirection>>;
