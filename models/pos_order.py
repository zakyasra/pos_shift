from odoo import api, fields, models


class PosOrder(models.Model):
    _inherit = 'pos.order'

    shift = fields.Integer(string='Shift')

    @api.model
    def _order_fields(self, ui_order):
        res = super(PosOrder, self)._order_fields(ui_order)
        res['shift'] = ui_order.get('shift', 1)
        return res
