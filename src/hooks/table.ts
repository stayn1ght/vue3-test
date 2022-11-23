import {Ref} from "vue";
import {ReactiveVariable} from "vue/macros";

declare interface Table<T> {
    data: T[]
    total: number
    page: number
    limit: number
    keywords: string
    totalData: T[]
    except: boolean
}

export const useTableTools = <T>(allTableData: Ref<T[]>, table: Table<T>, expandedRowKey?: Ref<any[]> | null, map?: any, searchForm?: ReactiveVariable<any>) => {
    const searchTable = () => {
        if (expandedRowKey) {
            expandedRowKey.value = []
        }
        if (searchForm) {
            for (let k in searchForm) searchForm[k] = ''
        }
        table.page = 1
        table.totalData = allTableData.value?.filter((item: T) => {
            const keywords = table.keywords.toLowerCase()
            const itemStr = JSON.stringify(item).toLowerCase()
            if (!table.except)
                return itemStr.indexOf(keywords) !== -1
            else
                return itemStr.indexOf(keywords) === -1
        }) as T[]
        table.total = table.totalData?.length || 0
        getTableData()
    }
    const refreshSearch = () => {
        table.keywords = ''
        table.except = false
        searchTable()
    }
    const changePage = (data: any) => {
        table.page = data.currentPage
        table.limit = data.pageSize
        getTableData()
    }
    const getTableData = () => {
        table.data = table.totalData.slice((table.page - 1) * table.limit, table.page * table.limit)
    }
    const handleSortChange = ({ prop, order }: any) => {
        let k = prop
        if (map) k = map[prop]
        // @ts-ignore
        if (typeof table.totalData[0][k] === 'number') {
            table.totalData.sort((a: T, b: T) => {
                if (order === 'descending') {
                    // @ts-ignore
                    return b[k] - a[k]
                }
                else {
                    // @ts-ignore
                    return a[k] - b[k]
                }
            })
        }
        // @ts-ignore
        else if (typeof table.totalData[0][k] === 'string') {
            table.totalData.sort((a: T, b: T) => {
                if (order === 'descending') { // @ts-ignore
                    return b[k] > a[k] ? 1: -1
                }
                else { // @ts-ignore
                    return a[k] > b[k] ? 1: -1
                }
            })
        }
        getTableData()
    }

    return {
        searchTable,
        refreshSearch,
        changePage,
        getTableData,
        handleSortChange
    }
}
