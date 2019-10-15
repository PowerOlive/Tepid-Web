import React from 'react';
import {Table} from "antd";
import {Link} from "react-router-dom";
import {jobStatus} from "../tepid-utils";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../actions";
import {MoreMenu} from "./Buttons/MoreButton";
import MenuItem from "@material-ui/core/MenuItem";

function JobTable({loading, showUser, canRefund, jobs}) {

	const destinations = useSelector(state => state.destinations.items);
	const getDestination = (job) => destinations[job.destination];

	const dispatch = useDispatch();
	const makeHandleRefund = (job) => () => dispatch(actions.doSetJobRefunded(job, !job.refunded));

	const columns = [
		{
			title: 'Started',
			key: 'Started',
			render: job => <>{job.started === -1 ? '' : new Date(job.started).toLocaleString('en-CA')}</>
		},
		{
			title: 'User',
			key: 'User',
			render: job => <Link to={`/accounts/${job.userIdentification}`}> {job.userIdentification}</Link>
		},
		{
			title: 'Pages',
			key: 'Pages',
			render: job => <>{`${job.pages} ${job.colorPages === 0 ? '' : ` (${job.colorPages} color)`}`}</>
		},
		{
			title: 'Status',
			key: 'Status',
			render: job => <>{jobStatus(job)}</>
		},
		{
			title: 'Destination',
			key: 'Destination',
			render: job => { const destination = getDestination(job); return <>{(destination && destination.name) || ""}</>}
		},
		{
			title: 'Name',
			key: 'Name',
			render: job => <>{job.name}</>
		},
		{
			title: '',
			key: 'MoreMenu',
			render: job => <MoreMenu>{canRefund && <MenuItem onClick={makeHandleRefund(job)}>Refund</MenuItem>}<MenuItem>Reprint</MenuItem></MoreMenu>
		}
	];

	return (
		<div>
				<Table columns={columns} dataSource={jobs} loading={loading}/>
		</div>
	);
}

export default JobTable;
