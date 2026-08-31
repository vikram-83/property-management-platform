const getPagination = (page = 1, limit = 10) => {
  const pageNumber = Number(page) > 0 ? Number(page) : 1;
  const limitNumber = Number(limit) > 0 ? Number(limit) : 10;
  return {
    skip: (pageNumber - 1) * limitNumber,
    take: limitNumber,
  };
};

module.exports = { getPagination };
