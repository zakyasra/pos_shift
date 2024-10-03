from odoo import _, api, fields, models

class PosPayment(models.Model):
    _inherit = 'pos.payment'

    shift = fields.Integer(related='pos_order_id.shift',store=True, string="Shift")