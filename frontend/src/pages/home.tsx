import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Header } from "../components/header";
import { useSearchParams } from "react-router-dom";
import { UserPageResponse } from "../types/userPageResponse";
import { Pagination } from "../components/pagination";
import { UserInformationTable } from "../components/userInformationTable/userInformationTable";

export function Home() {
  const [searchParams] = useSearchParams();

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const pageSize = searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 10;

  const { data: userPageResponse, isLoading } = useQuery<UserPageResponse>({
    queryKey: ['get-users', page, pageSize],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/api/users?pageNumber=${page - 1}&pageSize=${pageSize}`)
      const data = await response.json()

      return data
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  })

  if (isLoading) {
    return null;
  }

  return (
    <div className="max-w-[1200px] m-auto space-y-2">
      <Header />
      <UserInformationTable userInformation={userPageResponse?.data}/>
      {userPageResponse && <Pagination pages={userPageResponse.pages} items={userPageResponse.pageItems} page={page} totalItems={userPageResponse.totalItems}/>}
    </div>
  )
}
