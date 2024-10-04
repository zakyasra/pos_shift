from odoo import api, fields, models


class PosOrder(models.Model):
    _inherit = 'pos.order'

    # shift = fields.Integer(string='Shift')
    shift_id = fields.Many2one('pos.shift', string='Shift')

    @api.model
    def _order_fields(self, ui_order):
        res = super(PosOrder, self)._order_fields(ui_order)
        res['shift_id'] = ui_order.get('shift_id', 1)
        return res
