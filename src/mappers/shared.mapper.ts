export type IdLike = unknown;

export function toId(value: IdLike): string {
    return value == null ? '' : String(value);
}

export function toIso(value: Date | string | undefined | null): string {
    if (!value) return new Date(0).toISOString();
    return value instanceof Date ? value.toISOString() : value;
}

export function toOptionalIso(value: Date | string | undefined | null): string | undefined {
    if (value == null) return undefined;
    return value instanceof Date ? value.toISOString() : value;
}
