import { SearchTitleName } from "./Styled/StyledSearchTitle";
type SearchTitleProps = {
  searchKeyword: string;
};

export default function SearchTitle({ searchKeyword }: SearchTitleProps) {
  return (
    <div>
      <SearchTitleName>{searchKeyword}</SearchTitleName>
    </div>
  );
}
