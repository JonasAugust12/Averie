import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@typings/api.type';

export function toastSuccess(message: string) {
    toast.success(message);
}

export function toastApiError(error: unknown) {
    const axiosErr = error as AxiosError<ApiResponse<null>>;
    const message =
        axiosErr.response?.data?.message ??
        (error instanceof Error ? error.message : null) ??
        'Something went wrong';
    toast.error(message);
}
