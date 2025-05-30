import fs from "fs/promises";
import path from "path";

export class FileService {
  static PATH_TO_UPLOADS = process.env.PATH_TO_UPLOADS;
  /**
   * @protected
   * @type {import("./db.service.js").DbService}
   */
  _dbService;

  /**
   * @param {import("./db.service.js").DbService} dbService
   */
  constructor(dbService) {
    this._dbService = dbService;
  }

  async getAllFilesFromFs(dirPath) {
    const allEntries = await fs.readdir(
      path.join(FileService.PATH_TO_UPLOADS, dirPath ?? ""),
    );

    const files = [];
    for (const entry of allEntries) {
      const stats = await fs.stat(
        path.join(FileService.PATH_TO_UPLOADS, dirPath ?? "", entry),
      );

      if (stats.isDirectory()) {
        files.push(
          ...(await this.getAllFilesFromFs(path.join(dirPath ?? "", entry))),
        );
      } else files.push(path.join(dirPath ?? "", entry));
    }

    return files;
  }

  /**
   *
   * @param {boolean} usingFiles
   * @return {Promise<{id: number, url: string}[]>}
   */
  async getAllFilesFromDb(usingFiles) {
    const res = await this._dbService.query(
      this.sqlQueryToGetAllFilesFromDb(usingFiles),
    );
    if (res.rows.length === 0) {
      throw new Error("No generated SQL returned");
    }

    const generatedSql = res.rows[0].generated_sql;
    const filesData = await this._dbService.query(generatedSql);
    return filesData.rows;
  }

  /**
   *
   * @param {number[]} fileIds
   * @returns {Promise<number>}
   */
  async deleteFilesFromDb(fileIds) {
    const res = await this._dbService.query(
      `DELETE FROM files WHERE id IN (${fileIds.join(", ")});`,
    );
    return res.rowCount;
  }

  /**
   *
   * @param {boolean} usingFiles
   * @returns {string}
   */
  sqlQueryToGetAllFilesFromDb(usingFiles) {
    return `
WITH fks AS (
    SELECT
        ccu.table_name AS referenced_table,
        kcu.table_name AS source_table,
        kcu.column_name AS source_column,
        ROW_NUMBER() OVER (PARTITION BY kcu.table_name ORDER BY kcu.column_name) - 1 AS alias_index
    FROM
        information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
    WHERE
        tc.constraint_type = 'FOREIGN KEY'
        AND ccu.table_name = 'files'
        AND ccu.column_name = 'id'
),
joined AS (
    SELECT
        string_agg(
            'LEFT JOIN ' || source_table || ' ' || source_table || '_' || alias_index ||
            ' ON files.id = ' || source_table || '_' || alias_index || '.' || source_column,
            E'\\n'
        ) AS join_clauses,
        string_agg(
            source_table || '_' || alias_index || '.' || source_column || ' ${usingFiles ? "IS NOT NULL" : "IS NULL"}',
            ' ${usingFiles ? "OR" : "AND"} '
        ) AS where_clause
    FROM fks
)
SELECT
    'SELECT files.id, substring(files.url FROM ''uploads/(.*)$'') AS url
FROM files
' || join_clauses || '
WHERE ' || where_clause || ';' AS generated_sql
FROM joined;

`;
  }
}
