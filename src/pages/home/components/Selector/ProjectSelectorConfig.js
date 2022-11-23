import { Utils } from "react-awesome-query-builder";
const { uuid } = Utils

export const fields = {
    disease: {
        label: 'Phenotype',
        type: 'select',
        fieldSettings: {
            listValues: null
        },
        defaultOperator: 'equal',
        widgets: {
            select: {
                operators: ['equal', 'not_equal']
            }
        }
    },
    has_healthy_controls: {
        label: 'Has healthy controls',
        widgets: {
            select: {
                operators: ['equal']
            }
        },
        type: 'select',
        fieldSettings: {
            listValues: {
                Y: 'Yes',
                N: 'No'
            }
        },
        defaultValue: 'Y'
    },
    nr_healthy_controls: {
        label: 'Number of health controls in a project',
        type: 'number'
    },
    pct_failed_runs: {
        label: 'Percent of failed runs',
        type: 'number'
    },
    nr_total_runs: {
        label: 'Number of runs of a phenotype',
        type: 'number'
    },
    nr_valid_runs: {
        label: 'Number of valid runs of a phenotype',
        type: 'number'
    },
    nr_failed_runs: {
        label: 'Number of failed runs of a phenotype',
        type: 'number'
    }
}

export const initValue = (id) => {
    return {
        type: 'group',
        id,
        children1: {
            [uuid()]: {
                type: 'rule',
                properties: {
                    field: 'disease',
                    operator: 'equal',
                    value: ['D015179'],
                    valueSrc: ['value'],
                    valueType: ['select']
                }
            },
            [uuid()]: {
                type: 'rule',
                properties: {
                    field: 'has_healthy_controls',
                    operator: 'equal',
                    value: ['Y'],
                    valueSrc: ['value'],
                    valueType: ['select']
                }
            },
            [uuid()]: {
                type: 'rule',
                properties: {
                    field: 'pct_failed_runs',
                    operator: 'less_or_equal',
                    value: [90],
                    valueSrc: ['value'],
                    valueType: ['number']
                }
            }
        }
    }
}

export const initValue1 = (id) => {
    return {
        type: 'group',
        id,
        children1: {
            [uuid()]: {
                type: 'rule',
                properties: {
                    field: 'disease',
                    value: ['D015179'],
                    valueSrc: ['value'],
                    operator: 'equal',
                    valueType: ['select']
                },
            },
            [uuid()]: {
                type: 'rule',
                properties: {
                    operator: 'equal',
                    field: 'has_healthy_controls',
                    value: ['Y'],
                    valueSrc: ['value'],
                    valueType: ['select']
                }
            }
        }
    }
}

export const initValue2 = (id) => {
    return {
        type: 'group',
        id,
        children1: {
            [uuid()]: {
                type: 'rule',
                properties: {
                    operator: 'equal',
                    field: 'disease',
                    value: ['D001714'],
                    valueSrc: ['value'],
                    valueType: ['select']
                }
            },
            [uuid()]: {
                type: 'rule',
                properties: {
                    operator: 'equal',
                    field: 'has_healthy_controls',
                    value: ['Y'],
                    valueSrc: ['value'],
                    valueType: ['select']
                }
            },
            [uuid()]: {
                type: 'rule',
                properties: {
                    field: 'pct_failed_runs',
                    operator: 'less_or_equal',
                    value: [100],
                    valueSrc: ['value'],
                    valueType: ['number']
                }
            }
        }
    }
}

export const initValue3 = (id) => {
    return {
        type: 'group',
        id,
        children1: {
            [uuid()]: {
                type: 'rule',
                properties: {
                    field: 'disease',
                    operator: 'equal',
                    value: ['D003967'],
                    valueSrc: ['value'],
                    valueType: ['select']
                }
            },
            [uuid()]: {
                type: 'rule',
                properties: {
                    field: 'nr_total_runs',
                    operator: 'greater_or_equal',
                    value: [200],
                    valueSrc: ['value'],
                    valueType: ['number']
                }
            }
        }
    }
}
