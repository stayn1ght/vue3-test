import { toRefs } from 'vue'
import React, {useState, useCallback, useEffect} from "react";
import {Query, Builder, Utils as QbUtils} from "react-awesome-query-builder";
import MaterialConfig from 'react-awesome-query-builder/lib/config/material';

import "react-awesome-query-builder/lib/css/styles.css";

import Button from '@material-ui/core/Button'

// Choose your skin (ant/material/vanilla):
const InitialConfig = MaterialConfig; // or MaterialConfig or MuiConfig or BootstrapConfig or BasicConfig

import {injectPropsFromWrapper} from 'veaury'
import useHomeData from "../../../../hooks/homeData";

// You need to provide your own config. See below 'Config format'
const config = {
    ...InitialConfig
};

function VueInjectionHookInSetupMode(vueProps) {
    const {phenotype} = useHomeData()
    return {
        phenotype: toRefs(phenotype)
    }
}

export default injectPropsFromWrapper(VueInjectionHookInSetupMode, (props) => {
    const { search, fields, initValue, initValue1, initValue2, initValue3 } = props
    config.fields = fields
    const [state, setState] = useState({
        config: config
    });
    const [query, setQuery] = useState('')
    useEffect(() => {
        const obj = JSON.stringify(props.phenotype)
        if (obj !== '{}') {
            config.fields.disease.fieldSettings.listValues = JSON.parse(obj)
            const tree = QbUtils.checkTree(QbUtils.loadTree(initValue(QbUtils.uuid())), config)
            setState(prevState => {
                return {...prevState, tree, config}
            })
        }
    }, [props.phenotype])

    const onChange = useCallback((immutableTree, config) => {
        const q = QbUtils.sqlFormat(immutableTree, config)
        if (!q) return
        setQuery(q.substring(1, q.length - 1))
        setState(prevState => {
            return {...prevState, tree: immutableTree}
        });
    }, []);

    const renderBuilder = useCallback((props) => (
        <div className="query-builder-container" style={{padding: " 0 10px 0"}}>
            <div className="query-builder qb-lite" style={{marginTop: '0.5rem'}}>
                <Builder {...props} />
            </div>
        </div>
    ), []);

    const changeExample = (initValue) => {
        setState(prevState => {
            return {
                ...prevState,
                tree: QbUtils.checkTree(QbUtils.loadTree(initValue), state.config)
            }
        })
    }
    const emitQuery = () => {
        search(query)
    }

    return (
        <div>
            <p className="px-10px pt-20px ml-1rem">Examples:&nbsp;
                <a className="text-underline cursor-pointer text-blue-400" onClick={() => changeExample(initValue1(QbUtils.uuid()))}>#1,</a>&nbsp;
                <a className="text-underline cursor-pointer text-blue-400" onClick={() => changeExample(initValue2(QbUtils.uuid()))}>#2,</a>&nbsp;
                <a className="text-underline cursor-pointer text-blue-400" onClick={() => changeExample(initValue3(QbUtils.uuid()))}>#3</a>
            </p>
            <Query
                {...config}
                value={state.tree}
                onChange={onChange}
                renderBuilder={renderBuilder}
            />
            <div className="query-builder-result px-10px pb-20px ml-1rem">
                <Button variant="contained" size="small" color="primary" onClick={() => emitQuery()}>
                    SEARCH
                </Button>
            <span className="ml-10px">Query logic: <span className="text-red-600 bg-red-100/30">{query}</span></span>
            </div>
        </div>
    );
})