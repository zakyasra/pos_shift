from odoo import _, api, fields, models

class PosPayment(models.Model):
    _inherit = 'pos.payment'

    # shift = fields.Integer(related='pos_order_id.shift',store=True, string="Shift")
    shift_id = fields.Many2one('pos.shift', string='shift', related='pos_order_id.shift_id')