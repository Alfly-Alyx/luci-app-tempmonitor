/* Licensed to the public under the Apache License 2.0. */

'use strict';
'require baseclass';

return baseclass.extend({
	title: _('Temperatures'),

	rrdargs(graph, host, plugin, plugin_instance, dtype) {
		const instances = graph.dataInstances(host, plugin, plugin_instance, 'temperature');
		const palette = [ 'e6194b', '0082c8', '3cb44b', 'f58231', '911eb4', '46f0f0', 'f032e6', '808000' ];
		const options = {};

		for (let i = 0; i < instances.length; i++) {
			const instance = instances[i];
			const key = 'temperature_%s_value'.format(instance.replace(/\W/g, '_'));
			let title;

			if (instance == 'cpu')
				title = _('CPU');
			else if (instance.startsWith('cpu_'))
				title = '%s - %s'.format(_('CPU'), instance.substring(4).replace(/_/g, ' '));
			else if (instance.startsWith('wifi_'))
				title = '%s %s'.format(_('Wi-Fi'), instance.substring(5).replace(/_/g, ' '));
			else if (instance.startsWith('sensor_'))
				title = instance.substring(7).replace(/_/g, ' ');
			else
				title = instance.replace(/_/g, ' ');

			options[key] = {
				color: palette[i % palette.length],
				title: title,
				noarea: true,
				overlay: true
			};
		}

		return {
			title: _('%H: CPU and Wi-Fi temperatures'),
			alt_autoscale: true,
			vlabel: '\u00b0C',
			number_format: '%4.1lf\u00b0C',
			data: {
				types: [ 'temperature' ],
				instances: { temperature: instances },
				options: options
			}
		};
	}
});
