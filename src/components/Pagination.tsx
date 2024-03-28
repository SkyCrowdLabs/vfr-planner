import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

const items = [
  {
    id: 1,
    title: "Back End Developer",
    department: "Engineering",
    type: "Full-time",
    location: "Remote",
  },
  {
    id: 2,
    title: "Front End Developer",
    department: "Engineering",
    type: "Full-time",
    location: "Remote",
  },
  {
    id: 3,
    title: "User Interface Designer",
    department: "Design",
    type: "Full-time",
    location: "Remote",
  },
];

interface PaginationProps {
  indexStart: number;
  indexEnd: number;
  count: number;
  onClickNext: () => void;
  onClickPrev: () => void;
  onClickPage: (i: number) => void;
  selectedPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  indexStart,
  indexEnd,
  count,
  onClickNext,
  onClickPrev,
  onClickPage,
  selectedPage,
}) => {
  const disabledNext = selectedPage * 10 > count;
  const disabledPrev = selectedPage === 1;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-0">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={onClickPrev}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          onClick={onClickNext}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{indexStart}</span> to{" "}
            <span className="font-medium">{indexEnd}</span> of{" "}
            <span className="font-medium">{count}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={onClickPrev}
              className={clsx({
                "relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0":
                  true,
                "bg-gray-200 pointer-events-none": disabledPrev,
              })}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {Array.from({ length: Math.ceil(count / 10) }, (_, i) => i + 1).map(
              (n) => (
                <button
                  key={`page-${n}`}
                  aria-current="page"
                  onClick={() => {
                    onClickPage(n);
                  }}
                  className={clsx(
                    selectedPage === n
                      ? "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      : "relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                  )}
                >
                  {n}
                </button>
              )
            )}
            <button
              onClick={onClickNext}
              className={clsx({
                "relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0":
                  true,
                "bg-gray-200  pointer-events-none": disabledNext,
              })}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
