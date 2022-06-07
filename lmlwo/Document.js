import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import './style.css';
import queryString from 'query-string';
import DocumentTemplate from '../templates/DocumentTemplate';
import moment from 'moment';
import { momentToString, stringToMoment } from '../../../utils/helpers';
import { fetchDocument } from './actions';
import { action, option } from '../templates/helper';

require('moment/locale/ru');
/*
{
  "branchId": 0,
  "bukrs": "string",
  "customerId": 0,
  "departmentId": 0,
  "fromWerks": 0,
  "id": 0,
  "invoiceDate": "string",
  "items": [
    {
      "barcodes": [
        "string"
      ],
      "id": 0,
      "matnr": 0,
      "note": "string",
      "quantity": 0
    }
  ],
  "note": "string",
  "parentDocId": 0,
  "responsibleId": 0,
  "toWerks": 0,
  "typeId": 0
}
 */
const Document = props => {
    const {intl: {messages}} = props;
    React.useEffect(()=>{
        if(queryString.parse(window.location.search).ID)props.fetchDocument(queryString.parse(window.location.search).ID);
    }, [])

    const initialParameters = {
        branchId: null,
        bukrs: null,
        customerId: null,
        departmentId: null,
        fromWerks: null,
        id: parseInt(queryString.parse(props.location.search).id),
        invoiceDate: null,
        items: [],
        note: null,
        parentDocId: null,
        responsibleId: null,
        toWerks: null,
        typeId: null,
    };

    const initialState = {
        parameters: initialParameters,
    };

    const [state, setState] = React.useState(initialState);

    // console.log('documentState: ', state);
    return (
        <DocumentTemplate
            transaction={{name: 'lmlwo', title: `Списание по потере`}}
            document={{...props.document,
                createdAt: stringToMoment(props.document.createdAt, 'DD.MM.YYYY HH:mm'),
                invoiceDate: stringToMoment(props.document.invoiceDate, 'DD.MM.YYYY'),
                updatedAt: stringToMoment(props.document.updatedAt, 'DD.MM.YYYY HH:mm')}}
            action={action=>console.log(action)}
            onChange={value=>setState({...state, parameters: value})}
            parameters={[
                {
                    title: '№',
                    propName: null,
                    required: false,
                    type: 'info',
                    value: {type: 'implementation', value: `${state.parameters.id || ''}`}
                },
                {
                    title: messages.type,
                    propName: null,
                    required: false,
                    type: 'info',
                    value: {type: 'implementation', value: 'Списание по потере'}
                },
                {
                    title: messages.bukrs,
                    propName: 'bukrs',
                    required: true,
                    type: 'option',
                    value: {onChange: false, value: false, placeholder: false, option: {type: 'companies', value: null}}
                },
                {
                    title: messages.brnch,
                    propName: 'branchId',
                    required: true,
                    type: 'implementation',
                    value: (body, state, setState, props, action)=>option(
                        value=>action('setParameter', {fieldName: body?.propName, fieldValue: value}, state, setState),
                        state.parameters[body.propName],
                        body.value.placeholder? body.value.placeholder : body.title,
                        action('getOptions', {onChange: null, option: {type: 'branches', value: 'bukrs'}, placeholder: null, value: null}, state, null, props))
                },
                {
                    title: messages.sender_whouse,
                    propName: 'fromWerks',
                    required: true,
                    type: 'option',
                    value: {onChange: false, value: false, placeholder: false, option: {type: 'warehouses', value: null}}
                },
                {
                    title: messages.date,
                    propName: 'invoiceDate',
                    required: true,
                    type: 'dateSelector',
                    value: {onChange: false, value: false, placeholder: false}
                },
                {
                    title: messages.dep,
                    propName: 'departmentId',
                    required: true,
                    type: 'option',
                    value: {onChange: false, value: false, placeholder: false, option: {type: 'departments', value: null}}
                },
                {
                    title: messages.bktxt,
                    propName: 'note',
                    required: false,
                    type: 'textArea',
                    value: {onChange: false, value: false, placeholder: false, option: {type: 'departments', value: null}}
                },
                {
                    title: messages.creator,
                    propName: null,
                    required: false,
                    type: 'info',
                    value: {type: 'user', value: null}
                },
                {
                    title: messages['Table.createdAt'],
                    propName: null,
                    required: false,
                    type: 'info',
                    value: {type: 'implementation', value: `${moment().format('DD.MM.YYYY HH:mm')}`}
                },
                {
                    title: messages['status'],
                    propName: null,
                    required: false,
                    type: 'info',
                    value: {type: 'implementation', value: `${messages.new}`}
                },

            ]}
        />
    );
};

function mapStateToProps(state) {
    return {
        lang: state.userInfo.language,

        document: state.lmlwoReducer.document
    };
}

export default connect(mapStateToProps, { fetchDocument })(injectIntl(Document));
