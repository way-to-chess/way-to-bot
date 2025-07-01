import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import {
  TBaseOperand,
  TCommonGetManyOptions,
  TCommonWhere,
} from "@way-to-bot/shared/api/zod/common/get-many-options.schema.js";
import { EOperandPredicate } from "@way-to-bot/shared/api/enums/EOperandPredicate.js";
import { EPredicate } from "@way-to-bot/shared/api/enums/EPredicate.js";

export class GetManyOptionsDTO<Entity extends ObjectLiteral> {
  private parameterCounter: number = 0;

  constructor(private readonly parsedQuery?: TCommonGetManyOptions) {}

  public applyToQueryBuilder(
    queryBuilder: SelectQueryBuilder<Entity>,
    alias: string,
  ) {
    if (this.parsedQuery?.where) {
      const { whereExpression, parameters } = this.buildWhereExpression(
        this.parsedQuery.where,
        alias,
      );
      queryBuilder.where(whereExpression, parameters);
    }

    if (this.parsedQuery?.sort) {
      queryBuilder.orderBy(
        `${alias}.${this.parsedQuery.sort.field}`,
        this.parsedQuery.sort.direction,
      );
    }

    if (this.parsedQuery?.pagination) {
      if (this.parsedQuery.pagination.limit) {
        queryBuilder.take(this.parsedQuery.pagination.limit);
      }
      if (this.parsedQuery.pagination.offset) {
        queryBuilder.skip(this.parsedQuery.pagination.offset);
      }
    }
  }

  private buildWhereExpression(where: TCommonWhere, alias: string) {
    const conditions: string[] = [];
    const parameters: Record<string, any> = {};

    for (const operand of where.operands) {
      if (this.isBaseOperand(operand)) {
        const { condition, parameter } = this.buildBaseCondition(
          operand,
          alias,
        );
        conditions.push(condition);
        if (parameter) {
          Object.assign(parameters, parameter);
        }
      } else {
        const { whereExpression, parameters: nestedParams } =
          this.buildWhereExpression(operand as TCommonWhere, alias);
        conditions.push(`(${whereExpression})`);
        Object.assign(parameters, nestedParams);
      }
    }

    const joinOperator = where.predicate === EPredicate.AND ? " AND " : " OR ";
    return {
      whereExpression: conditions.join(joinOperator),
      parameters,
    };
  }

  private isBaseOperand(operand: any): operand is TBaseOperand {
    return "field" in operand && "predicate" in operand && "value" in operand;
  }

  private buildBaseCondition(
    operand: TBaseOperand,
    alias: string,
  ): { condition: string; parameter?: Record<string, any> } {
    // Если field - массив, применяем токенизированный поиск
    if (Array.isArray(operand.field)) {
      return this.buildTokenizedCondition(operand, alias);
    }

    // Обычный поиск по одному полю
    const paramName = `param${this.parameterCounter++}`;
    const fieldName = `${alias}.${operand.field}`;

    switch (operand.predicate) {
      case EOperandPredicate.EQ:
        if (operand.value === null) {
          return { condition: `${fieldName} IS NULL` };
        }
        return {
          condition: `${fieldName} = :${paramName}`,
          parameter: { [paramName]: operand.value },
        };

      case EOperandPredicate.NOT_EQ:
        if (operand.value === null) {
          return { condition: `${fieldName} IS NOT NULL` };
        }
        return {
          condition: `${fieldName} != :${paramName}`,
          parameter: { [paramName]: operand.value },
        };

      case EOperandPredicate.IN:
        return {
          condition: `${fieldName} IN (:...${paramName})`,
          parameter: { [paramName]: operand.value },
        };

      case EOperandPredicate.NOT_IN:
        return {
          condition: `${fieldName} NOT IN (:...${paramName})`,
          parameter: { [paramName]: operand.value },
        };

      case EOperandPredicate.LIKE:
        return {
          condition: `${fieldName} ILIKE :${paramName}`,
          parameter: { [paramName]: `%${operand.value}%` },
        };

      default:
        throw new Error(`Unknown predicate ${operand.predicate}`);
    }
  }

  private buildTokenizedCondition(
    operand: TBaseOperand,
    alias: string,
  ): { condition: string; parameter?: Record<string, any> } {
    if (!Array.isArray(operand.field) || typeof operand.value !== "string") {
      throw new Error(
        "Tokenized search requires array of fields and string value",
      );
    }

    const fields = operand.field;
    const searchValue = operand.value;

    // Разбиваем строку на токены (убираем лишние пробелы)
    const tokens = searchValue.split(/\s+/).filter((token) => token.length > 0);

    if (tokens.length === 0) {
      return { condition: "1=1" }; // Пустой поиск - возвращаем все
    }

    const parameters: Record<string, any> = {};
    const tokenConditions: string[] = [];

    // Для каждого токена создаем условие поиска по всем полям
    tokens.forEach((token) => {
      const fieldConditions: string[] = [];

      fields.forEach((field) => {
        const paramName = `param${this.parameterCounter++}`;
        const fieldName = `${alias}.${field}`;

        // Используем тот же предикат, что и в исходном запросе
        switch (operand.predicate) {
          case EOperandPredicate.EQ:
            fieldConditions.push(`${fieldName} = :${paramName}`);
            parameters[paramName] = token;
            break;
          case EOperandPredicate.NOT_EQ:
            fieldConditions.push(`${fieldName} != :${paramName}`);
            parameters[paramName] = token;
            break;
          case EOperandPredicate.IN:
            fieldConditions.push(`${fieldName} IN (:...${paramName})`);
            parameters[paramName] = [token];
            break;
          case EOperandPredicate.NOT_IN:
            fieldConditions.push(`${fieldName} NOT IN (:...${paramName})`);
            parameters[paramName] = [token];
            break;
          case EOperandPredicate.LIKE:
            fieldConditions.push(`${fieldName} ILIKE :${paramName}`);
            parameters[paramName] = `%${token}%`;
            break;
          default:
            throw new Error(
              `Unsupported predicate for tokenized search: ${operand.predicate}`,
            );
        }
      });

      // Токен должен найтись хотя бы в одном из полей
      tokenConditions.push(`(${fieldConditions.join(" OR ")})`);
    });

    // Все токены должны найтись (объединяем через AND)
    return {
      condition: tokenConditions.join(" AND "),
      parameter: parameters,
    };
  }
}
