import {
	ADD_JOB,
	RECEIVE_ACCOUNT_JOBS,
	RECEIVE_JOB_REFUNDED,
	RECEIVE_QUEUE_JOBS,
	REQUEST_ACCOUNT_JOBS,
	REQUEST_QUEUE_JOBS
} from "../actions";

import {dbObjToSpreadable} from "./helpers";

const initialJobsState = {
	isFetching: false,
	didInvalidate: false,
	items: {},
	allItems: [],
	lastUpdated: null
};

const updatePrintJobs = function (state = initialJobsState, actionItems) {
	return Object.assign({}, state, {
		isFetching: false,
		didInvalidate: false,
		items: Object.assign({}, state.items,  dbObjToSpreadable(actionItems))
	})
};

const jobs = function (state = initialJobsState, action) {
	switch (action.type) {
		case ADD_JOB:
			return Object.assign({}, state, {

			});
		case RECEIVE_JOB_REFUNDED:{
			if (action.ok) {
				const job = state.items[action.jobId];
				const newRefundedStatus = action.ok ? !job.refunded : job.refunded;

				return Object.assign({}, state, {
					items: {
						...state.items,
						[action.jobId]: {
							...job,
							refunded:newRefundedStatus
						}
					}
				});
			} else {
				return state
			}
		}
		case REQUEST_QUEUE_JOBS:{
			return Object.assign({}, state, {
				isFetching: true
			})
		}

		case RECEIVE_QUEUE_JOBS:{
			return updatePrintJobs(state, action.jobs);
		}

		case REQUEST_ACCOUNT_JOBS:{
			return Object.assign({}, state, {
				isFetching: true
			})
		}

		case RECEIVE_ACCOUNT_JOBS:{
			return updatePrintJobs(state, action.jobs);
		}

		default:
			return state;
	}
};

export default jobs