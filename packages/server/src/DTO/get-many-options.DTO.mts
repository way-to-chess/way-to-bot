import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import {
  TBaseOperand,
  TCommonGetManyOptions,
  TCommonWhere,
} from "@way-to-bot/shared/api/zod/common/get-many-options.schema.js";
import {
  EOperandPredicate,
  EPredicate,
} from "@way-to-bot/shared/api/enums/index.js";

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
}
