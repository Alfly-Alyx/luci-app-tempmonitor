/* Licensed to the public under the Apache License 2.0. */

'use strict';
'require view';
'require form';
'require uci';

return view.extend({
	load() {
		return uci.load('tempmonitor');
	},

	render() {
		const m = new form.Map('tempmonitor', _('Temperature Monitor'),
			_('Collects CPU and Wi-Fi chip temperatures and displays them under Statistics \u2192 Graphs \u2192 Temperatures. Sensor files are read-only; this service does not change thermal limits or fan control.'));
		const s = m.section(form.NamedSection, 'main', 'tempmonitor', _('Collection settings'));

		let o = s.option(form.Flag, 'enabled', _('Enable temperature collection'));
		o.default = '1';
		o.rmempty = false;

		o = s.option(form.Value, 'interval', _('Collection interval'));
		o.datatype = 'and(uinteger,min(5),max(300))';
		o.default = '30';
		o.placeholder = '30';
		o.rmempty = false;
		o.description = _('Seconds between samples (5 to 300).');

		o = s.option(form.Flag, 'cpu', _('CPU / SoC'));
		o.default = '1';
		o.rmempty = false;

		o = s.option(form.Flag, 'wifi', _('Wi-Fi chips'));
		o.default = '1';
		o.rmempty = false;

		o = s.option(form.Flag, 'extra', _('Other hwmon sensors'));
		o.default = '0';
		o.rmempty = false;
		o.description = _('Also graph temperatures such as NVMe drives when exposed through hwmon.');

		return m.render();
	}
});
