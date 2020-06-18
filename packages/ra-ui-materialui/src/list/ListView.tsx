import * as React from 'react';
import { Children, cloneElement, FC } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import {
    ComponentPropType,
    ExporterContext,
    defaultExporter,
    ListControllerProps,
    useListContext,
} from 'ra-core';

import Title, { TitlePropType } from '../layout/Title';
import ListToolbar from './ListToolbar';
import DefaultPagination from './Pagination';
import BulkDeleteButton from '../button/BulkDeleteButton';
import BulkActionsToolbar from './BulkActionsToolbar';
import DefaultActions from './ListActions';
import Empty from './Empty';
import { ListProps } from '../types';

export const ListView: FC<ListViewProps> = props => {
    const {
        top,
        left,
        right,
        bottom,
        actions,
        aside,
        filter,
        filters,
        bulkActionButtons,
        pagination,
        children,
        className,
        classes: classesOverride,
        component: Content,
        exporter = defaultExporter,
        title,
        empty,
        ...rest
    } = props;
    const listContext = useListContext();
    const classes = useStyles(props);
    const {
        defaultTitle,
        version,
        total,
        loaded,
        loading,
        hasCreate,
        filterValues,
        selectedIds,
    } = listContext;

    // @deprecated to be removed in 4.0
    // we inject listContext several times, for backwards compatibility reasons
    // children should use useListContext instead to grab the controller props

    const renderList = () => (
        <>
            {top ??
                ((filters || actions) && (
                    <ListToolbar
                        filters={filters}
                        {...listContext} // deprecated, use ListContext instead
                        actions={actions}
                        exporter={exporter} // deprecated, use ExporterContext instead
                        permanentFilter={filter}
                    />
                ))}
            <div className={classes.main}>
                {left}
                <Content
                    className={classnames(classes.content, {
                        [classes.bulkActionsDisplayed]: selectedIds.length > 0,
                    })}
                    key={version}
                >
                    {bulkActionButtons !== false && bulkActionButtons && (
                        <BulkActionsToolbar {...listContext}>
                            {bulkActionButtons}
                        </BulkActionsToolbar>
                    )}
                    {children &&
                        // @ts-ignore-line
                        cloneElement(Children.only(children), {
                            ...listContext,
                            hasBulkActions: bulkActionButtons !== false,
                        })}
                    {pagination && cloneElement(pagination, listContext)}
                </Content>
                {right}
                {aside && cloneElement(aside, listContext)}
            </div>
            {bottom}
        </>
    );

    const shouldRenderEmptyPage =
        hasCreate &&
        loaded &&
        !loading &&
        !total &&
        !Object.keys(filterValues).length;

    return (
        <ExporterContext.Provider value={exporter}>
            <div
                className={classnames('list-page', classes.root, className)}
                {...sanitizeRestProps(rest)}
            >
                <Title title={title} defaultTitle={defaultTitle} />
                {shouldRenderEmptyPage
                    ? cloneElement(empty, listContext)
                    : renderList()}
            </div>
        </ExporterContext.Provider>
    );
};

ListView.propTypes = {
    actions: PropTypes.element,
    aside: PropTypes.element,
    basePath: PropTypes.string,
    // @ts-ignore-line
    bulkActionButtons: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
    children: PropTypes.element,
    className: PropTypes.string,
    classes: PropTypes.object,
    component: ComponentPropType,
    // @ts-ignore-line
    currentSort: PropTypes.shape({
        field: PropTypes.string.isRequired,
        order: PropTypes.string.isRequired,
    }),
    data: PropTypes.any,
    defaultTitle: PropTypes.string,
    displayedFilters: PropTypes.object,
    // @ts-ignore-line
    exporter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    filterDefaultValues: PropTypes.object,
    filters: PropTypes.element,
    filterValues: PropTypes.object,
    hasCreate: PropTypes.bool,
    hideFilter: PropTypes.func,
    ids: PropTypes.array,
    loading: PropTypes.bool,
    onSelect: PropTypes.func,
    onToggleItem: PropTypes.func,
    onUnselectItems: PropTypes.func,
    page: PropTypes.number,
    // @ts-ignore-line
    pagination: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    perPage: PropTypes.number,
    refresh: PropTypes.func,
    resource: PropTypes.string,
    selectedIds: PropTypes.array,
    setFilters: PropTypes.func,
    setPage: PropTypes.func,
    setPerPage: PropTypes.func,
    setSort: PropTypes.func,
    showFilter: PropTypes.func,
    title: TitlePropType,
    total: PropTypes.number,
    version: PropTypes.number,
};

const DefaultBulkActionButtons = props => <BulkDeleteButton {...props} />;

ListView.defaultProps = {
    actions: <DefaultActions />,
    classes: {},
    component: Card,
    bulkActionButtons: <DefaultBulkActionButtons />,
    pagination: <DefaultPagination />,
    empty: <Empty />,
};

const useStyles = makeStyles(
    theme => ({
        root: {},
        main: {
            display: 'flex',
        },
        content: {
            marginTop: 0,
            transition: theme.transitions.create('margin-top'),
            position: 'relative',
            flex: '1 1 auto',
            [theme.breakpoints.down('xs')]: {
                boxShadow: 'none',
            },
            overflow: 'inherit',
        },
        bulkActionsDisplayed: {
            marginTop: -theme.spacing(8),
            transition: theme.transitions.create('margin-top'),
        },
        actions: {
            zIndex: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
        },
        noResults: { padding: 20 },
    }),
    { name: 'RaList' }
);

export interface ListViewProps
    extends Omit<ListProps, 'basePath' | 'hasCreate' | 'perPage' | 'resource'>,
        ListControllerProps {}

const sanitizeRestProps: (
    props: Omit<
        ListViewProps,
        | 'actions'
        | 'aside'
        | 'filter'
        | 'filters'
        | 'bulkActionButtons'
        | 'pagination'
        | 'children'
        | 'className'
        | 'classes'
        | 'component'
        | 'exporter'
        | 'title'
        | 'empty'
    >
) => any = ({
    basePath,
    currentSort,
    data,
    defaultTitle,
    displayedFilters,
    filterDefaultValues,
    filterValues,
    hasCreate,
    hasEdit,
    hasList,
    hasShow,
    hideFilter,
    history,
    ids,
    loading,
    loaded,
    location,
    match,
    onSelect,
    onToggleItem,
    onUnselectItems,
    options,
    page,
    permissions,
    perPage,
    resource,
    selectedIds,
    setFilters,
    setPage,
    setPerPage,
    setSort,
    showFilter,
    sort,
    total,
    version,
    ...rest
}) => rest;

export default ListView;