import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import {
    Container,
    Segment,
    Grid,
    Table,
    List,
    Button,
    Divider,
    Input,
    TextArea,
    Form,
} from 'semantic-ui-react';
import { fetchMatnrs } from '../actions/logisticsActions';
import {
    f4FetchWerksBranchList,
    f4FetchDepartmentList,
} from '../../../reference/f4/f4_action';
import { option, multiOption, dateSelector, input, actionInput, textArea, action } from './helper';
import { Link } from 'react-router-dom';
import ErrorForForm from '../../../utils/ErrorForForm';
import ModalViewSN from '../lmpm/components/ModalViewSN';
import queryString from 'query-string';

require('moment/locale/ru');

const DocumentTemplate = props => {
    const initialState = {
        document: {action: [{name: 'create', text: 'Создание'}, {name: 'view', text: 'Просмотр'}, {name: 'update', text: 'Изменить'},].find(act=>act.name===queryString.parse(window.location?.search).action), id: queryString.parse(window.location.search).ID},
        ...props.parameters.reduce((state, parameter)=>(parameter.type==='info'? state : {...state, parameters: {...state.parameters, [parameter.propName]: null}, errors: {...state.errors, [parameter.propName]: false} }), {})};

    const [state, setState] = React.useState(initialState)
    React.useEffect(() => {
        props.fetchMatnrs();
        props.f4FetchWerksBranchList();
        props.f4FetchDepartmentList();
    }, []);

    React.useEffect(()=>{
        props.onChange(state.parameters);
    }, [state.parameters]);

    React.useEffect(()=>{
        setState({...state, parameters: props.document})
    }, [props.document.id]);
    //
    // console.log('document: ', props.document);
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
            <Segment className="flexSpaceBetween">
                <h3 style={{ margin: '0' }}>
                    {`${props.transaction?.title} ${state.document.id? `№ ${state.document.id}` : null} / ${state.document.action?.text}`}
                </h3>
                <div>
                    <Link
                        to={`/logistics/mainoperation/${props.transaction?.name}`}
                    >
                        <Button color={'blue'}>
                            В список
                        </Button>
                    </Link>
                    {props.document.actionButtons?.map(item => (
                        <Button
                            key={JSON.stringify(item)}
                            // disabled={
                            //     item.action === 'UPDATE'
                            //         ? !!editStatus
                            //         : false
                            // }
                            color={
                                item.action === 'UPDATE'
                                    ? 'orange'
                                    : item.action === 'DELETE'
                                        ? 'red'
                                        : 'blue'
                            }
                            onClick={() =>
                                action('documentActions', item)
                            }
                        >
                            {item.actionName}
                        </Button>
                    ))}
                </div>
            </Segment>
            <Segment>
                <Grid columns={2} divided>
                    <Grid.Row>
                        <Grid.Column width={6}>
                            <Divider horizontal>Информация о документе</Divider>
                            <Table celled compact>
                                <Table.Body>
                                    {props.parameters.map((parameter, i) => (
                                        <Table.Row key={`${parameter}|${i}`}>
                                            <Table.Cell width={6 }>{parameter.title}</Table.Cell>
                                            <Table.Cell width={10}><Form>{action('displayParameter', parameter, state, setState, props)}</Form></Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Divider horizontal>Список материалов</Divider>
                            <Table compact celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>
                                            Код товара
                                        </Table.HeaderCell>
                                        <Table.HeaderCell>
                                            Наименование товара
                                        </Table.HeaderCell>
                                        <Table.HeaderCell>
                                            Количество
                                        </Table.HeaderCell>
                                        <Table.HeaderCell>
                                            Серийный номер
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                {/*<Table.Body>*/}
                                {/*    {items.map((item, index) => (*/}
                                {/*        <Table.Row key={index}>*/}
                                {/*            <Table.Cell width={2}>*/}
                                {/*                {item.matnrCode}*/}
                                {/*            </Table.Cell>*/}
                                {/*            <Table.Cell width={10}>*/}
                                {/*                {item.note}*/}
                                {/*            </Table.Cell>*/}
                                {/*            <Table.Cell width={2}>*/}
                                {/*                {item.quantity}*/}
                                {/*            </Table.Cell>*/}
                                {/*            <Table.Cell width={2}>*/}
                                {/*            </Table.Cell>*/}
                                {/*        </Table.Row>*/}
                                {/*    ))}*/}
                                {/*</Table.Body>*/}
                            </Table>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Divider />
            </Segment>
        </Container>
    )};

function mapStateToProps(state) {
    return {
        companies: state.userInfo.companyOptions,
        branches: state.userInfo.branchOptionsAll,
        user: state.userInfo.currentStaff.fio,

        warehouses: state.f4.werksBranchList,
        departments: state.f4.departmentOptions,
        materials: state.logisticsReducer,
    };
}

export default connect(mapStateToProps, {
    fetchMatnrs,
    f4FetchWerksBranchList,
    f4FetchDepartmentList
})(injectIntl(DocumentTemplate));
