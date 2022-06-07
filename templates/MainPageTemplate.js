import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Container, Segment, Tab, Button, Label, Popup, Dropdown, Form, Input } from 'semantic-ui-react';
import browserHistory from '../../../utils/history';
import ReactTableWrapper from '../../../utils/ReactTableWrapper';
import { Link } from 'react-router-dom';
import { centerH, option, multiOption, optioner, input, dateSelector, action } from './helper';
import { moneyFormat } from '../../../utils/helpers';
import './style.css';
import moment from 'moment';
require('moment/locale/ru');

const MainPage = props => {
    const { intl: { messages } } = props;

    console.log('7777', props.list)
    const initialFilterParameters = props.filterBy.reduce((obj, filterItem)=>{
        switch (filterItem.type){
            case 'option':      return {...obj, [filterItem.accessor]: []};
            case 'multiOption': return {...obj, [filterItem.accessor]: []};
            case 'dateFrom':    return {...obj, [filterItem.accessor]: {...obj[filterItem.accessor], dateFrom: ''}};
            case 'dateTo':      return {...obj, [filterItem.accessor]: {...obj[filterItem.accessor], dateTo: ''}};
            default:            return {...obj, [filterItem.accessor]: ''};
        }
    }, {})

    const [state, setState] = useState({
        activePane: 0,
        filterBy: initialFilterParameters,
        list: []
    })

    useEffect(() => {
        setState({...state, list: props.list?.filter(item=>item.statusId===state.activePane+1)})
    }, [props.list]);
/*
.map(item=>({
                id: item.id,
                regNumber: item.regNumber,
                bukrs: item.bukrs,
                toWerks: item.toWerks,
                fromWerks: item.fromWerks,
                typeId: item.typeId,
                invoiceDate: item.invoiceDate,
                createdAt: stringToMomentYYYYMMDDHHMM(item?.createdAt),
                note: item.note,
                statusId: item.statusId,
                contractNumber: item.contractNumber,
                serviceNumber: item.serviceNumber,
                bukrsName: item.bukrsName,
                toWerksName: item.toWerksName,
                fromWerksName: item.fromWerksName,
                statusName: item.statusName,
                responsibleName: item.responsibleName
            }))
 */
    // // item?.id?.includes(state.filterBy.id) &&
    // (state.filterBy.regNumber.length? `${item.regNumber}`.includes(state.filterBy.regNumber) : true) &&
    // // item?.bukrs?.includes(state.filterBy.bukrs) &&
    // // item?.toWerks?.includes(state.filterBy.toWerks) &&
    // // item?.fromWerks?.includes(state.filterBy.fromWerks) &&
    // // item?.typeId?.includes(state.filterBy.typeId) &&
    // // item?.invoiceDate?.includes(state.filterBy.invoiceDate) &&
    // (state.filterBy[accessor].dateFrom.length? (stringToMomentYYYYMMDDHHMM(item?.createdAt) >= stringToMomentDDMMYYYY(state.filterBy[accessor].dateFrom)) : true) &&
    // (state.filterBy[accessor].dateTo.length? (stringToMomentYYYYMMDDHHMM(item?.createdAt) <= stringToMomentDDMMYYYY(state.filterBy[accessor].dateTo)) : true) &&
    // (state.filterBy.note? item.note.includes(state.filterBy.note) || !item.note : true)
    // // item?.statusId === state.filterBy.statusId &&
    // // item?.contractNumber?.includes(state.filterBy.contractNumber) &&
    // // item?.serviceNumber?.includes(state.filterBy.serviceNumber) &&
    // // item?.bukrsName?.includes(state.filterBy.bukrsName) &&
    // // item?.toWerksName?.includes(state.filterBy.toWerksName) &&
    // (state.filterBy.fromWerksName.length? state.filterBy.fromWerksName.includes(item.fromWerksName) : true) &&
    // // (state.filterBy.statusName.length? state.filterBy.statusName.includes(item.statusName) : true) //&&
    // item?.responsibleName?.includes(state.filterBy.responsibleName)

    useEffect(() => {
        setState({...state, list: props.list?.filter(item=> {
                return Object.keys(state.filterBy).reduce((boolean, key) => {
                    const parameter = props.filterBy.find(item => key === item.accessor);
                    switch (parameter.type) {
                        case 'option':
                            return state.filterBy[key].length
                                ? boolean && state.filterBy[key].includes(item?.[parameter.accessor]) : true;
                        case 'multiOption':
                            return state.filterBy[key].length
                                ? boolean && state.filterBy[key].includes(item?.[parameter.accessor]) : true;
                        case 'dateFrom':
                            return `${state.filterBy[key].dateFrom}`.length
                                ? boolean && (item?.[parameter.accessor] >= state.filterBy[key].dateFrom)
                                && (item?.[parameter.accessor] <= state.filterBy[key].dateTo) : true;
                        case 'dateTo':
                            return `${state.filterBy[key].dateTo}`.length
                                ? boolean && (item?.[parameter.accessor] <= state.filterBy[key].dateTo)
                                && (item?.[parameter.accessor] >= state.filterBy[key].dateFrom) : true;
                        // case 'input':
                        //     console.log('boolean: ', boolean)
                        //     console.log('parameter.accessor: ', parameter.accessor)
                        //     console.log('key: ', key)
                        //     console.log('state.filterBy[key].length: ', state.filterBy[key].length)
                        //     console.log('state.filterBy[key].includes(item?.[parameter.accessor]): ',
                        //         boolean && `${item[parameter.accessor]}`.includes(`${state.filterBy[key]}`))
                        //     console.log('item[parameter.accessor]', `${item[parameter.accessor]}`)
                        //     console.log('state.filterBy[key]', `${state.filterBy[key]}`)
                        //     return state.filterBy[key].length
                        //         ? boolean && (`${item[parameter.accessor]}`.includes(`${state.filterBy[key]}`)) : true;
                        default: return boolean;
                    }
                }, true)
            }).filter(item=>item.statusId===state.activePane+1)})
    }, [state.filterBy, state.activePane]);

    console.log('new list:', props.list?.filter(item=>item.statusId===state.activePane+1).filter(item=> {
                return Object.keys(state.filterBy).reduce((boolean, key) => {
                    switch (props.filterBy.find(item=>key===item.accessor).type) {
                        case 'option':
                            return state.filterBy[key].length
                                ? boolean && state.filterBy[key].includes(item[key]) : true;
                        case 'multiOption':
                            console.log('parameter.type', key)
                            console.log('state.filterBy[key]', state.filterBy[key])
                            console.log('item?.[parameter.accessor]', item[key])
                            return state.filterBy[key].length
                                ? boolean && (state.filterBy[key].includes(item[key])) : true;
                        case 'dateFrom':
                            return `${state.filterBy[key].dateFrom}`.length
                                ? boolean && (item[key] >= state.filterBy[key].dateFrom)
                                && (item[key] <= state.filterBy[key].dateTo) : true;
                        case 'dateTo':
                            return `${state.filterBy[key].dateTo}`.length
                                ? boolean && (item[key] <= state.filterBy[key].dateTo)
                                && (item[key] >= state.filterBy[key].dateFrom) : true;
                        // default:
                        //     console.log('boolean: ', boolean)
                        //     console.log('parameter.accessor: ', parameter.accessor)
                        //     console.log('key: ', key)
                        //     console.log('state.filterBy[key].length: ', state.filterBy[key].length)
                        //     console.log('state.filterBy[key].includes(item?.[parameter.accessor]): ',
                        //         boolean && `${item[parameter.accessor]}`.includes(`${state.filterBy[key]}`))
                        //     console.log('item[parameter.accessor]', `${item[parameter.accessor]}`)
                        //     console.log('state.filterBy[key]', `${state.filterBy[key]}`)
                        //     return state.filterBy[key].length
                        //         ? boolean && (`${item[parameter.accessor]}`.includes(`${state.filterBy[key]}`)) : true;
                        default: return boolean;
                    }}, true)}));
    const pane = name => ({
        menuItem: name,
        render: () => (
            <Tab.Pane attached={false}>
                <Segment>
                    <Form>
                        <Form.Group widths="equal">
                            {props.filterBy.map((element)=>(
                                <Form.Field key={`${element.title}|${element.accessor}|${element.type}`}>
                                    <label>{element.title}</label>
                                    {action('displayFilter', element, state, setState, props)}
                                </Form.Field>
                            ))}
                            <Form.Field>
                                <label>{'Очистить'}</label>
                                <Button
                                    color="red"
                                    fluid
                                    onClick={() => setState({...state, filterBy: initialFilterParameters})}
                                >
                                    {'Очистить фильтр'}
                                </Button>
                            </Form.Field>
                        </Form.Group>
                    </Form>
                </Segment>
                <Segment className="flexSpaceBetween">
                    <h5>Всего: {moneyFormat(state.list?.length)}</h5>
                    <Link
                        to={`/logistics/mainoperation/${props.transaction?.name}/document?action=create`}
                    >
                        <Button color="green">
                            Добавить
                        </Button>
                    </Link>
                </Segment>
                <ReactTableWrapper
                    data={state.list}
                    columns={props.columns}
                    previousText={messages['Table.Previous']}
                    nextText={messages['Table.Next']}
                    showPagination={true}
                    className="-striped -highlight"
                    defaultPageSize={15}
                    pageSizeOptions={[10, 20, 30, 40]}
                    loadingText={messages['Table.Next']}
                    noDataText={messages['Table.NoData']}
                    rowsText={messages['Table.Rows']}
                    pageText={messages['Table.Page']}
                    ofText={messages['Table.Of']}
                />
            </Tab.Pane>
        ),
    });

    const panes = [pane('Новые'), pane('Закрытые')];

    // console.log('mainPage template state: ', state)
    // console.log('mainPage template props: ', props)
    return (
        <Container
            fluid
            style={{
                marginTop: '2em',
                marginBottom: '2em',
                paddingLeft: '2em',
                paddingRight: '2em',
            }}
        >
            <Segment>
                <h3 style={{ margin: '0' }}>{props.transaction?.title}</h3>
            </Segment>
            <Tab
                activeIndex={state.activePane}
                menu={{ pointing: true }}
                panes={panes}
                onTabChange={(event, { activeIndex }) => {
                    setState({...state, activePane: activeIndex});
                }}
            />
        </Container>
    );
};

export default injectIntl(MainPage);
