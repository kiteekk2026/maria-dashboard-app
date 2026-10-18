import { generateYAxis } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue } from '@/app/lib/data';


// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

export default async function RevenueChart() {
  const revenue = await fetchRevenue();
  
  const chartHeight = 350;

  const { yAxisLabels, topLabel } = generateYAxis(revenue);

  if (!revenue || revenue.length === 0) {
   return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Recent Revenue
      </h2>

      {<div className="rounded-xl bg-gray-50 p-4">
        <div
          className="mt-0 grid items-end gap-1 rounded-md bg-white p-3 sm:gap-2 md:gap-4 md:p-4"
          style={{
          gridTemplateColumns: 'minmax(28px, 1.5fr) repeat(12, minmax(0, 1fr))',
          }}
        >
        <div
          className="mb-10 flex flex-col justify-between whitespace-nowrap text-[10px] text-gray-400 sm:mb-10 sm:text-sm"
          style={{ height: `${chartHeight}px` }}
        >
          {yAxisLabels.map((label) => (
           <p key={label}>{label}</p>
          ))}
        </div>

          {revenue.map((month, index) => (
            <div
              key={month.month}
              className="flex min-w-0 flex-col items-center"
            >
              <div
                className="flex w-full items-end"
                style={{ height: `${chartHeight}px` }}
              >
                <div
                  className="w-full rounded-md bg-blue-300"
                  style={{
                    height: `${(chartHeight / topLabel) * month.revenue}px`,
                  }}
                />
              </div>

              <p
                className={`mt-2 h-10 text-center text-xs leading-4 text-gray-400 sm:text-sm ${
                  index === 0 || index === 3 || index === 6 || index === 11
                    ? ''
                    : 'invisible sm:visible'
                }`}
              >
                {month.month}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3>
        </div>
      </div> }
    </div>
  );
}