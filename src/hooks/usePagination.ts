'use client';

import { useState, useCallback, useMemo } from 'react';

export interface UsePaginationProps {
    totalItems: number;
    initialPage?: number;
    initialItemsPerPage?: number;
}

export interface UsePaginationReturn {
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    goToPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    setItemsPerPage: (items: number) => void;
    canGoNext: boolean;
    canGoPrev: boolean;
}

export const usePagination = ({
    totalItems,
    initialPage = 1,
    initialItemsPerPage = 10,
}: UsePaginationProps): UsePaginationReturn => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage);

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(totalItems / itemsPerPage)),
        [totalItems, itemsPerPage],
    );

    const goToPage = useCallback(
        (page: number) => {
            const validPage = Math.max(1, Math.min(page, totalPages));
            setCurrentPage(validPage);
        },
        [totalPages],
    );

    const nextPage = useCallback(() => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    }, [totalPages]);

    const prevPage = useCallback(() => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    }, []);

    const setItemsPerPage = useCallback((items: number) => {
        setItemsPerPageState(items);
        setCurrentPage(1);
    }, []);

    const canGoNext = currentPage < totalPages;
    const canGoPrev = currentPage > 1;

    return {
        currentPage,
        itemsPerPage,
        totalPages,
        goToPage,
        nextPage,
        prevPage,
        setItemsPerPage,
        canGoNext,
        canGoPrev,
    };
};
