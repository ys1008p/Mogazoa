import { ReactNode, useState, useEffect } from "react";
import styled from "styled-components";
import { StyledCategoryChip } from "@/src/components/common/chip/Styled/StyledCategoryChip";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/src/routes";
import { useRouter } from "next/router";
import { getUserData, getUserFollowees, getUserFollowers, getUserReviewed } from "@/src/apis/user";
import { categoryList } from "@/src/utils/categoryList";
import UserProductList from "@/src/components/profiles/UserProductList";
import { useToggle } from "usehooks-ts";
import FollowInfoModal from "@/src/components/profiles/FollowInfoModal";
import MyPageProfileButtons from "@/src/components/profiles/MyPageProfileButtons";
import FollowButton from "@/src/components/profiles/FollowButton";

/**
 * 1. 상품 카드 사이즈 변경
 * 2. 활동내역 css 변경
 * 3. 팔로잉 수 누르면 모달창 띄우기
 * 4. 본인 id면 마이페이지로 이동
 *    -
 */

const StyledProfileLayout = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  @media only screen and (max-width: 900px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ActivityList = styled.div`
  color: white;
  font-size: 24px;
  margin-bottom: 30px;
`;

const StyledMyActivities = styled.div`
  display: flex;
  gap: 20px;
`;

const StyledRatings = styled.span`
  color: white;
  font-size: 24px;
`;

// 프로필 styled component
const StyledProfileBox = styled.div`
  width: 350px;
  border-radius: 12px;
  border: 1px solid var(--black-black_353542, #353542);
  background: var(--black-black_252530, #252530);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  gap: 30px;
`;

const StyledImageBox = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
`;

const StyledProfileText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const StyledProfileNickname = styled.div`
  color: white;
  font-size: 24px;
`;

const StyledProfileDesc = styled.div`
  color: #9fa6b2;
`;

const StyledProfileButton = styled.button`
  color: white;
  border-radius: 8px;
  background: var(--main-main_gradation, linear-gradient(91deg, #5097fa 0%, #5363ff 100%));
  padding: 24px;
  width: 100%;
`;

const StyledFollowInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 60px;
`;
const StyledFollowNumber = styled.button`
  color: white;
`;

const StyledFollowText = styled.div`
  color: #9fa6b2;
`;

const StyledFilterButton = styled.button<{ $active?: boolean }>`
  color: ${(props) => (props.$active ? "white" : "#6E6E82")};
  margin-right: 40px;
`;

type Props = {
	isMe: boolean;
}

export default function Userprofile({ isMe }: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [dataType, setDataType] = useState<"REVIEWED" | "CREATED" | "FAVORITE">("REVIEWED");
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);

  const { userId }: any = router.query;

  const { data: USERDATA } = useQuery({
    queryKey: ["USERDATA", userId],
    queryFn: () => getUserData(userId),
  });
  console.log({ USERDATA });
  const { data: FOLLOWEES } = useQuery({
    queryKey: [QUERY_KEY.FOLLOWEES, userId],
    queryFn: () => getUserFollowees(userId),
  });
  const { data: FOLLOWERS } = useQuery({
    queryKey: [QUERY_KEY.FOLLOWERS, userId],
    queryFn: () => getUserFollowers(userId),
  });
  const { data: REVIEWS } = useQuery({
    queryKey: [QUERY_KEY.REVIEWS, userId],
    queryFn: () => getUserReviewed(userId),
  });
  console.log(REVIEWS);
  const followingCount = USERDATA?.followeesCount;
  const followersCount = USERDATA?.followersCount;
  const reviewsCount = REVIEWS?.list.length;
  const ratingEverage = REVIEWS?.list.length
    ? Math.floor((REVIEWS?.list.reduce((acc, item) => acc + item.rating, 0) / reviewsCount) * 10) / 10
    : 0;

  const categoryCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 };
  REVIEWS?.list.forEach((item) => categoryCount[item.categoryId]++);
  // 프로퍼티 값 중 최대값을 구합니다.
  const maxPropertyValue = Math.max(...Object.values(categoryCount));

  // 최대값을 가진 프로퍼티의 키를 찾습니다.
  const maxPropertyKey = Object.keys(categoryCount).find((key) => categoryCount[key] === maxPropertyValue);

  const favoriteCategory = categoryList[maxPropertyKey - 1].name;

  return (
    <>

			<StyledProfileLayout>
			{/* 프로필 */}
			<div>
				<StyledProfileBox>
					<StyledImageBox>
						{/* Next Image로 바꾸기 & next.config.mjs 수정하기 & 사용법 익혀서 하기 */}
						<Image
							width={200}
							height={200}
							src="https://images.unsplash.com/photo-1683009427470-a36fee396389?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
							alt="프로필사진"
						/>
					</StyledImageBox>

					<StyledProfileText>
						<StyledProfileNickname>surisuri마수리</StyledProfileNickname>
						<StyledProfileDesc>
							세상에 리뷰 못할 제품은 없다. surisuri마수리와 함께라면 당신도 쇼핑~~~~~
						</StyledProfileDesc>
					</StyledProfileText>
					<StyledFollowInfo>
						<div>
							<StyledFollowNumber>{followersCount}</StyledFollowNumber>
							<StyledFollowText>팔로워</StyledFollowText>
						</div>
						<svg xmlns="http://www.w3.org/2000/svg" width="1" height="48" viewBox="0 0 1 48" fill="none">
							<path d="M0.5 0V48" stroke="#353542" />
						</svg>
						<div>
							{/* 1. 팔로잉 수를 누른다. 
								2. 모달이 열린다.
								3. 모달에 유저 목록이 보인다.
						*/}
							<StyledFollowNumber
								onClick={() => {
									setIsFollowingModalOpen(true);
								}}>
								{followingCount}
							</StyledFollowNumber>
							<StyledFollowText>팔로잉</StyledFollowText>
						</div>
					</StyledFollowInfo>
					{isMe ? <MyPageProfileButtons /> : <FollowButton isFollowingData={USERDATA?.isFollowing} userId={userId}/>}
				</StyledProfileBox>
			</div>

			{/* 활동 내역 */}
			<div>
				<ActivityList>활동내역</ActivityList>
				<StyledMyActivities>
					<div>
						<span>별아이콘</span> <StyledRatings> {ratingEverage}</StyledRatings>
					</div>

					<div>
						<span>리뷰아이콘</span> <StyledRatings> {reviewsCount}</StyledRatings>
					</div>
					{/* 카테고리 없을경우 조건달기 */}
					<div>
						<StyledCategoryChip $category={favoriteCategory}>{favoriteCategory}</StyledCategoryChip>
					</div>
				</StyledMyActivities>
				<div>
					<StyledFilterButton $active={dataType === "REVIEWED"} onClick={() => setDataType("REVIEWED")}>
						리뷰 남긴 상품
					</StyledFilterButton>
					<StyledFilterButton $active={dataType === "CREATED"} onClick={() => setDataType("CREATED")}>
						등록한 상품
					</StyledFilterButton>
					<StyledFilterButton $active={dataType === "FAVORITE"} onClick={() => setDataType("FAVORITE")}>
						찜한 상품
					</StyledFilterButton>
				</div>

				<UserProductList userId={userId} dataType={dataType}></UserProductList>
			</div>
		</StyledProfileLayout>
		{isFollowingModalOpen && (
			<FollowInfoModal
				setIsOpen={setIsFollowingModalOpen}
				dataType="followee"
				userId={userId}
				nickname="surisuri마수리"
			/>
		)}
      
    </>
  );
}