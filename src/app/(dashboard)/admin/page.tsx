import CountChartContainer from "@/components/CountChartContainer";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";

const AdminPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  return (
    <div className="p-4 gap-4 md:flex-row">
      {/* LEFT */}
      <div className="w-full flex flex-col gap-8 ">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          {/* <UserCard type="admin" /> */}
          <UserCard type="admission" />
          <UserCard type="employee" />
          <UserCard type="enrollment" />
        </div>

        {/* MIDDLE CHART */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* <FinanceChart /> */}
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>

          {/* ATTENDANCE CHART */}

          <div className="w-full lg:w-2/3 h-[450px]">
            <FinanceChart />
          </div>
        </div>

      </div>
      {/* RIGHT */}
      
    </div>
  );
};

export default AdminPage;
