/* Licensed to the public under the Apache License 2.0. */

'use strict';
'require view';
'require rpc';
'require ui';
'require view.statistics.graphs as statisticsGraphs';

const callUciSet = rpc.declare({
	object: 'uci',
	method: 'set',
	params: [ 'config', 'section', 'values' ],
	reject: true
});

const callUciCommit = rpc.declare({
	object: 'uci',
	method: 'commit',
	params: [ 'config' ],
	reject: true
});

const spanLabels = {
	'2hour': '2 hours',
	'1day': '1 day',
	'1week': '1 week',
	'1month': '1 month',
	'1year': '1 year'
};

return view.extend({
	load() {
		return statisticsGraphs.load();
	},

	render() {
		const renderedView = statisticsGraphs.render.apply(statisticsGraphs, arguments);

		if (!renderedView || typeof(renderedView.querySelector) != 'function')
			return renderedView;

		const spanSelect = renderedView.querySelector('[data-name="timespan"]');

		if (!spanSelect)
			return renderedView;

		for (let i = 0; i < spanSelect.options.length; i++) {
			const option = spanSelect.options[i];
			const span = option.value;
			const label = spanLabels[span];

			if (label) {
				option.value = span;
				option.textContent = _(label);
			}
		}

		spanSelect.addEventListener('change', function() {
			const selectedSpan = spanSelect.value;

			callUciSet('luci_statistics', 'rrdtool', {
				default_timespan: selectedSpan
			}).then(function() {
				return callUciCommit('luci_statistics');
			}).catch(function(err) {
				ui.addNotification(null, E('p', {}, [
					_('Unable to save the selected period: %s').format(err.message || err)
				]), 'error');
			});
		});

		return renderedView;
	},

	handleSave: null,
	handleSaveApply: null,
	handleReset: null
});
