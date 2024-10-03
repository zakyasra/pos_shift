from odoo import _, api, fields, models


class PosShift(models.Model):
    _name = 'pos.shift'
    _description = 'Pos Shift'

    name = fields.Char('Name')
    end_datetime = fields.Datetime('End Datetime')
    pos_session_id = fields.Many2one('pos.session', string='Session')

    def change_shift(self, id):
        latest_shift = self.browse(id)
        new_shift = self.create({
            'name':  str(int(latest_shift.name) + 1),
            'pos_session_id': latest_shift.pos_session_id.id,
        })
        latest_shift.write({'end_datetime': new_shift.create_date})

    def end_shift(self, session_id):
        shift = self.search([("pos_session_id", "=", session_id)], order="id desc", limit=1)
        shift.write({'end_datetime': fields.Datetime.now()})