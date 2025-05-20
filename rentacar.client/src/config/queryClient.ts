/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryCache, QueryClient, MutationCache } from '@tanstack/react-query';
import { message } from 'antd';

const nonRetryErrorCodes = [403, 401, 400, 404, 409];
const errorMessageMap: Record<number, string> = {
    401: 'Unauthorized 401',
    403: 'Forbidden 403',
    404: 'Not found 404',
    400: 'Bad request 400',
    409: 'Concurent modification 409',
};

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error: any) => {
            if (error.status && errorMessageMap[error.status]) {
                message.error(errorMessageMap[error.status]);
            } else {
                message.error('An unexpected error occurred');
            }
        },
    }),
    mutationCache: new MutationCache({
        onError: (error: any) => {
            if (error.status && errorMessageMap[error.status]) {
                message.error(errorMessageMap[error.status]);
            } else {
                message.error('An unexpected error occurred');
            }
        },
    }),
    defaultOptions: {
        queries: {
            retry(failureCount, error: any) {
                return error.status && nonRetryErrorCodes.includes(error.status)
                    ? false
                    : failureCount <= 2
                      ? true
                      : false;
            },
        },
    },
});
