export interface Response<T> {
    status: number;
    message: string;
    entries: T;
}

export interface ResponseOneIf<T> extends Response<T> {}

export interface ResponseListIf<T> extends Partial<Response<T[]>> {
    totalRecords?: number;
}