import {FormItemProps} from "antd";

const REQUIRED_RULE: FormItemProps["rules"] = [{required: true, message: "Обязательное поле"}];


const withRequiredRule = (...otherRules: Required<Pick<FormItemProps, "rules">>["rules"]) => {
    return otherRules.length === 0 ? REQUIRED_RULE : [...REQUIRED_RULE, ...otherRules];
}

export {withRequiredRule, REQUIRED_RULE}