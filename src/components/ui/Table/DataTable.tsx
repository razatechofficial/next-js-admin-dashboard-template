import React, {
  useState,
  useEffect,
  useTransition,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  BiChevronLeft,
  BiChevronRight,
  BiDownload,
  BiEdit,
  BiPlus,
  BiRefresh,
  BiSearch,
  BiTrash,
} from "react-icons/bi";

import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa6";

export interface BaseTableData {
  id: string | number;
  [key: string]: string | number | boolean | null | undefined;
}

export interface DataTableRef {
  refresh: () => Promise<void>;
}
// Column definition type
export type ColumnDefinition<T> = {
  key: keyof T;
  label: string;
  sortable?: boolean;
  customClassName?: string;
  renderCell?: (row: T) => React.ReactNode;
};

// DataTable props type
type DataTableProps<T extends BaseTableData> = {
  columns: ColumnDefinition<T>[];
  fetchData: (params: DataTableParams) => Promise<{
    data: T[];
    totalPages: number;
    range: string;
  }>;
  onRowClick?: (row: T) => void;
  // onRowSelect?: (selectedRows: T[]) => void;
  tableTitle?: string;
  enableDelete?: boolean;
  enableExport?: boolean;
  enableSearch?: boolean;
  enablePagination?: boolean;
  pageSizeOptions?: number[];
  addNewButton?: {
    label: string;
    onClick: () => void;
  };
  editButton?: {
    label: string;
    onClick: () => void;
  };
  rowClassName?: (row: T) => string;
};

// Parameters for data fetching
export type DataTableParams = {
  pageSize: number;
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
};

// export const DataTable = forwardRef(
//   function DataTable<T extends BaseTableData>(
//     {

// export const DataTable = forwardRef<DataTableRef, DataTableProps<any>>(
//   function DataTable<T extends BaseTableData>(
//     {

export const DataTable = forwardRef(
  <T extends BaseTableData>(
    {
      // export const DataTable = forwardRef(function DataTable<T extends BaseTableData>(
      //   {
      columns,
      fetchData,
      onRowClick,
      // onRowSelect,
      enableDelete = false,
      enableExport = false,
      enableSearch = false,
      enablePagination = false,
      tableTitle = "Data Table",
      pageSizeOptions = [5, 10, 25, 50, 100],
      addNewButton,
      editButton,
      rowClassName,
    }: DataTableProps<T>,
    ref: React.ForwardedRef<DataTableRef>
  ) => {
    const [data, setData] = useState<T[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(pageSizeOptions[1]);
    const [totalPages, setTotalPages] = useState(0);
    const [range, setRange] = useState("");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<string>(columns[0].key as string);
    const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
    const [loading, setLoading] = useState(false);
    const [isPending, startTransition] = useTransition();
    // const [selectedRows, setSelectedRows] = useState<T[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadData = useCallback(
      async (isRefresh = false) => {
        // Add check to prevent unnecessary fetches
        if ((!loading && !isPending) || isRefresh) {
          setLoading(true);
          if (isRefresh) {
            setIsRefreshing(true);
          }

          try {
            const result = await fetchData({
              page,
              limit,
              search,
              sortBy,
              sortOrder,
              pageSize: 0,
            });

            setData(result.data);
            setTotalPages(result.totalPages);
            setRange(result.range);
          } catch (error) {
            console.error("Error fetching data:", error);
          } finally {
            setIsRefreshing(false);
            setLoading(false);
          }
        }
      },
      [page, limit, search, sortBy, sortOrder, fetchData, loading, isPending]
    );

    // Modify the useEffect to only run when necessary data-related props change
    useEffect(() => {
      const debounceTimer = setTimeout(
        () => {
          startTransition(loadData);
        },
        search ? 500 : 0
      ); // Add debounce for search

      return () => clearTimeout(debounceTimer);
    }, [page, limit, search, sortBy, sortOrder]); // Remove loadData from dependencies

    const refreshData = useCallback(() => {
      return loadData(true);
    }, [loadData]);

    const handleRefreshClick = () => {
      refreshData();
    };

    useImperativeHandle(ref, () => ({
      refresh: () => loadData(true),
    }));

    const handleSort = (columnKey: string) => {
      if (columnKey === sortBy) {
        setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
      } else {
        setSortBy(columnKey);
        setSortOrder("ASC");
      }
    };

    // const toggleRowSelection = (row: T) => {
    //   setSelectedRows((prev) =>
    //     prev.includes(row) ? prev.filter((r) => r !== row) : [...prev, row]
    //   );
    // };

    // const toggleRowSelection = (row: T) => {
    //   const newSelectedRows = selectedRows.includes(row)
    //     ? selectedRows.filter((r) => r.id !== row.id)
    //     : [...selectedRows, row];
    //   setSelectedRows(newSelectedRows);
    //   onRowSelect?.(newSelectedRows); // Call the selection callback if provided
    // };

    const skeletonRows = Array.from({ length: limit }).map((_, index) => (
      <tr key={index} className="animate-pulse">
        {columns.map((col, colIndex) => (
          <td key={colIndex} className="px-6 py-4">
            <div
              className={`h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-2 animate-pulse w-auto ${col.customClassName}`}
            />
          </td>
        ))}
      </tr>
    ));

    return (
      <div className="w-full">
        {/* Header Section */}
        {/* <div className="px-2 py-2 md:py-4 bg-slate-300 dark:bg-gray-700">
        <div className="sm:flex items-center justify-between">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800 dark:text-gray-200">
            {tableTitle}
          </p>

          {addNewButton && (
            <div>
              <button
                onClick={addNewButton.onClick}
                className="inline-flex sm:ml-3 mt-4 sm:mt-0 items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:outline-none rounded-md"
              >
                <BiPlus className="mr-2 w-4 h-4 text-slate-100" />
                <span className="text-white">{addNewButton.label}</span>
              </button>
            </div>
          )}
        </div>
      </div> */}

        <div className="px-4 py-2 md:py-4 bg-slate-300 dark:bg-gray-700">
          <div className="sm:flex sm:flex-wrap items-center justify-between gap-4">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800 dark:text-gray-200">
              {tableTitle}
            </p>

            <div className="flex flex-wrap gap-3 sm:mt-0 mt-4">
              {editButton && (
                <button
                  onClick={editButton.onClick}
                  className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 focus:outline-none rounded-md"
                >
                  <BiEdit className="mr-2 w-4 h-4 text-slate-100" />
                  <span className="text-white">{editButton.label}</span>
                </button>
              )}
              {addNewButton && (
                <button
                  onClick={addNewButton.onClick}
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:outline-none rounded-md"
                >
                  <BiPlus className="mr-2 w-4 h-4 text-slate-100" />
                  <span className="text-white">{addNewButton.label}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search and Actions Section */}
        {enableDelete || enableExport || enablePagination || enableSearch ? (
          <div className="px-2 py-3 md:py-4 bg-gray-100 dark:bg-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Delete option */}
                {enableDelete && (
                  <button
                    onClick={() => {
                      /* Implement delete logic */
                    }}
                    className="flex items-center px-2 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-sm focus:outline-none"
                  >
                    <BiTrash
                      size={27}
                      className=" text-gray-700 dark:text-gray-300"
                    />
                  </button>
                )}
                {/* Export Option */}
                {enableExport && (
                  <button
                    onClick={() => {
                      /* Implement export logic */
                    }}
                    className="flex items-center px-2 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-sm focus:outline-none"
                  >
                    <BiDownload
                      size={27}
                      className=" text-gray-700 dark:text-gray-300"
                    />
                  </button>
                )}
                {/* Refresh Button  */}
                <button
                  onClick={handleRefreshClick}
                  disabled={loading || isRefreshing}
                  className={`flex items-center px-2 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-sm focus:outline-none  ${
                    loading || isRefreshing ? "opacity-50 cursor-wait" : ""
                  }`}
                >
                  <BiRefresh
                    size={27}
                    className={` text-gray-700 dark:text-gray-300 ${
                      isRefreshing ? "animate-spin" : ""
                    } `}
                  />
                </button>

                {/* Pagination - Items per page option */}
                {enablePagination && (
                  <div>
                    <select
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                      }}
                      className="px-4 py-2 cursor-pointer border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none"
                    >
                      {pageSizeOptions.map((option) => (
                        <option key={option} value={option}>
                          Show {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              {/* Searching option */}
              {enableSearch && (
                <div className="mt-4 sm:mt-0 sm:w-1/3">
                  <div className="relative">
                    <BiSearch className="absolute w-5 h-5 top-2.5 left-3 text-gray-500" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-indigo-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // if no options are enabled, add the border between heading and table header to seperate the sections
          <div className="border-t-2 border-slate-300 dark:border-slate-400"></div>
        )}

        {/* Table Section */}
        <div className="overflow-x-auto hide-scroll-bar">
          <div className="max-h-[30rem] min-h-[18rem] overflow-y-auto hide-scroll-bar">
            <table className="min-w-full table-auto">
              <thead className="sticky top-0 bg-gray-200 dark:bg-slate-700 z-10 shadow-md">
                <tr>
                  {/* Row select checkbox Column */}
                  {/* {enableDelete && (
                  <th className="px-4 py-3 text-left border-b border-gray-300">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows(data);
                        } else {
                          setSelectedRows([]);
                        }
                        onRowSelect?.(selectedRows);
                      }}
                      checked={
                        selectedRows.length === data.length && data.length > 0
                      }
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    />
                  </th>
                )} */}
                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
                      onClick={() =>
                        column.sortable && handleSort(String(column.key))
                      }
                      className={`px-4 py-3 text-left border-b border-gray-300 text-gray-700 dark:text-gray-300 ${
                        column.sortable ? "cursor-pointer" : ""
                      }`}
                    >
                      {/* Column label and sorting */}
                      <div className="flex items-center gap-2">
                        {column.label}
                        {column.sortable && (
                          <div className="text-gray-500 dark:text-gray-400">
                            {sortBy === column.key ? (
                              sortOrder === "ASC" ? (
                                <FaSortUp className="w-4 h-4 text-black dark:text-white" />
                              ) : (
                                <FaSortDown className="w-4 h-4 text-black dark:text-white" />
                              )
                            ) : (
                              <FaSort className="w-4 h-4 opacity-50" />
                            )}
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-gray-50 dark:bg-slate-800">
                {loading || isPending
                  ? skeletonRows
                  : data.map((row) => (
                      <tr
                        className={`border-b border-gray-300 dark:border-gray-600 px-4 py-3 text-sm hover:cursor-pointer hover:shadow-md hover:shadow-gray-300 dark:hover:shadow-md dark:hover:shadow-gray-700 hover:scale-[1.0001] transition-all duration-300 ease-in-out ${
                          rowClassName ? rowClassName(row) : ""
                        }`}
                        key={JSON.stringify(row)}
                        onClick={() => onRowClick && onRowClick(row)}
                      >
                        {/* Row select checkbox Cell */}
                        {/* {enableDelete && (
                        <td 
                          className="px-4 py-3"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedRows.some((selectedRow) => selectedRow.id === row.id)}
                            onChange={(e) => {
                              toggleRowSelection(row);
                            }}
                            className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                          />
                        </td>
                      )} */}
                        {columns.map((column) => (
                          <td
                            key={String(column.key)}
                            className={`px-4 py-3 text-gray-700 dark:text-gray-300 ${column.customClassName}`}
                          >
                            {column.renderCell
                              ? column.renderCell(row)
                              : String(row[column.key])}
                          </td>
                        ))}
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Section */}
        {enablePagination && (
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-4 py-2">
            <div className="text-sm">
              <p>{range}</p>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="px-1 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
              >
                <BiChevronLeft />
              </button>
              <button
                onClick={() => setPage(page > 1 ? page - 1 : 1)}
                disabled={page === 1}
                className="px-1 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
              >
                <BiChevronLeft />
              </button>

              {/* Pagination number rendering logic */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (p === 1 || p === totalPages) return true;
                  if (Math.abs(p - page) <= 2) return true;
                  return false;
                })
                .map((p, index, array) => {
                  const isDots =
                    index > 0 &&
                    index < array.length - 1 &&
                    Math.abs(array[index - 1] - p) > 1;

                  return isDots ? (
                    <span
                      key={`dots-${index}`}
                      className="px-2 py-1 text-gray-600 dark:text-gray-400 text-center"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-2 py-1 rounded ${
                        p === page
                          ? "bg-blue-700 text-white"
                          : "bg-gray-300 text-gray-800 hover:bg-blue-500 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}

              <button
                onClick={() =>
                  setPage(page < totalPages ? page + 1 : totalPages)
                }
                disabled={page === totalPages}
                className="px-1 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
              >
                <BiChevronRight />
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="px-1 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
              >
                <BiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
) as <T extends BaseTableData>(
  props: DataTableProps<T> & { ref?: React.ForwardedRef<DataTableRef> }
) => React.ReactElement;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
DataTable.displayName = "DataTable";

export default DataTable;
