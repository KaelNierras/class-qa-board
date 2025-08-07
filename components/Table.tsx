
export interface TableColumn<T> {
    key: keyof T;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: T) => string | JSX.Element;
}

interface TableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    onSort?: (key: keyof T, order: "asc" | "desc") => void;
    sortColumn: keyof T;
    sortOrder: "asc" | "desc";
    onRowClick?: (row: T) => void;
    actions?: (row: T) => JSX.Element;
}

const Table = <T,>({ columns, data, onSort, sortColumn, sortOrder, onRowClick, actions }: TableProps<T>) => {

    const handleSort = (key: keyof T) => {
        if (onSort) {
            if (sortColumn === key) {
                onSort(key, sortOrder === "asc" ? "desc" : "asc");
            } else {
                onSort(key, "asc");
            }
        }
    }

    return (
        <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr>
                                {columns.map((col) => (
                                    <th
                                        key={col.key as string}
                                        className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                        onClick={() => col.sortable && handleSort(col.key)}
                                    >
                                        {col.label} {col.sortable && (sortColumn === col.key ? (sortOrder === "asc" ? "▲" : "▼") : "↕")}

                                    </th>
                                ))}
                                {actions && (
                                    <th className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.length > 0 ? (
                                <>
                                    {
                                        data.map((row, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-gray-100 hover:cursor-pointer"
                                                onClick={() => onRowClick && onRowClick(row)}
                                            >
                                                {columns.map((col) => (
                                                    <td key={col.key as string} className="px-3 py-4 text-sm text-gray-500">
                                                        {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                                                    </td>
                                                ))}
                                                {actions && (
                                                    <td className="px-3 py-4">
                                                        {actions(row)}
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    }
                                </>
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="px-3 py-4 text-center text-sm text-gray-500">
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};

export default Table;
