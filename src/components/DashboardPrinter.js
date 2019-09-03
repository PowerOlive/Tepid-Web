import React, {useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';

import {
	fetchDestinationsIfNeeded,
	fetchQueueJobsIfNeeded,
	resolveDestinationTicket,
	submitDestinationTicket
} from '../actions';
import {jobHasFailed, jobStatus} from '../tepid-utils';
import useModal from "../hooks/useModal";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import {DialogActions} from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import {useFormField} from "../hooks/useFormField";
import styled from 'styled-components'


function AddTicketDialog({destination, ticket}) {
	const dispatch = useDispatch();

	const text = useFormField((ticket && ticket.reason) || '');

	const handleSubmit = (event) => {
		event.preventDefault();
		dispatch(submitDestinationTicket(destination, text.value));
	};
	const handleResolve = () => {
		dispatch(resolveDestinationTicket(destination))
	};

	return (
		<React.Fragment>
			<form>
				<DialogTitle> {`Add ticket for destination ${destination.name}`}</DialogTitle>
				<DialogContent>
					<TextField rows={4} label={'Ticket'} variant={'outlined'} InputLabelProps={{shrink: true}}
							   fullWidth name={'ticketContents'} {...text}/>
				</DialogContent>
				<DialogActions>
					{ticket && <Button variant={"outlined"} onClick={handleResolve}> Resolve</Button>}
					<Button variant={"outlined"} type={'submit'} onClick={handleSubmit}>Submit</Button>

				</DialogActions>
			</form>
		</React.Fragment>
	)
}

function QueueDestinationClicker({dest}) {
	const addTicketModal = useModal();
	const iconClass = dest.up ? 'up' : 'down';
	const iconText = dest.up ? 'arrow_upward' : 'arrow_downward';
	return (
		<React.Fragment>
			<div key={dest._id} onClick={addTicketModal.handleOpen}>
				<i className={`material-icons ${iconClass}`}>{iconText}</i> {dest.name}
			</div>
			<Dialog open={addTicketModal.open} onClose={addTicketModal.handleClose}>
				<AddTicketDialog destination={dest} ticket={dest.ticket}/>
			</Dialog>
		</React.Fragment>
	);

}

const PrinterUpIcon = styled.i`
	color: #4D983E
`;
const PrinterDownIcon = styled.i`
	color: #F44336;
`;

function PrinterIconHalf({up}) {
	return up ? <PrinterUpIcon className="material-icons"> print </PrinterUpIcon> :
		<PrinterDownIcon className="material-icons"> print </PrinterDownIcon>
}

function QueueIcon({destinations}) {
	const hasUp = destinations.reduce((acc, it) => (acc || it.up), false);
	const allUp = destinations.reduce((acc, it) => (acc && it.up), true);

	return <div className="printer-status-display">
		<PrinterIconHalf up={allUp}/>
		<PrinterIconHalf up={hasUp}/>
	</div>;
}

function DashboardPrinter({queue, destinations, loadingDestinations, jobs, queueJobs, loadingQueueJobs, fetchNeededData}) {

	useEffect(() => {
		fetchNeededData()
	});

	if (loadingDestinations) return (<div className="col"></div>);

	const queueDestinations = queue.destinations
		.map(dest => destinations[dest])
		.sort((d1, d2) => d1.name.localeCompare(d2));

	const queueDestinationClickers = queueDestinations.map(dest => <QueueDestinationClicker dest={dest}/>);

	const jobsToShow = queueJobs.slice(0, 25).map(it => jobs.items[it]);
	const queueJobsElement = loadingQueueJobs
		? (<tr style={{borderBottom: 'none'}}>
			<td colSpan="4" style={{textAlign: 'center'}}>Loading...</td>
		</tr>)
		: jobsToShow.map(job => (
			<tr key={job._id} className={jobHasFailed(job) ? 'failed' : ''}>
				<td><Link to={`/accounts/${job.userIdentification}`}>{job.userIdentification}</Link></td>
				<td>{destinations[job.destination]
					? destinations[job.destination].name
					: ''}</td>
				<td>{jobStatus(job)}</td>
				<td><i className="material-icons">more_vert</i></td>
			</tr>
		));

	return (
		<div className="col dash-printer no-side-padding no-bottom-padding">
			<QueueIcon destinations={Object.values(queueDestinations)}/>
			<h2>{queue.name}</h2>
			<div className="printer-status">{queueDestinationClickers}</div>
			<table className="dash-printer-queue">
				<thead>
				<tr>
					<th style={{width: '5.8rem'}}>User</th>
					<th style={{width: '5.8rem'}}>Printer</th>
					<th style={{minWidth: '12.3rem'}}>Status</th>
					<th style={{width: '2.9rem'}}>&nbsp;</th>
				</tr>
				</thead>
				<tbody>{queueJobsElement}</tbody>
			</table>
		</div>
	);
}

const mapStateToProps = (state, ownProps) => {
	const loading = state.queues.jobsByQueue[ownProps.queue.name].isFetching || state.destinations.isFetching;
	const unloaded = state.queues.jobsByQueue[ownProps.queue.name].items.length === 0;

	const loadingDestinations = Object.keys(state.destinations.items).length === 0;

	return {
		queue: ownProps.queue,
		queueJobs: state.queues.jobsByQueue[ownProps.queue.name].items,
		destinations: state.destinations.items,
		loading: unloaded || loading || loadingDestinations,
		loadingDestinations: loadingDestinations,
		loadingQueueJobs: unloaded || loading,
		jobs: state.jobs
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		fetchNeededData: () => {
			dispatch(fetchDestinationsIfNeeded()).then(() => dispatch(fetchQueueJobsIfNeeded(ownProps.queue.name)));
		}
	};
};

const DashboardPrinterContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(DashboardPrinter));

export default DashboardPrinterContainer;
