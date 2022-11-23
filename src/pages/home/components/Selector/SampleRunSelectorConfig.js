import { Utils } from "react-awesome-query-builder";
const { uuid } = Utils

export const fields = {
    disease: {
        label: 'Phenotype',
        type: 'select',
        fieldSettings: {
            listValues: {}
        },
        defaultOperator: 'equal',
        widgets: {
            select: {
                operators: ['equal', 'not_equal']
            }
        }
    },
    experiment_type: {
        label: 'Experiment Type',
        type: 'select',
        widgets: {
            select: {
                operators: ['equal']
            }
        },
        fieldSettings: {
            listValues: {
                Amplicon: 'Amplicon',
                Metagenomics: 'Metagenomics'
            }
        },
        defaultValue: 'Amplicon'
    },
    QCStatus: {
        label: 'QC Status',
        widgets: {
            select: {
                operators: ['equal']
            }
        },
        type: 'select',
        fieldSettings: {
            listValues: {
                0: 'Failed runs',
                1: 'Good runs'
            }
        },
        defaultValue: '0'
    },
    nr_reads_sequenced: {
        label: 'Nr. of sequenced reads',
        operators: ['greater', 'greater_or_equal'],
        type: 'number',
        defaultOperator: 'greater'
    },
    country: {
        label: 'Country',
        type: 'select',
        fieldSettings: {
            listValues: {
                "Australia": "Australia",
                "Austria": "Austria",
                "Azerbaijan": "Azerbaijan",
                "Bangladesh": "Bangladesh",
                "Belgium": "Belgium",
                "Brazil": "Brazil",
                "Canada": "Canada",
                "China": "China",
                "Croatia": "Croatia",
                "Czech Republic": "Czech Republic",
                "Denmark": "Denmark",
                "Egypt": "Egypt",
                "Estonia": "Estonia",
                "Finland": "Finland",
                "France": "France",
                "Gambia": "Gambia",
                "Germany": "Germany",
                "Greece": "Greece",
                "Guatemala": "Guatemala",
                "Hong Kong": "Hong Kong",
                "Hungary": "Hungary",
                "Iceland": "Iceland",
                "India": "India",
                "Ireland": "Ireland",
                "Isle of Man": "Isle of Man",
                "Italy": "Italy",
                "Japan": "Japan",
                "Jersey": "Jersey",
                "Jordan": "Jordan",
                "Kenya": "Kenya",
                "Korea, Republic of": "Korea, Republic of",
                "Latvia": "Latvia",
                "Luxembourg": "Luxembourg",
                "Malawi": "Malawi",
                "Mali": "Mali",
                "Mexico": "Mexico",
                "Morocco": "Morocco",
                "Netherlands": "Netherlands",
                "New Zealand": "New Zealand",
                "Nigeria": "Nigeria",
                "Norway": "Norway",
                "Not provided": "Not provided",
                "Oman": "Oman",
                "Poland": "Poland",
                "Portugal": "Portugal",
                "Puerto Rico": "Puerto Rico",
                "Romania": "Romania",
                "Russian Federation": "Russian Federation",
                "Serbia": "Serbia",
                "Singapore": "Singapore",
                "Slovakia": "Slovakia",
                "South Africa": "South Africa",
                "Spain": "Spain",
                "Sudan": "Sudan",
                "Sweden": "Sweden",
                "Switzerland": "Switzerland",
                "Tanzania, United Republic of": "Tanzania, United Republic of",
                "Thailand": "Thailand",
                "Turkey": "Turkey",
                "United Arab Emirates": "United Arab Emirates",
                "United Kingdom": "United Kingdom",
                "United Kingdom of Great Britain and Northern Irela": "United Kingdom of Great Britain and Northern Irela",
                "United States Minor Outlying Islands": "United States Minor Outlying Islands",
                "United States of America": "United States of America",
                "Unspecified": "Unspecified",
                "Yugoslavia": "Yugoslavia"
            }
        },
        defaultOperator: 'equal',
        widgets: {
            select: {
                operators: ['equal', 'not_equal', 'select_any_in', "select_not_any_in", 'is_null', 'is_not_null']
            }
        },
        defaultValue: 'Australia'
    },
    sex: {
        label: 'Gender',
        widgets: {
            select: {
                operators: ['equal']
            }
        },
        type: 'select',
        fieldSettings: {
            listValues: {
                Male: 'Male',
                Female: 'Female'
            }
        },
        defaultValue: 'Male'
    },
    host_age: {
        label: 'Age',
        type: 'number'
    },
    BMI: {
        label: 'BMI',
        type: 'number'
    },
    nr_diseases: {
        label: 'Nr. of associated phenotypes',
        type: 'number'
    },
    'Recent.Antibiotics.Use': {
        label: 'Recent Antibiotics Use',
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
                    value: ['D006262'],
                    valueSrc: ['value'],
                    valueType: ['select']
                }
            },
            [uuid()]: {
                type: 'group',
                properties: {
                    conjunction: 'AND',
                    not: false
                },
                children1: {
                    [uuid()]: {
                        type: 'rule',
                        properties: {
                            field: 'host_age',
                            operator: 'between',
                            value: [18, 25],
                            valueSrc: ['value', 'value'],
                            valueType: ['number', 'number']
                        }
                    },
                    [uuid()]: {
                        type: 'rule',
                        properties: {
                            field: 'BMI',
                            operator: 'between',
                            value: [18.5, 24.9],
                            valueSrc: ['value', 'value'],
                            valueType: ['number', 'number']
                        }
                    }
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
                    operator: 'equal',
                    value: ['D006262'],
                    valueSrc: ['value'],
                    valueType: ['select']
                }
            },
            [uuid()]: {
                type: 'rule',
                properties: {
                    field: 'BMI',
                    operator: 'between',
                    value: [18.5, 24.9],
                    valueSrc: ['value', 'value'],
                    valueType: ['number', 'number']
                }
            }
        },
        "properties": {
            "conjunction": "AND",
            "not": false
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
                    field: 'disease',
                    operator: 'equal',
                    value: ['D006262'],
                    valueSrc: ['value'],
                    valueType: ['select']
                }
            }
        },
        "properties": {
            "conjunction": "AND",
            "not": false
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
                    field: 'country',
                    operator: 'equal',
                    value: ['United States of America'],
                    valueSrc: ['value'],
                    valueType: ['select']
                }
            },
            [uuid()]: {
                type: 'rule',
                properties: {
                    field: 'Recent.Antibiotics.Use',
                    operator: 'equal',
                    value: ['N'],
                    valueSrc: ['value'],
                    valueType: ['select']
                }
            }
        },
        "properties": {
            "conjunction": "AND",
            "not": false
        }
    }
}
