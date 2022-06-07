import React from 'react';
import DropdownClearable from '../../../utils/DropdownClearable';
import { Dropdown, Form, Input, TextArea } from 'semantic-ui-react';
import { momentToStringDDMMYYYY, stringToMomentDDMMYYYY } from '../../../utils/helpers';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function centerH(element) {
    return <div style={{ textAlign: 'center' }}>{element}</div>;
}

export function centerV(element) {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>{element}</div>
    );
}

export function right(element) {
    return <div style={{ textAlign: 'right' }}>{element}</div>;
}

export function left(element) {
    return <div style={{ textAlign: 'left' }}>{element}</div>;
}

export function multiOption(onChange, value=[], placeholder='', options=[]) {
    return (
        <Dropdown
            // style={{position: 'absolute'}}
            fluid
            multiple
            selection
            options={options}
            placeholder={placeholder}
            value={value}
            onChange={(e, { value }) =>
                onChange(value)
            }
        />
    );
}

export function option(onChange, value='', placeholder='', options=[]) {
    console.log('placeholder: ', placeholder, 'value: ', value)
    return (
        <DropdownClearable
            fluid
            selection
            value={value || ''}
            placeholder={placeholder}
            options={options}
            onChange={(e, { value }) =>onChange(value)}
            handleClear={() =>onChange('')}
        />
    );
}

export function input(onChange, value='', placeholder='') {
    return (
        <Input
            fluid
            placeholder={placeholder}
            value={value}
            onChange={(e, { value }) =>
                onChange(value)
            }
        />
    );
}

export function actionInput(onChange, value='', placeholder='', onClick) {
    return (
        <Input
            readOnly
            style={{
                // width: '80%',
            }}
            action={{
                color: 'teal',
                icon: 'copy',

                onClick: () => onClick(),
            }}
            placeholder={placeholder}
            value={value}
        />
    );
}

export function dateSelector(onChange, value='', placeholder='') {
    return (
        <DatePicker
            fluid
            style={{width: '100%'}}
            autoComplete="off"
            showMonthYearPicker
            dropdownMode="select"
            dateFormat="DD.MM.YYYY"
            placeholderText={placeholder}
            selected={value}
            onChange={date => onChange(date)}
        />
    );
}

export function textArea(onChange, value='', placeholder='') {
    return (
        <TextArea
            value={value || ''}
            placeholder={placeholder}
            onChange={(e, {value}) =>onChange(value)}
        />
    );
}

function getByKeys(array, key){return array.reduce((keys, current)=>[...keys, current[key]], [])}

// const getOptions=(option, state, props)=> {
//     switch (option.type) {
//         case 'branches':
//             return props[option.type]?.[state.parameters[option.value]]?.map(branch=>({key: branch.key, text: branch.text, value: branch.value, }));
//         case 'warehouses':
//             return props[option.type]?.reduce((result, current, index, array)=>array.reduce((result, current, index)=>result.id.includes(current.werks)? result : {id: [...result.id, current.werks], index: [...result.index, index]}, {id: [], index: []}).index.includes(index)? [...result, {key: current.werks, text: current.werksName, value: current.werks}] : result, []);
//         case 'filterOptions':
//             return props.list?.reduce((items, item)=>items.includes(item[option.value])? items : [...items, item[option.value]], []).map(item=>({key: item, text: item, value: item}));
//         case 'implementation':
//             return option.value;
//
//         default:
//             return props[option.type];
//     }}

const parameterElementBody=(element, state, setState, props)=>[
    value=>action('setParameter', {fieldName: element?.propName, fieldValue: value}, state, setState),
    state.parameters[element.propName],
    element.value.placeholder? element.value.placeholder : element.title];

const itemElementBody=(element, state, setState)=>[
    value=>action('setParameter', {fieldName: element?.propName, fieldValue: value}, state, setState),
    state.parameters[element.propName],
    element.value.placeholder? element.value.placeholder : element.title];

const filterElementBody=(element, state, setState)=>[
    value=>action('setFilter', {fieldName: element.accessor, fieldValue: value}, state, setState),
    state.filterBy[element.accessor],
    element.title];

const dataIntervalFilterElementBody=(element, state, setState)=>[
    value=>setState({...state, filterBy: {...state.filterBy, [element.accessor]: {...state.filterBy[element.accessor], [element.type]: value}}}),
    state.filterBy[element.accessor][element.type],
    element.title];

export function action(name, body, state, setState, props){
    // if(body.title==='Филиал') {
    //     console.log('name', name);
    //     console.log('body', body);
    //     console.log('state', state);
    //     console.log('props', props);
    // }
    switch (name){
        case 'setParameter':
            setState({...state, parameters: {...state.parameters, [body.fieldName]: body.fieldValue}});
            break;
        case 'setFilter':
            setState({...state, filterBy: {...state.filterBy, [body.fieldName]: body.fieldValue}});
            break;
        case 'displayParameter':
            switch (body.type){
                case 'info':
                    switch (body.value.type){
                        case 'example': return 'Gogo';
                        case 'implementation': return body.value.value;
                        default: return props[body.value.type];
                    }
                case 'option': return option(...parameterElementBody(body, state, setState, props), action('getOptions', body.value, state,null , props));
                case 'multiOption': return multiOption(...parameterElementBody(body, state, setState, props), action('getOptions', body.value, state,null , props));
                case 'dateSelector': return dateSelector(...parameterElementBody(body, state, setState, props));
                case 'input': return input(...parameterElementBody(body, state, setState, props));
                case 'actionInput': return actionInput(...parameterElementBody(body, state, setState, props), body.value.onClick());
                case 'textArea': return textArea(...parameterElementBody(body, state, setState, props));
                case 'implementation': return body.value(body, state, setState, props, action);
                default: return body.value;
            }
        case 'displayItem':
            switch (body.type){
                case 'info':
                    switch (body.value.type){
                        case 'example': return 'Gogo';
                        case 'implementation': return body.value.value;
                        default: return props[body.value.type];
                    }
                case 'option': return option(...itemElementBody(body), action('getOptions', body.value, state,null , props));
                case 'multiOption': return multiOption(...itemElementBody(body), action('getOptions', body.value, state,null , props));
                case 'dateSelector': return dateSelector(...itemElementBody(body));
                case 'input': return input(...itemElementBody(body));
                case 'actionInput': return actionInput(...itemElementBody(body), body.value.onClick());
                case 'textArea': return textArea(...itemElementBody(body));
                case 'implementation': return body.value(body, state, setState, props, action);
                default: return body.value;
            }
        case 'displayFilter':
            switch (body.type){
                case 'option': return option(...filterElementBody(body, state, setState), action('getOptions', body.accessor, state,null , props));
                case 'multiOption': return multiOption(...filterElementBody(body, state, setState), action('getOptions', {type: 'filterOptions', option: {type: 'filterOptions', value: body.accessor}}, state,null , props));
                case 'dateSelector': return dateSelector(...filterElementBody(body, state, setState));
                case 'dateFrom': return dateSelector(...dataIntervalFilterElementBody(body, state, setState));
                case 'dateTo': return dateSelector(...dataIntervalFilterElementBody(body, state, setState));
                case 'input': return input(...filterElementBody(body, state, setState));
                case 'actionInput': return actionInput(...filterElementBody(body, state, setState), body.value.onClick());
                case 'textArea': return textArea(...filterElementBody(body, state, setState));
                case 'implementation': return body.value;
                default: return body.value;
            }
        case 'getOptions':
            switch (body.option.type){
                case 'branches':
                    return props[body.option.type]?.[state.parameters[body.option.value]]?.map(branch=>({key: branch.key, text: branch.text, value: branch.value, }));
                case 'warehouses':
                    return props[body.option.type]?.reduce((result, current, index, array)=>array.reduce((result, current, index)=>result.id.includes(current.werks)? result : {id: [...result.id, current.werks], index: [...result.index, index]}, {id: [], index: []}).index.includes(index)? [...result, {key: current.werks, text: current.werksName, value: current.werks}] : result, []);
                case 'filterOptions':
                    return props.list?.reduce((items, item)=>items.includes(item[body.option.value])? items : [...items, item[body.option.value]], []).map(item=>({key: item, text: item, value: item}));
                case 'implementation':
                    return body.option.value;
                default:
                    return props[body.option.type];
            }
        default:
            break;
    }}
