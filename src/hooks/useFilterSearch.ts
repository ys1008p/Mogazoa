import { useRouter } from "next/router";

export type filterSearchProps = {
  category?: string;
  sort?: string;
  searchQuery?: string;
};

const useFilterSearch = () => {
  const router = useRouter();

  const filterSearch = ({ category, sort, searchQuery }: filterSearchProps) => {
    const { pathname, query } = router; // pathname 추가

    if (searchQuery !== undefined) {
      query.searchQuery = searchQuery;
    }
    if (sort !== undefined) {
      query.sortValue = sort;
    }
    if (category !== undefined) {
      query.category = category;
    }

    router.push({
      pathname: "/search",
      query: query,
    });
  };

  return filterSearch;
};

export default useFilterSearch;