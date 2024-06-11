import { BaseService } from '@/services/base.service'
// import api1 from "@/services/apis/api1"
import { Table } from './table.type'
import JSONData from './test_json.json'
import api1 from '@/services/apis/api1'
// import fs from "fs"

class TablesService extends BaseService {
  Projects = 'projects'
  endpoint = ''
  tables = JSONData.tables

  async getTables(projectId: number, object_uid: string): Promise<Array<Table>> {
    // const dataArray = JSON.parse(fs.readFileSync("test_json.json", "utf-8"))
    try {
      const { data } = await api1.get(`${this.Projects}/${projectId}/data-tabulation/${object_uid}`)
      console.log(data, 'datadatadatadatadata')
      // this.tables = JSONData.tables
      //   const { data } = await api1.get(this.endpoint)

      //   return data
      // return this.addEmptyColumn(tables)
      const twiced = this.addPercentRow(data.tables)

      return this.addEmptyColumn(twiced)
    } catch (error) {
      throw error
    }
  }

  async getPercentTables(projectId: number, object_uid: string): Promise<Array<Table>> {
    // const dataArray = JSON.parse(fs.readFileSync("test_json.json", "utf-8"))
    try {
      // this.tables = JSONData.tables
      //   const { data } = await api1.get(this.endpoint)
      const { data } = await api1.get(`${this.Projects}/${projectId}/data-tabulation/${object_uid}`)

      //   return data
      // return this.addEmptyColumn(tables)

      return this.addEmptyColumnForPercentTable(data.tables)
    } catch (error) {
      throw error
    }
  }

  addEmptyColumn(tables: Array<Table>) {
    tables.forEach((table) => {
      table.rows.forEach((row, i) => {
        if (row.columns[0].group_name === '') {
          // REMOVE THIS LINE DURING PROD CODE
          row.columns.shift()
        }
        row.columns.unshift({
          group_name: '',
          name: '',
          label: '',
          value: i === 0 || i % 2 !== 0 ? row.name : '',
          value_percent: '',
          value_subscript: '',
        })
      })
    })

    return tables
  }

  addEmptyColumnForPercentTable(tables: Array<Table>) {
    tables.forEach((table) => {
      table.rows.forEach((row) => {
        if (row.columns[0].group_name === '') {
          // REMOVE THIS LINE DURING PROD CODE
          row.columns.shift()
        }
        row.columns.unshift({
          group_name: '',
          name: '',
          label: '',
          value: '',
          value_percent: row.name,
          value_subscript: '',
        })
      })
    })

    return tables
  }

  addPercentRow(tables: Array<Table>) {
    return tables.map((table) => {
      const newTable = { ...table }

      const { rows } = newTable

      const newRows = [rows[0]]

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i]
        const newRow = { ...row }

        newRow.columns = newRow.columns.map((col) => {
          return {
            ...col,
            value: col.value || col.value_percent || '',
          }
        })

        newRows.push(row)
        newRows.push(newRow)
      }

      newTable.rows = newRows

      return newTable
    })
  }
}

export { TablesService }
