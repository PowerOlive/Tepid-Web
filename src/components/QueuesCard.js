import React from 'react';

import QueueContainer from '../containers/QueueContainer';
import { CTFerRoute } from './auth_routes';
import CardNav from './CardNav';

class QueuesCard extends React.Component {
	render() {
		const navItems = this.props.queues.map(queue => queue.name);
		// TODO: Loading
		return (
			<div className="card no-padding">
				<h2>
					Queues
					<CardNav navItems={navItems} />
				</h2>
			</div>
		);
	}
}

export default QueuesCard;
