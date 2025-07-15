export const calculatePaginationData = (countItems, page, perPage) => {
  const totalPages = Math.ceil(countItems / perPage);
  const hasNextPage = Boolean(totalPages - page);
  const hasPreviousPage = page !== 1;

  return {
    page,
    perPage,
    totalItems: countItems,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};
