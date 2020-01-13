import {FormComponentProps} from "antd/es/form";
import {FullDestination} from "../models";
import React, {useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import * as actions from "../actions";
import {Button, Card, Form, InputNumber, Modal} from "antd";
import FormBuilder from 'antd-form-builder'
import Password from "antd/es/input/Password";


interface i extends FormComponentProps {
	destination: FullDestination
}

export const destinationsFormMeta = (d) => ({
	columns: 2,
	fields: [
		{key: 'name', label: 'Name', required: true, initialValue: d.name},
		{key: 'protocol', label: 'Protocol', required: true, initialValue: d.protocol},
		{key: 'username', label: 'Username', initialValue: d.username},
		{
			key: 'password',
			label: 'Password',
			initialValue: d.password,
			widget: Password,
			viewWidget: Password,
			viewWidgetProps: {disabled: true}
		},
		{key: 'path', label: 'Path', initialValue: d.path},
		{key: 'domain', label: 'Domain', initialValue: d.domain},
		{key: 'up', label: 'Up', disabled: true},
		{key: 'ppm', label: 'PPM', initialValue: d.ppm, widget: InputNumber}
	]
});

function D({form, destination}: i) {

	const [d, sd] = useState(destination);

	const dispatch = useDispatch();

	const [viewMode, setViewMode] = useState(true);
	const [pending, setPending] = useState(false);
	const handleSubmit = useCallback(
		evt => {
			evt.preventDefault();
			const values = form.getFieldsValue();
			console.log('Submit: ', values);
			setPending(true);
			const n = Object.assign({}, d, values);
			sd(n);
			dispatch(actions.putDestination(n));
			setTimeout(() => {
				setPending(false);
				// setPersonalInfo(values);
				setViewMode(true);
				Modal.success({
					title: 'Success',
					content: 'Infomation updated.',
				})
			}, 1500)
		},
		[form],
	);

	const meta = destinationsFormMeta(d);

	return (
		<Card title={destination.name} extra={viewMode && (
			<Button type="link" onClick={() => setViewMode(false)} style={{float: 'right'}}>
				Edit
			</Button>
		)}>
			<Form layout="horizontal" onSubmit={handleSubmit}>
				<FormBuilder form={form} meta={{...meta, disabled: pending}} viewMode={viewMode}/>
				{!viewMode && (
					<Form.Item className="form-footer" wrapperCol={{span: 16, offset: 4}}>
						<Button htmlType="submit" type="primary" disabled={pending}>
							{pending ? 'Updating...' : 'Update'}
						</Button>
						<Button onClick={() => {
							form.resetFields();
							setViewMode(true)
						}} style={{marginLeft: '15px'}}>
							Cancel
						</Button>
					</Form.Item>
				)}
			</Form>
		</Card>
	)
}

export default Form.create()(D)
